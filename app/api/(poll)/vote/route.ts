import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimiter";
import { hashValue } from "@/lib/hash";

const VoteSchema = z.object({
  constituency: z.string().min(2).max(100),
  district:     z.string().min(2).max(100),
  party:        z.enum(["UDF", "LDF", "NDA", "IND"]),
  fingerprint:  z.string().min(8).max(200),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = VoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { constituency, district, party, fingerprint } = result.data;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

    const ipHash          = hashValue(ip);
    const fingerprintHash = hashValue(fingerprint);

    // Rate limit: 1 vote per IP across ALL constituencies per 24h
    const limited = await checkRateLimit(`vote:${ipHash}`, {
      maxRequests: 1,
      windowSeconds: 86400,
    });

    if (limited) {
      return NextResponse.json(
        { error: "Only one vote allowed from this network today." },
        { status: 429 }
      );
    }

    await prisma.vote.create({
      data: { constituency, district, party, fingerprintHash, ipHash },
    });

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "This device has already cast a vote." },
        { status: 409 }
      );
    }
    console.error("[POST /api/vote]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const constituency = searchParams.get("constituency");
  const fingerprint  = searchParams.get("fingerprint");

  if (!constituency || !fingerprint) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const fingerprintHash = hashValue(fingerprint);

  const existing = await prisma.vote.findUnique({
    where: { fingerprintHash },
    select: { party: true, createdAt: true, constituency: true },
  });

  return NextResponse.json({
    voted:   !!existing,
    party:   existing?.party   ?? null,
    votedAt: existing?.createdAt ?? null,
  });
}