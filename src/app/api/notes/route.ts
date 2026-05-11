import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await requireSession();
  const body = await req.json();

  const note = await prisma.note.create({
    data: {
      userId: session.id,
      entityType: body.entityType,
      candidateId: body.candidateId || null,
      matchId: body.matchId || null,
      content: body.content,
    },
  });

  return NextResponse.json(note, { status: 201 });
}
