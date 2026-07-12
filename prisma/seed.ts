import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      role: "SUPERADMIN",
    },
  });

  const customerPassword = await bcrypt.hash("password123", 10);
  const alice = await prisma.customer.upsert({
    where: { email: "alice@cloudbank.test" },
    update: {},
    create: {
      name: "Alice Nguyen",
      email: "alice@cloudbank.test",
      password: customerPassword,
      accountNumber: "CB0000000001",
      balance: 2500,
    },
  });

  const bob = await prisma.customer.upsert({
    where: { email: "bob@cloudbank.test" },
    update: {},
    create: {
      name: "Bob Martinez",
      email: "bob@cloudbank.test",
      password: customerPassword,
      accountNumber: "CB0000000002",
      balance: 1000,
    },
  });

  const existingSeedTransfer = await prisma.transaction.findFirst({
    where: {
      senderAccount: alice.accountNumber,
      receiverAccount: bob.accountNumber,
    },
  });
  if (!existingSeedTransfer) {
    const seedAmount = 150;
    await prisma.$transaction([
      prisma.customer.update({
        where: { accountNumber: alice.accountNumber },
        data: { balance: { decrement: seedAmount } },
      }),
      prisma.customer.update({
        where: { accountNumber: bob.accountNumber },
        data: { balance: { increment: seedAmount } },
      }),
      prisma.transaction.create({
        data: {
          reference: `SEED-${alice.accountNumber}-${bob.accountNumber}`,
          senderAccount: alice.accountNumber,
          receiverAccount: bob.accountNumber,
          amount: seedAmount,
          status: "SUCCESS",
        },
      }),
    ]);
  }

  console.log("Seed complete:");
  console.log("  Admin      -> username: admin / password: admin123");
  console.log(
    "  Customer 1 -> email: alice@cloudbank.test / password: password123",
  );
  console.log(
    "  Customer 2 -> email: bob@cloudbank.test / password: password123",
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
