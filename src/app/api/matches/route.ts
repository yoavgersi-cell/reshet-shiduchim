import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireSession();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";

  const matches = await prisma.match.findMany({
    where: {
      userId: session.id,
      ...(status && { status: status as never }),
    },
    include: {
      candidate1: true,
      candidate2: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(matches);
}

export async function POST(req: NextRequest) {
  const session = await requireSession();
  const body = await req.json();

  const match = await prisma.match.create({
    data: {
      userId: session.id,
      candidate1Id: body.candidate1Id,
      candidate2Id: body.candidate2Id,
      status: "SUGGESTED",
    },
    include: { candidate1: true, candidate2: true },
  });

  return NextResponse.json(match, { status: 201 });
}
