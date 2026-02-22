"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowDown,
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
    color: "var(--green)",
    trigger: "Greenfield codebase",
    desc: "Start from zero with proof baked in.",
  },
  {
    name: "REBUILD",
    emoji: "🟡",
    color: "var(--amber)",
    trigger: "Migrate or rewrite",
    desc: "Swap the engine without losing reliability.",
  },
  {
    name: "FIX",
    emoji: "🔴",
    color: "var(--red)",
    trigger: "Bug hunt",
    desc: "Fix one thing, prove nothing else broke.",
  },
  {
    name: "AUDIT",
    emoji: "🔵",
    color: "var(--blue)",
    trigger: "Quality verification",
    desc: "Prove your current code is trustworthy.",
  },
];

const verdicts = [
  {
    name: "SHIP",
    emoji: "🟢",
    color: "var(--green)",
    desc: "All gates pass. Code is ready to merge.",
  },
  {
    name: "CAUTION",
    emoji: "🟡",
    color: "var(--amber)",
    desc: "Some gates flagged. Review before shipping.",
  },
  {
    name: "BLOCKED",
    emoji: "🔴",
    color: "var(--red)",
    desc: "Critical failures found. Do not ship.",
  },
];

const particlePositions = [
  { left: "8%", top: "18%" },
  { left: "22%", top: "62%" },
  { left: "38%", top: "28%" },
  { left: "48%", top: "72%" },
  { left: "60%", top: "22%" },
  { left: "72%", top: "58%" },
  { left: "82%", top: "30%" },
  { left: "90%", top: "68%" },
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
    .replace(/"([^"]+)":/g, '<span class="text-emerald-300">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="text-sky-300">"$1"</span>')
    .replace(
      /: (\d+(\.\d+)?)/g,
      ': <span class="text-amber-200">$1</span>'
    )
    .replace(
      /(PASS|WARN|GENERATED|SHIP)/g,
      '<span class="text-[var(--green)]">$1</span>'
    )
    .replace(/CAUTION/g, '<span class="text-[var(--amber)]">CAUTION</span>')
    .replace(/BLOCKED/g, '<span class="text-[var(--red)]">BLOCKED</span>');
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

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {subtitle ? (
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--green)]">
          {subtitle}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
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

function SwarmGraphic() {
  return (
    <div className="relative mx-auto flex h-48 w-full max-w-xl items-center justify-center">
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.3em] text-white/70">
        Orchestrator
      </div>
      {[...Array(8)].map((_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        const radius = 90;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <div
            key={index}
            className="absolute h-10 w-10 rounded-full border border-white/10 bg-white/5"
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
          />
        );
      })}
    </div>
  );
}

export default function MarketingPage() {
  const scrolled = useScrollTop();
  const gateRef = useRef(null);
  const gateInView = useInView(gateRef, { once: true, margin: "-120px" });
  const highlightedProof = useMemo(() => highlightJson(proofJson), []);

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
    <div className="bg-[var(--bg)] text-white">
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all",
          scrolled ? "backdrop-blur-xl bg-black/40 border-b border-white/10" : ""
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-mono text-lg">
            <span className="text-[var(--green)]">▮</span> wreckit
          </div>
          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#how" className="transition hover:text-white">
              How It Works
            </a>
            <a href="#gates" className="transition hover:text-white">
              Gates
            </a>
            <a href="#modes" className="transition hover:text-white">
              Modes
            </a>
            <a href="#proof" className="transition hover:text-white">
              Proof
            </a>
          </div>
          <Button className="rounded-full bg-[var(--green)] text-black hover:bg-white">
            Get Started
          </Button>
        </div>
      </nav>

      <section className="relative min-h-screen overflow-hidden px-6 pb-24 pt-28">
        <div className="absolute inset-0">
          <div
            className="blob left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(0,255,136,0.45),_transparent_70%)]"
            style={{ animation: "floatSlow 18s ease-in-out infinite" }}
          />
          <div
            className="blob right-[-12%] top-[10%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,_rgba(77,163,255,0.45),_transparent_70%)]"
            style={{ animation: "floatSlowAlt 20s ease-in-out infinite" }}
          />
          <div
            className="blob bottom-[-20%] left-[20%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_rgba(255,51,102,0.35),_transparent_70%)]"
            style={{ animation: "floatSlow 22s ease-in-out infinite" }}
          />
        </div>
        {particlePositions.map((pos, index) => (
          <span
            key={index}
            className="absolute h-1.5 w-1.5 rounded-full bg-white/30"
            style={{
              left: pos.left,
              top: pos.top,
              animation: `particleDrift ${6 + index}s ease-in-out infinite`,
            }}
          />
        ))}

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
              AI code verification
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              AI code verification that AI can&apos;t fake.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              Build it. Break it. Prove it works. wreckit is the AI agent skill that
              enforces real verification gates, signed proof bundles, and ruthless
              adversarial checks before you ship.
            </p>
            <div className="mt-6 max-w-xl rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70">
              <span className="text-white/80">Philosophy:</span> AI cannot verify
              itself. Structure the pipeline so it cannot silently agree with
              itself.
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button className="rounded-full bg-[var(--green)] px-6 py-6 text-base text-black hover:bg-white">
                Start Verification
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-white/20 px-6 py-6 text-base text-white hover:border-white/60 hover:bg-white/10"
              >
                View Proof Bundle
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--green)]" />
                Language agnostic
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[var(--green)]" />
                Evidence-first pipeline
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[var(--green)]" />
                Swarm architecture
              </div>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center justify-center"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Terminal />
          </motion.div>
        </div>
      </section>

      <section className="relative bg-black/40 px-6 py-24" id="problem">
        <SectionHeader
          title="AI writes confident, broken code. And AI reviews agree with it."
          subtitle="The problem"
        />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {painPoints.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.1}
              className="glass rounded-2xl border border-red-500/30 bg-red-500/10 p-6"
            >
              <item.icon className="h-6 w-6 text-[var(--red)]" />
              <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-white/70">{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative px-6 py-24" id="how">
        <SectionHeader title="Three steps. Zero excuses." subtitle="How it works" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.1} className="glass rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                      0{index + 1}
                    </div>
                    {index < steps.length - 1 ? (
                      <motion.span
                        className="mt-2 h-10 w-px bg-white/20"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      />
                    ) : null}
                    {index < steps.length - 1 ? (
                      <ArrowDown className="mt-2 h-4 w-4 text-[var(--green)]" />
                    ) : null}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm text-white/70">{step.copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white">Swarm Architecture</h3>
            <p className="mt-2 text-sm text-white/70">
              The orchestrator spins up specialized agents for each gate. Builders and
              breakers work in parallel, then aggregate evidence into a signed bundle.
            </p>
            <SwarmGraphic />
          </Reveal>
        </div>
      </section>

      <section className="relative bg-black/30 px-6 py-24" id="gates">
        <SectionHeader title="Eleven gates. One verdict." subtitle="Verification" />
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
              className="glass group rounded-2xl p-5 transition hover:-translate-y-1 hover:border-[var(--green)]/60 hover:shadow-[0_0_24px_rgba(0,255,136,0.25)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <gate.icon className="h-5 w-5 text-white/70" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{gate.name}</h3>
              <p className="mt-2 text-sm text-white/60">{gate.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative px-6 py-24" id="modes">
        <SectionHeader title="One tool. Every situation." subtitle="Modes" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {modes.map((mode, index) => (
            <Reveal
              key={mode.name}
              delay={index * 0.1}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div
                className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                style={{
                  boxShadow: `0 0 30px ${mode.color}`,
                }}
              />
              <div className="relative">
                <div className="text-2xl">{mode.emoji}</div>
                <h3 className="mt-4 text-xl font-semibold text-white">{mode.name}</h3>
                <p className="mt-2 text-sm text-white/60">{mode.trigger}</p>
                <p className="mt-4 text-sm text-white/70">{mode.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative bg-black/40 px-6 py-24" id="proof">
        <SectionHeader title="Every run produces a receipt." subtitle="Proof bundle" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Proof you can audit.</h3>
            <p className="text-sm text-white/70">
              wreckit outputs a signed proof bundle in `.wreckit/` that captures every
              gate, every artifact, and every verdict decision. It&apos;s the receipt your
              CI and security teams can trust.
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              <li>Gate-by-gate evidence trail</li>
              <li>Signed verdict with score and thresholds</li>
              <li>Reproducible run metadata</li>
            </ul>
          </Reveal>
          <Reveal className="glass rounded-2xl border border-white/10 bg-black/60 p-6 font-mono text-xs text-white/80">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs text-white/60">.wreckit/proof.json</div>
              <Badge className="bg-[var(--green)] text-black">SHIP</Badge>
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
            <Reveal
              key={verdict.name}
              delay={index * 0.1}
              className="glass rounded-2xl p-6"
            >
              <div
                className="rounded-2xl border border-white/10 bg-black/40 p-5 text-center animate-[pulseVerdict_3.4s_ease-in-out_infinite]"
                style={
                  {
                    boxShadow: `0 0 20px ${verdict.color}`,
                    "--glow": verdict.color,
                  } as CSSProperties
                }
              >
                <div className="text-3xl">{verdict.emoji}</div>
                <h3 className="mt-3 text-xl font-semibold text-white">{verdict.name}</h3>
                <p className="mt-2 text-sm text-white/70">{verdict.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="relative bg-black/60 px-6 py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <p className="text-4xl font-semibold text-white">Stop shipping vibes.</p>
          <p className="mt-2 text-lg text-white/70">Start shipping proof.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              className="rounded-full bg-white text-black hover:bg-[var(--green)]"
              asChild
            >
              <a href="https://github.com/christiancattaneo/wreckit" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/30 text-white hover:border-white/70 hover:bg-white/10"
              asChild
            >
              <a href="https://clawhub.com" target="_blank" rel="noreferrer">
                ClawHub
              </a>
            </Button>
          </div>
          <p className="mt-10 text-xs uppercase tracking-[0.3em] text-white/40">
            wreckit — AI code verification
          </p>
        </div>
      </footer>
    </div>
  );
}
