import Link from "next/link";
import Calculator from "@/components/Calculator";
import NewsletterForm from "@/components/NewsletterForm";

/* ─── Colour constants ──────────────────────────────────────────────────────── */
const C = {
  plum:      "#2D1B4E",
  plumDeep:  "#1E1238",
  teal:      "#00D4AA",
  tealDark:  "#005C47",
  tealTint:  "#E8FAF6",
  violet:    "#5C3D8A",
  ivory:     "#FAF9F7",
  charcoal:  "#2C2C2A",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <WhatWeDo />
      <CalculatorBand />
      <CalculatorSection />
      <BlogSection />
      <Newsletter />
    </>
  );
}

/* ─── 1. Hero ─────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      style={{ background: C.plum }}
      className="px-6 py-24 md:py-36 lg:px-10"
    >
      <div className="mx-auto max-w-4xl">
        <h1
          className="text-6xl md:text-7xl font-bold leading-tight mb-8"
          style={{ fontFamily: "var(--font-outfit)", color: C.ivory }}
        >
          Built for the other<br />
          <span style={{ color: C.teal }}>362 days.</span>
        </h1>

        <p
          className="text-xl md:text-2xl font-semibold mb-4"
          style={{ color: C.ivory, fontFamily: "var(--font-outfit)" }}
        >
          The three days matter. So do the other 362.
        </p>

        <p
          className="text-lg max-w-2xl leading-relaxed mb-10"
          style={{ color: "rgba(250,249,247,0.78)", fontFamily: "var(--font-inter)" }}
        >
          Your event ends but your engagement shouldn&apos;t. Event Matters gives
          you the tools, clarity, and strategic thinking to keep people connected
          long after the lights go down.
        </p>

        <Link
          href="/about"
          style={{
            color: C.ivory,
            fontFamily: "var(--font-outfit)",
            fontStyle: "italic",
            borderBottom: `2px solid ${C.teal}`,
            paddingBottom: 2,
            fontSize: "1.1rem",
          }}
        >
          My Story →
        </Link>
      </div>
    </section>
  );
}

/* ─── 2. Stats strip ──────────────────────────────────────────────────────── */
const NUMBER_STATS = [
  { value: "18+", label: "years of community & events" },
  { value: "26",  label: "in-person conferences" },
  { value: "214", label: "full-day workshops" },
  { value: "122", label: "virtual & hybrid events" },
  { value: "35",  label: "training courses" },
  { value: "288", label: "newsletter editions" },
];

function StatsStrip() {
  return (
    <section
      style={{ background: C.plumDeep }}
      className="px-6 py-10 lg:px-10"
    >
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {/* Name credit — first cell, no big number */}
        <div className="flex flex-col gap-1">
          <span
            className="text-4xl font-bold"
            style={{ color: C.ivory, fontFamily: "var(--font-outfit)" }}
          >
            Marcella McKeown
          </span>
          <span
            className="text-sm leading-snug"
            style={{ color: "rgba(250,249,247,0.65)", fontFamily: "var(--font-inter)" }}
          >
            Event Matters, Founder
          </span>
        </div>

        {/* Number stats */}
        {NUMBER_STATS.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <span
              className="text-4xl font-bold"
              style={{ color: C.teal, fontFamily: "var(--font-outfit)" }}
            >
              {s.value}
            </span>
            <span
              className="text-sm leading-snug"
              style={{ color: "rgba(250,249,247,0.65)", fontFamily: "var(--font-inter)" }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── 3. What I do ───────────────────────────────────────────────────────── */
function WhatWeDo() {
  return (
    <section
      style={{ background: "#ffffff" }}
      className="px-6 py-20 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: C.teal, fontFamily: "var(--font-inter)" }}
        >
          What I do
        </p>
        <h2
          className="text-4xl font-bold mb-12"
          style={{ color: C.plum, fontFamily: "var(--font-outfit)" }}
        >
          Practical thoughts, tools, and resources.
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            eyebrow="Content & resources"
            title="CONTENT & IDEAS"
            body="Practical articles, frameworks, and perspectives on event strategy, speaker programmes, audience engagement, and the year-round work that makes events worth attending."
            cta="Read the blog →"
            href="https://blog.eventmatters.co"
          />
          <Card
            eyebrow="Free tools"
            title="Ticket Calculator"
            body="The ticket pricing engine. Enter your net profit target, expenses, sponsorship income and commission rate, and registration purchase split to get the lowest viable ticket price, for each pricing tier, instantly."
            cta="Use the calculator →"
            href="#calculator"
          />
          <Card
            eyebrow="Free tools"
            title="FREE RESOURCES"
            body="Everyday Templates. Short, structured input forms for timelines, workbacks, budgets, and comms calendars. Each one helps you start quickly and export cleanly to PDF, Excel, or Google Sheets."
            cta="Explore Templates →"
            href="#"
          />
        </div>
      </div>
    </section>
  );
}

function Card({
  eyebrow,
  title,
  body,
  cta,
  href,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <div
      className="flex flex-col p-8 rounded-lg border"
      style={{ borderColor: "rgba(45,27,78,0.12)", background: C.ivory }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: C.teal, fontFamily: "var(--font-inter)" }}
      >
        {eyebrow}
      </p>
      <h3
        className="text-xl font-semibold mb-3 leading-snug"
        style={{ color: C.plum, fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h3>
      <p
        className="text-base leading-relaxed flex-1 mb-6"
        style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}
      >
        {body}
      </p>
      <Link
        href={href}
        className="self-start text-sm font-medium"
        style={{ color: C.teal, fontFamily: "var(--font-inter)", borderBottom: `1px solid ${C.teal}`, paddingBottom: 1 }}
      >
        {cta}
      </Link>
    </div>
  );
}

/* ─── 4. Calculator band ─────────────────────────────────────────────────── */
function CalculatorBand() {
  return (
    <section
      id="calculator"
      style={{ background: C.plum }}
      className="px-6 py-16 lg:px-10"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: C.teal, fontFamily: "var(--font-inter)" }}
        >
          Free tool
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold leading-tight mb-6"
          style={{ color: C.ivory, fontFamily: "var(--font-outfit)" }}
        >
          What should you charge for conference{" "}
          <em style={{ color: C.teal, fontStyle: "italic" }}>tickets?</em>
        </h2>
        <p
          className="text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ color: "rgba(250,249,247,0.78)", fontFamily: "var(--font-inter)" }}
        >
          The only calculator built specifically for conference ticket pricing.
          Enter your net profit target, expenses, sponsorship income and commission
          rate, attendee numbers, and registration purchase split to get the lowest
          viable ticket price for each tier.
        </p>
      </div>
    </section>
  );
}

/* ─── 5. Calculator ──────────────────────────────────────────────────────── */
function CalculatorSection() {
  return <Calculator />;
}

/* ─── 6. Blog section ────────────────────────────────────────────────────── */
const BLOG_POSTS = [
  {
    tag:     "Strategy",
    title:   "Why your post-event engagement drops — and how to fix it",
    excerpt: "Most event teams measure success on the day. Here's what to measure during the other 362.",
    href:    "https://blog.eventmatters.co",
  },
  {
    tag:     "CFP",
    title:   "The CFP review process most committees get wrong",
    excerpt: "Blind review, scoring rubrics, and the one conversation that changes everything.",
    href:    "https://blog.eventmatters.co",
  },
  {
    tag:     "Sponsorship",
    title:   "Keeping sponsors warm between events",
    excerpt: "Relationships cool when there's nothing to send. Here's a content cadence that changes that.",
    href:    "https://blog.eventmatters.co",
  },
];

function BlogSection() {
  return (
    <section
      style={{ background: C.ivory }}
      className="px-6 py-20 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: C.teal, fontFamily: "var(--font-inter)" }}
            >
              From the blog
            </p>
            <h2
              className="text-4xl font-bold"
              style={{ color: C.plum, fontFamily: "var(--font-outfit)" }}
            >
              Recent posts.
            </h2>
          </div>
          <Link
            href="https://blog.eventmatters.co"
            className="hidden md:block text-sm font-medium"
            style={{ color: C.teal, fontFamily: "var(--font-inter)", borderBottom: `1px solid ${C.teal}`, paddingBottom: 1 }}
          >
            All posts →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="flex flex-col p-6 rounded-lg group"
              style={{ background: "#ffffff", border: "1px solid rgba(45,27,78,0.1)" }}
            >
              <span
                className="self-start text-xs font-semibold px-2 py-1 rounded-sm mb-4"
                style={{ background: C.tealTint, color: C.tealDark, fontFamily: "var(--font-inter)" }}
              >
                {post.tag}
              </span>
              <h3
                className="text-lg font-semibold leading-snug mb-3 group-hover:underline"
                style={{ color: C.plum, fontFamily: "var(--font-outfit)" }}
              >
                {post.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}
              >
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link
            href="https://blog.eventmatters.co"
            className="text-sm font-medium"
            style={{ color: C.teal, fontFamily: "var(--font-inter)" }}
          >
            All posts →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── 7. Newsletter ──────────────────────────────────────────────────────── */
function Newsletter() {
  return (
    <section
      style={{ background: C.tealTint }}
      className="px-6 py-16 lg:px-10"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: C.tealDark, fontFamily: "var(--font-inter)" }}
        >
          Weekly posts
        </p>
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: C.plum, fontFamily: "var(--font-outfit)" }}
        >
          Practical thinking for event professionals.
        </h2>
        <p
          className="text-base leading-relaxed mb-8"
          style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}
        >
          Real-world ideas and insights on conference design and year-round engagement.
        </p>
        <NewsletterForm />
      </div>
    </section>
  );
}
