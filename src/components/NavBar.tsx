import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transfer", label: "Transfer" },
  { href: "/transactions", label: "Transactions" },
  { href: "/profile", label: "Profile" },
];

export function NavBar({ name }: { name: string }) {
  return (
    <header className="bg-slate-900 text-white">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-semibold tracking-tight text-lg">
            CloudBank
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-slate-400">{name}</span>
          <LogoutButton redirectTo="/login" />
        </div>
      </div>
    </header>
  );
}
