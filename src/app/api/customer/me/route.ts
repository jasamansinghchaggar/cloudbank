import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customer = await prisma.customer.findUnique({
    where: { id: Number(session.sub) },
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

  if (!customer || customer.isBlocked) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ...customer,
    balance: customer.balance.toString(),
  });
}
