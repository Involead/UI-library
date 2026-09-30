import { TransitionLink } from './TransitionLink';
import './landing.css';

export default function Home() {
  return (
    <main className="landing">
      <header className="landing-nav">
        <div className="landing-brand">
          <img src="/involead-logo.jpe" alt="" className="landing-logo" />
          <span>InvoLead</span>
        </div>
      </header>

      <section className="landing-hero">
        <TransitionLink href="/explorer" className="landing-badge">
          5 components ready to explore
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

        <h1 className="landing-title">
          The Framework for Your <span>Design System</span>
        </h1>

        <p className="landing-subtitle">
          A unified design system of reusable components, patterns, and guidelines. Helping teams
          build consistent, accessible, and scalable experiences faster.
        </p>

        <div className="landing-actions">
          <TransitionLink href="/explorer/introduction" className="landing-btn landing-btn-primary">
            Get Started
          </TransitionLink>
          <TransitionLink href="/explorer" className="landing-btn landing-btn-secondary">
            View Components
          </TransitionLink>
        </div>
      </section>
    </main>
  );
}
