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
  Bolt,
  Bug,
  CheckCircle2,
  Cpu,
  FileCheck,
  Flame,
  Layers,
  Lock,
  Radar,
  Shield,
  Sparkles,
  TerminalSquare,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Terminal from "@/components/Terminal";
import { cn } from "@/lib/utils";

const painPoints = [
  {
    icon: Radar,
    title: "AI reviewers hallucinate approvals",
    copy: "Confident feedback hides subtle logic gaps and unsafe assumptions.",
  },
  {
    icon: Bug,
    title: "Tests pass. Bugs ship.",
    copy: "Green checkmarks without adversarial validation are just vibes.",
  },
  {
    icon: Flame,
    title: "No one actually knows if it works",
    copy: "Deploys should ship with proof, not gut feel.",
  },
];

const steps = [
  {
    title: "Point wreckit at your code or prompt",
    copy: "Plug in a repo, a branch, or a plain-language spec.",
  },
  {
    title: "Swarm of parallel AI workers run 11 verification gates",
    copy: "Builder and breaker agents execute every gate independently.",
  },
  {
    title: "Get a signed proof bundle — SHIP, CAUTION, or BLOCKED",
    copy: "Audit artifacts, verdict logic, and the evidence trail.",
  },
];

const gates = [
  {
    name: "AI Slop Scan",
    desc: "Detects placeholders, artifacts, dead code, hallucinated logic.",
    icon: Sparkles,
  },
  {
    name: "Type Check",
    desc: "Full static analysis with zero errors allowed.",
    icon: CheckCircle2,
  },
  {
    name: "Ralph Loop",
    desc: "Adversarial AI breaks what the builder writes.",
    icon: Bolt,
  },
  {
    name: "Test Quality",
    desc: "Coverage, assertion density, and test-to-code ratio.",
    icon: Layers,
  },
  {
    name: "Mutation Kill",
    desc: "Mutates source; tests must catch every change.",
    icon: Wrench,
  },
  {
    name: "Cross-Verify",
    desc: "Independent oracle validates behavior.",
    icon: Cpu,
  },
  {
    name: "SAST",
    desc: "Static security analysis for critical findings.",
    icon: Shield,
  },
  {
    name: "Design Review",
    desc: "Checks coupling, cycles, and architecture drift.",
    icon: FileCheck,
  },
  {
    name: "CI Integration",
    desc: "Verifies real CI config and execution.",
    icon: TerminalSquare,
  },
  {
    name: "Proof Bundle",
    desc: "Creates signed `.wreckit/` evidence bundle.",
    icon: Lock,
  },
];

const modes = [
  {
    name: "BUILD",
    emoji: "🟢",
    color: "linear-gradient(90deg, #10b981, #22c55e)",
    trigger: "Greenfield codebase",
    desc: "Start from zero with proof baked in.",
  },
  {
    name: "REBUILD",
    emoji: "🟡",
    color: "linear-gradient(90deg, #f59e0b, #fbbf24)",
    trigger: "Migrate or rewrite",
    desc: "Swap the engine without losing reliability.",
  },
  {
    name: "FIX",
    emoji: "🔴",
    color: "linear-gradient(90deg, #f43f5e, #e11d48)",
    trigger: "Bug hunt",
    desc: "Fix one thing, prove nothing else broke.",
  },
  {
    name: "AUDIT",
    emoji: "🔵",
    color: "linear-gradient(90deg, #06b6d4, #3b82f6)",
    trigger: "Quality verification",
    desc: "Prove your current code is trustworthy.",
  },
];

const verdicts = [
  {
    name: "SHIP",
    emoji: "🟢",
    color: "#065f46",
    glow: "rgba(16, 185, 129, 0.5)",
    desc: "All gates pass. Code is ready to merge.",
  },
  {
    name: "CAUTION",
    emoji: "🟡",
    color: "#92400e",
    glow: "rgba(245, 158, 11, 0.5)",
    desc: "Some gates flagged. Review before shipping.",
  },
  {
    name: "BLOCKED",
    emoji: "🔴",
    color: "#9f1239",
    glow: "rgba(244, 63, 94, 0.5)",
    desc: "Critical failures found. Do not ship.",
  },
];

const gateGradients = [
  "linear-gradient(135deg, #7c3aed, #f43f5e)",
  "linear-gradient(135deg, #f43f5e, #fb923c)",
  "linear-gradient(135deg, #fb923c, #fbbf24)",
  "linear-gradient(135deg, #fbbf24, #a3e635)",
  "linear-gradient(135deg, #22c55e, #06b6d4)",
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  "linear-gradient(135deg, #8b5cf6, #f43f5e)",
  "linear-gradient(135deg, #f43f5e, #f97316)",
  "linear-gradient(135deg, #f97316, #fbbf24)",
  "linear-gradient(135deg, #7c3aed, #06b6d4)",
];

const proofJson = `{
  "version": "2.1.0",
  "timestamp": "2026-02-22T14:32:01Z",
  "project": "./src",
  "stack": "TypeScript / Next.js / Vitest",
  "verdict": "SHIP",
  "score": 94,
  "gates": {
    "slop_scan": { "status": "PASS", "artifacts": 0 },
    "type_check": { "status": "PASS", "errors": 0 },
    "ralph_loop": { "status": "PASS", "exploits_found": 0 },
    "test_quality": { "status": "PASS", "coverage": 91, "assertions_per_test": 2.8 },
    "mutation_kill": { "status": "PASS", "kill_rate": 0.87 },
    "cross_verify": { "status": "PASS", "oracle_agreement": true },
    "sast": { "status": "PASS", "high_findings": 0 },
    "design_review": { "status": "PASS", "circular_deps": 0 },
    "ci_integration": { "status": "PASS", "config": "github-actions" },
    "proof_bundle": { "status": "GENERATED", "path": ".wreckit/proof-2026-02-22.json" }
  }
}`;

function highlightJson(json: string) {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/"([^"]+)":/g, '<span class="text-[#7c3aed]">"$1"</span>:')
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
    let start = 0;
    const duration = 1200;
    let raf = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (target - start) * eased);
      setCount(value);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
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
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--purple)]">
          {subtitle}
        </p>
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
      initial={{ opacity: 0, y: 30 }}
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
          stroke="#e9d5ff"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
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
        transition: { duration: 0.6, delay: index * 0.08 },
      }),
    }),
    []
  );

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all",
          scrolled
            ? "backdrop-blur-xl bg-white/80 border-b border-slate-200"
            : ""
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="text-2xl">👊</span>
            <span className="text-gradient">wreckit</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            {[
              { label: "How It Works", href: "#how" },
              { label: "Gates", href: "#gates" },
              { label: "Modes", href: "#modes" },
              { label: "Proof", href: "#proof" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative transition text-slate-700 hover:text-slate-900 after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-0 after:bg-[var(--grad-text)] after:transition-all hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </div>
          <Button className="animate-pulse rounded-full bg-[var(--grad-primary)] text-white shadow-[0_12px_24px_rgba(124,58,237,0.25)] hover:opacity-90">
            Start Wrecking
          </Button>
        </div>
      </nav>

      <section className="relative min-h-screen overflow-hidden px-6 pb-24 pt-28">
        <div className="absolute inset-0 mesh-bg">
          <div
            className="blob left-[-10%] top-[-20%] h-[440px] w-[440px] bg-[radial-gradient(circle,_rgba(124,58,237,0.6),_transparent_70%)]"
            style={{ animation: "morph 16s ease-in-out infinite" }}
          />
          <div
            className="blob right-[-12%] top-[8%] h-[520px] w-[520px] bg-[radial-gradient(circle,_rgba(244,63,94,0.5),_transparent_70%)]"
            style={{ animation: "morph 18s ease-in-out infinite" }}
          />
          <div
            className="blob bottom-[-20%] left-[20%] h-[520px] w-[520px] bg-[radial-gradient(circle,_rgba(251,146,60,0.5),_transparent_70%)]"
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
              AI code verification
            </p>
            <h1 className="font-display text-5xl font-extrabold leading-[0.95] text-[var(--text)] sm:text-6xl lg:text-7xl">
              <span className="text-gradient-strong shimmer block">WE WRECK</span>
              <span className="text-gradient-strong shimmer block">YOUR CODE.</span>
              <span className="mt-2 block text-3xl font-bold text-[var(--text)] sm:text-4xl">
                So production doesn&apos;t.
              </span>
            </h1>
            <p className="mt-5 text-sm uppercase tracking-[0.28em] text-slate-500">
              Build it. Break it. Prove it works.
            </p>
            <p className="mt-5 max-w-xl text-lg text-slate-700">
              Build it. Break it. Prove it works. wreckit is the AI agent skill that
              enforces real verification gates, signed proof bundles, and ruthless
              adversarial checks before you ship.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button className="rounded-full bg-[var(--grad-primary)] px-6 py-6 text-base text-white shadow-[0_12px_24px_rgba(124,58,237,0.25)] hover:opacity-90">
                Start Wrecking
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
                Language agnostic
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[var(--rose)]" />
                Evidence-first pipeline
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[var(--orange)]" />
                Swarm architecture
              </div>
            </div>
          </motion.div>
          <motion.div
            className="relative flex items-center justify-center"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute -top-10 right-10 text-[120px] opacity-20">👊</div>
            <Terminal />
          </motion.div>
        </div>
      </section>

      <section className="relative bg-[#f5f3ff] px-6 py-24" id="problem">
        <SectionHeader
          title="AI writes confident, broken code. And AI reviews agree with it."
          subtitle="The problem"
        />
        <div className="absolute right-[8%] top-12 text-[120px] opacity-30">💥</div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {painPoints.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.1} className="card card-hover p-6">
              <item.icon className="h-6 w-6 text-[var(--rose)]" />
              <h3 className="mt-4 text-xl font-semibold text-[var(--text)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600">{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CrackDivider />

      <section className="relative px-6 py-24" id="how">
        <SectionHeader title="Three steps. Zero excuses." subtitle="How it works" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.1} className="card card-hover p-6">
                <div className="flex items-start gap-5">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f3ff] text-lg font-bold text-[var(--purple)]">
                    0{index + 1}
                    <span className="absolute -right-10 top-1/2 -translate-y-1/2 text-6xl font-bold text-[#ede9fe]">
                      0{index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text)]">
                      {step.title}
                    </h3>
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
              <h3 className="text-lg font-semibold text-[var(--text)]">
                Swarm Architecture
              </h3>
              <span className="rounded-full bg-[#ede9fe] px-3 py-1 text-xs font-semibold text-[var(--purple)]">
                Orchestrated
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              The orchestrator spins up specialized agents for each gate. Builders and
              breakers work in parallel, then aggregate evidence into a signed bundle.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-slate-200 bg-white">
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Orchestrator
                </span>
                {Array.from({ length: 7 }).map((_, index) => {
                  const angle = (index / 7) * Math.PI * 2;
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

      <section className="relative bg-white px-6 py-24" id="gates">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="relative">
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--purple)]">
              Verification
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--text)] sm:text-4xl">
              <span className="text-4xl">👊</span> Eleven gates. One verdict.
            </h2>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-600">
              <span className="rounded-full bg-[#f5f3ff] px-4 py-2 font-semibold text-[var(--purple)]">
                {gateCount} gates running
              </span>
              <span className="rounded-full bg-[#fff7ed] px-4 py-2 font-semibold text-[#f97316]">
                1 verdict delivered
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
                <h3 className="mt-4 text-base font-semibold text-[var(--text)]">
                  {gate.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{gate.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-[#fafafa] px-6 py-24" id="modes">
        <SectionHeader title="One tool. Every situation." subtitle="Modes" />
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
                <div
                  className="mb-4 h-1 w-full rounded-full"
                  style={{ background: mode.color }}
                />
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{mode.emoji}</div>
                  <h3 className="text-xl font-semibold text-[var(--text)]">
                    {mode.name}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-slate-600">{mode.trigger}</p>
                <p className="mt-4 text-sm text-slate-700">{mode.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative bg-[#f5f3ff] px-6 py-24" id="proof">
        <SectionHeader title="Every run produces a receipt." subtitle="Proof bundle" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="space-y-4">
            <h3 className="text-2xl font-semibold text-[var(--text)]">
              Proof you can audit.
            </h3>
            <p className="text-sm text-slate-700">
              wreckit outputs a signed proof bundle in `.wreckit/` that captures every
              gate, every artifact, and every verdict decision. It&apos;s the receipt your
              CI and security teams can trust.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li>Gate-by-gate evidence trail</li>
              <li>Signed verdict with score and thresholds</li>
              <li>Reproducible run metadata</li>
            </ul>
          </Reveal>
          <Reveal className="receipt p-6 font-mono text-xs text-slate-700">
            <div className="stamp">WRECKED</div>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs text-slate-500">.wreckit/proof.json</div>
              <Badge className="bg-[#16a34a] text-white shadow-[0_0_20px_rgba(22,163,74,0.3)]">
                ✅ SHIP
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
                <div className="text-3xl">{verdict.emoji}</div>
                <h3 className="mt-3 text-xl font-semibold tracking-wide">
                  {verdict.name}
                </h3>
                <p className="mt-2 text-sm text-white/80">{verdict.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="relative bg-[var(--grad-primary)] px-6 py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="text-[120px]">👊</div>
          <p className="font-display text-4xl font-semibold">Stop shipping vibes.</p>
          <p className="mt-2 text-lg text-white/80">Start shipping proof.</p>
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
          <p className="mt-10 text-xs uppercase tracking-[0.3em] text-white/70">
            wreckit — AI code verification
          </p>
        </div>
      </footer>
    </div>
  );
}
