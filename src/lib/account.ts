import { randomInt } from "crypto";
import { prisma } from "@/lib/db";

const DEFAULT_STARTING_BALANCE = 1000;

export async function generateAccountNumber(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const digits = Array.from({ length: 10 }, () => randomInt(0, 10)).join("");
    const accountNumber = `CB${digits}`;
    const existing = await prisma.customer.findUnique({
      where: { accountNumber },
      select: { id: true },
    });
    if (!existing) return accountNumber;
  }
  throw new Error("Failed to generate a unique account number");
}

export { DEFAULT_STARTING_BALANCE };
