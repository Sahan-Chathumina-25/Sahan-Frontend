import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../lib/api.js";
import { projects as fallback, prompt } from "../data/site.js";

function slugOf(p, i) {
  if (p && typeof p.slug === "string" && p.slug) return p.slug;
  if (p && typeof p.title === "string" && p.title) {
    return p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `project-${i}`;
  }
  return fallback[i % fallback.length]?.slug ?? `project-${i}`;
}

export default function Projects() {
  const [items, setItems] = useState(fallback);
  const [source, setSource] = useState("local");

  useEffect(() => {
    let alive = true;
    getProjects().then((list) => {
      if (!alive || !Array.isArray(list)) return;
      setItems(list.length > 0 ? list : fallback);
      setSource(list === fallback ? "local" : "api");
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <section className="terminal-section">
      <div className="cmd-head">
        <span className="ps1">{prompt()}</span> ls -la ~/projects
        <div className="sub">6 builds &amp; labs · source: {source}</div>
      </div>
      <div className="panel tight">
        <div className="proj-table-head">
          <span>PERMS</span>
          <span>OWNER</span>
          <span>YEAR</span>
          <span>NAME</span>
        </div>
        {items.map((p, i) => {
          const slug = slugOf(p, i);
          const title = p.title ?? p.name ?? slug;
          const desc = p.description ?? p.excerpt ?? "";
          const year = p.year ?? p.date ?? "2025";
          return (
            <Link key={slug} className="proj-row" to={`/projects/${slug}`}>
              <span className="cols">
                <span className="perm">drwxr-xr-x</span>
                <span className="owner">sahan</span>
                <span className="date">{String(year).slice(0, 4)}</span>
                <span className="pname">{title}</span>
              </span>
              {desc ? <span className="pdesc">{desc}</span> : null}
            </Link>
          );
        })}
      </div>
      <div className="eof">-- {items.length} entries --</div>
    </section>
  );
}
