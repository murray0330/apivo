"use client";

import { Info, MessageSquare, Star, DollarSign, Mail, LogIn } from "lucide-react";

export default function Navbar() {
  const links = [
    { href: "#about", label: "About", icon: Info },
    { href: "#demo", label: "Demo", icon: MessageSquare },
    { href: "#features", label: "Features", icon: Star },
    { href: "#pricing", label: "Pricing", icon: DollarSign },
  ];

  function openWidget() {
    const launcher = document.querySelector<HTMLButtonElement>("#aw-launcher");
    if (launcher) launcher.click();
  }

  return (
    <nav className="fixed top-4 left-1/2 z-50 -translate-x-1/2" aria-label="Main navigation">
      <div className="flex items-center gap-1 rounded-full border border-black/[.08] bg-white/75 px-2 py-1.5 shadow-[0_2px_20px_rgba(0,0,0,.06)] backdrop-blur-xl sm:gap-2 sm:px-3">
        {/* Logo */}
        <a href="#hero" className="mr-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#6366f1] sm:h-8 sm:w-8">
          <img src="/apivo-favicon_white.png" alt="Apivo" className="h-4 w-4 object-contain sm:h-5 sm:w-5" />
        </a>
        <div className="mr-1 h-4 w-px bg-black/[.08]" />

        {/* Nav links */}
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium text-zinc-500 transition-colors hover:bg-black/[.06] hover:text-zinc-900 sm:px-3 sm:py-2 sm:text-xs"
          >
            <l.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{l.label}</span>
          </a>
        ))}

        {/* Contact — opens widget */}
        <button
          type="button"
          onClick={openWidget}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium text-zinc-500 transition-colors hover:bg-black/[.06] hover:text-zinc-900 sm:px-3 sm:py-2 sm:text-xs"
        >
          <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Contact</span>
        </button>

        {/* Divider */}
        <div className="mx-1 h-4 w-px bg-black/[.08]" />

        {/* Login */}
        <a
          href="/login"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[.06] text-[11px] font-medium text-zinc-900 transition-colors hover:bg-black/[.10] sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3.5 sm:py-2 sm:text-xs"
        >
          <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Login</span>
        </a>
      </div>
    </nav>
  );
}
