import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { articles, profile, projects, prompt } from "../data/site.js";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="term-window reveal">
          <div className="term-titlebar">
            <div className="dots" aria-hidden="true">
              <i style={{ background: "#ff5f57" }} />
              <i style={{ background: "#febc2e" }} />
              <i style={{ background: "#28c840" }} />
            </div>
            <span>sahan@portfolio: ~/hello</span>
          </div>
          <div className="term-body">
            <div className="term-main">
              <div className="term-scroll">
                <div className="motd">
                  {`  ____        _             \n / ___|  __ _| |__   __ _ _ __  \n \\___ \\ / _\` | '_ \\ / _\` | '_ \\ \n  ___) | (_| | | | | (_| | | | |\n |____/ \\__,_|_| |_|\\__,_|_| |_|`}
                </div>
                <p className="lead-line">
                  Hi, I&apos;m <span className="bright">{profile.name}</span> — {profile.role} based in{" "}
                  {profile.location}.
                </p>
                <div className="help-grid">
                  <span className="cmd">whoami</span>
                  <span className="desc">linux · networking · full-stack · wordpress</span>
                  <span className="cmd">cat focus.txt</span>
                  <span className="desc">cybersecurity labs, LAN audits, hardening</span>
                  <span className="cmd">./hire-me.sh</span>
                  <span className="desc">open for internships &amp; freelance</span>
                </div>
                <div className="hist">
                  <div className="in">{prompt()} ls ~/projects | head -3</div>
                  <div className="out">{projects.slice(0, 3).map((p) => p.slug).join("  ")}</div>
                </div>
                <div className="prompt-line">
                  <span className="ps1">{prompt()}</span>
                  <span className="dim">explore the portfolio via the nav above</span>
                  <span className="caret">▊</span>
                </div>
              </div>
              <div className="term-actions">
                <Link className="btn" to="/projects">View projects <ArrowUpRight size={14} /></Link>
                <Link className="btn dim" to="/contact">Contact me</Link>
                <Link className="btn dim" to="/about">About</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="terminal-section">
        <div className="cmd-head">
          <span className="ps1">{prompt()}</span> cat about-preview.txt
          <div className="sub">who is sahan?</div>
        </div>
        <div className="panel">
          <p className="lead-line">
            {profile.role} in {profile.location}. I learn by building labs: VLANs, BIND9, Wireshark
            captures, hardened WordPress and small full-stack apps.
          </p>
          <div className="tag-row">
            <span className="tag">Networking</span>
            <span className="tag">Linux</span>
            <span className="tag">Security</span>
            <span className="tag">Full-stack</span>
            <span className="tag">WordPress</span>
          </div>
          <div className="link-row">
            <Link to="/about">Read full about →</Link>
          </div>
        </div>
      </section>

      <section className="terminal-section">
        <div className="cmd-head">
          <span className="ps1">{prompt()}</span> ls projects --recent
          <div className="sub">latest builds &amp; labs</div>
        </div>
        <div className="panel tight">
          <div className="proj-table-head">
            <span>PERMS</span>
            <span>OWNER</span>
            <span>YEAR</span>
            <span>NAME</span>
          </div>
          {projects.slice(0, 3).map((p) => (
            <Link key={p.slug} className="proj-row" to={`/projects/${p.slug}`}>
              <span className="cols">
                <span className="perm">drwxr-xr-x</span>
                <span className="owner">sahan</span>
                <span className="date">{p.year}</span>
                <span className="pname">{p.title}</span>
              </span>
              <span className="pdesc">{p.description}</span>
            </Link>
          ))}
        </div>
        <div className="link-row">
          <Link to="/projects">All 6 projects →</Link>
        </div>
      </section>

      <section className="terminal-section">
        <div className="cmd-head">
          <span className="ps1">{prompt()}</span> tail articles.log
          <div className="sub">notes &amp; write-ups</div>
        </div>
        <div className="panel">
          {articles.slice(0, 2).map((a) => (
            <div key={a.slug} className="kv">
              <b>{a.date}</b>
              <span><Link to="/articles" style={{ color: "var(--crt-accent)" }}>{a.title}</Link> — {a.excerpt}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="terminal-section">
        <div className="cmd-head">
          <span className="ps1">{prompt()}</span> ./contact.sh --preview
        </div>
        <div className="panel">
          <p className="lead-line">Have a lab, internship or freelance task? My inbox is open.</p>
          <Link className="btn" to="/contact">Open contact form <ArrowUpRight size={14} /></Link>
          <div className="eof">-- EOF --</div>
        </div>
      </section>
    </>
  );
}
