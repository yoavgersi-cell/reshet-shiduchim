import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  const { id } = await params;

  const match = await prisma.match.findFirst({
    where: { id, userId: session.id },
    include: {
      candidate1: true,
      candidate2: true,
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!match) return NextResponse.json({ error: "לא נמצא" }, { status: 404 });
  return NextResponse.json(match);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  const { id } = await params;
  const body = await req.json();

  const match = await prisma.match.updateMany({
    where: { id, userId: session.id },
    data: { status: body.status },
  });

  if (match.count === 0) return NextResponse.json({ error: "לא נמצא" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  const { id } = await params;

  await prisma.match.deleteMany({ where: { id, userId: session.id } });
  return NextResponse.json({ ok: true });
}
