"use client";

import { useState } from "react";
import Link from "next/link";
import { Scissors, Calendar, Crown, User, Menu, X } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Scissors className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-zinc-100 tracking-wider uppercase">
            Barber<span className="text-amber-500">Shop</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link href="/" className="hover:text-amber-500 transition-colors">Início</Link>
          <Link href="/appointments" className="hover:text-amber-500 transition-colors">Agendamentos</Link>
          <Link href="/plans" className="flex items-center gap-1.5 text-amber-500 hover:text-amber-400 transition-colors">
            <Crown className="w-4 h-4" /> Clube VIP
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-zinc-200 px-4 py-2 rounded-lg text-sm transition-all"
          >
            <User className="w-4 h-4 text-amber-500" />
            <span>Entrar</span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-100"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-6 py-4 space-y-4">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-zinc-300 hover:text-amber-500 py-2">
            <Scissors className="w-5 h-5 text-amber-500" /> Início
          </Link>
          <Link href="/appointments" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-zinc-300 hover:text-amber-500 py-2">
            <Calendar className="w-5 h-5 text-amber-500" /> Meus Agendamentos
          </Link>
          <Link href="/plans" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-amber-400 font-semibold py-2">
            <Crown className="w-5 h-5" /> Clube VIP & Planos
          </Link>
          <div className="pt-4 border-t border-zinc-900">
            <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100">
              <User className="w-4 h-4" /> Entrar / Cadastro
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}