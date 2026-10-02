#!/usr/bin/env node
/**
 * Probe the deployed GitHub Pages site (https://sahancs.is-a.dev).
 *  Phase 1 - HTTP: status + HTML markers per route, RSC (.txt) payload checks,
 *            plus existence of every referenced /_next/ script on /about/.
 *  Phase 2 - Headless Chrome: dump post-JS DOM for every main route and surface
 *            console errors / failed resource loads from chrome stderr.
 *  Phase 3 - CDP: load "/" via the DevTools protocol, click the navbar About
 *            link (client-side navigation) and verify #content swaps to /about/.
 *
 * Usage: npm run probe:site [-- --local]   (npm passes args after `--` through,
 *          so `npm run probe:site -- --local` leaves `--local` in process.argv;
 *          no npm registry access needed)
 *        node scripts/deployed-site-probe.mjs --local   (local static-server mode:
 *          serves Sahan-Frontend/out on 127.0.0.1:8123+ and runs all phases against it)
 * Env:   PROBE_BASE, CHROME_PATH, PROBE_WS_RETRY override defaults.
 * Output: summary on stdout; raw DOM dumps written to <os tmpdir>/site-probe/.
 */
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

// CLI mode: local static-server mode = `process.argv.includes("--local")`
// (reached via `npm run probe:site -- --local`: npm appends args after `--`
// to the script invocation, so `--local` lands in process.argv).
const LOCAL_MODE = process.argv.includes("--local");
// In local mode BASE is assigned AFTER the static server starts (see main());
// in live mode it honors PROBE_BASE exactly as before.
let BASE = LOCAL_MODE ? "" : (process.env.PROBE_BASE ?? "https://sahancs.is-a.dev");
const LOCAL_PORT_START = 8123;
const LOCAL_PORT_TRIES = 10;
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const LOCAL_ROOT = join(SCRIPT_DIR, "..", "out");
// Snapshots captured by phase3's takeSnapshot (used for the LOCAL VERDICT).
const localSnapshots = [];
const CHROME = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = join(tmpdir(), "site-probe");
const ROUTES = ["/", "/about/", "/about", "/articles/", "/projects/", "/contact/", "/definitely-missing-xyz"];
const RSC_ROUTES = ["/", "/about/", "/articles/", "/projects/", "/contact/"];

function countSub(haystack, needle) {
  if (needle === "") return 0;
  let count = 0;
  let index = 0;
  while (true) {
    const found = haystack.indexOf(needle, index);
    if (found === -1) return count;
    count += 1;
    index = found + needle.length;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function localContentType(ext) {
  switch (ext) {
    case ".html":
      return "text/html";
    case ".txt":
      return "text/plain";
    case ".js":
      return "application/javascript";
    case ".css":
      return "text/css";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".ico":
      return "image/x-icon";
    case ".json":
    case ".map":
      return "application/json";
    case ".woff2":
      return "font/woff2";
    case ".xml":
      return "application/xml";
    default:
      return "application/octet-stream";
  }
}

function serveLocal404(res, method) {
  let body;
  try {
    body = readFileSync(join(LOCAL_ROOT, "404.html"));
  } catch {
    body = Buffer.from("Not Found", "utf8");
  }
  res.writeHead(404, { "Content-Type": "text/html", "Content-Length": body.length });
  if (method === "HEAD") {
    res.end();
  } else {
    res.end(body);
  }
}

function serveLocalFile(res, filePath, method) {
  let data;
  try {
    data = readFileSync(filePath);
  } catch {
    serveLocal404(res, method);
    return;
  }
  res.writeHead(200, {
    "Content-Type": localContentType(extname(filePath).toLowerCase()),
    "Content-Length": data.length,
  });
  if (method === "HEAD") {
    res.end();
  } else {
    res.end(data);
  }
}

function handleLocalRequest(req, res, root) {
  const method = (req.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed");
    return;
  }
  const rawUrl = req.url ?? "/";
  const rawPath = rawUrl.split("?")[0].split("#")[0] || "/";
  let pathname;
  try {
    pathname = decodeURIComponent(rawPath);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Bad Request");
    return;
  }
  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }
  const rootResolved = resolve(root);
  const resolved = resolve(rootResolved, `.${pathname}`);
  if (resolved !== rootResolved && !resolved.startsWith(rootResolved + sep)) {
    serveLocal404(res, method);
    return;
  }
  let stat = null;
  try {
    stat = statSync(resolved);
  } catch {
    stat = null;
  }
  if (stat !== null && stat.isFile()) {
    serveLocalFile(res, resolved, method);
    return;
  }
  if (stat !== null && stat.isDirectory()) {
    // GitHub Pages semantics: directory without trailing slash -> 301 to slash.
    if (!pathname.endsWith("/")) {
      res.writeHead(301, { Location: `${pathname}/` });
      res.end();
      return;
    }
    // Trailing slash -> <dir>/index.html; never list directories (else 404).
    const indexFile = join(resolved, "index.html");
    let indexStat = null;
    try {
      indexStat = statSync(indexFile);
    } catch {
      indexStat = null;
    }
    if (indexStat !== null && indexStat.isFile()) {
      serveLocalFile(res, indexFile, method);
      return;
    }
    serveLocal404(res, method);
    return;
  }
  serveLocal404(res, method);
}

function listenOnce(server, port) {
  return new Promise((resolvePromise, rejectPromise) => {
    const onError = (err) => {
      server.removeListener("listening", onListening);
      rejectPromise(err);
    };
    const onListening = () => {
      server.removeListener("error", onError);
      resolvePromise();
    };
    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(port, "127.0.0.1");
  });
}

async function startLocalServer() {
  let port = LOCAL_PORT_START;
  let lastErr = null;
  for (let attempt = 0; attempt < LOCAL_PORT_TRIES; attempt += 1) {
    const server = createServer((req, res) => handleLocalRequest(req, res, LOCAL_ROOT));
    try {
      await listenOnce(server, port);
    } catch (err) {
      try {
        server.close();
      } catch {
        // ignore cleanup errors
      }
      const code = err instanceof Error && "code" in err ? String(err.code) : "";
      if (code === "EADDRINUSE") {
        lastErr = err;
        port += 1;
        continue;
      }
      throw err;
    }
    server.unref();
    console.log(`LOCAL SERVER http://127.0.0.1:${port}/ root=${LOCAL_ROOT}`);
    return { server, port };
  }
  throw lastErr instanceof Error ? lastErr : new Error("local server: no free port");
}

async function closeLocalServer(server) {
  try {
    server.closeAllConnections?.();
  } catch {
    // ignore cleanup errors
  }
  await Promise.race([
    new Promise((resolvePromise) => {
      try {
        server.close(() => resolvePromise());
      } catch {
        resolvePromise();
      }
    }),
    sleep(3000),
  ]);
}

function printLocalVerdict() {
  if (localSnapshots.length === 0) {
    console.log("LOCAL VERDICT NAV-HIDDEN no-snapshots");
    return;
  }
  const bad = localSnapshots.filter((s) => !(s.opacity >= 0.99 && s.contentLen > 200));
  if (bad.length === 0) {
    console.log("LOCAL VERDICT NAV-VISIBLE");
  } else {
    console.log(`LOCAL VERDICT NAV-HIDDEN ${bad.map((s) => `${s.label}:${s.opacityRaw}`).join(" ")}`);
  }
}

async function phase1() {
  for (const route of ROUTES) {
    const url = BASE + route;
    try {
      const res = await fetch(url, { redirect: "manual" });
      const location = res.headers.get("location") ?? "-";
      const contentType = res.headers.get("content-type") ?? "-";
      console.log(`${route} -> ${res.status} loc=${location} content-type=${contentType}`);
      if (contentType.includes("text/html")) {
        const text = await res.text();
        const scriptCount = (text.match(/<script[^>]+src=/g) ?? []).length;
        const hasAboutH1 = text.includes("Network engineer in training");
        const hasNotFound = text.includes("Packet lost");
        const opacityCount = countSub(text, "opacity:0");
        console.log(`${route} html len=${text.length} scripts=${scriptCount} aboutH1=${hasAboutH1} notFound=${hasNotFound} opacity0=${opacityCount}`);
        if (route === "/about/") {
          const srcs = [...text.matchAll(/<script[^>]+src="([^"]+)"/g)]
            .map((m) => m[1])
            .filter((s) => typeof s === "string" && s.length > 0);
          let bad = 0;
          for (const src of srcs) {
            const scriptUrl = new URL(src, BASE).toString();
            try {
              const sres = await fetch(scriptUrl, { redirect: "manual" });
              if (sres.status !== 200) {
                bad += 1;
                console.log(`${route} script ${sres.status} ${scriptUrl}`);
              }
            } catch (err) {
              bad += 1;
              const msg = err instanceof Error ? err.message : String(err);
              console.log(`${route} script ERROR ${scriptUrl} ${msg}`);
            }
          }
          if (bad === 0) {
            console.log(`${route} ALL ${srcs.length} SCRIPTS OK`);
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`${route} ERROR ${msg}`);
    }
  }
  for (const route of RSC_ROUTES) {
    const stripped = route.replace(/\/$/, "");
    const candidates = [...new Set([route + "index.txt", (stripped === "" ? "/index" : stripped) + ".txt"])];
    for (const cand of candidates) {
      const url = BASE + cand;
      try {
        const res = await fetch(url, { redirect: "manual" });
        const contentType = res.headers.get("content-type") ?? "-";
        const buf = await res.arrayBuffer();
        let line = `RSC ${url} -> ${res.status} ct=${contentType} len=${buf.byteLength}`;
        if (res.status === 200 && contentType.includes("text/html")) {
          line += " UNEXPECTED-HTML";
        }
        console.log(line);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`RSC ${url} -> ERROR ${msg}`);
      }
    }
  }
}

function runChromeDump(file, args) {
  return new Promise((resolve) => {
    const maxBuffer = 64 * 1024 * 1024;
    const child = spawn(file, args, { stdio: ["ignore", "pipe", "pipe"] });
    const stdoutChunks = [];
    const stderrChunks = [];
    let stdoutLen = 0;
    let stderrLen = 0;
    let error;
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      if (!error) {
        error = new Error("spawn timed out after 60000ms");
      }
      try {
        child.kill("SIGKILL");
      } catch {
        // ignore kill errors
      }
    }, 60000);
    if (typeof timer.unref === "function") {
      timer.unref();
    }
    const finish = (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        stdout: Buffer.concat(stdoutChunks).toString("utf8"),
        stderr: Buffer.concat(stderrChunks).toString("utf8"),
        error,
        code,
        signal,
      });
    };
    if (child.stdout) {
      child.stdout.on("data", (chunk) => {
        const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        stdoutLen += buf.length;
        if (stdoutLen > maxBuffer) {
          if (!error) {
            error = new Error("maxBuffer exceeded");
          }
          try {
            child.kill("SIGKILL");
          } catch {
            // ignore kill errors
          }
          return;
        }
        stdoutChunks.push(buf);
      });
    }
    if (child.stderr) {
      child.stderr.on("data", (chunk) => {
        const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        stderrLen += buf.length;
        if (stderrLen > maxBuffer) {
          if (!error) {
            error = new Error("maxBuffer exceeded");
          }
          try {
            child.kill("SIGKILL");
          } catch {
            // ignore kill errors
          }
          return;
        }
        stderrChunks.push(buf);
      });
    }
    child.on("error", (err) => {
      if (!error) {
        error = err;
      }
    });
    child.on("close", (code, signal) => {
      finish(code, signal);
    });
  });
}

async function phase2() {
  mkdirSync(OUT_DIR, { recursive: true });
  const pages = [
    { path: "/", name: "home" },
    { path: "/about/", name: "about" },
    { path: "/projects/", name: "projects" },
    { path: "/articles/", name: "articles" },
    { path: "/contact/", name: "contact" },
  ];
  for (const page of pages) {
    const profileDir = join(OUT_DIR, `profile-${Date.now()}`);
    const args = [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profileDir}`,
      "--virtual-time-budget=10000",
      "--timeout=25000",
      "--enable-logging=stderr",
      "--v=0",
      "--dump-dom",
      BASE + page.path,
    ];
    const res = await runChromeDump(CHROME, args);
    const stdout = typeof res.stdout === "string" ? res.stdout : "";
    if (res.error || stdout === "") {
      const detail = res.error instanceof Error ? res.error.message : "empty stdout";
      console.log(`${page.name} CHROME UNAVAILABLE: ${detail}`);
      continue;
    }
    const outFile = join(OUT_DIR, `${page.name}.dom.html`);
    writeFileSync(outFile, stdout);
    console.log(`${page.name} dom file=${outFile} len=${stdout.length}`);
    if (page.name === "about") {
      console.log(`${page.name} dom aboutH1=${stdout.includes("Network engineer in training")}`);
    }
    const mainMatch = stdout.match(/<main[^>]*>/);
    console.log(`${page.name} dom main=${mainMatch ? mainMatch[0] : "NONE"}`);
    console.log(`${page.name} dom opacity0=${countSub(stdout, "opacity:0")} opacitySpace0=${countSub(stdout, "opacity: 0")}`);
    console.log(`${page.name} dom z70=${stdout.includes("z-[70]")}`);
    console.log(`${page.name} dom scripts=${countSub(stdout, "<script")}`);
    const contentIdx = stdout.indexOf('id="content"');
    let contentSlice = contentIdx === -1 ? "" : stdout.slice(contentIdx, contentIdx + 50000);
    const mainClose = contentSlice.indexOf("</main>");
    if (mainClose !== -1) {
      contentSlice = contentSlice.slice(0, mainClose);
    }
    const contentTextLen = contentSlice.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().length;
    console.log(`${page.name} dom contentIdx=${contentIdx} contentTextLen=${contentTextLen} packetLostInContent=${contentSlice.includes("Packet lost")} pageNotFoundInContent=${contentSlice.includes("Page not found")}`);
    const stderrText = typeof res.stderr === "string" ? res.stderr : "";
    const pattern = /CONSOLE|Failed to load resource|net::ERR|404 \(Not Found\)/;
    const hits = stderrText.split(/\r?\n/).filter((line) => pattern.test(line)).slice(0, 40);
    for (const line of hits) {
      console.log(`${page.name} stderr: ${line.trim()}`);
    }
    console.log(`${page.name} dom done`);
  }
}

function waitForDevToolsEndpoint(child, timeoutMs) {
  return new Promise((resolve, reject) => {
    let output = "";
    let settled = false;
    const onData = (chunk) => {
      if (settled) return;
      output += chunk.toString();
      const m = output.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m && m[1]) {
        settled = true;
        cleanup();
        resolve(m[1]);
      }
    };
    const onError = (err) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(err);
    };
    const cleanup = () => {
      clearTimeout(timer);
      if (child.stderr && typeof child.stderr.off === "function") {
        child.stderr.off("data", onData);
      }
      child.off("error", onError);
    };
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("timed out waiting for DevTools endpoint"));
    }, timeoutMs);
    if (!child.stderr || typeof child.stderr.on !== "function") {
      settled = true;
      clearTimeout(timer);
      reject(new Error("chrome stderr not piped"));
      return;
    }
    child.stderr.on("data", onData);
    child.on("error", onError);
  });
}

async function phase3() {
  if (typeof WebSocket === "undefined") {
    if (process.env.PROBE_WS_RETRY === "1") {
      console.log("CDP SKIP no WebSocket even after --experimental-websocket retry");
      return;
    }
    console.log("CDP respawn with --experimental-websocket for WebSocket support");
    const selfPath = fileURLToPath(import.meta.url);
    const res = spawnSync(process.execPath, ["--experimental-websocket", selfPath, ...process.argv.slice(2)], {
      stdio: "inherit",
      env: { ...process.env, PROBE_WS_RETRY: "1" },
      timeout: 150000,
    });
    process.exit(typeof res.status === "number" ? res.status : 0);
    return;
  }

  let child = null;
  let ws = null;
  let sessionId = null;
  let targetId = null;
  const cdpNotes = [];
  const pending = new Map();
  let nextId = 1;
  let loadEventResolve = null;

  const note = (line) => {
    if (cdpNotes.length < 500) cdpNotes.push(line);
  };

  const send = (method, params, sid) => {
    const id = nextId++;
    const payload = sid
      ? { id, method, params: params ?? {}, sessionId: sid }
      : { id, method, params: params ?? {} };
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      try {
        ws.send(JSON.stringify(payload));
      } catch (err) {
        pending.delete(id);
        reject(err);
      }
      setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          reject(new Error(`CDP timeout ${method}`));
        }
      }, 20000);
    });
  };

  const evaluate = async (expression, sid) => {
    const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }, sid);
    if (result && result.exceptionDetails) {
      return `EXCEPTION ${String(result.exceptionDetails.text || "unknown")}`;
    }
    return result && result.result ? result.result.value : undefined;
  };

  const waitForLoad = (timeoutMs) =>
    new Promise((resolve) => {
      const timer = setTimeout(() => {
        loadEventResolve = null;
        note("CDP no loadEventFired within timeout, continuing");
        resolve();
      }, timeoutMs);
      loadEventResolve = () => {
        clearTimeout(timer);
        resolve();
      };
    });

  try {
    const profileDir = join(tmpdir(), `site-probe-cdp-${Date.now()}-${process.pid}`);
    mkdirSync(profileDir, { recursive: true });
    const args = [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profileDir}`,
      "--remote-debugging-port=0",
      "--remote-allow-origins=*",
      "about:blank",
    ];
    child = spawn(CHROME, args, { stdio: ["ignore", "ignore", "pipe"] });
    const browserWsUrl = await waitForDevToolsEndpoint(child, 15000);
    console.log("CDP browser endpoint found");

    ws = new globalThis.WebSocket(browserWsUrl);
    ws.addEventListener("message", (event) => {
      let msg;
      try {
        msg = JSON.parse(String(event.data));
      } catch {
        return;
      }
      if (msg.id !== undefined && pending.has(msg.id)) {
        const entry = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) {
          entry.reject(new Error(`CDP ${msg.error.message || JSON.stringify(msg.error)}`));
        } else {
          entry.resolve(msg.result);
        }
        return;
      }
      if (!msg.method) return;
      if (msg.method === "Page.loadEventFired" && loadEventResolve) {
        const done = loadEventResolve;
        loadEventResolve = null;
        done();
      } else if (msg.method === "Network.loadingFailed") {
        const p = msg.params || {};
        note(`CDP loadingFailed ${p.errorText || "?"} ${p.blockedReason || "-"} ${p.type || "-"}`);
      } else if (msg.method === "Network.responseReceived") {
        const resp = (msg.params && msg.params.response) || {};
        const respUrl = typeof resp.url === "string" ? resp.url : "?";
        if (respUrl.includes(".txt")) {
          note(`CDP RSC-RESP ${String(resp.status ?? "?")} ${String(resp.mimeType ?? "-")} ${respUrl}`);
        }
        if (typeof resp.status === "number" && resp.status >= 400) {
          note(`CDP badResponse ${resp.status} ${resp.url || "?"}`);
        }
      } else if (msg.method === "Runtime.exceptionThrown") {
        const detail = (msg.params && msg.params.exceptionDetails) || {};
        note(`CDP exception ${String(detail.text || detail.exception || "?").slice(0, 200)}`);
      } else if (msg.method === "Log.entryAdded") {
        const entry = (msg.params && msg.params.entry) || {};
        if (entry.level === "error") {
          note(`CDP consoleError ${String(entry.text || entry.source || "?").slice(0, 200)}`);
        }
      }
    });
    ws.addEventListener("error", (event) => {
      note(`CDP wsError ${String((event && event.message) || "websocket error")}`);
    });
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("ws open timeout")), 10000);
      ws.addEventListener("open", () => {
        clearTimeout(timer);
        resolve();
      }, { once: true });
      ws.addEventListener("error", () => {
        clearTimeout(timer);
        reject(new Error("ws open failed"));
      }, { once: true });
    });

    const created = await send("Target.createTarget", { url: BASE + "/" });
    targetId = created && created.targetId;
    if (!targetId) throw new Error("createTarget returned no targetId");
    const attached = await send("Target.attachToTarget", { targetId, flatten: true });
    sessionId = attached && attached.sessionId;
    if (!sessionId) throw new Error("attachToTarget returned no sessionId");

    const loadPromise = waitForLoad(30000);
    await send("Page.enable", {}, sessionId);
    await send("Runtime.enable", {}, sessionId);
    await send("Network.enable", {}, sessionId);
    await send("Log.enable", {}, sessionId);
    await loadPromise;
    await sleep(2500);

    const homeLen = await evaluate("document.querySelector('#content') ? document.querySelector('#content').innerText.length : -1", sessionId);
    console.log(`CDP HOME contentLen=${String(homeLen)}`);

    const reducedMotion = await evaluate('window.matchMedia("(prefers-reduced-motion: reduce)").matches', sessionId);
    const visibility = await evaluate("document.visibilityState", sessionId);
    const homeMainStyle = await evaluate("(function(){var m=document.querySelector('#content main');return m?m.getAttribute('style'):'NO-MAIN';})()", sessionId);
    console.log(`CDP HOME pre <reducedMotion=${String(reducedMotion)} visibility=${String(visibility)} mainStyle=${String(homeMainStyle)}>`);

    const SNAP_EXPR = "(function(){var content=document.querySelector('#content');var text=content?content.innerText:'';var main=document.querySelector('#content main');var mainStyleAttr=main?main.getAttribute('style'):null;var mainComputed='?';try{mainComputed=main?String(window.getComputedStyle(main).opacity):'NO-MAIN';}catch(e){mainComputed='ERR:'+String((e&&e.message)||e);}var styled=document.querySelector('#content main [style]');var firstRevealStyleAttr=styled?styled.getAttribute('style'):null;var firstChild=document.querySelector('#content main > div')||document.body;var firstRevealComputed='?';try{firstRevealComputed=String(window.getComputedStyle(firstChild).opacity);}catch(e){firstRevealComputed='ERR:'+String((e&&e.message)||e);}return {path:window.location.pathname,contentLen:text.length,text:text.slice(0,4000),mainComputedOpacity:mainComputed,mainStyleAttr:mainStyleAttr,firstRevealStyleAttr:firstRevealStyleAttr,firstRevealComputedOpacity:firstRevealComputed};})()";
    const RES_EXPR = 'JSON.stringify(performance.getEntriesByType("resource").map(function(r){return r.name;}).filter(function(n){return n.includes(".txt")||n.includes("index");}))';

    const logResources = async (step) => {
      const raw = await evaluate(RES_EXPR, sessionId);
      const text = typeof raw === "string" ? raw : String(raw);
      console.log(`CDP RESOURCES-after-${step} ${text.slice(0, 1500)}`);
    };

    const takeSnapshot = async (label, marker) => {
      const snap = await evaluate(SNAP_EXPR, sessionId);
      const obj = snap && typeof snap === "object" ? snap : {};
      const path = typeof obj.path === "string" ? obj.path : String(obj.path ?? "?");
      const contentLen = Number(obj.contentLen ?? -1);
      const text = typeof obj.text === "string" ? obj.text : "";
      let hasMarker = false;
      let markerNote = marker;
      if (marker === "about") {
        hasMarker = text.includes("Network engineer in training");
      } else {
        hasMarker = text.includes("Projects");
        if (!hasMarker && contentLen > 200) {
          markerNote = "projects-fallback-len>200";
          hasMarker = true;
        }
      }
      console.log(`CDP SNAP ${label} path=${path} contentLen=${String(contentLen)} hasMarker=${String(hasMarker)}(${markerNote}) mainComputedOpacity=${String(obj.mainComputedOpacity ?? "?")} mainStyleAttr=${String(obj.mainStyleAttr ?? "null")} firstRevealStyleAttr=${String(obj.firstRevealStyleAttr ?? "null")} firstRevealComputedOpacity=${String(obj.firstRevealComputedOpacity ?? "?")}`);
      await logResources(label);
      const opacityRaw = String(obj.mainComputedOpacity ?? "?");
      const opacity = Number(obj.mainComputedOpacity);
      if (LOCAL_MODE) {
        localSnapshots.push({ label, contentLen, opacity, opacityRaw });
      }
      return { path, contentLen, opacity, opacityRaw };
    };

    const captureDom = async (label) => {
      mkdirSync(OUT_DIR, { recursive: true });
      const html = await evaluate("document.documentElement.outerHTML", sessionId);
      const text = typeof html === "string" ? html : String(html ?? "");
      const outFile = join(OUT_DIR, `nav-${label}.dom.html`);
      writeFileSync(outFile, text);
      console.log(`CDP DOM nav-${label} file=${outFile} len=${text.length}`);
    };

    const clickAbout = await evaluate("(function(){var links=Array.prototype.slice.call(document.querySelectorAll('header a, nav a'));for(var i=0;i<links.length;i++){if(links[i].getAttribute('href')==='/about/'){links[i].click();return 'CLICKED';}}return 'NO-LINK';})()", sessionId);
    console.log(`CDP CLICK about ${String(clickAbout)}`);
    await sleep(1500);
    await takeSnapshot("about-1", "about");
    await sleep(4500);
    await takeSnapshot("about-2", "about");
    await captureDom("about");

    const clickProjects = await evaluate("(function(){var links=Array.prototype.slice.call(document.querySelectorAll('header a, nav a'));var found=null;for(var i=0;i<links.length;i++){if(links[i].getAttribute('href')==='/projects/'){found=links[i];break;}}if(!found){found=document.querySelector('a[href=\"/projects/\"]');}if(found){found.click();return 'CLICKED';}return 'NO-LINK';})()", sessionId);
    console.log(`CDP CLICK projects ${String(clickProjects)}`);
    await sleep(1500);
    await takeSnapshot("projects-1", "projects");
    await sleep(4500);
    await takeSnapshot("projects-2", "projects");
    await captureDom("projects");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`CDP ERROR ${msg}`);
    if (err instanceof Error && err.stack) {
      console.log(`CDP STACK ${String(err.stack).split(/\r?\n/).slice(0, 5).join(" | ")}`);
    }
  } finally {
    for (const line of cdpNotes.slice(0, 50)) {
      console.log(line);
    }
    try {
      if (ws && targetId) await send("Target.closeTarget", { targetId });
    } catch {
      // ignore cleanup errors
    }
    try {
      if (ws) ws.close();
    } catch {
      // ignore cleanup errors
    }
    try {
      if (child) child.kill();
    } catch {
      // ignore cleanup errors
    }
    for (const [, entry] of pending) {
      try {
        entry.reject(new Error("CDP probe ending"));
      } catch {
        // ignore cleanup errors
      }
    }
    pending.clear();
    console.log("CDP DONE");
  }
}

async function main() {
  console.log(`node ${process.version}`);
  let localServer = null;
  if (LOCAL_MODE) {
    const started = await startLocalServer();
    localServer = started.server;
    // BASE override AFTER server start: all phases (HTTP, dumps, CDP) use it.
    BASE = `http://127.0.0.1:${started.port}`;
  }
  await phase1();
  await phase2();
  try {
    await phase3();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`CDP ERROR ${msg}`);
  }
  if (LOCAL_MODE) {
    printLocalVerdict();
  }
  console.log("PROBE DONE");
  if (localServer !== null) {
    await closeLocalServer(localServer);
    process.exit(0);
  }
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`PROBE FATAL ${msg}`);
  process.exit(1);
});
