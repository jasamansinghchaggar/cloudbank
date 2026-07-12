import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accountNumber = session.accountNumber as string;

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [{ senderAccount: accountNumber }, { receiverAccount: accountNumber }],
    },
    orderBy: { timestamp: "desc" },
    take: 100,
  });

  return NextResponse.json(
    transactions.map((t) => ({
      id: t.id,
      senderAccount: t.senderAccount,
      receiverAccount: t.receiverAccount,
      amount: t.amount.toString(),
      status: t.status,
      timestamp: t.timestamp,
      direction: t.senderAccount === accountNumber ? "sent" : "received",
    })),
  );
}
