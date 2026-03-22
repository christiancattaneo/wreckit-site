import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Proof-Driven Development: Why AI Code Needs Evidence, Not Just Tests — Reckit Ralph",
  description:
    "Tests tell you if code works in expected cases. Proof tells you if code works in ALL cases. Learn how Proof-Driven Development ships AI-generated features with evidence bundles, not just passing test suites.",
};

export default function ProofDrivenDevelopmentPage() {
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
            proof-driven development
          </span>
          <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[var(--purple)]">
            AI verification
          </span>
        </div>
        <div className="mb-2 text-xs text-slate-400">2026-03-09 · 7 min read</div>

        <h1 className="font-display text-4xl font-bold leading-tight text-[var(--text)] sm:text-5xl">
          Proof-Driven Development:{" "}
          <span className="block text-3xl sm:text-4xl font-semibold text-slate-500 mt-2">
            Why AI Code Needs Evidence, Not Just Tests
          </span>
        </h1>

        <div className="prose-section mt-12 space-y-6 text-slate-700 leading-relaxed">

          <p className="text-lg">
            An AI agent writes a feature. It generates the code, writes the tests, runs the suite,
            and reports back: all green. Ship it.
          </p>
          <p>
            Three days later, a user hits an edge case that corrupts their data. The fix takes two
            engineers four hours. The post-mortem reveals that the tests were perfectly coherent —
            they just didn&apos;t test the right things.
          </p>
          <p>
            This is the fundamental problem with AI-generated code in 2026: the same model that wrote
            the bug also wrote the test that didn&apos;t catch it. Tests are necessary. They are not
            sufficient. What you need is <em>proof</em>.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            What&apos;s Wrong with Tests Alone
          </h2>

          <p>
            Tests have always had a limitation: they verify expected behavior, not correctness. A
            test that checks <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-[var(--purple)]">add(2, 3) === 5</code> tells
            you the function works for that input. It tells you nothing about{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-[var(--purple)]">add(MAX_INT, 1)</code> or{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-[var(--purple)]">add(-0, 0)</code> or what happens
            when someone passes a string.
          </p>
          <p>
            This limitation was manageable when humans wrote both the code and the tests. The
            engineer who wrote the function understood its failure modes differently than the
            engineer who reviewed it. Different brains, different blind spots.
          </p>
          <p>
            AI collapses that separation. When a single model generates both the implementation and
            the test suite, you get <strong className="text-[var(--text)]">circular reasoning</strong>:
            the code is &ldquo;correct&rdquo; because it passes tests written by the same system that wrote the
            code. The tests confirm the model&apos;s assumptions. They don&apos;t challenge them.
          </p>

          <div className="space-y-4">
            {[
              {
                label: "Same blind spots",
                desc: "The model that writes if (price > 0) writes tests where price is 100 and -5. Neither the code nor the tests think about price === 0. The boundary goes untested because both artifacts share the same statistical bias.",
              },
              {
                label: "Coherent but incomplete",
                desc: "AI-generated test suites look professional. They have descriptive names, they hit multiple branches, they assert specific values. But they systematically undertest edge cases, boundary conditions, and error paths — exactly the cases that cause production failures.",
              },
              {
                label: "Coverage as theater",
                desc: "A model can generate 95% code coverage trivially. Lines executed ≠ logic verified. A test that calls a function and asserts it doesn't throw achieves coverage without testing anything meaningful.",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-[#faf5ff] border border-violet-100 p-5">
                <p className="font-semibold text-[var(--purple)] mb-1">{item.label}</p>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <p>
            The result: teams ship AI-generated features that look verified but aren&apos;t. The CI badge
            is green. The confidence is misplaced. The bug is waiting.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            What Is Proof?
          </h2>

          <p>
            A proof bundle is a collection of independent evidence that a piece of code actually works —
            not just that it passes its own tests. Each layer examines the code from a different angle,
            and no single layer is generated by the same system that wrote the code.
          </p>

          {[
            {
              num: "01",
              title: "Mutation test results",
              body: (
                <>
                  Deliberately break the code — flip operators, remove returns, negate conditions — and
                  check if the tests catch it. A high kill rate means the tests actually guard the logic.
                  A low one means the tests are decorative. This is the single most honest measure of test
                  quality that exists.
                </>
              ),
            },
            {
              num: "02",
              title: "Type coverage",
              body: (
                <>
                  No <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">any</code> escapes.
                  No <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono">ts-ignore</code> comments
                  hiding errors. No implicit coercions that silently convert types at runtime. Strict type
                  checking catches an entire class of bugs that tests can&apos;t — because the bug isn&apos;t in the
                  logic, it&apos;s in the types.
                </>
              ),
            },
            {
              num: "03",
              title: "Static analysis findings",
              body: (
                <>
                  Known bad patterns caught before execution: SQL injection vectors, XSS sinks, hardcoded
                  credentials, insecure deserialization. SAST tools aren&apos;t perfect, but they catch the
                  problems that code review systematically misses under time pressure.
                </>
              ),
            },
            {
              num: "04",
              title: "Property tests",
              body: (
                <>
                  Instead of testing specific inputs, property tests verify that invariants hold across
                  randomized inputs. &ldquo;For any valid email string, the validator returns true.&rdquo; &ldquo;For
                  any two positive numbers, the sum is greater than either input.&rdquo; These catch the edge
                  cases that example-based tests miss by construction.
                </>
              ),
            },
            {
              num: "05",
              title: "Behavior capture",
              body: (
                <>
                  A regression baseline that documents what the code <em>actually does</em> right now — not
                  what it&apos;s supposed to do. Snapshot the outputs, record the side effects, capture the
                  state transitions. When something changes unexpectedly in a future commit, the diff is
                  obvious.
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

          <p>
            Each of these layers is independent. A mutation test doesn&apos;t care what the type checker
            found. The static analyzer doesn&apos;t know about the property tests. That independence is the
            point — it&apos;s what separates proof from confirmation bias.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            The Three Minds Pattern
          </h2>

          <p>
            Proof-driven development isn&apos;t just about adding more tools to CI. It&apos;s about breaking the
            circular reasoning loop that AI introduces. The methodology is built on a principle:{" "}
            <strong className="text-[var(--text)]">no single mind should both generate and verify code.</strong>
          </p>
          <p>
            In practice, this means three distinct AI roles, each with a different objective:
          </p>

          <div className="space-y-4">
            {[
              {
                role: "Builder",
                color: "bg-indigo-50 border-indigo-200",
                labelColor: "text-indigo-700",
                desc: "Writes the implementation. Optimizes for correctness, readability, and performance. This is the model that generates the feature code — the thing you're actually shipping.",
              },
              {
                role: "Tester",
                color: "bg-violet-50 border-violet-200",
                labelColor: "text-violet-700",
                desc: "Writes adversarial tests independently. Doesn't see the Builder's test suggestions. Focuses on edge cases, boundary conditions, error paths, and the specific failure modes that the Builder's statistical biases would miss.",
              },
              {
                role: "Breaker",
                color: "bg-pink-50 border-pink-200",
                labelColor: "text-pink-700",
                desc: "Tries to find inputs that break the code. Runs property tests with randomized inputs, generates mutation variants, and actively searches for the gap between what the code does and what it should do. The Breaker's job is to find the bug before your users do.",
              },
            ].map((item) => (
              <div
                key={item.role}
                className={`rounded-xl border p-5 ${item.color}`}
              >
                <p className={`font-semibold mb-1 ${item.labelColor}`}>{item.role}</p>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <p>
            All three must agree before the code ships. If the Builder&apos;s implementation passes the
            Tester&apos;s adversarial suite and survives the Breaker&apos;s attack, you have genuine
            evidence of correctness. Not because one model said so — because three independent
            evaluations converged on the same answer.
          </p>
          <p>
            This is how human engineering works at its best: the developer writes the code, the
            reviewer challenges it, and QA tries to break it. PDD automates that separation of
            concerns with AI agents that have structurally different objectives.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            How Wreckit Generates Proof Bundles
          </h2>

          <p>
            When you run{" "}
            <a
              href="https://wreckit-ralph.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--purple)] font-semibold underline underline-offset-2 hover:opacity-80 transition"
            >
              wreckit
            </a>{" "}
            against a codebase, it executes the Three Minds pattern automatically and produces a
            structured proof bundle at{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-[var(--purple)]">.wreckit/proof.json</code>.
          </p>
          <p>Here&apos;s what that bundle contains:</p>

          <div className="rounded-xl bg-slate-900 p-6 overflow-x-auto">
            <pre className="text-sm font-mono text-slate-100 leading-relaxed">{`.wreckit/
├── proof.json            # Full evidence chain
│   ├── gates[]           # Each verification gate + result
│   │   ├── slop-scan     # AI residue detection
│   │   ├── type-check    # Strict TypeScript verification
│   │   ├── mutation-test # Kill rate + surviving mutants
│   │   ├── sast          # Security findings by severity
│   │   └── cross-verify  # Independent oracle agreement
│   ├── mutationKillRate  # e.g. 0.96 (96%)
│   ├── thresholds        # What was required vs achieved
│   ├── verdict           # SHIP | CAUTION | BLOCKED
│   └── timestamp         # When the verification ran
└── evidence/             # Raw artifacts per gate`}</pre>
          </div>

          <p>
            The <strong className="text-[var(--text)]">mutation kill rate</strong> is the headline
            number. It tells you what percentage of deliberately injected bugs your test suite caught.
            A rate of 96% means that out of every 100 plausible mutations, 96 were detected — your
            tests are genuinely protective.
          </p>
          <p>
            The <strong className="text-[var(--text)]">gate verdicts</strong> are pass/fail per layer.
            A codebase might pass type checking and SAST but fail mutation testing — meaning the code
            is type-safe and secure but the tests are weak. The proof bundle makes this visible
            instead of hidden behind a single green badge.
          </p>
          <p>
            The <strong className="text-[var(--text)]">evidence chain</strong> links every verdict back
            to the raw data that produced it. When someone asks &ldquo;why was this CAUTION?&rdquo; the answer
            is in the bundle — not in someone&apos;s memory of a CI run that expired two weeks ago.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            Ship, Caution, Blocked
          </h2>

          <p>
            Every wreckit run ends with one of three verdicts. They&apos;re not arbitrary labels — they&apos;re
            calibrated to what actually predicts production reliability.
          </p>

          <div className="space-y-4">
            {[
              {
                verdict: "SHIP",
                color: "bg-green-50 border-green-200",
                labelColor: "text-green-700",
                badgeColor: "bg-green-100 text-green-800",
                desc: "All gates passed. Mutation kill rate ≥ 95%. Type coverage is strict. No high-severity SAST findings. The Three Minds agree. This code has been independently verified from multiple angles — you have evidence, not just hope.",
              },
              {
                verdict: "CAUTION",
                color: "bg-amber-50 border-amber-200",
                labelColor: "text-amber-700",
                badgeColor: "bg-amber-100 text-amber-800",
                desc: "Most gates passed, but there are gaps. Maybe the mutation kill rate is 91% — close but not clean. Maybe a medium-severity SAST finding needs review. CAUTION means the code is probably fine but the proof bundle has holes. Ship if the risk is acceptable; fix if it's not.",
              },
              {
                verdict: "BLOCKED",
                color: "bg-red-50 border-red-200",
                labelColor: "text-red-700",
                badgeColor: "bg-red-100 text-red-800",
                desc: "One or more critical gates failed. The mutation kill rate is below threshold, or a high-severity security finding was detected, or the type checker found errors. BLOCKED means the evidence says this code isn't ready. The proof bundle tells you exactly what to fix.",
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
                </div>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <p>
            The key insight: these verdicts are based on <em>evidence</em>, not opinion. A SHIP verdict
            isn&apos;t &ldquo;the AI thinks it&apos;s good.&rdquo; It&apos;s &ldquo;mutation testing killed 97% of injected bugs, type
            coverage is 100% strict, SAST found zero high-severity issues, and the cross-verifier
            agrees.&rdquo; You can audit every claim. That&apos;s what proof means.
          </p>

          <hr className="border-violet-100 my-10" />

          <h2 className="font-display text-2xl font-bold text-[var(--text)] mt-12 mb-4">
            Conclusion: Evidence Over Vibes
          </h2>

          <p>
            The old workflow was: write code, write tests, check coverage, ship. That worked when
            humans wrote both sides and different brains caught different bugs.
          </p>
          <p>
            The AI workflow broke that model. When one system generates both the code and the tests,
            you need something outside that system to verify the result. You need independent evidence
            from multiple angles — mutation testing, type analysis, static security scanning, property
            verification — aggregated into a single, auditable artifact.
          </p>
          <p>
            That&apos;s Proof-Driven Development. Not a replacement for tests — a requirement that tests
            alone aren&apos;t the end of the story. Every AI-generated feature ships with a proof bundle
            that documents what was checked, what passed, what failed, and why the verdict was issued.
          </p>
          <p>
            The question isn&apos;t &ldquo;did the tests pass?&rdquo; anymore. It&apos;s &ldquo;where&apos;s the proof?&rdquo;
          </p>

          {/* CTA */}
          <div className="rounded-2xl border-2 border-violet-200 bg-[var(--bg-secondary)] p-8 text-center mt-10">
            <p className="font-display text-xl font-bold text-[var(--text)] mb-2">
              Ship with evidence, not assumptions.
            </p>
            <p className="text-slate-600 mb-6">
              Wreckit runs the Three Minds pattern and ships a signed proof bundle with every verdict.
            </p>
            <a
              href="https://clawhub.com/christiancattaneo/wreckit-ralph"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full px-8 py-3 text-white font-semibold shadow-[0_12px_24px_rgba(99,102,241,0.3)] hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)" }}
            >
              Get Wreckit on ClawHub →
            </a>
          </div>

          <hr className="border-violet-100 my-10" />

          <p className="text-sm text-slate-400 italic">
            Published by the wreckit team.{" "}
            <a
              href="https://clawhub.com/christiancattaneo/wreckit-ralph"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--purple)] hover:underline"
            >
              Get wreckit on ClawHub →
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
