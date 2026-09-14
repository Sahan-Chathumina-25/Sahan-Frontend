import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  Cpu,
  Database,
  ExternalLink,
  Github,
  Linkedin,
  LockKeyhole,
  Mail,
  Menu,
  Network,
  Server,
  ShieldCheck,
  X,
} from "lucide-react";
import "./styles.css";
import { sendContactMessage } from "./api/contactApi.js";

/* ============================== data ============================== */

const profile = {
  user: "sahan",
  host: "portfolio",
  name: "Sahan Chathumina",
  display: "S A H A N  C S",
  role: "Cybersecurity & Network Engineering Student | Linux | Full Stack | WordPress",
  location: "Sri Lanka",
  github: "https://github.com/Sahan-Chathumina-25",
  linkedin: "https://www.linkedin.com/in/sahan-chathumina-4a5723316/",
  email: "chathuminacsahan25@gmail.com",
};

const prompt = () => `${profile.user}@${profile.host}:~$`;

const skillGroups = [
  {
    name: "Networking",
    items: [
      { name: "Routing & Switching", level: 85 },
      { name: "VLANs / Subnetting", level: 88 },
      { name: "DNS / DHCP / BIND", level: 86 },
      { name: "HAProxy / Load Bal.", level: 78 },
      { name: "Troubleshooting", level: 90 },
    ],
  },
  {
    name: "Cybersecurity",
    items: [
      { name: "Ethical Hacking", level: 80 },
      { name: "System Hardening", level: 85 },
      { name: "Wireshark / tshark", level: 82 },
      { name: "Access Control", level: 84 },
      { name: "Burp Suite", level: 74 },
    ],
  },
  {
    name: "Linux & Systems",
    items: [
      { name: "Rocky / CentOS Admin", level: 86 },
      { name: "Apache / VirtualHosts", level: 82 },
      { name: "SSH / firewalld", level: 88 },
      { name: "auditd / ACLs", level: 80 },
      { name: "Virtualization Labs", level: 83 },
    ],
  },
  {
    name: "Development & Data",
    items: [
      { name: "Full-Stack Web", level: 82 },
      { name: "WordPress", level: 85 },
      { name: "Node.js Automation", level: 80 },
      { name: "MySQL Security", level: 84 },
      { name: "Git / GitHub", level: 88 },
    ],
  },
];

const projects = [
  {
    slug: "secure-linux-baseline",
    title: "Secure Linux Baseline",
    category: "SYSTEM SECURITY",
    date: "Lab 01",
    description:
      "Hardened Rocky Linux baseline: firewalld zones, SSH key-only auth, automatic updates, auditd rules, filesystem ACLs and kernel sysctl tuning.",
    tags: ["Rocky Linux", "firewalld", "auditd", "SSH"],
    githubUrl: profile.github,
    demoUrl: "",
  },
  {
    slug: "network-infrastructure-lab",
    title: "Network Infrastructure Lab",
    category: "NETWORKING",
    date: "Lab 02",
    description:
      "Multi-service lab with BIND DNS, DHCP, Apache virtual hosts, TLS certificates and HAProxy load balancing in a virtualised environment.",
    tags: ["BIND", "DHCP", "Apache", "HAProxy"],
    githubUrl: profile.github,
    demoUrl: "",
  },
  {
    slug: "database-security-lab",
    title: "Database Security Lab",
    category: "DATABASE",
    date: "Lab 03",
    description:
      "Security-focused MySQL environment: roles and privileges, auth plugins, hardening checklist, replication, backups and failure monitoring.",
    tags: ["MySQL", "RBAC", "Backups", "Hardening"],
    githubUrl: profile.github,
    demoUrl: "",
  },
  {
    slug: "github-readme-automation",
    title: "github-readme-automation",
    category: "AUTOMATION",
    date: "Repo",
    description:
      "Automated developer-profile stats pipeline that keeps public GitHub metrics current via the GitHub API without manual editing.",
    tags: ["GitHub API", "Node.js", "Automation"],
    githubUrl: "https://github.com/Sahan-Chathumina-25/github-readme-automation",
    demoUrl: "",
  },
  {
    slug: "register",
    title: "register",
    category: "WEB APP",
    date: "Repo",
    description:
      "Registration web application exploring form validation, data handling and full-stack project structure.",
    tags: ["Web", "Forms", "Full Stack"],
    githubUrl: "https://github.com/Sahan-Chathumina-25/register",
    demoUrl: "",
  },
  {
    slug: "portfolio-site",
    title: "Sahan-Chathumina-25.github.io",
    category: "PORTFOLIO",
    date: "Repo",
    description:
      "This portfolio site — a CRT-terminal styled personal site built with Vite and React, deployed on GitHub Pages.",
    tags: ["Vite", "React", "CRT UI"],
    githubUrl: "https://github.com/Sahan-Chathumina-25/Sahan-Chathumina-25.github.io",
    demoUrl: "https://sahan-chathumina-25.github.io/",
  },
];

const archNodes = [
  { label: "INTERNET", Icon: Network, x: "50%", y: "10%" },
  { label: "FIREWALL", Icon: ShieldCheck, x: "50%", y: "31%" },
  { label: "LOAD BALANCER", Icon: Activity, x: "50%", y: "52%" },
  { label: "WEB / APP", Icon: Server, x: "22%", y: "80%" },
  { label: "DATABASE", Icon: Database, x: "50%", y: "80%" },
  { label: "MONITORING", Icon: Cpu, x: "78%", y: "80%" },
];

const education = [
  {
    when: "CURRENT",
    title: "BSc(Hons) Ethical Hacking & Network Security",
    text: "Deeper foundation across cybersecurity, networking, Linux systems and secure computing.",
  },
  {
    when: "COMPLETED",
    title: "Higher National Diploma in Network Engineering",
    text: "Networking, infrastructure, system administration and hands-on technical labs.",
  },
  {
    when: "COURSE",
    title: "Red Hat System Administration I",
    text: "Linux administration fundamentals, system management and command-line operations.",
  },
];

const INTRO_LINES = [
  { cmd: "whoami", out: "Sahan Chathumina — Cybersecurity & Network Engineering Student" },
  { cmd: "cat focus.txt", out: "Networking  •  Linux  •  Security  •  Full Stack  •  WordPress" },
  { cmd: "ls projects/", out: "secure-baseline/  infra-lab/  dbsec-lab/  automation/  ..." },
  { cmd: "open portfolio", out: "[ OK ] launching interface..." },
];

const BOOT_LINES = [
  "[ OK ] mounting sections...",
  "[ OK ] indexing skill matrix...",
  "[ OK ] loading project table...",
  "[ OK ] link encrypted — ready.",
];

/* ============================== overlays ============================== */

function CrtOverlays() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  if (reduced) return null;
  return (
    <>
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-noise" aria-hidden="true" />
      <div className="crt-vignette" aria-hidden="true" />
      <div className="crt-flicker" aria-hidden="true" />
    </>
  );
}

function Sweep({ active, onDone }) {
  useEffect(() => {
    if (!active) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => onDone && onDone(), reduced ? 0 : 210);
    return () => clearTimeout(t);
  }, [active, onDone]);
  if (!active) return null;
  return <div className="scanline-sweep" aria-hidden="true" />;
}

/* ============================== status bar ============================== */

const NAV = [
  { id: "about", label: "ABOUT", cmd: "cat about.txt" },
  { id: "skills", label: "SKILLS", cmd: "skills --list" },
  { id: "architecture", label: "TOPOLOGY", cmd: "netstat -t" },
  { id: "projects", label: "PROJECTS", cmd: "ls projects/" },
  { id: "education", label: "EDUCATION", cmd: "cat edu.log" },
  { id: "contact", label: "CONTACT", cmd: "ping sahan" },
];

function StatusBar({ active, onNavigate, onReplay }) {
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= 900);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const go = (id) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <header className="statusbar">
      <div className="prompt">{wide ? prompt() : "~$"}</div>
      <nav className={open ? "open" : ""} aria-label="Sections">
        {NAV.map((n) => (
          <button key={n.id} className={active === n.id ? "active" : ""} onClick={() => go(n.id)} aria-current={active === n.id ? "page" : undefined}>
            {active === n.id && <span className="accent">&gt;</span>}
            <span>{wide ? n.cmd : n.label}</span>
          </button>
        ))}
      </nav>
      <div className="meta">
        <span className="dim">{time}</span>
        <span>
          <span className="dot" /> ONLINE
        </span>
        <button onClick={onReplay} aria-label="Replay intro">REPLAY</button>
        <button className="menu-btn" style={{ display: undefined }} onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>
    </header>
  );
}

/* ============================== terminal intro ============================== */

function TerminalIntro({ onComplete }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [typedCmd, setTypedCmd] = useState("");
  const [typedOut, setTypedOut] = useState("");
  const [phase, setPhase] = useState("cmd"); // cmd | out | boot | done
  const [done, setDone] = useState([]);
  const [bootCount, setBootCount] = useState(0);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(INTRO_LINES);
      setBootCount(BOOT_LINES.length);
      const t = setTimeout(() => doneRef.current(), 150);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (phase === "cmd") {
      if (lineIdx >= INTRO_LINES.length) {
        setPhase("boot");
        return;
      }
      const target = INTRO_LINES[lineIdx].cmd;
      if (typedCmd.length < target.length) {
        const t = setTimeout(() => setTypedCmd(target.slice(0, typedCmd.length + 1)), 34);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("out"), 120);
      return () => clearTimeout(t);
    }
    if (phase === "out") {
      const target = INTRO_LINES[lineIdx].out;
      if (typedOut.length < target.length) {
        const t = setTimeout(() => setTypedOut(target.slice(0, typedOut.length + 1)), 12);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setDone((d) => [...d, INTRO_LINES[lineIdx]]);
        setLineIdx((i) => i + 1);
        setTypedCmd("");
        setTypedOut("");
        setPhase("cmd");
      }, 220);
      return () => clearTimeout(t);
    }
    if (phase === "boot") {
      if (bootCount < BOOT_LINES.length) {
        const t = setTimeout(() => setBootCount((c) => c + 1), 130);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setPhase("done");
        doneRef.current();
      }, 350);
      return () => clearTimeout(t);
    }
  }, [phase, lineIdx, typedCmd, typedOut, bootCount]);

  const skip = () => {
    setDone(INTRO_LINES);
    setBootCount(BOOT_LINES.length);
    setPhase("done");
    doneRef.current();
  };

  return (
    <>
      <div className="intro-box">
        {done.map((l, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div>
              <span className="ps1">{prompt()}</span>
              <span className="bright">{l.cmd}</span>
            </div>
            <div className="dim">{l.out}</div>
          </div>
        ))}
        {(phase === "cmd" || phase === "out") && lineIdx < INTRO_LINES.length && (
          <div style={{ marginBottom: 12 }}>
            <div>
              <span className="ps1">{prompt()}</span>
              <span className="bright">{typedCmd}</span>
              {phase === "cmd" && <span className="caret">█</span>}
            </div>
            {phase === "out" && <div className="dim">{typedOut}</div>}
          </div>
        )}
        {(phase === "boot" || phase === "done") && (
          <div style={{ marginTop: 8, borderTop: "1px solid var(--crt-border)", paddingTop: 12 }}>
            {BOOT_LINES.slice(0, bootCount).map((b, i) => (
              <div key={i} className="accent" style={{ fontSize: 12 }}>
                {b}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="skip-row">
        <button onClick={skip}>SKIP INTRO &gt;&gt;</button>
      </div>
    </>
  );
}

/* ============================== hero shell ============================== */

const MOTD = [
  "╔══════════════════════════════════════════════════════════╗",
  "║  Welcome, guest. Type 'help' or use the status bar.      ║",
  "║  about · skills · topology · projects · edu · contact    ║",
  "╚══════════════════════════════════════════════════════════╝",
];

function HeroTerminal({ started, onIntroDone, onNavigate, onReplay }) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    setShowIntro(true);
  }, [started]);

  const finishIntro = useCallback(() => {
    setShowIntro(false);
    onIntroDone();
  }, [onIntroDone]);

  return (
    <section id="hero" className="hero">
      <div className="term-window">
        <div className="term-titlebar">
          <div className="dots">
            <i style={{ background: "rgba(255,95,86,.7)" }} />
            <i style={{ background: "rgba(255,189,46,.7)" }} />
            <i style={{ background: "rgba(39,201,63,.7)" }} />
          </div>
          <span>
            {profile.user}@{profile.host} — bash
          </span>
          <span style={{ width: 60 }} />
        </div>
        <div className="term-body">
          {showIntro ? <TerminalIntro onComplete={finishIntro} /> : <Shell onNavigate={onNavigate} onReplay={onReplay} />}
        </div>
      </div>
    </section>
  );
}

function Shell({ onNavigate, onReplay }) {
  const scrollRef = useRef(null);
  const [clock, setClock] = useState("");
  const [uptime, setUptime] = useState("0:00:00");
  const [input, setInput] = useState("");
  const [hist, setHist] = useState([]);
  const t0 = useRef(Date.now());

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString("en-GB", { hour12: false }));
      const s = Math.floor((Date.now() - t0.current) / 1000);
      const h = Math.floor(s / 3600);
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      setUptime(`${h}:${m}:${ss}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [hist]);

  const run = useCallback(
    (raw) => {
      const cmd = raw.trim();
      if (!cmd) return;
      const norm = cmd.toLowerCase().replace(/\s+/g, " ");
      const rows = [{ kind: "in", text: `${prompt()} ${cmd}` }];
      const ok = (section, msg) => {
        rows.push({ kind: "out", text: `[OK] ${msg}` });
        setHist((h) => [...h, ...rows]);
        setInput("");
        setTimeout(() => onNavigate(section), 250);
      };
      if (norm === "help") {
        rows.push(
          { kind: "out", text: "allowed commands:" },
          { kind: "out", text: "  cat about.txt ......... bio" },
          { kind: "out", text: "  skills --list ......... skill matrix" },
          { kind: "out", text: "  netstat -t ............ topology" },
          { kind: "out", text: "  ls projects/ .......... projects" },
          { kind: "out", text: "  cat edu.log ........... education" },
          { kind: "out", text: "  ping sahan ............ contact" },
          { kind: "out", text: "  whoami / clear" },
        );
      } else if (norm === "cat about.txt" || norm === "about") ok("about", "opening about.txt");
      else if (norm === "skills --list" || norm === "skills") ok("skills", "dumping skill matrix");
      else if (norm === "netstat -t" || norm === "topology") ok("architecture", "tracing topology");
      else if (norm === "ls projects/" || norm === "ls projects" || norm === "projects") ok("projects", "listing projects/");
      else if (norm === "cat edu.log" || norm === "education") ok("education", "reading edu.log");
      else if (norm === "ping sahan" || norm === "contact") ok("contact", "pinging sahan — reply in 0.04ms");
      else if (norm === "whoami") rows.push({ kind: "out", text: profile.name });
      else if (norm === "clear") {
        setHist([]);
        setInput("");
        return;
      } else rows.push({ kind: "err", text: `command not allowed: ${cmd} (try 'help')` });

      if (!rows[1] || rows[1].kind !== "out" || !rows[1].text.startsWith("[OK]")) {
        setHist((h) => [...h, ...rows]);
        setInput("");
      }
    },
    [onNavigate],
  );

  const quick = [
    { label: "> HELP", fn: () => run("help") },
    { label: "> VIEW PROJECTS", fn: () => run("ls projects/") },
    { label: "> GITHUB", fn: () => window.open(profile.github, "_blank", "noopener") },
    { label: "> REPLAY", fn: onReplay },
  ];

  return (
    <div className="term-main" style={{ flexDirection: "row", display: "flex", width: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div ref={scrollRef} className="term-scroll">
          <div className="motd">{MOTD.join("\n")}</div>
          <div className="dim" style={{ fontSize: 12, marginBottom: 4 }}>
            Allowed commands:
          </div>
          <div className="help-grid">
            <span className="cmd">cat about.txt</span>
            <span className="desc">- view bio</span>
            <span className="cmd">skills --list</span>
            <span className="desc">- skill matrix</span>
            <span className="cmd">ls projects/</span>
            <span className="desc">- browse projects</span>
            <span className="cmd">ping sahan</span>
            <span className="desc">- contact form</span>
          </div>
          {hist.length > 0 && (
            <div className="hist">
              {hist.map((h, i) => (
                <div key={i} className={h.kind === "err" ? "err" : h.kind === "in" ? "in" : "out"}>
                  {h.text}
                </div>
              ))}
            </div>
          )}
          <form
            className="prompt-line"
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
            }}
          >
            <span className="ps1">{prompt()}</span>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="type a command (help)" aria-label="Terminal command" autoComplete="off" spellCheck={false} />
            <span className="caret">█</span>
          </form>
        </div>
        <div className="term-actions">
          {quick.map((b) => (
            <button key={b.label} type="button" onClick={b.fn}>
              {b.label}
            </button>
          ))}
        </div>
      </div>
      <aside className="term-side" aria-label="System info">
        <section>
          <h4>SYSTEM</h4>
          <div className="row">
            <span>TIME</span>
            <b>{clock}</b>
          </div>
          <div className="row">
            <span>UPTIME</span>
            <b>{uptime}</b>
          </div>
          <div className="row">
            <span>STATUS</span>
            <b className="accent">ONLINE</b>
          </div>
        </section>
        <section>
          <h4>PROFILE</h4>
          <div className="row">
            <span>USER</span>
            <b>{profile.user}</b>
          </div>
          <div className="row">
            <span>ROLE</span>
            <b>netsec</b>
          </div>
          <div className="row">
            <span>LOC</span>
            <b>{profile.location}</b>
          </div>
        </section>
        <section>
          <h4>STACK</h4>
          <div className="chipset">
            {["Linux", "Networking", "Security", "React", "WordPress", "MySQL"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

/* ============================== sections ============================== */

function CmdHead({ cmd, sub }) {
  return (
    <div className="cmd-head">
      <div>
        <span className="ps1 accent">{prompt()}</span> <span className="bright">{cmd}</span>
      </div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

function About() {
  return (
    <section id="about" className="terminal-section">
      <div className="wrap">
        <CmdHead cmd="cat about.txt" />
        <div className="panel reveal">
          <p className="lead-line">
            {profile.name} — {profile.role}. Based in {profile.location}.
          </p>
          <p className="lead-line">
            I work at the intersection of <span className="bright">network engineering, Linux administration and cybersecurity</span> — building
            real labs, breaking down problems and documenting practical solutions.
          </p>
          <p className="lead-line">
            Currently pursuing a BSc(Hons) in Ethical Hacking &amp; Network Security after an HND in Network Engineering. This portfolio is a living
            record of the systems, experiments and projects I build along the way.
          </p>
          <hr className="divider" />
          <div className="mini-head">FOCUS AREAS:</div>
          <div className="tag-row">
            {["Networking", "Linux Systems", "Security", "Full Stack", "WordPress"].map((f) => (
              <span key={f} className="tag">
                {f}
              </span>
            ))}
          </div>
          <hr className="divider" />
          <div className="mini-head">LOCATION:</div>
          <div className="dim" style={{ fontSize: 12 }}>
            &gt; {profile.location} — open to remote collaboration worldwide
          </div>
        </div>
        <div className="eof">[EOF] about.txt — 3 blocks</div>
      </div>
    </section>
  );
}

function SkillBar({ name, level }) {
  const filled = Math.round(level / 5);
  const bar = "█".repeat(filled) + "░".repeat(20 - filled);
  return (
    <div className="skill-bar">
      <span className="name">{name}</span>
      <span className="bar">[{bar}]</span>
      <span className="pct">{level}%</span>
    </div>
  );
}

function Skills() {
  const total = skillGroups.reduce((n, g) => n + g.items.length, 0);
  return (
    <section id="skills" className="terminal-section">
      <div className="wrap">
        <CmdHead cmd="skills --list" />
        <div className="panel reveal">
          <div className="skill-cols">
            {skillGroups.map((g) => (
              <div key={g.name}>
                <div className="skill-cat">&gt; {g.name.toUpperCase()}</div>
                {g.items.map((s) => (
                  <SkillBar key={s.name} name={s.name} level={s.level} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="eof">[OK] skills loaded — {total} items</div>
      </div>
    </section>
  );
}

function Architecture() {
  return (
    <section id="architecture" className="terminal-section">
      <div className="wrap">
        <CmdHead cmd="netstat -t" sub="tracing secure path: client → firewall → services" />
        <div className="arch reveal">
          <svg className="wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M50 16 L50 31 L50 52 L22 80 M50 52 L50 80 M50 52 L78 80" />
          </svg>
          {archNodes.map((n) => (
            <div key={n.label} className="arch-node" style={{ left: n.x, top: n.y }}>
              <div className="box">
                <n.Icon size={20} />
              </div>
              <small>{n.label}</small>
            </div>
          ))}
          <div className="arch-cap">
            <LockKeyhole size={13} /> ZERO-TRUST MINDSET / DEFENCE IN DEPTH
          </div>
        </div>
        <div className="eof">[OK] 6 hops — all firewalled, all monitored</div>
      </div>
    </section>
  );
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!project) return null;
  return (
    <div className="modal-veil" onClick={onClose} role="dialog" aria-modal="true" aria-label={project.title}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span>
            cat projects/{project.slug}.md
          </span>
          <button onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          <h2># {project.title}</h2>
          <div className="mini-head">## CATEGORY</div>
          <p className="dim" style={{ marginTop: 0 }}>
            {project.category}
          </p>
          <div className="mini-head">## README</div>
          <p className="bright" style={{ lineHeight: 1.8 }}>
            {project.description}
          </p>
          <div className="mini-head">## TECHNOLOGIES</div>
          <div className="tag-row">
            {project.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          <div className="mini-head" style={{ marginTop: 20 }}>
            ## LINKS
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="btn dim" href={project.githubUrl} target="_blank" rel="noreferrer">
              <Github size={14} /> VIEW ON GITHUB
            </a>
            {project.demoUrl && (
              <a className="btn dim" href={project.demoUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={14} /> OPEN LIVE
              </a>
            )}
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn dim" onClick={onClose}>
            &gt; CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const [selected, setSelected] = useState(null);
  return (
    <section id="projects" className="terminal-section">
      <div className="wrap">
        <CmdHead cmd="ls -la projects/" />
        <div className="panel tight reveal">
          <div className="proj-table-head">
            <span>PERMISSIONS</span>
            <span>OWNER</span>
            <span>REF</span>
            <span>NAME</span>
          </div>
          {projects.map((p) => (
            <button key={p.slug} className="proj-row" onClick={() => setSelected(p)}>
              <span className="cols">
                <span className="perm">drwxr-xr-x</span>
                <span className="owner">{profile.user}</span>
                <span className="date">{p.date}</span>
                <span className="pname">{p.title}/</span>
              </span>
              <span className="pdesc">{p.description}</span>
            </button>
          ))}
        </div>
        <div className="eof">
          total {projects.length} — click a row for details · <a href={profile.github} target="_blank" rel="noreferrer" style={{ color: "var(--crt-accent)" }}>view all on GitHub <ArrowUpRight size={11} style={{ verticalAlign: -1 }} /></a>
        </div>
        <div className="proj-cards" style={{ marginTop: 18 }}>
          {projects.slice(0, 4).map((p, i) => (
            <article key={p.slug} className="panel proj-card reveal">
              <span className="cat">
                0{i + 1} / {p.category}
              </span>
              <h3>
                {p.title} <ChevronRight size={18} />
              </h3>
              <p>{p.description}</p>
              <div className="tag-row">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      </div>
    </section>
  );
}

function Education() {
  return (
    <section id="education" className="terminal-section">
      <div className="wrap">
        <CmdHead cmd="cat edu.log" />
        <div className="panel reveal">
          <div className="tl">
            {education.map((e) => (
              <div key={e.title} className="tl-item">
                <span className="when">[{e.when}]</span>
                <div>
                  <h3>{e.title}</h3>
                  <p>{e.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="eof">[EOF] edu.log — {education.length} entries</div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [channel, setChannel] = useState("");
  const [error, setError] = useState("");
  const MIN = 10;

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (k === "message" && error && e.target.value.trim().length >= MIN) setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    const msg = form.message.trim();
    if (msg.length < MIN) {
      setError(`Message must be at least ${MIN} characters.`);
      return;
    }
    setError("");
    setStatus("sending");
    try {
      const result = await sendContactMessage({ name: form.name, email: form.email, message: msg });
      setChannel(result && result.channel ? result.channel : "api");
      setStatus("sent");
    } catch (err) {
      const subject = encodeURIComponent(`Portfolio contact from ${form.name || "guest"}`);
      const body = encodeURIComponent(`${msg}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setChannel("mailto");
      setStatus("sent");
    }
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section id="contact" className="terminal-section">
      <div className="wrap">
        <CmdHead cmd="ping sahan" sub={`PING sahan (${profile.location.toLowerCase()}): 56 data bytes`} />
        <div className="panel reveal">
          <form className="form-grid" onSubmit={submit}>
            <div className="field">
              <label htmlFor="c-name">&gt; NAME</label>
              <input id="c-name" name="name" value={form.name} onChange={set("name")} required placeholder="your handle..." autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="c-email">&gt; EMAIL</label>
              <input id="c-email" type="email" name="email" value={form.email} onChange={set("email")} required placeholder="you@domain.tld" autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="c-msg">&gt; MESSAGE</label>
              <textarea id="c-msg" name="message" rows={5} value={form.message} onChange={set("message")} required minLength={MIN} placeholder="ping with purpose..." />
              <div className="form-note" style={{ marginTop: 6 }}>
                <span>
                  minimum {MIN} characters
                </span>
                <span>
                  {form.message.trim().length}/{MIN}
                </span>
              </div>
              {error && <p className="form-err">[ VALIDATION ] {error}</p>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button className="btn" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "SENDING..." : "> SEND MESSAGE"}
              </button>
              {status === "sent" && (
                <span className="form-ok">
                  {channel === "mailto" ? "[ OK ] opening mail client..." : "[ OK ] message sent via api..."}
                </span>
              )}
            </div>
          </form>
        </div>
        <div className="eof">64 bytes from sahan: icmp_seq=0 ttl=64 time=0.042 ms</div>
        <div className="contact-cards">
          <a href={profile.github} target="_blank" rel="noreferrer">
            <Github size={17} /> <span>GitHub<br />{profile.github.replace("https://", "")}</span>
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={17} /> <span>LinkedIn<br />connect</span>
          </a>
          <a href={`mailto:${profile.email}`}>
            <Mail size={17} /> <span>Email<br />{profile.email}</span>
          </a>
        </div>
        <div className="link-row dim">
          <span>or reach directly:</span>
          <a href={profile.github} target="_blank" rel="noreferrer">&gt; GitHub</a>
          <a href={`mailto:${profile.email}`}>&gt; Email</a>
        </div>
      </div>
    </section>
  );
}

/* ============================== app ============================== */

const SECTIONS = ["hero", "about", "skills", "architecture", "projects", "education", "contact"];

function App() {
  const [active, setActive] = useState("hero");
  const [introDone, setIntroDone] = useState(false);
  const [sweep, setSweep] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      let cur = "hero";
      SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) cur = id;
      });
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = introDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introDone]);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const navigate = useCallback(
    (id) => {
      setSweep(true);
      setTimeout(() => scrollTo(id), 190);
    },
    [scrollTo],
  );

  const replay = useCallback(() => {
    setIntroDone(false);
    setReplayKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const year = new Date().getFullYear();

  return (
    <div className="site">
      <CrtOverlays />
      <Sweep active={sweep} onDone={() => setSweep(false)} />
      <StatusBar active={active === "hero" ? "" : active} onNavigate={navigate} onReplay={replay} />

      <main>
        <HeroTerminal key={replayKey} started={replayKey} onIntroDone={() => setIntroDone(true)} onNavigate={navigate} onReplay={replay} />

        <div style={{ opacity: introDone ? 1 : 0, pointerEvents: introDone ? "auto" : "none", transition: "opacity .3s" }}>
          <About />
          <Skills />
          <Architecture />
          <Projects />
          <Education />
          <Contact />

          <footer className="site-foot">
            <div className="wrap">
              <p style={{ margin: 0 }}>
                {profile.user}@{profile.host}:~$ echo "© {year} {profile.display}"
              </p>
              <p className="bright-line">© {year} {profile.name.toUpperCase()}</p>
              <p style={{ marginTop: 12 }}>
                Built with <span className="bright">React</span>, <span className="bright">Vite</span> and{" "}
                <span className="bright">phosphor</span> · <button onClick={() => setMenuOpen((v) => !v)} style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", fontSize: 11 }}>{menuOpen ? "less" : "more"}</button>
              </p>
              {menuOpen && (
                <p className="dim" style={{ fontSize: 11 }}>
                  {profile.role} · {profile.location} · {profile.email}
                </p>
              )}
              <p style={{ marginTop: 10 }}>
                <a href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ color: "var(--crt-muted)" }}>BACK TO TOP ↑</a>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
