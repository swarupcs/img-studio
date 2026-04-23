import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/services/auth-guard";

export async function GET(request: Request) {
  try {
    const { userId } = await requireAuth();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const cursor = searchParams.get("cursor") ?? undefined;

    const images = await prisma.generatedImage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      select: {
        id: true,
        title: true,
        prompt: true,
        imageData: true,
        isPublic: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ images });
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth();

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const prompt = formData.get("prompt") as string;
    const title = formData.get("title") as string;

    if (!imageFile) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    const config = await prisma.systemConfig.findUnique({
      where: { id: 'default' },
    });
    
    const maxSizeBytes = (config?.maxImageSize ?? 5) * 1024 * 1024;
    if (imageFile.size > maxSizeBytes) {
      return NextResponse.json(
        { error: `Image exceeds maximum upload size of ${config?.maxImageSize ?? 5}MB` },
        { status: 413 }
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = imageFile.type || 'image/png';
    const imageData = `data:${mimeType};base64,${base64String}`;

    const image = await prisma.generatedImage.create({
      data: {
        userId,
        imageData,
        prompt: prompt || null,
        title: title || (prompt ? prompt.slice(0, 80) : "Generated Image"),
      },
      select: { id: true, title: true, createdAt: true },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }
}
