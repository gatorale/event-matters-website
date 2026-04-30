"use client";

import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ background: "#2D1B4E" }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <LogoMark />
          <span
            className="font-semibold leading-none tracking-tight"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "#FAF9F7",
              fontSize: "1.7rem",
            }}
          >
            Event{" "}
            <span style={{ color: "#00D4AA" }}>Matters</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/#calculator">Tools</NavLink>
          <NavLink href="/about">About</NavLink>
          <Link
            href="https://blog.eventmatters.co"
            className="rounded-sm px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              background: "#00D4AA",
              color: "#2D1B4E",
              fontFamily: "var(--font-inter)",
            }}
          >
            Subscribe
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          style={{ color: "#FAF9F7" }}
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-5 flex flex-col gap-4"
          style={{ background: "#2D1B4E" }}
        >
          <MobileNavLink href="/blog" onClick={() => setMenuOpen(false)}>
            Blog
          </MobileNavLink>
          <MobileNavLink href="/#calculator" onClick={() => setMenuOpen(false)}>
            Tools
          </MobileNavLink>
          <MobileNavLink href="/about" onClick={() => setMenuOpen(false)}>
            About
          </MobileNavLink>
          <Link
            href="https://blog.eventmatters.co"
            onClick={() => setMenuOpen(false)}
            className="self-start rounded-sm px-4 py-2 text-sm font-medium mt-1"
            style={{ background: "#00D4AA", color: "#2D1B4E" }}
          >
            Subscribe
          </Link>
        </div>
      )}
    </header>
  );
}

function NavLink({
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
      style={{ color: "#FAF9F7", fontFamily: "var(--font-inter)" }}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-base font-medium"
      style={{ color: "#FAF9F7", fontFamily: "var(--font-inter)" }}
    >
      {children}
    </Link>
  );
}

/* 3×3 grid logo mark — 8 plum dots + 1 teal centre dot */
function LogoMark() {
  const dots = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div
      className="flex items-center justify-center rounded-md"
      style={{ width: 36, height: 36, background: "#2D1B4E", border: "1px solid rgba(255,255,255,0.15)" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 4,
          padding: 6,
        }}
      >
        {dots.map((i) => (
          <div
            key={i}
            style={{
              width: i === 4 ? 7 : 5,
              height: i === 4 ? 7 : 5,
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

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect y="4" width="22" height="2" rx="1" fill="currentColor" />
      <rect y="10" width="22" height="2" rx="1" fill="currentColor" />
      <rect y="16" width="22" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <line x1="2" y1="2" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="2" x2="2" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
