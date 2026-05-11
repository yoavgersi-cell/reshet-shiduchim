import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  const { id } = await params;

  const candidate = await prisma.candidate.findFirst({
    where: { id, userId: session.id },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      matches1: {
        include: { candidate2: true },
        orderBy: { createdAt: "desc" },
      },
      matches2: {
        include: { candidate1: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!candidate) return NextResponse.json({ error: "לא נמצא" }, { status: 404 });
  return NextResponse.json(candidate);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  const { id } = await params;
  const body = await req.json();

  const candidate = await prisma.candidate.updateMany({
    where: { id, userId: session.id },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender,
      age: Number(body.age),
      sector: body.sector,
      background: body.background || null,
      lookingFor: body.lookingFor || null,
      privateNotes: body.privateNotes || null,
      phone: body.phone || null,
    },
  });

  if (candidate.count === 0) return NextResponse.json({ error: "לא נמצא" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  const { id } = await params;

  await prisma.candidate.deleteMany({ where: { id, userId: session.id } });
  return NextResponse.json({ ok: true });
}
