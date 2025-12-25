import React from "react";
import "./globals.css";
import Layout from "@/components/Layout";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Luna AI",
  description: "A next-generation AI news platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${poppins.variable}`}>
      <head></head>
      <body className="font-sans bg-neutral-50 text-neutral-900 min-h-screen sticky top-0 overflow-y-auto">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
