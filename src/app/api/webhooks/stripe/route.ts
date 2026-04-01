import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    switch (body.type) {
      case "checkout.session.completed":
        console.log("wreckit subscription:", body.data?.object?.customer_email);
        break;
      case "customer.subscription.deleted":
        console.log("wreckit cancelled:", body.data?.object?.id);
        break;
      case "invoice.payment_failed":
        console.log("wreckit payment failed:", body.data?.object?.customer_email);
        break;
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
