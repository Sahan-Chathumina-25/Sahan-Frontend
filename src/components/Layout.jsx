import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { profile, prompt } from "../data/site.js";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/articles", label: "Articles" },
  { to: "/contact", label: "Contact" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="site">
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-noise" aria-hidden="true" />
      <div className="crt-vignette" aria-hidden="true" />
      <div className="scanline-sweep" aria-hidden="true" />

      <header className="statusbar">
        <span className="prompt">{prompt()}</span>
        <button
          type="button"
          className="menu-btn"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
        <nav className={open ? "open" : undefined}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              style={({ isActive }) =>
                isActive
                  ? { color: "var(--crt-accent)", textShadow: "0 0 8px rgba(0,255,132,0.45)" }
                  : undefined
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="meta">
          <span>
            <span className="dot" /> online
          </span>
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github size={14} />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin size={14} />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email">
            <Mail size={14} />
          </a>
        </div>
      </header>

      <main className="wrap">
        <Outlet />
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <div>
            {prompt()} <Link to="/contact" style={{ color: "inherit" }}>hire sahan --secure</Link>
            <span className="cursor-blink">█</span>
          </div>
          <div className="bright-line">
            {profile.name} · {profile.role} · {profile.location}
          </div>
          <div style={{ marginTop: 6 }}>© {new Date().getFullYear()} {profile.name}. Built with React + CRT.</div>
        </div>
      </footer>
    </div>
  );
}
