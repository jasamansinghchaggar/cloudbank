import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export function AdminNavBar({ username }: { username: string }) {
  return (
    <header className="bg-slate-900 text-white">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
        <Link href="/admin/dashboard" className="font-semibold tracking-tight text-lg">
          CloudBank Admin
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-slate-400">{username}</span>
          <LogoutButton redirectTo="/admin/login" />
        </div>
      </div>
    </header>
  );
}
