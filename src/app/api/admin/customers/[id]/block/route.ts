import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession(req);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const customerId = Number(id);
  if (!Number.isInteger(customerId)) {
    return NextResponse.json({ error: "Invalid customer id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const isBlocked = Boolean(body?.isBlocked);

  const customer = await prisma.customer.update({
    where: { id: customerId },
    data: { isBlocked },
    select: { id: true, name: true, email: true, isBlocked: true },
  });

  return NextResponse.json(customer);
}
