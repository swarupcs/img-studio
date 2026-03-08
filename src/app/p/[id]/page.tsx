import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const image = await prisma.generatedImage.findFirst({
    where: { id, isPublic: true },
    select: { title: true, prompt: true },
  });
  if (!image) return { title: "Image not found — ImgGen" };
  return {
    title: image.title ?? "Shared Image — ImgGen",
    description: image.prompt?.slice(0, 155) ?? "AI-generated image shared on ImgGen",
  };
}

export default async function PublicImagePage({ params }: Props) {
  const { id } = await params;
  const image = await prisma.generatedImage.findFirst({
    where: { id, isPublic: true },
    select: {
      id: true,
      title: true,
      prompt: true,
      imageData: true,
      createdAt: true,
      user: { select: { name: true } },
    },
  });

  if (!image) notFound();

  return (
    <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #a855f7 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-2xl space-y-4">
        {/* Brand */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-zinc-200 transition-colors">
            Img<span className="text-purple-400">Gen</span>
          </Link>
        </div>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-purple-900/20">
          <Image
            src={image.imageData}
            alt={image.title ?? "AI generated image"}
            width={1024}
            height={1024}
            className="w-full h-auto"
            unoptimized
            priority
          />
        </div>

        {/* Info + CTA */}
        <div className="flex items-start justify-between gap-4 px-1">
          <div className="space-y-1 min-w-0">
            {image.title && (
              <h1 className="text-zinc-100 font-semibold truncate">{image.title}</h1>
            )}
            {image.prompt && (
              <p className="text-zinc-500 text-sm line-clamp-2">{image.prompt}</p>
            )}
            <p className="text-zinc-600 text-xs">
              by {image.user?.name ?? "Anonymous"} ·{" "}
              {new Date(image.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <Link
            href="/editor"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Try ImgGen
          </Link>
        </div>
      </div>
    </div>
  );
}
