export default function Home() {
  return (
    <main
      style={{
        padding: "var(--spacing-xl)",
      }}
    >
      <h1
        style={{
          color: "var(--color-primary)",
          fontSize: "var(--font-size-2xl)",
        }}
      >
        InvoLead Design System
      </h1>

      <p
        style={{
          color: "var(--color-text-secondary)",
        }}
      >
        Reusable components and design tokens.
      </p>
    </main>
  );
}