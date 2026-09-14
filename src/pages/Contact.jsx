import { useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { CONTACT_EMAIL, MIN_MESSAGE_LENGTH, sendContactMessage } from "../api/contactApi.js";
import { profile, prompt } from "../data/site.js";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ kind: "idle", text: "" });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus({ kind: "idle", text: "" });
    try {
      const result = await sendContactMessage({ name, email, message });
      if (result === "mailto") {
        const subject = encodeURIComponent(`Portfolio contact from ${name.trim()}`);
        const body = encodeURIComponent(`${message.trim()}\n\n— ${name.trim()} (${email.trim()})`);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        setStatus({ kind: "ok", text: "No backend configured — opened your mail app instead." });
      } else {
        setStatus({ kind: "ok", text: "Message sent. I usually reply within 48 hours." });
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch (err) {
      setStatus({ kind: "err", text: err instanceof Error ? err.message : "Send failed." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="terminal-section">
      <div className="cmd-head">
        <span className="ps1">{prompt()}</span> ./contact.sh
        <div className="sub">form posts to API when VITE_API_URL is set, else mailto fallback</div>
      </div>
      <div className="panel">
        <form className="form-grid" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="c-name">NAME</label>
            <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="sahan" autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="c-email">EMAIL</label>
            <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="c-msg">MESSAGE</label>
            <textarea id="c-msg" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Hello Sahan — (min ${MIN_MESSAGE_LENGTH} chars)`} />
          </div>
          <div className="form-note">
            <span>direct: {profile.email}</span>
            <span>{message.trim().length}/{MIN_MESSAGE_LENGTH}+ chars</span>
          </div>
          {status.kind === "err" ? <div className="form-err">{status.text}</div> : null}
          {status.kind === "ok" ? <div className="form-ok">{status.text}</div> : null}
          <div>
            <button className="btn" type="submit" disabled={busy}>{busy ? "sending…" : "send message"}</button>
          </div>
        </form>
        <div className="contact-cards">
          <a href={profile.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
          <a href={`mailto:${profile.email}`}><Mail size={16} /> Email</a>
        </div>
        <div className="eof">-- EOF --</div>
      </div>
    </section>
  );
}
