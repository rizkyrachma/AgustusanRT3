"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Daftar Lomba", href: "#lomba" },
    { name: "Panitia", href: "#panitia" },
    { name: "Rekap Kas", href: "#rekap" },
  ];

  return (
    <header className="w-full h-[60px] bg-[#B91C1C] border-b-[3px] border-[#FFD700] flex items-center justify-between px-6 md:px-8 sticky top-0 z-50">
      <span className="text-white font-playfair font-bold text-[17px] tracking-wide shrink-0">
        Kas Agustusan RT3
      </span>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            className="text-[13px] text-[#FFD700] font-medium hover:text-yellow-200 hover:scale-110 active:scale-95 transition-all duration-200 inline-block whitespace-nowrap"
          >
            {link.name}
          </Link>
        ))}
        <Link 
          href="/login" 
          className="text-[13px] text-[#FFD700] font-medium hover:text-yellow-200 hover:scale-110 active:scale-95 transition-all duration-200 inline-block whitespace-nowrap"
        >
          Masuk
        </Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button 
        className="md:hidden text-[#FFD700] hover:text-yellow-200 focus:outline-none transition-colors" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown List */}
      <div 
        className={`absolute top-16 left-0 w-full bg-[#B91C1C] border-b border-white/10 flex flex-col shadow-2xl md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[300px] opacity-100 py-2" : "max-h-0 opacity-0 py-0"
        }`}
      >
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            onClick={() => setIsOpen(false)}
            className="px-6 py-3 text-[14px] text-[#FFD700] font-medium hover:bg-black/10 active:bg-black/20 transition-colors border-b border-white/5"
          >
            {link.name}
          </Link>
        ))}
        <Link 
          href="/login" 
          onClick={() => setIsOpen(false)}
          className="px-6 py-3 text-[14px] text-[#FFD700] font-medium hover:bg-black/10 active:bg-black/20 transition-colors"
        >
          Masuk
        </Link>
      </div>
    </header>
  );
}
