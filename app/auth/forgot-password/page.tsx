"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    toast.success("If an account exists, a reset link has been sent.", {
      richColors: true,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fc] p-4">
      <div className="w-full max-w-[440px] bg-white rounded-xl p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-300">

        {/* Logo */}
        <div className="flex items-center justify-center">
          <Image src="/logo-simple.svg" alt="Luna logo" width={34} height={34} priority/>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-2 tracking-tight">
            Forgot Password
          </h1>
          <p className="text-[#64748b] text-[15px]">
            Enter your email and we&apos;ll send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-[#334155] ml-1">Email</label>
            <Input
              type="email"
              required
              placeholder="Enter email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button className="w-full flex items-center gap-2 text-sm cursor-pointer" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>

      </div>
    </div>
  );
}
