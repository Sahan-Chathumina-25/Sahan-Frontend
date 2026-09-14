import { profile, prompt } from "../data/site.js";

const groups = [
  { name: "NETWORKING", items: ["Routing & Switching", "VLANs / Subnetting", "DNS / DHCP / BIND9", "HAProxy basics", "Troubleshooting"] },
  { name: "SECURITY", items: ["Ethical hacking basics", "System hardening", "Wireshark / tshark", "Access control", "Burp Suite basics"] },
  { name: "BUILD", items: ["Linux / Bash", "React + Vite", "Node / Express", "WordPress / PHP", "Git & GitHub"] },
];

export default function About() {
  return (
    <section className="terminal-section">
      <div className="cmd-head">
        <span className="ps1">{prompt()}</span> cat about.txt
        <div className="sub">background, skills &amp; focus</div>
      </div>
      <div className="panel">
        <p className="lead-line">
          I&apos;m <span className="bright">{profile.name}</span>, a {profile.role} from {profile.location}.
          I split my time between network labs, Linux hardening and building small full-stack apps.
        </p>
        <p className="lead-line">
          Current goal: internship-ready in cybersecurity / network engineering — solid fundamentals,
          clean documentation, and reproducible labs.
        </p>
        <hr className="divider" />
        <div className="mini-head">SKILLS</div>
        <div className="skill-cols">
          {groups.map((g) => (
            <div key={g.name}>
              <div className="skill-cat">{g.name}</div>
              {g.items.map((s) => (
                <div key={s} className="skill-bar">
                  <span className="name">{s}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <hr className="divider" />
        <div className="kv"><b>location</b><span>{profile.location}</span></div>
        <div className="kv"><b>github</b><span>{profile.github}</span></div>
        <div className="kv"><b>email</b><span>{profile.email}</span></div>
        <div className="kv"><b>linkedin</b><span>{profile.linkedin}</span></div>
        <div className="eof">-- EOF --</div>
      </div>
    </section>
  );
}
