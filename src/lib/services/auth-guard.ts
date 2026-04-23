/**
 * Server-side auth guard.
 * Validates the session and returns the userId, or throws an HTTP response.
 */
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export type AuthResult = {
  userId: string;
};

/**
 * Require an authenticated session. Returns the userId.
 * Throws a NextResponse.json 401 if unauthenticated.
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await auth();
  if (!session?.user?.id) {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return { userId: session.user.id };
}

/**
 * Require an admin session. Returns the userId.
 * Throws 401 if not an admin.
 */
export async function requireAdmin(): Promise<AuthResult> {
  const session = await auth();
  if (!session?.user?.email) {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prisma } = await import('@/lib/prisma');
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return { userId: user.id };
}
