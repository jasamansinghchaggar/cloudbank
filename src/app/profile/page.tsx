import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session-server";
import { prisma } from "@/lib/db";
import { NavBar } from "@/components/NavBar";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session || session.role !== "customer") redirect("/login");

  const customer = await prisma.customer.findUnique({
    where: { id: Number(session.sub) },
  });
  if (!customer || customer.isBlocked) redirect("/login");

  const fields = [
    { label: "Full name", value: customer.name },
    { label: "Email", value: customer.email },
    { label: "Account number", value: customer.accountNumber, mono: true },
    {
      label: "Balance",
      value: `$${Number(customer.balance).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    },
    { label: "Member since", value: customer.createdAt.toLocaleDateString() },
  ];

  return (
    <>
      <NavBar name={customer.name} />
      <main className="flex-1 bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-semibold text-slate-900 mb-6">
            Your profile
          </h1>
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm divide-y divide-slate-100">
            {fields.map((f) => (
              <div key={f.label} className="flex justify-between px-6 py-4">
                <span className="text-sm text-slate-500">{f.label}</span>
                <span
                  className={`text-sm font-medium text-slate-900 ${f.mono ? "font-mono" : ""}`}
                >
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
