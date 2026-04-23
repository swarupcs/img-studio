import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/services/auth-guard";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await requireAuth();

    const [user, totalImages, publicImages, usageTransactions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      }),
      prisma.generatedImage.count({ where: { userId } }),
      prisma.generatedImage.count({ where: { userId, isPublic: true } }),
      prisma.creditTransaction.aggregate({
        where: { userId, type: 'USAGE' },
        _sum: { amount: true }
      })
    ]);

    const creditsRemaining = user?.credits ?? 0;
    const creditsUsed = Math.abs(usageTransactions._sum.amount || 0);

    return NextResponse.json({
      totalImages,
      publicImages,
      creditsUsed,
      creditsRemaining,
    });
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }
}
