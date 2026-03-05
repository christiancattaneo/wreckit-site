import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What Is AI Code Verification? (And Why Tests Alone Aren't Enough) — Reckit Ralph",
  description:
    "AI code verification goes beyond green CI. Learn what slop scanning, mutation testing, SAST, and proof bundles actually mean — and why they matter for AI-generated code.",
};

export default function WhatIsAICodeVerificationPage() {
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
            AI code verification
          </span>
          <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[var(--purple)]">
            mutation testing
          </span>
        </div>
        <div className="mb-2 text-xs text-slate-400">2026-03-05 · 6 min read</div>

        <h1 className="font-display text-4xl font-bold leading-tight text-[var(--text)] sm:text-5xl">
          What Is AI Code Verification?{" "}
          <span className="block text-3xl sm:text-4xl font-semibold text-slate-500 mt-2">
            (And Why Tests Alone Aren&apos;t Enough)
          </span>
        </h1>

        <div className="prose-section mt-12 space-y-6 text-slate-700 leading-relaxed">

          <p className="text-lg">
            Your test suite is green. CI passed. The AI-generated feature looks correct, the PR got
            approved, and you&apos;re about to merge.
          </p>
          <p>
            Then it breaks in production.
          </p>
          <p>
            Not because the tests lied — but because they were never testing the right things. A stub
            returned <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-[var(--purple)]">true</code> for every input. A type error was hidden behind{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-[var(--purple)]">any</code>. A mutation that
            flipped <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">&gt;</code> to{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">&gt;=</code> would have caught a billing bug, but nobody wrote an
            assertion tight enough to catch it. The AI wrote plausible code, the tests confirmed it{" "}
            <em>ran</em>, and nobody proved it actually <em>worked</em>.
          </p>
          <p>
            This is the gap that AI code verification fills. And it&apos;s why tests alone aren&apos;t enough.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            Section 1: What AI Code Verification Actually Means
          </h2>

          <p>
            &ldquo;AI code verification&rdquo; doesn&apos;t mean asking ChatGPT to review your code. It means running a
            systematic, multi-layered analysis pipeline that produces <em>evidence</em> — not just a green
            checkmark.
          </p>
          <p>Real verification answers questions that tests don&apos;t:</p>
          <ul className="list-none space-y-2 pl-0">
            {[
              "Does this code have AI-generated residue (stubs, dead branches, placeholder logic)?",
              "Are there type errors that TypeScript would catch if you actually ran the compiler correctly?",
              "Do the tests actually catch bugs, or do they pass even when the code is wrong?",
              "Are there known security patterns that SAST tools flag?",
              "Does an independent oracle agree with what the code claims to do?",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-[#eef2ff] flex items-center justify-center text-[var(--purple)] text-xs font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            The distinction matters more now than ever because the volume of AI-generated code has
            exploded. Every team is shipping Copilot suggestions, Claude completions, and GPT-generated
            functions — and most of it <em>looks</em> correct even when it isn&apos;t.
          </p>
          <p>
            A good{" "}
            <a
              href="https://wreckit-ralph.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--purple)] font-semibold underline underline-offset-2 hover:opacity-80 transition"
            >
              AI code verification tool
            </a>{" "}
            doesn&apos;t replace your engineers. It gives them proof instead of vibes.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            Section 2: The 6 Verification Layers
          </h2>
          <p>
            Different problems require different lenses. Here&apos;s what a complete verification pipeline
            looks like:
          </p>

          {[
            {
              num: "01",
              title: "Slop Scan",
              body: (
                <>
                  AI-generated code has fingerprints. Placeholder comments (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">// TODO: implement</code>),
                  dead code paths that never execute, functions that return hardcoded values, unnecessary
                  complexity that suggests the model was filling space rather than solving a problem.
                  <br /><br />
                  A slop scan finds these artifacts before they ship. It&apos;s not about blaming the AI — it&apos;s
                  about catching the cases where the model took a shortcut and the engineer didn&apos;t notice.
                </>
              ),
            },
            {
              num: "02",
              title: "Type Check",
              body: (
                <>
                  This sounds obvious, but most teams don&apos;t run strict type checking in CI. They use{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">any</code> as an escape hatch, ignore{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">ts-ignore</code> comments, and let type errors accumulate until
                  they cause runtime failures.
                  <br /><br />
                  A proper type check gate runs with <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">--strict</code> and zero tolerance.
                  No errors means no errors — not &ldquo;no errors we bothered to fix.&rdquo;
                </>
              ),
            },
            {
              num: "03",
              title: "Mutation Testing",
              body: (
                <>
                  This is the one most teams skip, and it&apos;s the most revealing.
                  <br /><br />
                  Mutation testing works by deliberately breaking your code — flipping <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">&gt;</code> to{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">&gt;=</code>, changing <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">&amp;&amp;</code> to{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">||</code>, deleting a return statement — and then running your
                  test suite. If the tests still pass after the mutation, they&apos;re not actually catching that
                  class of bug.
                  <br /><br />
                  A high mutation kill rate (&gt;80%) means your tests are genuinely protective. A low one
                  means you have coverage theater: tests that run but don&apos;t guard anything.
                </>
              ),
            },
            {
              num: "04",
              title: "SAST (Static Application Security Testing)",
              body: (
                <>
                  Security bugs don&apos;t announce themselves. SQL injection, XSS vectors, hardcoded
                  credentials, insecure deserialization — these patterns are detectable with static analysis
                  before the code ever runs.
                  <br /><br />
                  SAST tools aren&apos;t perfect, but a gate that blocks on high-severity findings catches the
                  obvious problems that reviews miss.
                </>
              ),
            },
            {
              num: "05",
              title: "Dynamic Analysis",
              body: (
                <>
                  Static analysis tells you what the code <em>says</em>. Dynamic analysis tells you what it{" "}
                  <em>does</em>.
                  <br /><br />
                  Runtime replay — executing code paths in a deterministic, sandboxed environment — catches
                  issues that only appear at runtime: resource leaks, race conditions, environment-specific
                  failures. If you can&apos;t replay the same execution and get the same result, you don&apos;t have a
                  reproducible system.
                </>
              ),
            },
            {
              num: "06",
              title: "Cross-Verification",
              body: (
                <>
                  The final layer is the most powerful and least common: an independent oracle.
                  <br /><br />
                  Run the same behavior through a second, unrelated model or verifier that wasn&apos;t involved
                  in generating the code. If they agree, confidence goes up. If they disagree, you have a
                  real problem that needs human attention.
                  <br /><br />
                  <a
                    href="https://wreckit-ralph.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--purple)] font-semibold underline underline-offset-2 hover:opacity-80 transition"
                  >
                    Wreckit
                  </a>{" "}
                  runs all 6 of these layers (plus more) in parallel, then aggregates the results into a
                  single verdict.
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
            Section 3: Why AI-Generated Code Has a Unique Verification Problem
          </h2>

          <p>
            Human-written code is wrong in ways that are usually obvious. A junior engineer writes
            spaghetti. A senior engineer misunderstands a requirement. The bugs are localized and the
            blame is clear.
          </p>
          <p>
            AI-generated code is wrong in a subtler way:{" "}
            <strong className="text-[var(--text)]">it&apos;s plausible, not proven.</strong>
          </p>
          <p>
            Language models are trained to produce text that looks correct. They&apos;re exceptionally good at
            this. Code that a model generates will use the right variable names, follow the right patterns,
            include comments that describe intent accurately, and pass surface-level review by experienced
            engineers.
          </p>
          <p>
            But the model doesn&apos;t <em>understand</em> the code. It predicts tokens. And sometimes the next
            most likely token is wrong — not obviously wrong, but subtly, expensively wrong.
          </p>
          <p>The result is a class of bugs that&apos;s unusually hard to catch with traditional methods:</p>

          <div className="space-y-4">
            {[
              {
                label: "Confidence mismatch",
                desc: "The code looks authoritative. Engineers are less likely to scrutinize it carefully because it reads well.",
              },
              {
                label: "Coverage theater",
                desc: "AI writes the tests too. The same model that wrote the bug also wrote the test that doesn't catch it. The test is coherent; it just doesn't test the right edge case.",
              },
              {
                label: "Plausible stubs",
                desc: "Instead of failing loudly, AI code sometimes returns plausible default values. A function that should validate an email address returns true for all inputs. The tests pass. The validator is useless.",
              },
              {
                label: "Mutation survivors",
                desc: "If a model generates a condition like if (price > 0) when it should be if (price >= 0), a test suite that doesn't test the exact boundary will never catch it.",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-[#faf5ff] border border-violet-100 p-5">
                <p className="font-semibold text-[var(--purple)] mb-1">{item.label}</p>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <p>
            This is why &ldquo;the AI reviewed it&rdquo; or &ldquo;we have 90% coverage&rdquo; isn&apos;t good enough anymore. The
            verification needs to be adversarial, not confirmatory.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            Section 4: What a Proof Bundle Is and Why It Matters
          </h2>

          <p>
            A proof bundle is the output of a complete verification run: a signed, machine-readable
            artifact that documents exactly what was checked, what passed, what failed, and why the final
            verdict was issued.
          </p>
          <p>A real proof bundle includes:</p>
          <ul className="list-none space-y-2 pl-0">
            {[
              "Gate-by-gate results with timestamps and artifact pointers",
              "Threshold records — what score was required and what was achieved",
              "Mutation kill rate — so you know the tests are actually protective",
              "SAST findings — categorized by severity",
              "Cross-verification agreement — did the oracle agree?",
              "Final verdict: SHIP, CAUTION, or BLOCKED",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-[#eef2ff] flex items-center justify-center text-[var(--purple)] text-xs font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>This matters for two reasons.</p>
          <p>
            <strong className="text-[var(--text)]">First, audits.</strong> When something breaks in
            production, &ldquo;the tests passed&rdquo; is not an explanation. A proof bundle is. You can trace exactly
            what was verified, what the evidence showed, and why the decision was made to ship.
          </p>
          <p>
            <strong className="text-[var(--text)]">Second, trust.</strong> Teams that ship with proof bundles build faster over time,
            not slower. When engineers know that a verification system has their back — that the mutation
            testing caught a real bug, that the slop scan found a stub before it shipped — they move with
            more confidence. The verification becomes a force multiplier, not a bottleneck.
          </p>
          <p>
            <a
              href="https://wreckit-ralph.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--purple)] font-semibold underline underline-offset-2 hover:opacity-80 transition"
            >
              Wreckit
            </a>{" "}
            generates a{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">.wreckit/proof-*.json</code> file on every run. It&apos;s signed,
            structured, and designed to be committed alongside the code it verifies.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            Conclusion: Ship with Proof, Not Vibes
          </h2>

          <p>The old question was: &ldquo;Did the tests pass?&rdquo;</p>
          <p>The new question is: &ldquo;Do you have proof?&rdquo;</p>
          <p>
            Tests are necessary but not sufficient. They confirm that the code ran. They don&apos;t confirm
            that the code is correct, secure, tested to the right depth, or free of AI-generated residue.
          </p>
          <p>
            A complete AI code verification tool runs the full stack: slop scan, type check, mutation
            testing, SAST, dynamic analysis, and cross-verification. It produces a signed artifact that
            teams can audit, commit, and stand behind.
          </p>
          <p>
            If you&apos;re shipping AI-generated code — and you almost certainly are — you need more than a
            green CI badge. You need a proof bundle.
          </p>

          {/* CTA */}
          <div className="rounded-2xl border-2 border-violet-200 bg-[var(--bg-secondary)] p-8 text-center mt-10">
            <p className="font-display text-xl font-bold text-[var(--text)] mb-2">
              Stop shipping guesswork.
            </p>
            <p className="text-slate-600 mb-6">
              Wreckit runs 11 verification gates and ships a signed proof bundle with every verdict.
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
