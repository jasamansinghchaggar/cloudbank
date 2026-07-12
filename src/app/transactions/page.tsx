import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session-server";
import { prisma } from "@/lib/db";
import { NavBar } from "@/components/NavBar";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const session = await getServerSession();
  if (!session || session.role !== "customer") redirect("/login");

  const customer = await prisma.customer.findUnique({
    where: { id: Number(session.sub) },
  });
  if (!customer || customer.isBlocked) redirect("/login");

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { senderAccount: customer.accountNumber },
        { receiverAccount: customer.accountNumber },
      ],
    },
    orderBy: { timestamp: "desc" },
    take: 100,
  });

  return (
    <>
      <NavBar name={customer.name} />
      <main className="flex-1 bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold text-slate-900 mb-6">
            Transaction history
          </h1>

          <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            {transactions.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">
                No transactions yet.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Direction</th>
                    <th className="px-6 py-3 font-medium">Counterparty</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((t) => {
                    const isSent = t.senderAccount === customer.accountNumber;
                    return (
                      <tr key={t.id}>
                        <td className="px-6 py-3 text-slate-500">
                          {t.timestamp.toLocaleString()}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={
                              isSent ? "text-red-600" : "text-emerald-600"
                            }
                          >
                            {isSent ? "Sent" : "Received"}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-mono text-slate-700">
                          {isSent ? t.receiverAccount : t.senderAccount}
                        </td>
                        <td className="px-6 py-3 font-medium text-slate-900">
                          {isSent ? "-" : "+"}$
                          {Number(t.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={
                              t.status === "SUCCESS"
                                ? "text-emerald-600"
                                : t.status === "FAILED"
                                  ? "text-red-600"
                                  : "text-amber-600"
                            }
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
