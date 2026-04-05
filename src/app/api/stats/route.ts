import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user, totalImages, publicImages] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true, createdAt: true },
    }),
    prisma.generatedImage.count({ where: { userId: session.user.id } }),
    prisma.generatedImage.count({ where: { userId: session.user.id, isPublic: true } }),
  ]);

  return NextResponse.json({
    totalImages,
    publicImages,
    creditsRemaining: user?.credits ?? 0,
  });
}
