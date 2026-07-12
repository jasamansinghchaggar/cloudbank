import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    orderBy: { timestamp: "desc" },
    take: 200,
  });

  return NextResponse.json(
    transactions.map((t) => ({ ...t, amount: t.amount.toString() })),
  );
}
