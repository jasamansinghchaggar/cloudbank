"use client";

import { useState } from "react";

interface CustomerRow {
  id: number;
  name: string;
  email: string;
  accountNumber: string;
  balance: string;
  isBlocked: boolean;
}

export function AdminCustomersTable({ initialCustomers }: { initialCustomers: CustomerRow[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [pendingId, setPendingId] = useState<number | null>(null);

  async function toggleBlock(customer: CustomerRow) {
    setPendingId(customer.id);
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !customer.isBlocked }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customer.id ? { ...c, isBlocked: updated.isBlocked } : c,
        ),
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <table className="w-full text-sm">
      <thead className="bg-slate-50 text-left text-slate-500">
        <tr>
          <th className="px-6 py-3 font-medium">Name</th>
          <th className="px-6 py-3 font-medium">Email</th>
          <th className="px-6 py-3 font-medium">Account</th>
          <th className="px-6 py-3 font-medium">Balance</th>
          <th className="px-6 py-3 font-medium">Status</th>
          <th className="px-6 py-3 font-medium" />
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {customers.map((c) => (
          <tr key={c.id}>
            <td className="px-6 py-3 text-slate-900">{c.name}</td>
            <td className="px-6 py-3 text-slate-500">{c.email}</td>
            <td className="px-6 py-3 font-mono text-slate-700">
              {c.accountNumber}
            </td>
            <td className="px-6 py-3 text-slate-900">
              $
              {Number(c.balance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
            <td className="px-6 py-3">
              <span className={c.isBlocked ? "text-red-600" : "text-emerald-600"}>
                {c.isBlocked ? "Blocked" : "Active"}
              </span>
            </td>
            <td className="px-6 py-3 text-right">
              <button
                onClick={() => toggleBlock(c)}
                disabled={pendingId === c.id}
                className="text-xs font-medium rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                {c.isBlocked ? "Unblock" : "Block"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
