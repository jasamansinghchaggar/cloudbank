"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function TransferForm({ accountNumber }: { accountNumber: string }) {
  const router = useRouter();
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverAccount, amount: Number(amount) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Transfer failed");
        return;
      }
      setSuccess(`Transferred $${amount} to ${receiverAccount}`);
      setReceiverAccount("");
      setAmount("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          From account
        </label>
        <input
          disabled
          value={accountNumber}
          className="w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-mono text-slate-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Receiver account number
        </label>
        <input
          type="text"
          required
          value={receiverAccount}
          onChange={(e) => setReceiverAccount(e.target.value)}
          placeholder="CB..."
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Amount (USD)
        </label>
        <input
          type="number"
          required
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-slate-900 text-white text-sm font-medium py-2.5 hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send transfer"}
      </button>
    </form>
  );
}
