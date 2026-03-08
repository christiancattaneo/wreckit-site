import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mutation Testing with AI: How to Actually Prove Your Code Works — Reckit Ralph",
  description:
    "Passing tests don't mean working code. Learn how mutation testing with AI exposes weak test suites, and how wreckit automates it with kill-rate thresholds and a signed proof bundle.",
};

export default function MutationTestingWithAIPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Nav */}
      <nav className="border-b border-violet-200/70 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="font-display text-lg font-bold"
            style={{
              background: "var(--grad-text)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Reckit Ralph
          </Link>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <Link href="/blog" className="transition hover:text-slate-900">
              ← Blog
            </Link>
            <a
              href="https://wreckit-ralph.vercel.app#waitlist"
              className="rounded-full px-4 py-2 text-white text-xs font-semibold shadow-[0_8px_20px_rgba(99,102,241,0.3)] hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)" }}
            >
              Try Wreckit
            </a>
          </div>
        </div>
      </nav>

      {/* Article */}
      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* Meta */}
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[var(--purple)]">
            mutation testing AI
          </span>
          <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[var(--purple)]">
            code verification
          </span>
        </div>
        <div className="mb-2 text-xs text-slate-400">2026-03-08 · 7 min read</div>

        <h1 className="font-display text-4xl font-bold leading-tight text-[var(--text)] sm:text-5xl">
          Mutation Testing with AI:{" "}
          <span className="block text-3xl sm:text-4xl font-semibold text-slate-500 mt-2">
            How to Actually Prove Your Code Works
          </span>
        </h1>

        <div className="prose-section mt-12 space-y-6 text-slate-700 leading-relaxed">

          <p className="text-lg">
            Your tests pass. Coverage is at 94%. CI is green. You&apos;re confident the code works.
          </p>
          <p>
            But here&apos;s the question nobody asks until it&apos;s too late: <em>do those tests actually catch
            bugs?</em> Not &ldquo;do they run&rdquo; — they clearly run. Do they <em>fail</em> when the code
            is wrong?
          </p>
          <p>
            That&apos;s a very different question. And it&apos;s the one mutation testing was built to answer.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            Section 1: What Mutation Testing Is (And Isn&apos;t)
          </h2>

          <p>
            Mutation testing is a technique for measuring how effective your tests really are. The idea
            is deceptively simple: take your code, introduce a small, deliberate bug (a{" "}
            <em>mutation</em>), run the test suite, and see if anything breaks.
          </p>
          <p>
            If the tests catch the mutation — meaning at least one test fails — that mutation is{" "}
            <strong className="text-[var(--text)]">killed</strong>. Good. Your tests are protective.
          </p>
          <p>
            If the tests all still pass despite the mutation — that mutation{" "}
            <strong className="text-[var(--text)]">survived</strong>. That&apos;s a problem. It means your
            tests would not catch that entire class of bug in production.
          </p>
          <p>
            The ratio of killed mutations to total mutations is called the{" "}
            <strong className="text-[var(--text)]">mutation kill rate</strong>. It&apos;s the most honest
            measure of test suite quality that exists.
          </p>

          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Common mutation operators
            </p>
            <div className="space-y-2">
              {[
                { from: "price > 0", to: "price >= 0", label: "Boundary flip" },
                { from: "user && user.active", to: "user || user.active", label: "Logical operator swap" },
                { from: "return result", to: "return null", label: "Return value removal" },
                { from: "i++", to: "i--", label: "Increment mutation" },
                { from: "if (isValid)", to: "if (!isValid)", label: "Condition negation" },
              ].map((op) => (
                <div key={op.label} className="flex items-center gap-3 text-sm">
                  <code className="rounded bg-red-50 border border-red-100 px-2 py-0.5 font-mono text-red-600 text-xs">{op.from}</code>
                  <span className="text-slate-400">→</span>
                  <code className="rounded bg-green-50 border border-green-100 px-2 py-0.5 font-mono text-green-700 text-xs">{op.to}</code>
                  <span className="text-slate-400 text-xs">({op.label})</span>
                </div>
              ))}
            </div>
          </div>

          <p>
            Each of these mutations represents a real class of bug. If your tests can&apos;t distinguish the
            original code from any of these variants, they&apos;re not testing the logic — they&apos;re just
            confirming the code compiles.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            Section 2: A Concrete Example — The Bug the Tests Missed
          </h2>

          <p>
            Let&apos;s make this concrete. Here&apos;s a function that applies a discount to an order:
          </p>

          <div className="rounded-xl bg-slate-900 p-6 overflow-x-auto">
            <pre className="text-sm font-mono text-slate-100 leading-relaxed">{`function applyDiscount(price: number, code: string): number {
  if (price > 100 && code === "SAVE20") {
    return price * 0.8;
  }
  return price;
}`}</pre>
          </div>

          <p>
            And here are the tests. They look reasonable. They pass.
          </p>

          <div className="rounded-xl bg-slate-900 p-6 overflow-x-auto">
            <pre className="text-sm font-mono text-slate-100 leading-relaxed">{`test("applies discount for qualifying order", () => {
  expect(applyDiscount(200, "SAVE20")).toBe(160);
});

test("no discount without code", () => {
  expect(applyDiscount(200, "")).toBe(200);
});

test("no discount for small order", () => {
  expect(applyDiscount(50, "SAVE20")).toBe(50);
});`}</pre>
          </div>

          <p>
            Coverage: 100%. All branches hit. CI is green.
          </p>
          <p>
            Now mutation testing introduces this change:
          </p>

          <div className="rounded-xl bg-slate-900 p-6 overflow-x-auto">
            <pre className="text-sm font-mono text-slate-100 leading-relaxed">{`// Mutation: > changed to >=
if (price >= 100 && code === "SAVE20") {`}</pre>
          </div>

          <p>
            Run the test suite against the mutated code. What happens?
          </p>
          <p>
            <strong className="text-[var(--text)]">All tests still pass.</strong> The mutation survived.
          </p>
          <p>
            Nobody wrote a test for{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-[var(--purple)]">applyDiscount(100, &quot;SAVE20&quot;)</code>.
            In production, an order for exactly $100 with a valid discount code gets the discount
            applied — when the business rule says it shouldn&apos;t. That&apos;s a real revenue leak, and 100%
            test coverage didn&apos;t catch it.
          </p>

          <div className="rounded-xl bg-[#faf5ff] border border-violet-100 p-5">
            <p className="font-semibold text-[var(--purple)] mb-1">The lesson</p>
            <p className="text-sm text-slate-600">
              Coverage tells you which lines ran. Mutation testing tells you whether the tests would
              notice if those lines were wrong. You need both — but coverage without mutation kill rate
              is a false confidence metric.
            </p>
          </div>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            Section 3: Why Regular Tests Miss These Bugs — Especially with AI Code
          </h2>

          <p>
            This problem exists in all codebases, but it&apos;s dramatically worse when AI writes the code.
            Here&apos;s why.
          </p>
          <p>
            When a model like Copilot or Claude generates a function, it also generates the tests.
            Those tests are coherent — they&apos;re written by the same model that understands the same
            intent — but they tend to test the <em>happy path</em> and the <em>obvious edge cases</em>.
            The model doesn&apos;t think adversarially. It thinks completionistically.
          </p>
          <p>The resulting test suite has a specific failure mode:</p>

          <div className="space-y-4">
            {[
              {
                label: "Tests confirm intent, not correctness",
                desc: "The AI wrote tests that verify what the code is supposed to do, not tests that would catch the 50 ways it could be subtly wrong. The tests and the code share the same blind spots.",
              },
              {
                label: "Boundary conditions get skipped",
                desc: "Models gravitate toward representative examples. Off-by-one conditions, exact boundary values, and the transition points between behaviors are systematically underrepresented.",
              },
              {
                label: "Operators look similar",
                desc: "A model that writes price > 0 is also likely to write tests where price is clearly above zero. Nobody thinks to check price === 0 unless they're specifically thinking about boundaries.",
              },
              {
                label: "The bias is invisible",
                desc: "Because the tests pass and look complete, there's no signal that something is missing. The problem only surfaces when a user hits the edge case in production.",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-[#faf5ff] border border-violet-100 p-5">
                <p className="font-semibold text-[var(--purple)] mb-1">{item.label}</p>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <p>
            Mutation testing is adversarial by design. It doesn&apos;t care what the model intended. It
            systematically introduces every plausible bug and checks whether the tests notice. That
            adversarial stance is exactly what AI-generated code needs.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            Section 4: How AI Mutation Testing Works
          </h2>

          <p>
            Traditional mutation testing tools — Stryker, PIT, mutmut — have been around for years.
            They work well, but they have real limitations: they&apos;re slow, they require framework-specific
            configuration, and they generate mutations mechanically without understanding the code&apos;s
            semantics.
          </p>
          <p>
            AI-powered mutation testing improves on this in a few meaningful ways.
          </p>

          {[
            {
              num: "01",
              title: "Semantic mutation generation",
              body: (
                <>
                  Instead of blindly flipping every operator, an AI-aware mutation engine understands
                  what the code is trying to do and generates mutations that are more likely to represent
                  real bugs. It targets the logic that matters, not every syntactic variation.
                </>
              ),
            },
            {
              num: "02",
              title: "Test gap identification",
              body: (
                <>
                  When a mutation survives, an AI engine can analyze <em>why</em> — what input would have
                  caught it, what assertion was missing, and whether it&apos;s worth adding a test or the
                  mutation represents a non-critical path. It surfaces actionable findings, not just a
                  kill-rate number.
                </>
              ),
            },
            {
              num: "03",
              title: "Parallel execution at scale",
              body: (
                <>
                  A typical codebase generates hundreds or thousands of mutations. Running them
                  sequentially would take hours. AI-powered tooling runs mutations in parallel, with smart
                  scheduling to prioritize the mutations most likely to reveal real weaknesses.
                </>
              ),
            },
            {
              num: "04",
              title: "Integration with the full verification pipeline",
              body: (
                <>
                  Mutation testing in isolation tells you your test suite is weak. Mutation testing as
                  part of a full pipeline — combined with slop scanning, type checking, and
                  cross-verification — tells you whether the code is actually shippable.
                  <br /><br />
                  That&apos;s what{" "}
                  <a
                    href="https://wreckit-ralph.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--purple)] font-semibold underline underline-offset-2 hover:opacity-80 transition"
                  >
                    wreckit
                  </a>{" "}
                  does: mutation testing is one of 11 verification gates, run in parallel, with results
                  aggregated into a single verdict.
                </>
              ),
            },
          ].map((layer) => (
            <div
              key={layer.num}
              className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)" }}
                >
                  {layer.num}
                </span>
                <h3 className="text-lg font-semibold text-[var(--text)]">{layer.title}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{layer.body}</p>
            </div>
          ))}

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            Section 5: Wreckit&apos;s Mutation Thresholds — SHIP, CAUTION, BLOCKED
          </h2>

          <p>
            A kill rate is only useful if you have a standard to compare it against. Wreckit uses
            three thresholds, calibrated to what actually predicts production reliability:
          </p>

          <div className="space-y-4">
            {[
              {
                verdict: "SHIP",
                rate: "≥ 95% kill rate",
                color: "bg-green-50 border-green-200",
                labelColor: "text-green-700",
                badgeColor: "bg-green-100 text-green-800",
                desc: "Your test suite is genuinely protective. Mutations are being caught across boundaries, logic branches, and operators. This is the bar for production-quality code.",
              },
              {
                verdict: "CAUTION",
                rate: "90–94% kill rate",
                color: "bg-amber-50 border-amber-200",
                labelColor: "text-amber-700",
                badgeColor: "bg-amber-100 text-amber-800",
                desc: "Most mutations are caught, but there are gaps. The code may be shippable depending on risk tolerance, but the surviving mutations should be reviewed. CAUTION means go slow, not stop.",
              },
              {
                verdict: "BLOCKED",
                rate: "< 90% kill rate",
                color: "bg-red-50 border-red-200",
                labelColor: "text-red-700",
                badgeColor: "bg-red-100 text-red-800",
                desc: "Too many mutations survived. The test suite has structural gaps — entire classes of bugs that would go undetected. Wreckit blocks the merge and surfaces which mutations survived so you can fix the tests.",
              },
            ].map((item) => (
              <div
                key={item.verdict}
                className={`rounded-xl border p-5 ${item.color}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${item.badgeColor}`}>
                    {item.verdict}
                  </span>
                  <span className={`text-sm font-semibold ${item.labelColor}`}>{item.rate}</span>
                </div>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <p>
            These thresholds aren&apos;t arbitrary. A 95% kill rate means that for every 100 plausible bugs
            mutation testing can inject, your tests catch 95 of them. That leaves 5 uncaught — but those
            5 are increasingly obscure edge cases, not the kind of boundary bugs that cause billing
            errors or auth bypasses.
          </p>
          <p>
            Below 90%, the surviving mutations represent real, likely bugs. You&apos;re not dealing with
            edge cases anymore — you&apos;re dealing with logic that&apos;s systematically untested.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            Section 6: The Proof Bundle — Making the Evidence Permanent
          </h2>

          <p>
            Knowing your kill rate is useful. Having a permanent, auditable record of it is essential.
          </p>
          <p>
            Every wreckit run produces a{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-[var(--purple)]">.wreckit/proof-*.json</code>{" "}
            file — a signed proof bundle that captures everything: the mutation kill rate, which
            mutations survived, which tests caught them, the thresholds applied, and the final verdict.
          </p>
          <p>This matters for a few reasons:</p>

          <ul className="list-none space-y-2 pl-0">
            {[
              "When something breaks in production, you can check what the mutation kill rate was at the time of the merge. If it was 87%, you know exactly why.",
              "Code review becomes faster. Engineers can look at the proof bundle instead of manually evaluating test quality.",
              "Compliance and audit requirements are increasingly expecting evidence that code was verified, not just tested. A proof bundle is that evidence.",
              "Teams that ship with proof bundles build trust in their own velocity — they know the gates caught real problems.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-[#eef2ff] flex items-center justify-center text-[var(--purple)] text-xs font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p>
            The proof bundle is designed to be committed alongside the code it verifies. It&apos;s not a
            CI artifact that disappears after 30 days — it&apos;s a permanent record that lives in the repo.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            Conclusion: Mutation Testing Is the Test for Your Tests
          </h2>

          <p>
            Code coverage is a proxy metric. It tells you the tests ran, not that they work. Mutation
            testing is the real metric — the one that tells you whether your test suite would actually
            catch a bug if the code were wrong.
          </p>
          <p>
            For AI-generated code, this matters more than ever. The same model that wrote the function
            wrote the tests. They share the same blind spots. Mutation testing is adversarial where the
            model was cooperative — and that adversarial stance is exactly what&apos;s missing from most
            AI-coding workflows.
          </p>
          <p>
            The bar is concrete: a ≥ 95% kill rate means{" "}
            <strong className="text-[var(--text)]">SHIP</strong>. 90–94% means{" "}
            <strong className="text-[var(--text)]">CAUTION</strong>. Under 90% means{" "}
            <strong className="text-[var(--text)]">BLOCKED</strong>. Every run produces a signed proof
            bundle that makes the evidence permanent.
          </p>
          <p>
            If you&apos;re shipping AI-generated code without mutation testing, you&apos;re not verifying —
            you&apos;re hoping. And hope doesn&apos;t scale.
          </p>

          {/* CTA */}
          <div className="rounded-2xl border-2 border-violet-200 bg-[var(--bg-secondary)] p-8 text-center mt-10">
            <p className="font-display text-xl font-bold text-[var(--text)] mb-2">
              Stop hoping. Start proving.
            </p>
            <p className="text-slate-600 mb-6">
              Wreckit runs mutation testing as part of an 11-gate verification pipeline and ships a
              signed proof bundle with every verdict.
            </p>
            <a
              href="https://wreckit-ralph.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full px-8 py-3 text-white font-semibold shadow-[0_12px_24px_rgba(99,102,241,0.3)] hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)" }}
            >
              Try Wreckit →
            </a>
          </div>

          <hr className="border-violet-100 my-10" />

          <p className="text-sm text-slate-400 italic">
            Published by the wreckit team.{" "}
            <a
              href="https://wreckit-ralph.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--purple)] hover:underline"
            >
              Try wreckit →
            </a>
          </p>
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-violet-100">
          <Link
            href="/blog"
            className="text-sm text-slate-500 hover:text-[var(--purple)] transition flex items-center gap-2"
          >
            ← Back to Blog
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-violet-100 px-6 py-8 text-center text-sm text-slate-400">
        <Link href="/" className="hover:text-slate-600 transition">
          ← Back to Reckit Ralph
        </Link>
      </footer>
    </div>
  );
}
