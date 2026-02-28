import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail =
      process.env.NOTIFY_EMAIL || "christiandcattaneo@gmail.com";

    if (resendKey) {
      // Welcome email to subscriber
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Wreckit <noreply@wreckit-ralph.vercel.app>",
          to: [email],
          subject: "You're on the wreckit waitlist 👊",
          html: `<p>Hey! You're on the wreckit waitlist. We'll let you know when it's your turn.</p><p>— The Wreckit team</p>`,
        }),
      });

      // Notification to admin
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Wreckit <noreply@wreckit-ralph.vercel.app>",
          to: [notifyEmail],
          subject: `New waitlist signup: ${email}`,
          html: `<p><strong>${email}</strong> just joined the wreckit waitlist.</p>`,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 400 },
    );
  }
}
