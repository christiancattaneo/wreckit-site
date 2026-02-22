"use client";

import { useEffect, useRef, useState } from "react";

const lines = [
  "$ wreckit audit ./src",
  "",
  "🔍 Detecting stack... TypeScript / Next.js / Vitest",
  "🚀 Spawning 11 verification workers...",
  "",
  "[1/11] ✅ AI Slop Scan       PASS  (0 artifacts found)",
  "[2/11] ✅ Type Check          PASS  (0 errors)",
  "[3/11] ✅ Ralph Loop          PASS  (breaker failed to exploit)",
  "[4/11] ✅ Test Quality        PASS  (87% coverage)",
  "[5/11] ⚠️  Mutation Kill      WARN  (71% kill rate — threshold: 80%)",
  "[6/11] ✅ Cross-Verify        PASS  (oracle agrees)",
  "[7/11] ✅ SAST               PASS  (no HIGH findings)",
  "[8/11] ✅ Design Review       PASS  (no circular deps)",
  "[9/11] ✅ CI Integration      PASS  (GitHub Actions valid)",
  "[10/11] ✅ Proof Bundle       GENERATED",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "  Verdict: ⚠️  CAUTION",
  "  1 gate below threshold.",
  "  Report: .wreckit/proof-2026-02-22.json",
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
        timeout = setTimeout(type, 16);
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
        }, 1600);
        return;
      }

      timeout = setTimeout(type, line.trim() === "" ? 120 : 50);
    };

    timeout = setTimeout(type, 300);

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
    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/70 shadow-[0_0_40px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-3 text-xs text-white/60">wreckit run</span>
      </div>
      <div
        ref={containerRef}
        className="h-[420px] overflow-y-auto px-4 py-4 font-mono text-xs leading-relaxed text-green-300"
      >
        <pre className="whitespace-pre-wrap">
          {content.split("\n").map((line, index) => {
            let lineClass = "text-green-300";
            if (line.includes("WARN") || line.includes("CAUTION")) {
              lineClass = "text-amber-300";
            }
            if (line.includes("BLOCKED")) {
              lineClass = "text-red-300";
            }
            if (line.includes("Verdict")) {
              lineClass = "text-white";
            }
            return (
              <span key={`${line}-${index}`} className={lineClass}>
                {line}
                {"\n"}
              </span>
            );
          })}
          <span
            className="inline-block h-4 w-2 translate-y-1 bg-green-300"
            style={{ animation: "cursorBlink 1s infinite" }}
          />
        </pre>
      </div>
    </div>
  );
}
