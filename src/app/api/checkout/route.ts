import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const VALID_PRICES = new Set([
  "price_1TEChLIaJvtinaIgogMJvEL6", // Starter $19/mo
  "price_1TEChLIaJvtinaIgM7AslHTA", // Pro $49/mo
  "price_1TEChLIaJvtinaIg8SpCJ1mg", // Team $99/mo
]);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: NextRequest) {
  const { priceId } = await req.json();

  if (!priceId || typeof priceId !== "string" || !/^price_[A-Za-z0-9]+$/.test(priceId)) {
    return NextResponse.json({ error: "priceId is required" }, { status: 400 });
  }

  if (!VALID_PRICES.has(priceId)) {
    return NextResponse.json({ error: "Invalid price for this product" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "https://wreckit-ralph.vercel.app";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
