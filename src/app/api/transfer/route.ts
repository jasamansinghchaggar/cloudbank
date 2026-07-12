import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth";
import { transferSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = transferSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const { receiverAccount, amount } = parsed.data;
  const senderAccount = session.accountNumber as string;

  if (receiverAccount === senderAccount) {
    return NextResponse.json(
      { error: "You cannot transfer money to your own account" },
      { status: 400 },
    );
  }

  const [sender, receiver] = await Promise.all([
    prisma.customer.findUnique({ where: { accountNumber: senderAccount } }),
    prisma.customer.findUnique({ where: { accountNumber: receiverAccount } }),
  ]);

  if (!sender || sender.isBlocked) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!receiver) {
    return NextResponse.json(
      { error: "Receiver account not found" },
      { status: 404 },
    );
  }

  const amountDecimal = new Prisma.Decimal(amount);

  if (sender.balance.lessThan(amountDecimal)) {
    await prisma.transaction.create({
      data: {
        senderAccount,
        receiverAccount,
        amount: amountDecimal,
        status: "FAILED",
      },
    });
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
  }

  const [, , transaction] = await prisma.$transaction([
    prisma.customer.update({
      where: { accountNumber: senderAccount },
      data: { balance: { decrement: amountDecimal } },
    }),
    prisma.customer.update({
      where: { accountNumber: receiverAccount },
      data: { balance: { increment: amountDecimal } },
    }),
    prisma.transaction.create({
      data: {
        senderAccount,
        receiverAccount,
        amount: amountDecimal,
        status: "SUCCESS",
      },
    }),
  ]);

  return NextResponse.json({
    id: transaction.id,
    status: transaction.status,
    amount: transaction.amount.toString(),
    receiverAccount,
    timestamp: transaction.timestamp,
  });
}
