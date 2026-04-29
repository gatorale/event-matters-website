export default function Home() {
  return (
    <section
      className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6"
      style={{ background: "#2D1B4E" }}
    >
      <p
        className="text-sm font-medium uppercase tracking-widest mb-4"
        style={{ color: "#00D4AA", fontFamily: "var(--font-inter)" }}
      >
        Coming soon
      </p>
      <h1
        className="text-5xl md:text-7xl font-bold leading-tight mb-6"
        style={{ color: "#FAF9F7", fontFamily: "var(--font-outfit)" }}
      >
        Built for the other{" "}
        <em className="not-italic" style={{ color: "#00D4AA" }}>
          362 days.
        </em>
      </h1>
      <p
        className="text-lg max-w-xl leading-relaxed"
        style={{ color: "rgba(250,249,247,0.75)", fontFamily: "var(--font-inter)" }}
      >
        Practical tools, direct content, and the thinking behind great
        conferences — for event professionals who care about what happens between
        events.
      </p>
    </section>
  );
}
