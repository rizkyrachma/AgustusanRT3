"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Tags,
  Users,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pemasukan", href: "/admin/pemasukan", icon: ArrowDownCircle },
  { name: "Pengeluaran", href: "/admin/pengeluaran", icon: ArrowUpCircle },
  { name: "Kategori", href: "/admin/kategori", icon: Tags },
  { name: "Panitia", href: "/admin/panitia", icon: Users },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#B91C1C] text-white border-b-[3px] border-[#FFD700] p-4 flex justify-between items-center">
        <span className="font-playfair font-bold text-[17px]">Kas Agustusan RT3</span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-black/10 rounded-md text-[#FFD700]"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-[220px] bg-white flex-shrink-0 z-20 md:min-h-screen border-r border-[#E5E7EB] flex flex-col`}
      >
        <div className="hidden md:flex h-[60px] items-center px-[1.25rem] bg-[#B91C1C] border-b-[3px] border-[#FFD700]">
          <h2 className="font-playfair font-bold text-[17px] text-white leading-tight">
            Kas Agustusan RT3
          </h2>
        </div>

        <nav className="flex-grow py-4">
          <ul className="space-y-0.5">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-[10px] py-[10px] px-[1.25rem] transition-colors ${
                      isActive
                        ? "bg-[#FEF2F2] text-[#B91C1C] border-l-[3px] border-l-[#B91C1C] font-medium"
                        : "text-[#374151] hover:bg-[#F3F4F6] font-normal border-l-[3px] border-l-transparent"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-[#B91C1C]" : "text-[#374151]"} />
                    <span className="text-[13px]">{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[#E5E7EB]">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-[10px] w-full text-left py-[10px] px-[1.25rem] text-[13px] text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
          <div className="pb-4">
            <Link
               href="/"
               className="block text-center text-[11px] text-[#4B5563] hover:text-[#374151] mt-2"
            >
               Kembali ke Beranda
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
