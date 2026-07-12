import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      accountNumber: true,
      balance: true,
      isBlocked: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    customers.map((c) => ({ ...c, balance: c.balance.toString() })),
  );
}
