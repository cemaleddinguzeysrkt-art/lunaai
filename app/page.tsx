import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="z-10 max-w-2xl px-6 text-center">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo-simple.svg"
            alt="Luna logo"
            width={100}
            height={28}
            priority
          />
        </div>

        <h1 className="text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
          Welcome to Luna AI
        </h1>
        <p className="text-xl text-neutral-500 mb-10 leading-relaxed">
          The next-generation AI news platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/trainings"
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition-all"
          >
            Go to Trainings
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
