"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });

    setLoading(false);
    if (!res.ok) return toast.error("Reset link invalid or expired", { richColors: true });

    toast.success("Password reset successfully", { richColors: true });
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fc] p-4">
      <div className="w-full max-w-[440px] bg-white rounded-xl p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-300">

        {/* Logo */}
        <div className="flex items-center justify-center">
          <Image src="/logo-simple.svg" alt="Luna logo" width={34} height={34}/>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-2 tracking-tight">
            Reset Password
          </h1>
          <p className="text-[#64748b] text-[15px]">
            Enter your new password below.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleReset}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-[#334155] ml-1">New Password</label>

            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                required
                placeholder="Enter new password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute cursor-pointer inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <Button className="w-full flex items-center gap-2 text-sm cursor-pointer" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            Reset Password
          </Button>
        </form>

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin size-5 text-gray-400" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}