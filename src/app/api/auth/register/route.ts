import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signSession, SESSION_COOKIE } from "@/lib/auth";
import { generateAccountNumber, DEFAULT_STARTING_BALANCE } from "@/lib/account";
import { registerSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 },
    );
  }

  const [hashedPassword, accountNumber] = await Promise.all([
    hashPassword(password),
    generateAccountNumber(),
  ]);

  const customer = await prisma.customer.create({
    data: {
      name,
      email,
      password: hashedPassword,
      accountNumber,
      balance: DEFAULT_STARTING_BALANCE,
    },
  });

  const token = await signSession({
    sub: String(customer.id),
    role: "customer",
    accountNumber: customer.accountNumber,
  });

  const response = NextResponse.json({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    accountNumber: customer.accountNumber,
  });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
