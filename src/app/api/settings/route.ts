import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let config = await prisma.systemConfig.findUnique({
      where: { id: 'default' },
      select: {
        maintenanceMode: true,
        maxImageSize: true,
        publicGalleryEnabled: true,
        allowSignups: true,
        defaultCredits: true,
      }
    });

    if (!config) {
      config = await prisma.systemConfig.create({
        data: { id: 'default' },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Failed to get system config:', error);
    return NextResponse.json(
      { maintenanceMode: false, maxImageSize: 5 },
      { status: 500 }
    );
  }
}
