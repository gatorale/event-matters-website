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
  { value: "18+", label: "years of community & events" },
  { value: "26",  label: "large-scale tech conferences" },
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
          className="font-bold leading-tight"
          style={{ color: C.ivory, fontFamily: "var(--font-outfit)", fontSize: "clamp(4rem, 10vw, 7rem)" }}
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
                background: C.tealTint,
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
          <div className="flex flex-col gap-6" style={{ maxWidth: 280, margin: "0 auto", width: "100%" }}>
            {/* Headshot */}
            <div>
              <div
                className="overflow-hidden rounded-lg"
                style={{ width: "100%", height: 340 }}
              >
                <Image
                  src="/headshot.png"
                  alt="Marcella McKeown"
                  width={600}
                  height={750}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center 15%" }}
                  priority
                />
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
          </div>
        </div>
      </div>
    </section>
  );
}

