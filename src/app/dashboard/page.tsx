import os from "os";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/session-server";
import { prisma } from "@/lib/db";
import { NavBar } from "@/components/NavBar";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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
        <div className="mx-auto max-w-5xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome back, {customer.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-slate-500">
              Account {customer.accountNumber}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-900 text-white p-6 shadow-sm">
              <p className="text-sm text-slate-300">Available balance</p>
              <p className="mt-2 text-3xl font-semibold">
                ${Number(customer.balance).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/transfer"
                  className="rounded-md bg-white text-slate-900 text-sm font-medium px-4 py-2 hover:bg-slate-100 transition-colors"
                >
                  Transfer money
                </Link>
                <Link
                  href="/transactions"
                  className="rounded-md border border-slate-600 text-sm font-medium px-4 py-2 hover:bg-slate-800 transition-colors"
                >
                  View transactions
                </Link>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-700">
                Serving instance
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Refresh the page to see this change as the load balancer
                routes your request across EC2 instances.
              </p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Hostname</dt>
                  <dd className="font-mono text-slate-900">{os.hostname()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Process ID</dt>
                  <dd className="font-mono text-slate-900">{process.pid}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Rendered at</dt>
                  <dd className="font-mono text-slate-900">
                    {new Date().toLocaleTimeString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
