import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Articles from "./pages/Articles.jsx";
import Contact from "./pages/Contact.jsx";
import { prompt } from "./data/site.js";

function Stub({ title, cmd }) {
  return (
    <section className="terminal-section">
      <div className="cmd-head">
        <span className="ps1">{prompt()}</span> {cmd}
      </div>
      <div className="panel">
        <p className="lead-line"><span className="bright">{title}</span> — placeholder route (coming soon).</p>
        <div className="eof">-- EOF --</div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="articles" element={<Articles />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Stub title="Login" cmd="auth login" />} />
          <Route path="register" element={<Stub title="Register" cmd="auth register" />} />
          <Route path="admin" element={<Stub title="Admin" cmd="sudo admin-panel" />} />
          <Route path="*" element={<Stub title="404" cmd="cat missing-page.md" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
