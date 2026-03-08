import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Reckit Ralph | AI Code Verification",
  description:
    "Developer guides, deep dives, and opinions on AI code verification, proof bundles, mutation testing, and shipping software you can actually trust.",
};

const articles = [
  {
    slug: "mutation-testing-with-ai",
    title: "Mutation Testing with AI: How to Actually Prove Your Code Works",
    excerpt:
      "Passing tests don't mean working code. Learn how mutation testing exposes weak test suites with a concrete example, and how wreckit automates it with kill-rate thresholds and a signed proof bundle.",
    date: "2026-03-08",
    readTime: "7 min read",
    tags: ["mutation testing AI", "verification", "proof bundle"],
  },
  {
    slug: "what-is-ai-code-verification",
    title: "What Is AI Code Verification? (And Why Tests Alone Aren't Enough)",
    excerpt:
      "Your test suite is green. CI passed. The AI-generated feature looks correct. Then it breaks in production. Here's why tests aren't enough — and what a real verification pipeline looks like.",
    date: "2026-03-05",
    readTime: "6 min read",
    tags: ["verification", "mutation testing", "AI code"],
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Nav */}
      <nav className="border-b border-violet-200/70 bg-white/80 backdrop-blur">
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
          <div className="flex items-center gap-8 text-sm text-slate-600">
            <Link href="/" className="transition hover:text-slate-900">
              Home
            </Link>
            <Link
              href="/blog"
              className="font-semibold text-[var(--purple)]"
            >
              Blog
            </Link>
            <a
              href="https://wreckit-ralph.vercel.app#waitlist"
              className="rounded-full bg-[var(--grad-primary)] px-4 py-2 text-white text-xs font-semibold shadow-[0_8px_20px_rgba(99,102,241,0.3)] hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)" }}
            >
              Try Wreckit
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-[var(--bg-secondary)] border-b border-violet-100 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--purple)] mb-3">
            Wreckit Blog
          </p>
          <h1 className="font-display text-4xl font-bold text-[var(--text)] sm:text-5xl">
            Ship with proof,{" "}
            <span
              style={{
                background: "var(--grad-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              not vibes
            </span>
          </h1>
          <p className="mt-4 text-slate-600 text-lg max-w-xl">
            Deep dives on AI code verification, mutation testing, proof bundles, and everything
            in between.
          </p>
        </div>
      </div>

      {/* Article list */}
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-8">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="group rounded-2xl border border-violet-100 bg-white p-8 shadow-sm transition hover:shadow-[0_14px_42px_rgba(99,102,241,0.12)] hover:border-violet-200"
            >
              <div className="flex items-center gap-3 mb-4">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[var(--purple)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-xl font-semibold text-[var(--text)] group-hover:text-[var(--purple)] transition leading-snug">
                <Link href={`/blog/${article.slug}`}>
                  {article.title}
                </Link>
              </h2>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {article.excerpt}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <time dateTime={article.date}>{article.date}</time>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
                <Link
                  href={`/blog/${article.slug}`}
                  className="text-sm font-semibold text-[var(--purple)] hover:underline flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Read →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-16 text-center text-sm text-slate-400">
          More articles coming soon.
        </p>
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
