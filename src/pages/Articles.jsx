import { Link } from "react-router-dom";
import { articles, prompt } from "../data/site.js";

export default function Articles() {
  return (
    <section className="terminal-section">
      <div className="cmd-head">
        <span className="ps1">{prompt()}</span> ls ~/articles
        <div className="sub">study notes &amp; write-ups by Sahan</div>
      </div>
      <div className="panel">
        <div className="tl">
          {articles.map((a) => (
            <article key={a.slug} className="tl-item">
              <span className="when">{a.date}</span>
              <div>
                <h3 className="bright">{a.title}</h3>
                <p>{a.excerpt}</p>
                <p className="dim" style={{ fontSize: 11, marginTop: 8 }}>slug: {a.slug} · status: draft published</p>
              </div>
            </article>
          ))}
        </div>
        <div className="link-row">
          <Link to="/contact">Suggest a topic →</Link>
        </div>
        <div className="eof">-- {articles.length} posts --</div>
      </div>
    </section>
  );
}
