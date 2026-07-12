import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session-server";
import { prisma } from "@/lib/db";
import { NavBar } from "@/components/NavBar";
import { TransferForm } from "@/components/TransferForm";

export const dynamic = "force-dynamic";

export default async function TransferPage() {
  const session = await getServerSession();
  if (!session || session.role !== "customer") redirect("/login");

  const customer = await prisma.customer.findUnique({
    where: { id: Number(session.sub) },
  });
  if (!customer || customer.isBlocked) redirect("/login");

  return (
    <>
      <NavBar name={customer.name} />
      <main className="flex-1 bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">
            Transfer money
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Balance: $
            {Number(customer.balance).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
            <TransferForm accountNumber={customer.accountNumber} />
          </div>
        </div>
      </main>
    </>
  );
}
