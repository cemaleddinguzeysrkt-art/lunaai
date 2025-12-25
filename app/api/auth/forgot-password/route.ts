import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email required" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase().trim() },
  });

  // Always return success (prevent email enumeration)
  if (!user) {
    return NextResponse.json({ message: "If account exists, email sent" });
  }

  // Generate token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpiry: expiry,
    },
  });

  const resetUrl = `${process.env.APP_URL}/auth/reset-password?token=${rawToken}`;

  const emailResult = await resend.emails.send({
    from: "Luna AI <luna-ai@resend.dev>",
    to: user.email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p>
        <a href="${resetUrl}">Click here to reset your password</a>
      </p>
      <p>This link expires in 30 minutes.</p>
    `,
  });

  if (!emailResult.error) {
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 400 }
    );
  }

  console.log("emmmmmmm", emailResult);

  return NextResponse.json({ message: "If account exists, email sent" });
}
