import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/services/auth-guard";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { createdAt: "desc" },
          include: {
            image: {
              select: {
                id: true,
                title: true,
                prompt: true,
                imageData: true,
                isPublic: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!collection || collection.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(collection);
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;

    const collection = await prisma.collection.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!collection || collection.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.collection.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }
}
