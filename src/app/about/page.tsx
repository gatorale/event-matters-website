import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Event Matters",
  description:
    "Marcella McKeown — 18+ years designing conferences and learning experiences that bring people together.",
};

const C = {
  plum:     "#2D1B4E",
  teal:     "#00D4AA",
  tealDark: "#005C47",
  tealTint: "#E8FAF6",
  violet:   "#5C3D8A",
  ivory:    "#FAF9F7",
  charcoal: "#2C2C2A",
};

const ABOUT_STATS = [
  { value: "26",  label: "in-person conferences" },
  { value: "214", label: "full-day workshops" },
  { value: "122", label: "virtual & hybrid events" },
  { value: "35",  label: "training courses" },
  { value: "288", label: "newsletter editions" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero />
      <Body />
      <CtaBand />
    </>
  );
}

/* ─── Page hero ─────────────────────────────────────────────────────────── */
function PageHero() {
  return (
    <section
      style={{ background: C.plum }}
      className="px-6 py-20 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: C.teal, fontFamily: "var(--font-inter)" }}
        >
          About
        </p>
        <h1
          className="text-6xl md:text-7xl font-bold leading-tight"
          style={{ color: C.ivory, fontFamily: "var(--font-outfit)" }}
        >
          My Story
        </h1>
      </div>
    </section>
  );
}

/* ─── Body — 2-col grid ─────────────────────────────────────────────────── */
function Body() {
  return (
    <section
      style={{ background: C.ivory }}
      className="px-6 py-16 lg:px-10"
    >
      <div className="mx-auto" style={{ maxWidth: 1400 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16 lg:gap-20">

          {/* Left — copy */}
          <div className="flex flex-col gap-8">
            <p
              className="text-xl leading-relaxed font-medium"
              style={{ color: C.plum, fontFamily: "var(--font-outfit)", fontSize: "1.2rem" }}
            >
              I&apos;m Marcella McKeown, the founder and methodologist behind
              Event Matters.
            </p>

            <p
              className="text-lg leading-relaxed"
              style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}
            >
              I created this space to collect what I&apos;ve learned over eighteen
              years of designing conferences and learning experiences. It&apos;s
              where I can write plainly about my perspective, document my experience
              and ideas, and share the tools and processes that have helped me do
              this work well.
            </p>

            {/* Pull quote */}
            <blockquote
              style={{
                borderLeft: `3px solid ${C.teal}`,
                borderLeftStyle: "solid",
                borderLeftColor: C.teal,
                background: "#ffffff",
                padding: "1.25rem 1.5rem",
              }}
            >
              <p
                className="text-xl italic leading-relaxed"
                style={{ color: C.plum, fontFamily: "var(--font-outfit)", fontSize: "1.35rem" }}
              >
                &ldquo;Vibrant and effortless on the surface, yet designed with
                care underneath.&rdquo;
              </p>
            </blockquote>

            <p
              className="text-lg leading-relaxed"
              style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}
            >
              I love a good challenge — figuring out how things fit together, how
              to solve what isn&apos;t working, and how to align a company&apos;s
              or client&apos;s goals with the experience and content they want to
              create. I&apos;m drawn to creative ideas and the stories uncovered by
              data, and I find real joy in blending the two to create event
              strategies and content programs that feel vibrant and effortless on
              the surface, yet designed with care underneath.
            </p>

            <p
              className="text-lg leading-relaxed"
              style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}
            >
              My goal is simple: to offer practical, real&#8209;world resources for
              event professionals everywhere — and to keep building new ones as I
              learn.
            </p>
          </div>

          {/* Right — sidebar */}
          <div className="flex flex-col gap-6">
            {/* Headshot */}
            <div
              className="w-full overflow-hidden rounded-lg"
              style={{ aspectRatio: "4/5" }}
            >
              <Image
                src="/headshot.png"
                alt="Marcella McKeown"
                width={600}
                height={750}
                className="w-full h-full object-cover object-top"
                priority
              />
            </div>

            {/* Stats card */}
            <div
              className="rounded-lg p-6"
              style={{
                background: "#ffffff",
                border: `1px solid ${C.plum}`,
                borderTop: `3px solid ${C.plum}`,
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ color: C.plum, fontFamily: "var(--font-inter)" }}
              >
                By the numbers
              </p>
              <div className="flex flex-col gap-4">
                {ABOUT_STATS.map(({ value, label }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: C.plum, fontFamily: "var(--font-outfit)" }}
                    >
                      {value}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connect card */}
            <div
              className="rounded-lg p-6"
              style={{ background: "#ffffff", border: `1px solid ${C.plum}` }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: C.plum, fontFamily: "var(--font-inter)" }}
              >
                Connect
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="https://www.linkedin.com/in/marcella-mckeown-5075935/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: C.teal, fontFamily: "var(--font-inter)", borderBottom: `1px solid ${C.teal}`, paddingBottom: 1, alignSelf: "flex-start" }}
                >
                  LinkedIn →
                </Link>
                <Link
                  href="mailto:info@eventmatters.co"
                  className="text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: C.teal, fontFamily: "var(--font-inter)", borderBottom: `1px solid ${C.teal}`, paddingBottom: 1, alignSelf: "flex-start" }}
                >
                  Get in touch →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA band ──────────────────────────────────────────────────────────── */
function CtaBand() {
  return (
    <section
      style={{ background: C.plum }}
      className="px-6 py-16 lg:px-10"
    >
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-4">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: C.teal, fontFamily: "var(--font-inter)" }}
          >
            Work together
          </p>
          <h2
            className="text-3xl font-bold leading-snug"
            style={{ color: C.ivory, fontFamily: "var(--font-outfit)" }}
          >
            Let&apos;s build something worth attending.
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: "rgba(250,249,247,0.75)", fontFamily: "var(--font-inter)" }}
          >
            If you&apos;re looking for a sharper content programme, a better CFP,
            or a clearer strategy for what happens between events — let&apos;s
            talk.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
          <Link
            href="mailto:info@eventmatters.co"
            className="inline-flex items-center justify-center px-7 py-3 rounded-sm text-base font-medium transition-opacity hover:opacity-90"
            style={{ background: C.teal, color: C.plum, fontFamily: "var(--font-inter)" }}
          >
            Work with me →
          </Link>
          <Link
            href="https://blog.eventmatters.co"
            className="inline-flex items-center justify-center px-7 py-3 text-base font-medium"
            style={{
              color: C.ivory,
              fontFamily: "var(--font-inter)",
              borderBottom: `2px solid ${C.teal}`,
              paddingBottom: "0.75rem",
            }}
          >
            Or read the blog first
          </Link>
        </div>
      </div>
    </section>
  );
}
