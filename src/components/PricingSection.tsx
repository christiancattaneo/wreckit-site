"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "$19",
    period: "/mo",
    priceId: "price_1TEChLIaJvtinaIgogMJvEL6",
    description: "For solo developers building with AI",
    features: [
      "100 audits / month",
      "Basic gates (Type, SAST, Slop Scan)",
      "Proof bundles (.wreckit/)",
      "Email support",
    ],
    highlighted: false,
    badge: null,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    priceId: "price_1TEChLIaJvtinaIgM7AslHTA",
    description: "For teams shipping AI code at speed",
    features: [
      "500 audits / month",
      "All 14 verification gates",
      "Priority support",
      "CI integration",
      "Proof bundles (.wreckit/)",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Team",
    price: "$99",
    period: "/mo",
    priceId: "price_1TEChLIaJvtinaIg8SpCJ1mg",
    description: "For organizations with custom needs",
    features: [
      "Unlimited audits",
      "All 14 verification gates",
      "Dedicated support",
      "Custom gates",
      "Proof bundles (.wreckit/)",
      "SLA guarantee",
    ],
    highlighted: false,
    badge: null,
  },
];

function PricingCard({
  plan,
  index,
}: {
  plan: (typeof plans)[0];
  index: number;
}) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative flex flex-col rounded-2xl border p-8 ${
        plan.highlighted
          ? "border-[var(--purple)] bg-[rgba(124,58,237,0.06)] shadow-[0_8px_32px_rgba(124,58,237,0.18)]"
          : "border-[rgba(124,58,237,0.12)] bg-[var(--bg-secondary)]"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-[var(--grad-primary)] px-4 py-1 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]">
            {plan.badge}
          </span>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--purple)]">
          {plan.name}
        </p>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="font-display text-4xl font-semibold text-[var(--text)]">
            {plan.price}
          </span>
          <span className="text-sm text-[var(--text-muted)]">{plan.period}</span>
        </div>
        <p className="mt-2 text-sm text-[var(--text-muted)]">{plan.description}</p>
      </div>

      <ul className="mt-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--purple)]" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        onClick={handleCheckout}
        disabled={loading}
        className={`mt-8 w-full rounded-full py-6 text-base font-semibold transition-all ${
          plan.highlighted
            ? "bg-[var(--grad-primary)] text-white shadow-[0_8px_20px_rgba(124,58,237,0.25)] hover:opacity-90"
            : "border border-[rgba(124,58,237,0.25)] bg-transparent text-[var(--text-muted)] hover:border-[rgba(124,58,237,0.45)] hover:bg-[rgba(124,58,237,0.06)] hover:text-[var(--text)]"
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Redirecting…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" />
            Get started
          </span>
        )}
      </Button>
    </motion.div>
  );
}

export default function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="relative px-6 py-24" id="pricing" ref={ref}>
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--purple)]">
            Pricing
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--text)] sm:text-4xl">
            Ship with proof, not vibes.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--text-muted)]">
            Every plan includes tamper-evident proof bundles. Cancel anytime.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
