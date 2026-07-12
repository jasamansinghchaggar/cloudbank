import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session-server";
import { prisma } from "@/lib/db";
import { AdminNavBar } from "@/components/AdminNavBar";
import { AdminCustomersTable } from "@/components/AdminCustomersTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  if (!session || session.role !== "admin") redirect("/admin/login");

  const [customers, transactions] = await Promise.all([
    prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        accountNumber: true,
        balance: true,
        isBlocked: true,
      },
    }),
    prisma.transaction.findMany({
      orderBy: { timestamp: "desc" },
      take: 50,
    }),
  ]);

  const customerRows = customers.map((c) => ({
    ...c,
    balance: c.balance.toString(),
  }));

  return (
    <>
      <AdminNavBar username={(session.username as string) ?? "Admin"} />
      <main className="flex-1 bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total customers</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {customers.length}
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
              <p className="text-sm text-slate-500">Blocked accounts</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {customers.filter((c) => c.isBlocked).length}
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
              <p className="text-sm text-slate-500">Transactions logged</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {transactions.length}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Customers
            </h2>
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <AdminCustomersTable initialCustomers={customerRows} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Recent transactions
            </h2>
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              {transactions.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">No transactions yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Sender</th>
                      <th className="px-6 py-3 font-medium">Receiver</th>
                      <th className="px-6 py-3 font-medium">Amount</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((t) => (
                      <tr key={t.id}>
                        <td className="px-6 py-3 text-slate-500">
                          {t.timestamp.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 font-mono text-slate-700">
                          {t.senderAccount}
                        </td>
                        <td className="px-6 py-3 font-mono text-slate-700">
                          {t.receiverAccount}
                        </td>
                        <td className="px-6 py-3 text-slate-900">
                          $
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
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
