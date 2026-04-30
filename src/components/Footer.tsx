import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#2C2C2A" }}>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="flex items-center gap-3">
              <FooterLogoMark />
              <span
                className="text-lg font-semibold leading-none"
                style={{ fontFamily: "var(--font-outfit)", color: "#FAF9F7" }}
              >
                Event{" "}
                <span style={{ color: "#00D4AA" }}>Matters</span>
              </span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(250,249,247,0.55)", fontFamily: "var(--font-inter)" }}
            >
              Built for the other 362 days.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            <FooterLink href="https://eventmatters.substack.com">Blog</FooterLink>
            <FooterLink href="/#calculator">Tools</FooterLink>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="mailto:info@eventmatters.co">Contact</FooterLink>
          </nav>
        </div>

        <div
          className="mt-10 border-t pt-6 text-xs"
          style={{
            borderColor: "rgba(250,249,247,0.12)",
            color: "rgba(250,249,247,0.35)",
            fontFamily: "var(--font-inter)",
          }}
        >
          © {new Date().getFullYear()} Event Matters · eventmatters.co
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium transition-colors hover:text-[#00D4AA]"
      style={{ color: "rgba(250,249,247,0.7)", fontFamily: "var(--font-inter)" }}
    >
      {children}
    </Link>
  );
}

function FooterLogoMark() {
  const dots = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div
      className="flex items-center justify-center rounded-md shrink-0"
      style={{ width: 32, height: 32, background: "#2D1B4E" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 3,
          padding: 5,
        }}
      >
        {dots.map((i) => (
          <div
            key={i}
            style={{
              width: i === 4 ? 6 : 4,
              height: i === 4 ? 6 : 4,
              borderRadius: "50%",
              background: i === 4 ? "#00D4AA" : "rgba(250,249,247,0.22)",
              margin: i === 4 ? "-1px" : 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
