import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Event Matters",
  description:
    "Practical thinking for event professionals — strategy, CFP, sponsorship, and the year-round work that makes conferences worth attending.",
};

const C = {
  plum:      "#2D1B4E",
  teal:      "#00D4AA",
  tealDark:  "#005C47",
  tealTint:  "#E8FAF6",
  violet:    "#5C3D8A",
  ivory:     "#FAF9F7",
  charcoal:  "#2C2C2A",
};

const POSTS = [
  {
    tag:     "Strategy",
    title:   "Why your post-event engagement drops — and how to fix it",
    excerpt:
      "Most event teams measure success on the day. Here's what to measure during the other 362.",
    href:    "https://eventmatters.substack.com",
  },
  {
    tag:     "CFP",
    title:   "The CFP review process most committees get wrong",
    excerpt:
      "Blind review, scoring rubrics, and the one conversation that changes everything.",
    href:    "https://eventmatters.substack.com",
  },
  {
    tag:     "Sponsorship",
    title:   "Keeping sponsors warm between events",
    excerpt:
      "Relationships cool when there's nothing to send. Here's a content cadence that changes that.",
    href:    "https://eventmatters.substack.com",
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHero />
      <Posts />
    </>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────────────────── */
function PageHero() {
  return (
    <section style={{ background: C.plum }} className="px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: C.teal, fontFamily: "var(--font-inter)" }}
        >
          From the blog
        </p>
        <h1
          className="text-6xl md:text-7xl font-bold leading-tight mb-6"
          style={{ color: C.ivory, fontFamily: "var(--font-outfit)" }}
        >
          Recent posts.
        </h1>
        <p
          className="text-lg max-w-2xl leading-relaxed"
          style={{ color: "rgba(250,249,247,0.75)", fontFamily: "var(--font-inter)" }}
        >
          Practical thinking on event strategy, speaker programmes, audience
          engagement, and the year-round work that makes conferences worth
          attending.
        </p>
      </div>
    </section>
  );
}

/* ─── Post grid ─────────────────────────────────────────────────────────────── */
function Posts() {
  return (
    <section style={{ background: C.ivory }} className="px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {POSTS.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="flex flex-col p-6 rounded-lg group"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(45,27,78,0.1)",
              }}
            >
              <span
                className="self-start text-xs font-semibold px-2 py-1 rounded-sm mb-4"
                style={{
                  background: C.tealTint,
                  color: C.tealDark,
                  fontFamily: "var(--font-inter)",
                }}
              >
                {post.tag}
              </span>
              <h2
                className="text-lg font-semibold leading-snug mb-3 group-hover:underline"
                style={{ color: C.plum, fontFamily: "var(--font-outfit)" }}
              >
                {post.title}
              </h2>
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}
              >
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="https://eventmatters.substack.com"
            className="inline-block text-sm font-medium"
            style={{
              color: C.teal,
              fontFamily: "var(--font-inter)",
              borderBottom: `1px solid ${C.teal}`,
              paddingBottom: 2,
            }}
          >
            View all posts →
          </Link>
        </div>
      </div>
    </section>
  );
}
