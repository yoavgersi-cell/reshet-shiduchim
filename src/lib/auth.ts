import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  return user;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("לא מחובר");
  }
  return session;
}
