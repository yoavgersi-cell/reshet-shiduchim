import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireSession();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const sector = searchParams.get("sector") || "";

  const candidates = await prisma.candidate.findMany({
    where: {
      userId: session.id,
      ...(q && {
        OR: [
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
        ],
      }),
      ...(sector && { sector: sector as never }),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(candidates);
}

export async function POST(req: NextRequest) {
  const session = await requireSession();
  const body = await req.json();

  const candidate = await prisma.candidate.create({
    data: {
      userId: session.id,
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender,
      age: Number(body.age),
      height: body.height ? Number(body.height) : null,
      city: body.city || null,
      sector: body.sector,
      ethnicity: body.ethnicity || null,
      maritalStatus: body.maritalStatus || "SINGLE",
      fatherName: body.fatherName || null,
      phone: body.phone || null,
      yeshivaOrSeminar: body.yeshivaOrSeminar || null,
      learningStatus: body.learningStatus || null,
      kashrut: body.kashrut || null,
      headCovering: body.headCovering || null,
      smoking: body.smoking,
      parentalSupport: body.parentalSupport || null,
      background: body.background || null,
      lookingFor: body.lookingFor || null,
      privateNotes: body.privateNotes || null,
      photoUrl: body.photoUrl || null,
    },
  });

  return NextResponse.json(candidate, { status: 201 });
}
