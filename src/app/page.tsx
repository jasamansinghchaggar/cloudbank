import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-semibold text-slate-900">CloudBank</h1>
        <p className="mt-3 text-slate-500">
          A secure, highly available banking portal running on AWS.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-md bg-slate-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-slate-800 transition-colors"
          >
            Customer login
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-slate-300 text-slate-900 text-sm font-medium px-5 py-2.5 hover:bg-slate-100 transition-colors"
          >
            Open an account
          </Link>
        </div>
        <p className="mt-6 text-xs text-slate-400">
          <Link href="/admin/login" className="hover:underline">
            Admin login
          </Link>
        </p>
      </div>
    </main>
  );
}
