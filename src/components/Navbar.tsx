"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const links = [
    { href: "/candidates", label: "מועמדים" },
    { href: "/matches", label: "התאמות" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg text-gray-800">רשת שידוכים</span>
          <div className="flex gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium pb-0.5 ${
                  pathname.startsWith(link.href)
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{userName}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            יציאה
          </button>
        </div>
      </div>
    </nav>
  );
}
