import type { Metadata } from "next";
import Script from "next/script";
import Calculator from "@/components/Calculator";
import "./workback.css";

export const metadata: Metadata = {
  title: "Free tools for event professionals | Event Matters",
  description:
    "Practical calculators built from real conference programmes. Free to use, free to share. Built for event professionals who plan in years, not weeks.",
};

const C = {
  plum:     "#2D1B4E",
  teal:     "#00D4AA",
  tealDark: "#005C47",
  tealTint: "#E8FAF6",
  ivory:    "#FAF9F7",
  charcoal: "#2C2C2A",
};

const WORKBACK_HTML = "\n<section class=\"hero page-wrap\">\n  <div class=\"hero-eyebrow\">Free Tool</div>\n  <h1>Build a year-long event workback in two minutes.</h1>\n  <p>Enter your event date, your weekly comms cadence, and the phases you own. We'll generate a complete workback schedule \u2014 start dates, end dates, and weeks-out countdowns for every milestone, calculated on business days.</p>\n  <p>Built from a methodology developed across 18+ years of conference programming and 26 large-scale events.</p>\n</section>\n\n<section class=\"form-section page-wrap\">\n  <div class=\"form-card\">\n    \n    <!-- Block 1: Your event -->\n    <div class=\"section-block\">\n      <h2>Your event</h2>\n      <p class=\"section-sub\">All dates calculated as business days, Mon&ndash;Fri. For most events, plan on roughly 18 months of runway for full standard timelines. Tighter runways are possible &mdash; pick a runway mode below, and the calculator will flag where things get tight.</p>\n      \n      <div class=\"input-grid\">\n        <div class=\"input-row cols-1\">\n          <div class=\"field\">\n            <label for=\"eventName\">Event name</label>\n            <input type=\"text\" id=\"eventName\" placeholder=\"e.g. Annual Summit 2027\" value=\"My Event 2027\">\n          </div>\n        </div>\n        <div class=\"input-row cols-2\">\n          <div class=\"field\">\n            <label for=\"eventStart\">Event start date</label>\n            <input type=\"date\" id=\"eventStart\">\n          </div>\n          <div class=\"field\">\n            <label for=\"eventEnd\">Event end date</label>\n            <input type=\"date\" id=\"eventEnd\">\n          </div>\n        </div>\n        <div class=\"input-row cols-2\">\n          <div class=\"field\">\n            <label for=\"marketingDay\">Marketing comms day</label>\n            <select id=\"marketingDay\">\n              <option value=\"1\">Monday</option>\n              <option value=\"2\" selected>Tuesday</option>\n              <option value=\"3\">Wednesday</option>\n              <option value=\"4\">Thursday</option>\n              <option value=\"5\">Friday</option>\n            </select>\n            <div class=\"field-help\">The weekday your event news/announcements go out.</div>\n          </div>\n          <div class=\"field\">\n            <label for=\"speakerDay\">Speaker comms day</label>\n            <select id=\"speakerDay\">\n              <option value=\"1\">Monday</option>\n              <option value=\"2\">Tuesday</option>\n              <option value=\"3\">Wednesday</option>\n              <option value=\"4\" selected>Thursday</option>\n              <option value=\"5\">Friday</option>\n            </select>\n            <div class=\"field-help\">The weekday speaker comms go out.</div>\n          </div>\n        </div>\n        <div class=\"input-row cols-1\">\n          <div class=\"field\">\n            <label for=\"runwayMode\">Timeline runway</label>\n            <select id=\"runwayMode\">\n              <option value=\"ideal\" selected>Standard &mdash; use ideal durations (full timeline)</option>\n              <option value=\"min\">Sprint &mdash; use minimum viable durations (compressed)</option>\n            </select>\n            <div class=\"field-help\">Standard uses recommended durations. Sprint uses the minimum viable durations &mdash; review every milestone for real-world feasibility before committing. After generating, you can edit any duration directly in the results table.</div>\n          </div>\n        </div>\n        <div class=\"input-row cols-1\">\n          <div class=\"field\">\n            <label>Holiday calendars to exclude</label>\n            <div class=\"holiday-grid\" id=\"holidayGrid\">\n              <!-- populated by JS -->\n            </div>\n            <div class=\"field-help\">Select all calendars relevant to your event. Holidays in selected regions will be excluded from working-day calculations.</div>\n          </div>\n        </div>\n      </div>\n    </div>\n    \n    <!-- Block 2: Phases & milestones -->\n    <div class=\"section-block\">\n      <h2>Phases &amp; milestones to include</h2>\n      <p class=\"section-sub\">Toggle off any phase you don't own. For finer control, use the milestone-level toggles below to include or exclude specific items.</p>\n      \n      <div class=\"phase-bulk-actions\">\n        <button type=\"button\" class=\"link-button\" id=\"phasesAllBtn\">Select all phases</button>\n        <span class=\"bulk-divider\">&middot;</span>\n        <button type=\"button\" class=\"link-button\" id=\"phasesNoneBtn\">Clear all phases</button>\n      </div>\n      \n      <div class=\"phase-toggles\" id=\"phaseToggles\">\n        <!-- populated by JS -->\n      </div>\n      \n      <div class=\"milestone-list-toggle\">\n        <button type=\"button\" class=\"link-button\" id=\"toggleMilestoneListBtn\">Show individual milestone toggles</button>\n        <div class=\"milestone-list\" id=\"milestoneList\">\n          <!-- populated by JS -->\n        </div>\n      </div>\n    </div>\n    \n    <div class=\"actions-row\">\n      <button class=\"button button-primary\" id=\"generateBtn\">Generate workback</button>\n      <button class=\"button button-ghost\" id=\"exportBtn\" disabled>Export to CSV</button>\n      <button type=\"button\" class=\"link-button reset-link\" id=\"resetBtn\">Reset to defaults</button>\n    </div>\n  </div>\n</section>\n\n<section class=\"results-section page-wrap\" id=\"resultsSection\" style=\"display:none;\">\n  <div class=\"results-warning\" id=\"resultsWarning\" style=\"display:none;\"></div>\n  <div class=\"results-summary\" id=\"resultsSummary\"></div>\n  <div class=\"table-hint\">Click any milestone for description and stakeholders. Use the checkbox to include or exclude it. Edit any duration directly in the table \u2014 end dates recalculate live.</div>\n  <div class=\"table-wrap\">\n    <div class=\"table-scroll\">\n      <table id=\"resultsTable\">\n        <thead>\n          <tr>\n            <th class=\"col-toggle-head\" aria-label=\"Include milestone\"></th>\n            <th>Milestone</th>\n            <th>Owner</th>\n            <th>Start</th>\n            <th>End</th>\n            <th>Duration</th>\n            <th>Weeks Out</th>\n          </tr>\n        </thead>\n        <tbody id=\"resultsBody\"></tbody>\n      </table>\n    </div>\n  </div>\n</section>\n\n<div class=\"modal-backdrop\" id=\"emailModal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"emailModalTitle\">\n  <div class=\"modal\">\n\n    <!-- Input state (shown by default) -->\n    <div id=\"emailModalInput\">\n      <h3 id=\"emailModalTitle\">Get your workback</h3>\n      <p>Enter your email and we'll send the workback as a CSV. We'll also send occasional Event Matters notes &mdash; unsubscribe anytime.</p>\n      <input type=\"email\" id=\"emailInput\" placeholder=\"you@company.com\" autocomplete=\"email\" required>\n      <div class=\"modal-error\" id=\"emailError\"></div>\n      <div class=\"modal-actions\">\n        <button class=\"modal-close\" id=\"modalCloseBtn\">Cancel</button>\n        <button class=\"button button-primary\" id=\"emailSubmitBtn\">Send me the CSV</button>\n      </div>\n    </div>\n\n    <!-- Sending state -->\n    <div id=\"emailModalSending\" style=\"display:none;\">\n      <div class=\"modal-status-body\">\n        <div class=\"modal-spinner\"></div>\n        <p class=\"modal-status-text\" id=\"emailModalSendingText\">Sending your workback&hellip;</p>\n      </div>\n    </div>\n\n    <!-- Sent state -->\n    <div id=\"emailModalSent\" style=\"display:none;\">\n      <div class=\"modal-status-body\">\n        <div class=\"modal-sent-icon\">&#x2713;</div>\n        <h3 style=\"margin:0;\">Sent!</h3>\n        <p class=\"modal-status-text\" id=\"emailModalSentText\">Check your inbox. Allow a couple of minutes for delivery.</p>\n        <div class=\"modal-actions\" style=\"justify-content:center;\">\n          <button class=\"button button-primary\" id=\"emailDoneBtn\">Done</button>\n        </div>\n      </div>\n    </div>\n\n    <!-- Error state -->\n    <div id=\"emailModalError\" style=\"display:none;\">\n      <div class=\"modal-status-body\">\n        <p class=\"modal-error-text\" id=\"emailModalErrorText\">Something went wrong. Please try again.</p>\n        <div class=\"modal-actions\">\n          <button class=\"modal-close\" id=\"emailModalErrorCloseBtn\">Cancel</button>\n          <button class=\"button button-primary\" id=\"emailRetryBtn\">Try again</button>\n        </div>\n      </div>\n    </div>\n\n  </div>\n</div>\n\n<div class=\"modal-backdrop\" id=\"resetModal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"resetModalTitle\">\n  <div class=\"modal\">\n    <h3 id=\"resetModalTitle\">Reset to defaults?</h3>\n    <p>This will clear your current schedule, milestone selections, custom durations, and any acknowledgments. The form will return to its starting state.</p>\n    <div class=\"modal-actions\">\n      <button class=\"modal-close\" id=\"resetCancelBtn\">Cancel</button>\n      <button class=\"button button-primary\" id=\"resetConfirmBtn\">Reset everything</button>\n    </div>\n  </div>\n</div>\n";

const TOOLS = [
  {
    id: "ticket-calculator",
    eyebrow: "Free tool",
    title: "Ticket Calculator",
    body: "The ticket pricing engine. Enter your net profit target, expenses, sponsorship income, and registration purchase split to get the lowest viable ticket price for each pricing tier, instantly.",
    cta: "Use this tool ↓",
  },
  {
    id: "workback",
    eyebrow: "Free tool",
    title: "Workback Schedule Generator",
    body: "Build a complete year-long event workback from your event date. 60+ milestones across seven phases, business-day aware, with holiday calendars for 10+ regions. Choose Standard or Sprint runway and export to CSV.",
    cta: "Use this tool ↓",
  },
];

export default function ToolsPage() {
  return (
    <>
      <ToolsHero />
      <ToolsGrid />

      {/* =================================================================
          TOOL: Ticket Calculator
          Future migration: cut this section to /tools/ticket-calculator
          ================================================================= */}
      <section id="ticket-calculator" style={{ scrollMarginTop: "80px" }}>
        <TicketCalculatorBand />
        <Calculator />
      </section>
      {/* END: Ticket Calculator ========================================== */}

      {/* =================================================================
          TOOL: Workback Schedule Generator
          Future migration: cut this section to /tools/workback
          ================================================================= */}
      <section id="workback" style={{ scrollMarginTop: "80px" }}>
        <div dangerouslySetInnerHTML={{ __html: WORKBACK_HTML }} />
      </section>
      {/* END: Workback Schedule Generator ================================= */}

      <Script src="/tools/workback.js" strategy="afterInteractive" />
    </>
  );
}

/* ─── Page hero ──────────────────────────────────────────────────────────────────────────────── */
function ToolsHero() {
  return (
    <section style={{ background: C.plum }} className="px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: C.teal, fontFamily: "var(--font-inter)" }}
        >
          Free tools
        </p>
        <h1
          className="text-5xl md:text-6xl font-bold leading-tight mb-6"
          style={{ color: C.ivory, fontFamily: "var(--font-outfit)" }}
        >
          Free tools for event professionals.
        </h1>
        <p
          className="text-lg max-w-2xl leading-relaxed"
          style={{ color: "rgba(250,249,247,0.78)", fontFamily: "var(--font-inter)" }}
        >
          Practical calculators built from real conference programmes. Free to
          use, free to share. Built for event professionals who plan in years,
          not weeks.
        </p>
      </div>
    </section>
  );
}

/* ─── Tool cards grid ──────────────────────────────────────────────────────────────────── */
function ToolsGrid() {
  return (
    <section style={{ background: "#ffffff" }} className="px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-6">
          {TOOLS.map((t) => (
            <ToolCard key={t.id} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolCard({
  id,
  eyebrow,
  title,
  body,
  cta,
}: {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
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
      <h2
        className="text-xl font-semibold mb-3 leading-snug"
        style={{ color: C.plum, fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h2>
      <p
        className="text-base leading-relaxed flex-1 mb-6"
        style={{ color: C.charcoal, fontFamily: "var(--font-inter)" }}
      >
        {body}
      </p>
      <a
        href={`#${id}`}
        className="self-start text-sm font-medium"
        style={{
          color: C.teal,
          fontFamily: "var(--font-inter)",
          borderBottom: `1px solid ${C.teal}`,
          paddingBottom: 1,
        }}
      >
        {cta}
      </a>
    </div>
  );
}

/* ─── Ticket Calculator intro band ──────────────────────────────────────────────────────── */
function TicketCalculatorBand() {
  return (
    <div style={{ background: C.plum }} className="px-6 py-16 lg:px-10">
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
          Enter your net profit target, expenses, sponsorship income and
          commission rate, attendee numbers, and registration purchase split to
          get the lowest viable ticket price for each tier.
        </p>
      </div>
    </div>
  );
}
