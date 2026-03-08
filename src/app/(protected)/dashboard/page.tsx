"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Wand2,
  Palette,
  Sparkles,
  LogOut,
  ArrowRight,
  User,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-dvh bg-zinc-950">
      {/* Background pattern */}
      <div className="fixed inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #a855f7 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-transparent to-transparent" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 h-14 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-lg">
          <div className="relative h-9 w-9 overflow-hidden rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-violet-600/10 border border-purple-500/20">
            <Image
              src="/logo.png"
              alt="ImgGen Logo"
              fill
              className="object-cover p-0.5"
              priority
            />
          </div>
          <span className="text-zinc-100 tracking-tight text-base">
            Img
            <span className="text-purple-400">Gen</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
            <User size={14} className="text-zinc-400" />
            <span className="text-sm text-zinc-300 hidden sm:block">
              {session?.user?.name || session?.user?.email}
            </span>
          </div>
          <Button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            variant="ghost"
            size="sm"
            className="h-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 px-2.5"
          >
            <LogOut size={14} className="mr-1.5" />
            <span className="hidden sm:inline text-xs">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* Welcome */}
        <div className="space-y-2 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
            Welcome back
            {session?.user?.name ? `, ${session.user.name}` : ""}
          </h1>
          <p className="text-zinc-500 text-lg">
            What would you like to create today?
          </p>
        </div>

        {/* Quick Start */}
        <div className="mb-12">
          <Link href="/editor">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-500/20 p-8 md:p-10 hover:border-purple-500/40 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-zinc-100">
                    Open Editor
                  </h2>
                  <p className="text-zinc-400 max-w-md">
                    Jump into the AI-powered image editor. Upload an image and
                    start transforming it with powerful tools.
                  </p>
                  <div className="flex items-center gap-2 text-purple-400 font-medium text-sm">
                    Launch Editor
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/20 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/logo.png"
                      width={96}
                      height={96}
                      alt="Editor"
                      className="object-cover p-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
            Available Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Wand2,
                title: "Inpainting",
                description:
                  "Select areas and describe changes. Remove objects, add elements, or transform regions.",
              },
              {
                icon: Palette,
                title: "AI Filters",
                description:
                  "Apply artistic styles like Ghibli, Cyberpunk, Oil Painting, and more.",
              },
              {
                icon: Sparkles,
                title: "Image Expansion",
                description:
                  "Expand your images to different aspect ratios with AI-generated content.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <feature.icon size={18} className="text-purple-400" />
                </div>
                <h4 className="font-semibold text-zinc-200">
                  {feature.title}
                </h4>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
