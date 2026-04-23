import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/services/auth-guard";

export async function GET() {
  try {
    const { userId } = await requireAuth();

    const collections = await prisma.collection.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            image: { select: { imageData: true } },
          },
        },
        _count: { select: { images: true } },
      },
    });

    return NextResponse.json({ collections });
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth();

    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: { userId, name: name.trim() },
      select: { id: true, name: true, createdAt: true },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }
}
