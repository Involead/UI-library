import { CopyCommand } from "./CopyCommand";
import { TransitionLink } from "./TransitionLink";
import "./landing.css";
import Image from "next/image";
import packageJson from "../../package.json";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const REPOSITORY_URL = "https://github.com/Involead/UI-library";

export default function Home() {
  return (
    <main className="landing">
      <header className="landing-nav">
        <div className="landing-brand">
          <Image
            // next/image doesn't add basePath for unoptimized images, so add it here.
            src={`${base}/involead-logo.jpe`}
            alt=""
            className="landing-logo"
            width={67}
            height={36}
            priority
          />
          <span>InvoLead</span>
        </div>

        <nav className="landing-links" aria-label="Main">
          <TransitionLink href="/explorer/introduction">Docs</TransitionLink>
          <TransitionLink href="/explorer">Components</TransitionLink>
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer" aria-label="InvoLead UI on GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
            </svg>
          </a>
        </nav>
      </header>

      <section className="landing-hero" aria-labelledby="landing-title">
        <TransitionLink href="/explorer" className="landing-badge">
          <span className="landing-badge-tag">v{packageJson.version}</span>
          Accessible components, ready to use
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </TransitionLink>

        <h1 id="landing-title" className="landing-title">
          The Framework for Your <span>Design System</span>
        </h1>

        <p className="landing-subtitle">
          A unified design system of reusable components, patterns, and guidelines. Helping teams
          build consistent, accessible, and scalable experiences faster.
        </p>

        <div className="landing-actions">
          <TransitionLink href="/explorer/introduction" className="landing-btn landing-btn-primary">
            Get Started
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </TransitionLink>
          <TransitionLink href="/explorer" className="landing-btn landing-btn-secondary">
            View Components
          </TransitionLink>
        </div>

        <CopyCommand command="npm install @involead/ui" />
      </section>

      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} InvoLead</span>
        <span aria-hidden="true">·</span>
        <span>React · TypeScript · Accessible by default</span>
      </footer>
    </main>
  );
}
