import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const constituency = searchParams.get("constituency");

  if (!constituency) {
    return NextResponse.json({ error: "constituency required" }, { status: 400 });
  }

  const counts = await prisma.vote.groupBy({
    by: ["party"],
    where: { constituency },
    _count: { party: true },
  });

  const results: Record<string, number> = { UDF: 0, LDF: 0, NDA: 0, IND: 0 };
  for (const row of counts) {
    results[row.party] = row._count.party;
  }

  const total = Object.values(results).reduce((a, b) => a + b, 0);

  return NextResponse.json(
    { constituency, results, total },
    { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30" } }
  );
}