import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/services/auth-guard";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;

    const image = await prisma.generatedImage.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!image || image.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.generatedImage.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAuth();
    const { id } = await params;
    const { isPublic, title } = await req.json();

    const image = await prisma.generatedImage.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!image || image.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.generatedImage.update({
      where: { id },
      data: {
        ...(isPublic !== undefined ? { isPublic } : {}),
        ...(title !== undefined ? { title } : {}),
      },
      select: { id: true, isPublic: true, title: true },
    });

    return NextResponse.json(updated);
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }
}
