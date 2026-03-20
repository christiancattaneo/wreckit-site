"use client";

import { useEffect, useRef, useState } from "react";

const lines = [
  '$ "Use wreckit to audit ~/Projects/myapp"',
  "",
  "Detecting stack... TypeScript / Next.js / Vitest",
  "Running 14 verification gates...",
  "",
  "[ 1/14] AI Slop Scan       PASS  (0 artifacts found)",
  "[ 2/14] Type Check         PASS  (0 errors)",
  "[ 3/14] Ralph Loop         PASS  (breaker failed to exploit)",
  "[ 4/14] Test Quality       PASS  (87% coverage)",
  "[ 5/14] Mutation Kill      PASS  (94% kill rate)",
  "[ 6/14] Cross-Verify       PASS  (oracle agrees)",
  "[ 7/14] Behavior Capture   PASS  (golden fixtures saved)",
  "[ 8/14] Regression         PASS  (no regressions)",
  "[ 9/14] SAST / Red Team    PASS  (no HIGH findings)",
  "[10/14] Dynamic Analysis   PASS  (no leaks detected)",
  "[11/14] Design Review      PASS  (no circular deps)",
  "[12/14] CI Integration     PASS  (GitHub Actions valid)",
  "[13/14] Performance        PASS  (no regressions)",
  "[14/14] Proof Bundle       GENERATED",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "  Verdict: SHIP ✅",
  "  14 gates passed. 0 warnings.",
  "  Proof: .wreckit/proof.json",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
];

export default function Terminal() {
  const [content, setContent] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let current = "";
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const type = () => {
      if (cancelled) return;
      const line = lines[lineIndex] ?? "";
      if (charIndex < line.length) {
        current += line[charIndex];
        charIndex += 1;
        setContent(current);
        timeout = setTimeout(type, 14);
        return;
      }
      current += "\n";
      setContent(current);
      lineIndex += 1;
      charIndex = 0;

      if (lineIndex >= lines.length) {
        timeout = setTimeout(() => {
          if (cancelled) return;
          lineIndex = 0;
          charIndex = 0;
          current = "";
          setContent("");
          timeout = setTimeout(type, 300);
        }, 2000);
        return;
      }

      timeout = setTimeout(type, line.trim() === "" ? 120 : 40);
    };

    timeout = setTimeout(type, 400);

    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[rgba(139,92,246,0.2)] bg-[#0a0a14] shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-2 border-b border-[rgba(139,92,246,0.12)] bg-[#0d0d18] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-[#6a6a8a]">wreckit — verification pipeline</span>
      </div>
      <div
        ref={containerRef}
        className="h-[440px] overflow-y-auto bg-[#08080e] px-4 py-4 font-mono text-xs leading-relaxed text-[#a8a8c8]"
      >
        <pre className="whitespace-pre-wrap">
          {content.split("\n").map((line, index) => {
            let lineClass = "text-[#a8a8c8]";
            if (line.startsWith("$")) {
              lineClass = "text-[#8b5cf6]";
            }
            if (line.includes("PASS")) {
              lineClass = "text-[#10b981]";
            }
            if (line.includes("WARN") || line.includes("CAUTION")) {
              lineClass = "text-[#f59e0b]";
            }
            if (line.includes("BLOCKED")) {
              lineClass = "text-[#ef4444]";
            }
            if (line.includes("SHIP")) {
              lineClass = "text-[#10b981] font-semibold";
            }
            if (line.includes("Verdict")) {
              lineClass = "text-[#e8e8f0] font-semibold";
            }
            if (line.includes("━━━━━━━━")) {
              lineClass = "text-[#333355]";
            }
            if (line.includes("Proof:")) {
              lineClass = "text-[#6a6a8a]";
            }
            if (line.includes("Detecting") || line.includes("Running")) {
              lineClass = "text-[#6a6a8a]";
            }
            if (line.includes("GENERATED")) {
              lineClass = "text-[#06b6d4]";
            }
            return (
              <span key={`${line}-${index}`} className={lineClass}>
                {line}
                {"\n"}
              </span>
            );
          })}
          <span
            className="inline-block h-4 w-2 translate-y-1 bg-[#8b5cf6]"
            style={{ animation: "cursorBlink 1s infinite" }}
          />
        </pre>
      </div>
    </div>
  );
}
