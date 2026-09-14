import { Link, useParams } from "react-router-dom";
import { projects, prompt } from "../data/site.js";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <section className="terminal-section">
        <div className="cmd-head">
          <span className="ps1">{prompt()}</span> cat projects/{slug ?? "unknown"}.md
        </div>
        <div className="panel">
          <p className="lead-line">No such project: <span className="accent">{slug}</span></p>
          <div className="hist"><div className="err">error: ENOENT — project not found</div></div>
          <Link className="btn dim" to="/projects">← Back to projects</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="terminal-section">
      <div className="cmd-head">
        <span className="ps1">{prompt()}</span> cat projects/{project.slug}.md
        <div className="sub">{project.stack} · {project.year}</div>
      </div>
      <div className="panel">
        <h1 className="bright text-glow" style={{ margin: "0 0 12px", fontSize: 24 }}>{project.title}</h1>
        <p className="lead-line">{project.description}</p>
        <div className="mini-head">STACK</div>
        <p className="dim" style={{ fontSize: 12 }}>{project.stack}</p>
        <div className="mini-head">TAGS</div>
        <div className="tag-row">
          {project.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <hr className="divider" />
        <div className="kv"><b>slug</b><span>{project.slug}</span></div>
        <div className="kv"><b>year</b><span>{project.year}</span></div>
        <div className="link-row">
          <Link to="/projects">← All projects</Link>
          <Link to="/contact">Discuss this build →</Link>
        </div>
        <div className="eof">-- EOF --</div>
      </div>
    </section>
  );
}
