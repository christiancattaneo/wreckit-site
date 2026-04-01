"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Code2,
  Cpu,
  FileCheck,
  Layers,
  Lock,
  Radar,
  Shield,
  Sparkles,
  TerminalSquare,
  UserRound,
  Wrench,
  Zap,
  Activity,
  Bug,
  GitBranch,
  Search,
  Eye,
  Gauge,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Terminal from "@/components/Terminal";
import PricingSection from "@/components/PricingSection";
import { cn } from "@/lib/utils";

/* ────────────────────────────── DATA ────────────────────────────── */

const steps = [
  {
    title: "Say what you want",
    copy: 'Natural language to your OpenClaw agent: "Use wreckit to audit this project"',
  },
  {
    title: "14 gates run",
    copy: "Slop scan, type check, SAST, mutation testing, dynamic analysis, and more — in parallel.",
  },
  {
    title: "Get your verdict",
    copy: "Ship \u2705, Caution \u26a0\ufe0f, or Blocked \ud83d\udeab — plus a signed proof bundle in .wreckit/",
  },
];

const gates = [
  { name: "AI Slop Scan", desc: "Detects placeholder code, template artifacts, empty stubs.", icon: Sparkles },
  { name: "Type Check", desc: "tsc / mypy / cargo check / go vet — zero unresolved errors.", icon: CheckCircle2 },
  { name: "Ralph Loop", desc: "Adversarial builder-breaker loop pressure-tests logic.", icon: Bug },
  { name: "Test Quality", desc: "Coverage depth, assertion density, and test structure scoring.", icon: Layers },
  { name: "Mutation Kill", desc: "mutmut / Stryker / cargo-mutants — verifies tests catch regressions.", icon: Wrench },
  { name: "Cross-Verify", desc: "Independent agent corroborates the builder's claims.", icon: Eye },
  { name: "Behavior Capture", desc: "Golden fixtures captured before rebuild/fix.", icon: GitBranch },
  { name: "Regression", desc: "Byte-for-byte replay with LLM-as-judge diff approval.", icon: Activity },
  { name: "SAST / Red Team", desc: "20+ vulnerability patterns, ReDoS analysis.", icon: Shield },
  { name: "Dynamic Analysis", desc: "Memory leaks, race conditions, FD leaks at runtime.", icon: Zap },
  { name: "Design Review", desc: "Dep graph, circular deps, coupling, god modules.", icon: FileCheck },
  { name: "CI Integration", desc: "CI config detection and pipeline scoring.", icon: TerminalSquare },
  { name: "Performance", desc: "Benchmark detection + regression vs captured baseline.", icon: Gauge },
  { name: "Proof Bundle", desc: "Writes .wreckit/proof.json, dashboard.json, decision.md.", icon: Lock },
];

const modes = [
  {
    name: "BUILD",
    chip: "B",
    emoji: "\ud83d\udfe2",
    color: "linear-gradient(90deg, #10b981, #22c55e)",
    trigger: "New project from PRD",
    desc: "Full pipeline for greenfield projects with verification guardrails from day one.",
  },
  {
    name: "REBUILD",
    chip: "R",
    emoji: "\ud83d\udfe1",
    color: "linear-gradient(90deg, #f59e0b, #fbbf24)",
    trigger: "Existing code + migration spec",
    desc: "BUILD + behavior capture + regression replay for safe migrations.",
  },
  {
    name: "FIX",
    chip: "F",
    emoji: "\ud83d\udd34",
    color: "linear-gradient(90deg, #ef4444, #f43f5e)",
    trigger: "Bug fix with proof",
    desc: "Fix, verify, prove nothing else broke. Signed evidence of safety.",
  },
  {
    name: "AUDIT",
    chip: "A",
    emoji: "\ud83d\udfe6",
    color: "linear-gradient(90deg, #06b6d4, #3b82f6)",
    trigger: "Verify existing code, no changes",
    desc: "Read-only analysis. Full gate suite. No modifications to your codebase.",
  },
];

const verdicts = [
  {
    name: "SHIP",
    symbol: "\u2705",
    bg: "linear-gradient(135deg, #059669, #10b981)",
    glow: "rgba(16, 185, 129, 0.25)",
    desc: "All gates passed. Evidence thresholds satisfied. Safe to deploy.",
  },
  {
    name: "CAUTION",
    symbol: "\u26a0\ufe0f",
    bg: "linear-gradient(135deg, #d97706, #f59e0b)",
    glow: "rgba(245, 158, 11, 0.2)",
    desc: "Some gates flagged risk. Review the proof bundle before promoting.",
  },
  {
    name: "BLOCKED",
    symbol: "\ud83d\udeab",
    bg: "linear-gradient(135deg, #dc2626, #ef4444)",
    glow: "rgba(239, 68, 68, 0.2)",
    desc: "Critical issues detected. Release should not proceed.",
  },
];

const chatTranscript = [
  {
    side: "left",
    name: "You",
    role: "Developer",
    text: "Use wreckit to audit ~/Projects/checkout. Don't change anything.",
    meta: 'Mode: AUDIT \u2014 read-only verification',
  },
  {
    side: "right",
    name: "wreckit",
    role: "Verification Engine",
    text: "Running 14 verification gates against ~/Projects/checkout. Stack detected: TypeScript / Next.js / Vitest.",
    meta: "14 gates queued",
  },
  {
    side: "right",
    name: "wreckit",
    role: "Verification Engine",
    text: "Mutation gate found one weak assertion cluster in checkout/payment.ts. Kill rate 71% \u2014 below 80% threshold.",
    meta: "Gate: Mutation Kill \u2014 CAUTION",
  },
  {
    side: "right",
    name: "wreckit",
    role: "Verification Engine",
    text: "Final verdict: CAUTION \u26a0\ufe0f. 13 gates passed, 1 below threshold. Proof bundle written to .wreckit/proof.json",
    meta: "Artifact: .wreckit/proof.json",
  },
];

const scripts = [
  { name: "run-all-gates.sh", args: "[path] [mode]", desc: "Full sequential pipeline with telemetry" },
  { name: "slop-scan.sh", args: "[path]", desc: "Semantic slop detection \u2014 placeholders, stubs, dead code" },
  { name: "type-check.sh", args: "[path]", desc: "tsc / mypy / cargo check / go vet" },
  { name: "red-team.sh", args: "[path]", desc: "20+ SAST vulnerability patterns + ReDoS" },
  { name: "mutation-test.sh", args: "[path]", desc: "mutmut / Stryker / cargo-mutants / AI fallback" },
  { name: "proof-bundle.sh", args: "[path] [mode]", desc: "Corroborated verdict + .wreckit/ artifacts" },
  { name: "dynamic-analysis.sh", args: "[path]", desc: "Memory leaks, race conditions, FD leaks" },
  { name: "design-review.sh", args: "[path]", desc: "Dep graph, circular deps, coupling analysis" },
];

const usageCommands = [
  { cmd: '"Use wreckit to audit ~/Projects/myapp. Don\'t change anything."', mode: "AUDIT" },
  { cmd: '"Use wreckit to build a REST API from this PRD."', mode: "BUILD" },
  { cmd: '"Use wreckit to fix this bug. Prove nothing else breaks."', mode: "FIX" },
  { cmd: '"Use wreckit to rebuild this codebase in TypeScript."', mode: "REBUILD" },
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
  "linear-gradient(135deg, #06b6d4, #6366f1)",
  "linear-gradient(135deg, #6366f1, #db2777)",
  "linear-gradient(135deg, #db2777, #8b5cf6)",
];

const proofJson = `{
  "verdict": "SHIP",
  "run_id": "a3f8c2d1-9e4b-4a7c-b8f6-2d1e3a5c7b9d",
  "git_sha": "abc123f",
  "timestamp": "2026-03-20T04:22:11Z",
  "gates": {
    "slop_scan":    { "status": "PASS", "density": 1.2 },
    "type_check":   { "status": "PASS", "errors": 0 },
    "ralph_loop":   { "status": "PASS", "exploits": 0 },
    "test_quality": { "status": "PASS", "coverage": 92 },
    "mutation":     { "status": "PASS", "kill_rate": 94 },
    "cross_verify": { "status": "PASS", "oracle_agrees": true },
    "sast":         { "status": "PASS", "blockers": 0 },
    "dynamic":      { "status": "PASS", "leaks": 0 },
    "design":       { "status": "PASS", "circular_deps": 0 },
    "red_team":     { "status": "PASS", "blockers": 0 }
  }
}`;

/* ────────────────────────────── HELPERS ────────────────────────────── */

function highlightJson(json: string) {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/"([^"]+)":/g, '<span class="text-[#7c3aed]">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="text-[#0891b2]">"$1"</span>')
    .replace(/: (\d+(\.\d+)?)/g, ': <span class="text-[#d97706]">$1</span>')
    .replace(/(PASS|GENERATED|SHIP)/g, '<span class="text-[#059669]">$1</span>')
    .replace(/: (true|false)/g, ': <span class="text-[#0891b2]">$1</span>')
    .replace(/CAUTION/g, '<span class="text-[#d97706]">CAUTION</span>')
    .replace(/BLOCKED/g, '<span class="text-[#dc2626]">BLOCKED</span>');
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

/* ────────────────────────────── COMPONENTS ────────────────────────────── */

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {subtitle ? (
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--purple)] font-semibold">{subtitle}</p>
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

/* ────────────────────────────── MAIN PAGE ────────────────────────────── */

export default function MarketingPage() {
  const scrolled = useScrollTop();
  const gateRef = useRef(null);
  const gateInView = useInView(gateRef, { once: true, margin: "-120px" });
  const highlightedProof = useMemo(() => highlightJson(proofJson), []);
  const gateCount = useCountUp(14, gateInView);

  const gateStagger = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      show: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: index * 0.05 },
      }),
    }),
    []
  );

  return (
    <div className="relative overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {/* ═══════════ NAV ═══════════ */}
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all",
          scrolled ? "glassline border-b border-[rgba(124,58,237,0.08)]" : ""
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3 font-display text-lg font-bold">
            <div className="logo-tile" aria-hidden="true">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="text-gradient">wreckit</span>
          </div>
          <div className="hidden items-center gap-8 text-sm md:flex">
            {[
              { label: "How It Works", href: "#how" },
              { label: "Gates", href: "#gates" },
              { label: "Usage", href: "#usage" },
              { label: "Scripts", href: "#scripts" },
              { label: "Proof", href: "#proof" },
              { label: "Pricing", href: "#pricing" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-[var(--text-muted)] transition hover:text-[var(--text)] after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-0 after:bg-[var(--grad-text)] after:transition-all hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </div>
          <Button
            className="rounded-full bg-[var(--grad-primary)] text-white shadow-[0_4px_14px_rgba(124,58,237,0.2)] hover:opacity-90"
            asChild
          >
            <a href="https://clawhub.com/christiancattaneo/wreckit-ralph" target="_blank" rel="noreferrer">
              Install on ClawHub
            </a>
          </Button>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen overflow-hidden px-6 pb-24 pt-28">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute inset-0" aria-hidden="true">
          <div
            className="blob left-[-10%] top-[-20%] h-[440px] w-[440px] bg-[radial-gradient(circle,_rgba(124,58,237,0.12),_transparent_70%)]"
            style={{ animation: "morph 16s ease-in-out infinite" }}
          />
          <div
            className="blob right-[-12%] top-[8%] h-[520px] w-[520px] bg-[radial-gradient(circle,_rgba(8,145,178,0.08),_transparent_70%)]"
            style={{ animation: "morph 18s ease-in-out infinite" }}
          />
          <div
            className="blob bottom-[-20%] left-[20%] h-[520px] w-[520px] bg-[radial-gradient(circle,_rgba(236,72,153,0.06),_transparent_70%)]"
            style={{ animation: "morph 20s ease-in-out infinite" }}
          />
        </div>

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-6xl font-extrabold leading-[0.95] sm:text-7xl lg:text-8xl">
              <span className="text-gradient-strong shimmer block">wreckit</span>
            </h1>
            <p className="mt-4 font-display text-2xl font-semibold text-[var(--text)] sm:text-3xl">
              Bulletproof AI code verification.
            </p>
            <p className="mt-5 max-w-xl text-lg text-[var(--text-muted)]">
              The agent IS the engine. No external CI required. Spawns parallel verification
              workers that slop-scan, type-check, mutation-test, and cross-verify before
              shipping. Ship proof, not vibes.
            </p>

            {/* Install command */}
            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-[rgba(124,58,237,0.12)] bg-[#1e1e2e] px-5 py-3 font-mono text-sm text-[#c8c8e0]">
              <span className="text-[#8888a8]">$</span>
              <span className="text-[#a78bfa]">clawhub install</span>
              <span className="text-[#e8e8f0]">wreckit-ralph</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                className="rounded-full bg-[var(--grad-primary)] px-6 py-6 text-base text-white shadow-[0_8px_20px_rgba(124,58,237,0.2)] hover:opacity-90"
                asChild
              >
                <a href="https://clawhub.com/christiancattaneo/wreckit-ralph" target="_blank" rel="noreferrer">
                  Install on ClawHub
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-[rgba(124,58,237,0.2)] px-6 py-6 text-base text-[var(--text-muted)] hover:border-[rgba(124,58,237,0.35)] hover:bg-[rgba(124,58,237,0.04)] hover:text-[var(--text)]"
                asChild
              >
                <a
                  href="https://clawhub.com/christiancattaneo/wreckit-ralph"
                  target="_blank"
                  rel="noreferrer"
                >
                  View on ClawHub
                </a>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--purple)]" />
                14-gate verification
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[var(--rose)]" />
                Signed proof bundles
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[var(--cyan)]" />
                Parallel workers
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

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="relative px-6 py-24" id="how">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative">
          <SectionHeader title="Three steps to verified code" subtitle="How it works" />
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.12} className="card card-hover p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white"
                  style={{ background: gateGradients[index * 4] }}
                >
                  0{index + 1}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--text)]">{step.title}</h3>
                <p className="mt-3 text-sm text-[var(--text-muted)]">{step.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ MODES ═══════════ */}
      <section className="relative bg-[var(--bg-secondary)] px-6 py-24" id="modes">
        <SectionHeader title="Four modes. One engine." subtitle="Modes" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {modes.map((mode, index) => (
            <Reveal
              key={mode.name}
              delay={index * 0.1}
              className="card card-hover group relative overflow-hidden p-6"
            >
              <div
                className="absolute inset-0 opacity-0 transition group-hover:opacity-[0.04]"
                style={{ background: mode.color }}
              />
              <div className="relative">
                <div className="mb-4 h-1 w-full rounded-full opacity-50" style={{ background: mode.color }} />
                <div className="flex items-center gap-3">
                  <div className="mode-chip" style={{ background: mode.color }}>
                    {mode.chip}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text)]">
                    <span className="mr-2">{mode.emoji}</span>
                    {mode.name}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-[var(--purple)]">{mode.trigger}</p>
                <p className="mt-3 text-sm text-[var(--text-muted)]">{mode.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════ GATES ═══════════ */}
      <section className="relative px-6 py-24" id="gates">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative">
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--purple)] font-semibold">Verification</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--text)] sm:text-4xl">
              14 gates. Each one earns trust.
            </h2>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-[var(--text-muted)]">
              <span className="rounded-full border border-[rgba(124,58,237,0.15)] bg-[rgba(124,58,237,0.06)] px-4 py-2 font-semibold text-[var(--purple)]">
                {gateCount} gates
              </span>
              <span className="rounded-full border border-[rgba(8,145,178,0.15)] bg-[rgba(8,145,178,0.06)] px-4 py-2 font-semibold text-[var(--cyan)]">
                + proof bundle
              </span>
            </div>
          </div>
          <div
            ref={gateRef}
            className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
                  className="absolute inset-0 opacity-0 transition group-hover:opacity-[0.04]"
                  style={{ background: gateGradients[index % gateGradients.length] }}
                />
                <div className="relative flex items-center justify-between">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ background: gateGradients[index % gateGradients.length] }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <gate.icon className="h-4 w-4 text-[var(--text-muted)]" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-[var(--text)]">{gate.name}</h3>
                <p className="mt-1.5 text-xs text-[var(--text-muted)]">{gate.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ USAGE ═══════════ */}
      <section className="relative bg-[var(--bg-secondary)] px-6 py-24" id="usage">
        <SectionHeader title="Natural language. Real verification." subtitle="Usage" />
        <div className="mx-auto max-w-3xl space-y-4">
          {usageCommands.map((item, index) => (
            <Reveal key={item.cmd} delay={index * 0.08}>
              <div className="flex items-start gap-4 rounded-xl border border-[rgba(124,58,237,0.08)] bg-[var(--bg-card)] p-5 backdrop-blur">
                <div
                  className="mt-0.5 flex h-7 w-14 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{
                    background: modes.find((m) => m.name === item.mode)?.color ?? gateGradients[0],
                  }}
                >
                  {item.mode}
                </div>
                <p className="font-mono text-sm text-[var(--text)]">{item.cmd}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.4}>
            <div className="mt-8 text-center">
              <p className="text-sm text-[var(--text-muted)]">
                wreckit is an{" "}
                <a
                  href="https://openclaw.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--purple)] underline decoration-[var(--purple)]/30 hover:decoration-[var(--purple)]"
                >
                  OpenClaw
                </a>{" "}
                skill — you talk to your agent, it runs wreckit.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ CHAT FLOW ═══════════ */}
      <section className="relative px-6 py-24" id="chat">
        <SectionHeader
          title="Verification as conversation"
          subtitle="Chat Flow"
        />
        <div className="mx-auto max-w-4xl rounded-[28px] border border-[rgba(124,58,237,0.1)] bg-[rgba(255,255,255,0.6)] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl md:p-10">
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
                          <Bot className="h-4 w-4 text-violet-200" />
                        ) : (
                          <UserRound className="h-4 w-4 text-[var(--text-muted)]" />
                        )}
                        <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                          {message.name}
                        </p>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.12em] opacity-60">
                        {message.role}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className="mt-3 border-t border-current/10 pt-2 text-[11px] opacity-60">
                      {message.meta}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ SCRIPTS ═══════════ */}
      <section className="relative bg-[var(--bg-secondary)] px-6 py-24" id="scripts">
        <SectionHeader title="24 deterministic scripts" subtitle="Scripts" />
        <p className="mx-auto -mt-6 mb-10 max-w-2xl text-center text-sm text-[var(--text-muted)]">
          The heart of wreckit. Each script is a standalone gate — run them individually or let the orchestrator run the full pipeline.
        </p>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
          {scripts.map((script, index) => (
            <Reveal key={script.name} delay={index * 0.06}>
              <div className="rounded-xl border border-[rgba(124,58,237,0.08)] bg-[var(--bg-card)] p-4 backdrop-blur">
                <div className="font-mono text-sm">
                  <span className="text-[var(--purple)]">{script.name}</span>
                  <span className="ml-2 text-[var(--text-muted)]">{script.args}</span>
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)]">{script.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════ PROOF BUNDLE ═══════════ */}
      <section className="relative px-6 py-24" id="proof">
        <SectionHeader title="Every run leaves a proof trail" subtitle="Proof bundle" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="space-y-5">
            <h3 className="text-2xl font-semibold text-[var(--text)]">Machine-verifiable evidence</h3>
            <p className="text-sm text-[var(--text-muted)]">
              wreckit writes a tamper-evident proof bundle in <code className="rounded bg-[rgba(124,58,237,0.08)] px-1.5 py-0.5 text-[var(--purple)]">.wreckit/</code> with
              gate output, thresholds, and final verdict reasoning. Review exactly why a
              release was approved — or blocked.
            </p>
            <div className="space-y-2 font-mono text-sm text-[var(--text-muted)]">
              <p className="text-[var(--text)]">.wreckit/</p>
              <p className="pl-4">\u251c\u2500\u2500 proof.json <span className="text-[var(--text-muted)]">\u2190 machine-readable verdict</span></p>
              <p className="pl-4">\u251c\u2500\u2500 dashboard.json <span className="text-[var(--text-muted)]">\u2190 external tooling schema</span></p>
              <p className="pl-4">\u251c\u2500\u2500 decision.md <span className="text-[var(--text-muted)]">\u2190 human-readable reasoning</span></p>
              <p className="pl-4">\u2514\u2500\u2500 raw/ <span className="text-[var(--text-muted)]">\u2190 raw script output per gate</span></p>
            </div>
          </Reveal>
          <Reveal className="receipt p-6 font-mono text-xs text-[var(--text-muted)]">
            <div className="stamp">VERIFIED</div>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs text-[var(--text-muted)]">.wreckit/proof.json</div>
              <Badge className="bg-[#059669] text-white shadow-[0_2px_8px_rgba(5,150,105,0.2)]">
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

      {/* ═══════════ VERDICTS ═══════════ */}
      <section className="relative bg-[var(--bg-secondary)] px-6 py-24" id="verdicts">
        <SectionHeader title="Three outcomes. No ambiguity." subtitle="Verdicts" />
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {verdicts.map((verdict, index) => (
            <Reveal key={verdict.name} delay={index * 0.1} className="p-2">
              <div
                className="rounded-2xl p-6 text-center text-white animate-[pulseVerdict_3.4s_ease-in-out_infinite]"
                style={
                  {
                    background: verdict.bg,
                    boxShadow: `0 8px 24px ${verdict.glow}`,
                    "--glow": verdict.glow,
                  } as CSSProperties
                }
              >
                <div className="text-3xl">{verdict.symbol}</div>
                <h3 className="mt-2 text-xl font-semibold tracking-wide">{verdict.name}</h3>
                <p className="mt-2 text-sm text-white/80">{verdict.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <PricingSection />

      {/* ═══════════ INSTALL ═══════════ */}
      <section className="relative px-6 py-24" id="install">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--purple)] font-semibold">Get started</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--text)] sm:text-4xl">
            Install in one command
          </h2>
          <div className="mx-auto mt-8 max-w-md">
            <div className="code-block p-5 text-left">
              <p className="text-[#8888a8]"># Via ClawHub (recommended)</p>
              <p className="mt-1">
                <span className="text-[#8888a8]">$ </span>
                <span className="text-[#a78bfa]">clawhub install</span>{" "}
                <span className="text-[#e8e8f0]">wreckit-ralph</span>
              </p>
              <p className="mt-4 text-[#8888a8]"># Then use it:</p>
              <p className="mt-1 text-[#67e8f9]">
                &quot;Use wreckit to audit ~/Projects/myapp&quot;
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              className="rounded-full bg-[var(--grad-primary)] px-8 py-6 text-base text-white shadow-[0_8px_20px_rgba(124,58,237,0.2)] hover:opacity-90"
              asChild
            >
              <a href="https://clawhub.com/christiancattaneo/wreckit-ralph" target="_blank" rel="noreferrer">
                Install on ClawHub
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-[rgba(124,58,237,0.2)] px-8 py-6 text-base text-[var(--text-muted)] hover:border-[rgba(124,58,237,0.35)] hover:bg-[rgba(124,58,237,0.04)] hover:text-[var(--text)]"
              asChild
            >
              <a href="https://clawhub.com/christiancattaneo/wreckit-ralph" target="_blank" rel="noreferrer">
                View on ClawHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative border-t border-[rgba(124,58,237,0.08)] bg-white px-6 py-16 text-[var(--text)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="logo-tile mb-4">
            <Code2 className="h-5 w-5" />
          </div>
          <p className="font-display text-3xl font-semibold text-gradient">wreckit</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Bulletproof AI code verification.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              className="rounded-full border-[rgba(124,58,237,0.15)] text-[var(--text-muted)] hover:border-[rgba(124,58,237,0.3)] hover:bg-[rgba(124,58,237,0.04)] hover:text-[var(--text)]"
              asChild
            >
              <a href="https://clawhub.com/christiancattaneo/wreckit-ralph" target="_blank" rel="noreferrer">
                ClawHub
              </a>
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-[rgba(124,58,237,0.15)] text-[var(--text-muted)] hover:border-[rgba(124,58,237,0.3)] hover:bg-[rgba(124,58,237,0.04)] hover:text-[var(--text)]"
              asChild
            >
              <a href="https://openclaw.ai" target="_blank" rel="noreferrer">
                OpenClaw
              </a>
            </Button>
          </div>
          <p className="mt-10 text-xs text-[var(--text-muted)]">
            wreckit by Christian Cattaneo
          </p>
        </div>
      </footer>
    </div>
  );
}
