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
      <div
        className="mx-auto grid gap-16 lg:gap-20"
        style={{
          maxWidth: 1400,
          gridTemplateColumns: "1fr",
        }}
      >
        <div
          className="grid gap-16"
          style={{
            gridTemplateColumns: "1fr",
          }}
        >
          {/* Two-column on large screens */}
          <div
            className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16 lg:gap-20"
          >
            {/* Left — copy */}
            <div className="flex flex-col gap-8">
              <p
                className="text-xl leading-relaxed font-medium"
                style={{
                  color: C.plum,
                  fontFamily: "var(--font-outfit)",
                  fontSize: "1.2rem",
                }}
              >
                I&apos;m Marcella McKeown, founder of Event Matters. I&apos;ve
                spent over 18 years designing conferences and learning experiences
                that bring people together to connect, share, and learn — while
                delivering real value for the organizations that invest in them.
              </p>

              {/* Pull quote */}
              <blockquote
                style={{
                  borderLeft: `3px solid ${C.teal}`,
                  paddingLeft: "1.25rem",
                  background: "#ffffff",
                  padding: "1.25rem 1.5rem",
                  borderLeftWidth: 3,
                  borderLeftStyle: "solid",
                  borderLeftColor: C.teal,
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
                Drawn to creative ideas and the stories uncovered by data, I find
                real joy in blending the two to create event strategies and content
                programs that feel vibrant and effortless on the surface yet
                designed with care underneath.
              </p>

              <p
                className="text-lg leading-relaxed"
                style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}
              >
                Based out of southern Alberta, Canada, I consult with event teams
                across North America and Europe.
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
                  {[
                    { stat: "18+ years", label: "in conference events" },
                    { stat: "5,500",     label: "largest event managed — attendees" },
                    { stat: "2",         label: "continents — North America & Europe" },
                  ].map(({ stat, label }) => (
                    <div key={stat} className="flex flex-col gap-0.5">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: C.plum, fontFamily: "var(--font-outfit)" }}
                      >
                        {stat}
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
                style={{
                  background: "#ffffff",
                  border: `1px solid ${C.plum}`,
                }}
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
        {/* Copy */}
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

        {/* Buttons */}
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
