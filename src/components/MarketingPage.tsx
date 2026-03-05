"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Cpu,
  FileCheck,
  Gamepad2,
  Layers,
  Lock,
  Loader2,
  Radar,
  Shield,
  Sparkles,
  TerminalSquare,
  UserRound,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Terminal from "@/components/Terminal";
import { cn } from "@/lib/utils";

const painPoints = [
  {
    icon: Radar,
    title: "Polite reviews miss risky gaps",
    copy: "Confident AI feedback can overlook fragile edge cases and security drift.",
  },
  {
    icon: Layers,
    title: "Loop-only checks are too narrow",
    copy: "Ralph loops are useful, but they are only one gate in a trustworthy release process.",
  },
  {
    icon: Shield,
    title: "Shipping without evidence is expensive",
    copy: "If there is no proof trail, each deploy becomes a wager.",
  },
];

const steps = [
  {
    title: "Point Reckit Ralph at code, branch, or prompt",
    copy: "Run from local repo, CI job, or plain-language feature specification.",
  },
  {
    title: "Parallel specialists run 11 verification gates",
    copy: "Ralph Loop is one gate. Security, testing, architecture, and replay gates run alongside it.",
  },
  {
    title: "Receive verdict plus signed evidence bundle",
    copy: "Each decision ships with machine-verifiable artifacts your team can audit.",
  },
];

const gates = [
  {
    name: "AI Slop Scan",
    desc: "Finds placeholders, generated residue, and suspicious dead paths.",
    icon: Sparkles,
  },
  {
    name: "Type Check",
    desc: "Static analysis with zero unresolved errors.",
    icon: CheckCircle2,
  },
  {
    name: "Ralph Loop",
    desc: "Adversarial builder-breaker loop pressure-tests logic.",
    icon: Gamepad2,
  },
  {
    name: "Test Quality",
    desc: "Scores coverage depth, assertion density, and test structure.",
    icon: Layers,
  },
  {
    name: "Mutation Kill",
    desc: "Mutates code paths and verifies tests catch regressions.",
    icon: Wrench,
  },
  {
    name: "Cross-Verify",
    desc: "Independent oracle validates behavior consistency.",
    icon: Cpu,
  },
  {
    name: "SAST",
    desc: "Static security analysis for critical and high findings.",
    icon: Shield,
  },
  {
    name: "Design Review",
    desc: "Flags coupling, architecture drift, and cyclic dependencies.",
    icon: FileCheck,
  },
  {
    name: "CI Integration",
    desc: "Validates real pipeline wiring and execution contracts.",
    icon: TerminalSquare,
  },
  {
    name: "Runtime Replay",
    desc: "Replays key paths in deterministic environment snapshots.",
    icon: Bot,
  },
  {
    name: "Proof Bundle",
    desc: "Packages signed verdict artifacts under .wreckit for audit.",
    icon: Lock,
  },
];

const modes = [
  {
    name: "BUILD",
    chip: "B",
    color: "linear-gradient(90deg, #12b76a, #22c55e)",
    trigger: "Greenfield systems",
    desc: "Start with verification guardrails from day one.",
  },
  {
    name: "REBUILD",
    chip: "R",
    color: "linear-gradient(90deg, #f59e0b, #fbbf24)",
    trigger: "Migrations and rewrites",
    desc: "Refactor core surfaces without sacrificing release confidence.",
  },
  {
    name: "FIX",
    chip: "F",
    color: "linear-gradient(90deg, #f43f5e, #e11d48)",
    trigger: "Regression incidents",
    desc: "Patch safely and verify collateral behavior did not regress.",
  },
  {
    name: "AUDIT",
    chip: "A",
    color: "linear-gradient(90deg, #06b6d4, #3b82f6)",
    trigger: "Pre-release validation",
    desc: "Prove readiness with reproducible evidence and threshold checks.",
  },
];

const verdicts = [
  {
    name: "SHIP",
    color: "#065f46",
    glow: "rgba(16, 185, 129, 0.45)",
    desc: "All gates passed and evidence thresholds were satisfied.",
  },
  {
    name: "CAUTION",
    color: "#92400e",
    glow: "rgba(245, 158, 11, 0.4)",
    desc: "Some gates flagged risk. Review before promoting.",
  },
  {
    name: "BLOCKED",
    color: "#9f1239",
    glow: "rgba(244, 63, 94, 0.42)",
    desc: "Critical issues detected. Release should not proceed.",
  },
];

const chatTranscript = [
  {
    side: "left",
    name: "You",
    role: "Release Engineer",
    text: "Reckit Ralph, audit checkout rewrite. We need confidence before merge.",
    meta: "Command: reckit-ralph audit ./checkout --mode rebuild",
  },
  {
    side: "right",
    name: "Reckit Ralph",
    role: "Verification Orchestrator",
    text: "Run accepted. Launching 11 gates: Ralph Loop plus test, security, architecture, and replay verification.",
    meta: "Workers: 18 parallel agents",
  },
  {
    side: "left",
    name: "You",
    role: "Release Engineer",
    text: "Good. Highlight any hidden regressions and attach proof artifacts.",
    meta: "Priority: strict",
  },
  {
    side: "right",
    name: "Reckit Ralph",
    role: "Verification Orchestrator",
    text: "Mutation gate found one weak assertion cluster. Suggested patch included, rerunning downstream checks now.",
    meta: "Mutation kill rate: 82 percent",
  },
  {
    side: "right",
    name: "Reckit Ralph",
    role: "Verification Orchestrator",
    text: "Final verdict: SHIP. Signed evidence bundle generated with full gate-by-gate trace.",
    meta: "Artifact: .wreckit/proof-2026-02-23.json",
  },
];

const gateGradients = [
  "linear-gradient(135deg, #6d28d9, #db2777)",
  "linear-gradient(135deg, #db2777, #f97316)",
  "linear-gradient(135deg, #f97316, #facc15)",
  "linear-gradient(135deg, #22c55e, #0ea5e9)",
  "linear-gradient(135deg, #0ea5e9, #6366f1)",
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #8b5cf6, #ec4899)",
  "linear-gradient(135deg, #ec4899, #f97316)",
  "linear-gradient(135deg, #f97316, #facc15)",
  "linear-gradient(135deg, #facc15, #22c55e)",
  "linear-gradient(135deg, #22c55e, #06b6d4)",
];

const proofJson = `{
  "version": "2.1.0",
  "timestamp": "2026-02-23T18:11:41Z",
  "project": "./checkout",
  "stack": "TypeScript / Next.js / Vitest",
  "verdict": "SHIP",
  "score": 96,
  "gates": {
    "slop_scan": { "status": "PASS", "artifacts": 0 },
    "type_check": { "status": "PASS", "errors": 0 },
    "ralph_loop": { "status": "PASS", "exploits_found": 0 },
    "test_quality": { "status": "PASS", "coverage": 92, "assertions_per_test": 3.1 },
    "mutation_kill": { "status": "PASS", "kill_rate": 0.82 },
    "cross_verify": { "status": "PASS", "oracle_agreement": true },
    "sast": { "status": "PASS", "high_findings": 0 },
    "design_review": { "status": "PASS", "circular_deps": 0 },
    "ci_integration": { "status": "PASS", "config": "github-actions" },
    "runtime_replay": { "status": "PASS", "deterministic": true },
    "proof_bundle": { "status": "GENERATED", "path": ".wreckit/proof-2026-02-23.json" }
  }
}`;

function highlightJson(json: string) {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/"([^"]+)":/g, '<span class="text-[#6366f1]">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="text-[#0ea5e9]">"$1"</span>')
    .replace(/: (\d+(\.\d+)?)/g, ': <span class="text-[#f59e0b]">$1</span>')
    .replace(/(PASS|GENERATED|SHIP)/g, '<span class="text-[#16a34a]">$1</span>')
    .replace(/CAUTION/g, '<span class="text-[#d97706]">CAUTION</span>')
    .replace(/BLOCKED/g, '<span class="text-[#e11d48]">BLOCKED</span>');
}

function useScrollTop() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrolled;
}

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      setCount(value);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return count;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {subtitle ? (
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--purple)]">{subtitle}</p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--text)] sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 26 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  );
}

function CrackDivider() {
  return (
    <div className="relative h-16">
      <svg
        viewBox="0 0 1200 120"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60 L150 55 L220 70 L320 50 L410 65 L520 40 L640 70 L760 55 L860 75 L980 50 L1100 70 L1200 60 V120 H0 Z"
          fill="#ffffff"
        />
        <path
          d="M0 60 L150 55 L220 70 L320 50 L410 65 L520 40 L640 70 L760 55 L860 75 L980 50 L1100 70 L1200 60"
          stroke="#d6bcfa"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
}

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setStatus("loading");
      setErrorMsg("");
      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || "Something went wrong.");
          setStatus("error");
        } else {
          setStatus("success");
        }
      } catch {
        setErrorMsg("Network error. Please try again.");
        setStatus("error");
      }
    },
    [email],
  );

  return (
    <section className="relative bg-[var(--bg-secondary)] px-6 py-24" id="waitlist">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--purple)]">Early access</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--text)] sm:text-4xl">
          Be first to ship bulletproof code
        </h2>
        <p className="mt-4 text-sm text-slate-600">
          Join the waitlist now and lock in early-access pricing when we launch. No spam, just updates.
        </p>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#dcfce7] px-6 py-3 text-sm font-semibold text-[#16a34a]"
          >
            <CheckCircle2 className="h-4 w-4" />
            You&apos;re on the list! We&apos;ll be in touch.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full max-w-sm rounded-full border border-slate-300 bg-white px-5 text-sm text-slate-800 outline-none transition focus:border-[var(--purple)] focus:ring-2 focus:ring-[var(--purple)]/20 sm:w-80"
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="h-12 rounded-full bg-[var(--grad-primary)] px-8 text-white shadow-[0_12px_24px_rgba(99,102,241,0.3)] hover:opacity-90 disabled:opacity-60"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Join waitlist"
              )}
            </Button>
          </form>
        )}

        {status === "error" && errorMsg && (
          <p className="mt-3 text-sm text-[#e11d48]">{errorMsg}</p>
        )}
      </div>
    </section>
  );
}

export default function MarketingPage() {
  const scrolled = useScrollTop();
  const gateRef = useRef(null);
  const gateInView = useInView(gateRef, { once: true, margin: "-120px" });
  const highlightedProof = useMemo(() => highlightJson(proofJson), []);
  const gateCount = useCountUp(11, gateInView);

  const gateStagger = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      show: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: index * 0.06 },
      }),
    }),
    []
  );

  return (
    <div className="relative overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="aurora-field" aria-hidden="true" />
      <div className="scanline-overlay pointer-events-none" aria-hidden="true" />

      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all",
          scrolled ? "glassline border-b border-violet-200/70" : ""
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3 font-display text-lg font-bold">
            <div className="logo-tile" aria-hidden="true">
              <Gamepad2 className="h-4 w-4" />
            </div>
            <span className="text-gradient">Reckit Ralph</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            {[
              { label: "How It Works", href: "#how" },
              { label: "Chat Flow", href: "#chat" },
              { label: "Gates", href: "#gates" },
              { label: "Proof", href: "#proof" },
              { label: "Pricing", href: "#pricing" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-slate-700 transition hover:text-slate-900 after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-0 after:bg-[var(--grad-text)] after:transition-all hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/blog"
              className="relative text-slate-700 transition hover:text-slate-900 after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-0 after:bg-[var(--grad-text)] after:transition-all hover:after:w-full"
            >
              Blog
            </a>
          </div>
          <Button className="rounded-full bg-[var(--grad-primary)] text-white shadow-[0_12px_24px_rgba(99,102,241,0.3)] hover:opacity-90">
            Run Reckit Ralph
          </Button>
        </div>
      </nav>

      <section className="relative min-h-screen overflow-hidden px-6 pb-24 pt-28">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute inset-0 opacity-80" aria-hidden="true">
          <div
            className="blob left-[-10%] top-[-20%] h-[440px] w-[440px] bg-[radial-gradient(circle,_rgba(99,102,241,0.58),_transparent_70%)]"
            style={{ animation: "morph 16s ease-in-out infinite" }}
          />
          <div
            className="blob right-[-12%] top-[8%] h-[520px] w-[520px] bg-[radial-gradient(circle,_rgba(16,185,129,0.4),_transparent_70%)]"
            style={{ animation: "morph 18s ease-in-out infinite" }}
          />
          <div
            className="blob bottom-[-20%] left-[20%] h-[520px] w-[520px] bg-[radial-gradient(circle,_rgba(236,72,153,0.4),_transparent_70%)]"
            style={{ animation: "morph 20s ease-in-out infinite" }}
          />
        </div>

        <div className="absolute left-[55%] top-[40%] hidden h-60 w-60 -translate-x-1/2 -translate-y-1/2 lg:block">
          <span className="impact-ring inset-0" />
          <span className="impact-ring delay-1 inset-0" />
          <span className="impact-ring delay-2 inset-0" />
        </div>

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-500">
              Reckit Ralph verification engine
            </p>
            <h1 className="font-display text-5xl font-extrabold leading-[0.95] sm:text-6xl lg:text-7xl">
              <span className="text-gradient-strong shimmer block glitch-text">RECKIT RALPH</span>
              <span className="text-gradient-strong shimmer block">PROVES RELEASES</span>
              <span className="mt-2 block text-3xl font-bold text-[var(--text)] sm:text-4xl">
                Beyond loops. Full evidence.
              </span>
            </h1>
            <p className="mt-5 text-sm uppercase tracking-[0.28em] text-slate-500">
              Build it. Break it. Verify every gate.
            </p>
            <p className="mt-5 max-w-xl text-lg text-slate-700">
              Reckit Ralph is not just a Ralph loop runner. It is a multi-gate
              verification and evidence engine that audits quality, security, design,
              and runtime behavior before production.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button className="rounded-full bg-[var(--grad-primary)] px-6 py-6 text-base text-white shadow-[0_12px_24px_rgba(99,102,241,0.3)] hover:opacity-90">
                Start Verification
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-slate-300 px-6 py-6 text-base text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                asChild
              >
                <a
                  href="https://github.com/christiancattaneo/wreckit"
                  target="_blank"
                  rel="noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--purple)]" />
                11-gate verification
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[var(--rose)]" />
                Signed evidence artifacts
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[var(--cyan)]" />
                Parallel specialist workers
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative flex items-center justify-center"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="parallax-card w-full">
              <Terminal />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-[var(--bg-secondary)] px-6 py-24" id="problem">
        <SectionHeader
          title="Code that sounds correct can still break in production"
          subtitle="The problem"
        />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {painPoints.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.1} className="card card-hover p-6">
              <item.icon className="h-6 w-6 text-[var(--rose)]" />
              <h3 className="mt-4 text-xl font-semibold text-[var(--text)]">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CrackDivider />

      <section className="relative px-6 py-24" id="how">
        <SectionHeader title="Three stages, one trusted outcome" subtitle="How it works" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.1} className="card card-hover p-6">
                <div className="flex items-start gap-5">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef2ff] text-lg font-bold text-[var(--purple)]">
                    0{index + 1}
                    <span className="absolute -right-10 top-1/2 -translate-y-1/2 text-6xl font-bold text-[#dbeafe]">
                      0{index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text)]">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{step.copy}</p>
                    {index === 2 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-semibold text-[#16a34a]">
                          SHIP
                        </span>
                        <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-semibold text-[#d97706]">
                          CAUTION
                        </span>
                        <span className="rounded-full bg-[#ffe4e6] px-3 py-1 text-xs font-semibold text-[#e11d48]">
                          BLOCKED
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="card card-hover p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--text)]">Multi-Gate Core</h3>
              <span className="rounded-full bg-[#e0e7ff] px-3 py-1 text-xs font-semibold text-[var(--purple)]">
                Evidence First
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Reckit Ralph orchestrates specialists for each gate. Ralph Loop pressure-tests
              logic, while other workers validate quality, security, architecture, CI, and
              runtime replay before final scoring.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-slate-200 bg-white">
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Core
                </span>
                {Array.from({ length: 8 }).map((_, index) => {
                  const angle = (index / 8) * Math.PI * 2;
                  const radius = 88;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  return (
                    <div
                      key={index}
                      className="absolute h-8 w-8 rounded-full border border-slate-200 bg-[#f8fafc]"
                      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                    />
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-[#f8fafc] px-6 py-24" id="chat">
        <SectionHeader
          title="Back-and-forth verification, like a game session"
          subtitle="Chat Flow"
        />
        <div className="mx-auto max-w-5xl rounded-[28px] border border-violet-200/60 bg-white/50 p-6 shadow-[0_24px_60px_rgba(76,29,149,0.16)] backdrop-blur md:p-10">
          <div className="space-y-4">
            {chatTranscript.map((message, index) => {
              const isRight = message.side === "right";
              return (
                <motion.div
                  key={`${message.name}-${index}`}
                  className={cn("flex", isRight ? "justify-end" : "justify-start")}
                  initial={{ opacity: 0, x: isRight ? 30 : -30, y: 14 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                >
                  <div
                    className={cn(
                      "chat-bubble max-w-[92%] rounded-2xl px-4 py-3 md:max-w-[72%]",
                      isRight ? "chat-bubble-right" : "chat-bubble-left"
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        {isRight ? (
                          <Bot className="h-4 w-4 text-violet-100" />
                        ) : (
                          <UserRound className="h-4 w-4 text-slate-700" />
                        )}
                        <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                          {message.name}
                        </p>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.12em] opacity-80">
                        {message.role}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className="mt-3 border-t border-current/15 pt-2 text-[11px] opacity-85">
                      {message.meta}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-white px-6 py-24" id="gates">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="relative">
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--purple)]">Verification</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--text)] sm:text-4xl">
              Eleven gates. Ralph Loop is one of them.
            </h2>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-600">
              <span className="rounded-full bg-[#eef2ff] px-4 py-2 font-semibold text-[var(--purple)]">
                {gateCount} gates running
              </span>
              <span className="rounded-full bg-[#ecfeff] px-4 py-2 font-semibold text-[#0891b2]">
                1 evidence bundle generated
              </span>
            </div>
          </div>
          <div
            ref={gateRef}
            className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {gates.map((gate, index) => (
              <motion.div
                key={gate.name}
                custom={index}
                variants={gateStagger}
                initial="hidden"
                animate={gateInView ? "show" : "hidden"}
                className="card card-hover group relative overflow-hidden p-5"
              >
                <div
                  className="absolute inset-0 opacity-0 transition group-hover:opacity-10"
                  style={{ background: gateGradients[index % gateGradients.length] }}
                />
                <div className="relative flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ background: gateGradients[index % gateGradients.length] }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <gate.icon className="h-5 w-5 text-slate-500" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-[var(--text)]">{gate.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{gate.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-[#fafafa] px-6 py-24" id="modes">
        <SectionHeader title="One engine. Multiple release modes." subtitle="Modes" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {modes.map((mode, index) => (
            <Reveal
              key={mode.name}
              delay={index * 0.1}
              className="card card-hover group relative overflow-hidden p-6"
            >
              <div
                className="absolute inset-0 opacity-0 transition group-hover:opacity-10"
                style={{ background: mode.color }}
              />
              <div className="relative">
                <div className="mb-4 h-1 w-full rounded-full" style={{ background: mode.color }} />
                <div className="flex items-center gap-3">
                  <div className="mode-chip" style={{ background: mode.color }}>
                    {mode.chip}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text)]">{mode.name}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600">{mode.trigger}</p>
                <p className="mt-4 text-sm text-slate-700">{mode.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative bg-[var(--bg-secondary)] px-6 py-24" id="proof">
        <SectionHeader title="Every run leaves an audit receipt" subtitle="Proof bundle" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="space-y-4">
            <h3 className="text-2xl font-semibold text-[var(--text)]">Evidence that teams can trust</h3>
            <p className="text-sm text-slate-700">
              Reckit Ralph writes a signed proof bundle in <code>.wreckit/</code> with
              gate output, thresholds, replay metadata, and final verdict reasoning.
              Security and platform teams can review exactly why a release was approved.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li>Gate-by-gate artifact trail with timestamps</li>
              <li>Signed verdict, score, and policy thresholds</li>
              <li>Deterministic metadata for reproducible reruns</li>
            </ul>
          </Reveal>
          <Reveal className="receipt p-6 font-mono text-xs text-slate-700">
            <div className="stamp">VERIFIED</div>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs text-slate-500">.wreckit/proof.json</div>
              <Badge className="bg-[#16a34a] text-white shadow-[0_0_20px_rgba(22,163,74,0.3)]">
                SHIP
              </Badge>
            </div>
            <pre
              className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-[0.7rem]"
              dangerouslySetInnerHTML={{ __html: highlightedProof }}
            />
          </Reveal>
        </div>
      </section>

      <section className="relative px-6 py-24" id="verdicts">
        <SectionHeader title="Three outcomes. No ambiguity." subtitle="Verdicts" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {verdicts.map((verdict, index) => (
            <Reveal key={verdict.name} delay={index * 0.1} className="p-2">
              <div
                className="rounded-2xl p-6 text-center text-white animate-[pulseVerdict_3.4s_ease-in-out_infinite]"
                style={
                  {
                    background: verdict.color,
                    boxShadow: `0 0 24px ${verdict.glow}`,
                    "--glow": verdict.glow,
                  } as CSSProperties
                }
              >
                <h3 className="text-xl font-semibold tracking-wide">{verdict.name}</h3>
                <p className="mt-2 text-sm text-white/85">{verdict.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="relative bg-white px-6 py-24" id="pricing">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="relative">
          <SectionHeader title="Simple, transparent pricing" subtitle="Pricing" />
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {/* Open Source */}
            <Reveal delay={0} className="card card-hover relative overflow-hidden p-6">
              <h3 className="text-xl font-semibold text-[var(--text)]">Open Source</h3>
              <p className="mt-1 text-sm text-slate-500">For OSS projects</p>
              <p className="mt-6 font-display text-4xl font-bold text-[var(--text)]">
                Free
                <span className="ml-1 text-base font-normal text-slate-500">forever</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {["All 11 verification gates", "CLI + GitHub Actions", "Community support", "Public repo only"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--purple)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full rounded-full border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                variant="outline"
                asChild
              >
                <a href="https://github.com/christiancattaneo/wreckit" target="_blank" rel="noreferrer">
                  Get started
                </a>
              </Button>
            </Reveal>

            {/* Pro */}
            <Reveal delay={0.1} className="card card-hover relative overflow-hidden border-2 border-[var(--purple)] p-6">
              <Badge className="absolute right-4 top-4 bg-[var(--grad-primary)] text-white">
                Most popular
              </Badge>
              <h3 className="text-xl font-semibold text-[var(--text)]">Pro</h3>
              <p className="mt-1 text-sm text-slate-500">For teams &lt;10 devs</p>
              <p className="mt-6 font-display text-4xl font-bold text-[var(--text)]">
                $49
                <span className="ml-1 text-base font-normal text-slate-500">/mo</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {["Everything in Free", "Private repositories", "Priority gate execution", "Email + Slack support"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--purple)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full rounded-full bg-[var(--grad-primary)] text-white shadow-[0_12px_24px_rgba(99,102,241,0.3)] hover:opacity-90" asChild>
                <a href="#waitlist">Join waitlist</a>
              </Button>
            </Reveal>

            {/* Team */}
            <Reveal delay={0.2} className="card card-hover relative overflow-hidden p-6">
              <h3 className="text-xl font-semibold text-[var(--text)]">Team</h3>
              <p className="mt-1 text-sm text-slate-500">For engineering orgs</p>
              <p className="mt-6 font-display text-4xl font-bold text-[var(--text)]">
                $149
                <span className="ml-1 text-base font-normal text-slate-500">/mo</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {["Everything in Pro", "Unlimited team seats", "Custom gate policies", "Dedicated onboarding"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--purple)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full rounded-full border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50" variant="outline" asChild>
                <a href="#waitlist">Join waitlist</a>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <WaitlistSection />

      <footer className="relative bg-[var(--grad-primary)] px-6 py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="logo-tile mb-4 bg-white/20 text-white">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <p className="font-display text-4xl font-semibold">Reckit Ralph</p>
          <p className="mt-2 text-lg text-white/85">Stop shipping guesswork. Start shipping proof.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              className="rounded-full bg-white text-[var(--purple)] hover:bg-white/90"
              asChild
            >
              <a
                href="https://github.com/christiancattaneo/wreckit"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/60 text-white hover:border-white"
              asChild
            >
              <a href="https://clawhub.com" target="_blank" rel="noreferrer">
                ClawHub
              </a>
            </Button>
          </div>
          <p className="mt-10 text-xs uppercase tracking-[0.3em] text-white/75">
            Reckit Ralph - Multi-gate AI verification and evidence engine
          </p>
        </div>
      </footer>
    </div>
  );
}
