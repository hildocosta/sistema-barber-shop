"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Scissors, Calendar, Crown, Menu, X, UserPlus, LogIn, LogOut } from "lucide-react";

// Funções para ler e subscrever ao localStorage (login tradicional)
function subscribe(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return localStorage.getItem("barber_user");
}

function getServerSnapshot() {
  return null;
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Sessão do Google (NextAuth)
  const { data: session } = useSession();

  // Sessão manual via localStorage
  const rawUser = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  let localUser = null;
  if (rawUser) {
    try {
      localUser = JSON.parse(rawUser);
    } catch {
      localUser = null;
    }
  }

  // Unifica os dados do usuário (prioriza o NextAuth/Google)
  const currentUser = session?.user
    ? {
        name: session.user.name || session.user.email?.split("@")[0],
        email: session.user.email,
        image: session.user.image,
        phone: session.user.phone || session.user.telefone || null,
        isVip: session.user.isVip || false,
      }
    : localUser;

  const handleLogout = async () => {
    localStorage.removeItem("barber_user");
    window.dispatchEvent(new Event("storage"));
    setIsOpen(false);
    
    // Se estiver logado via NextAuth/Google, executa o logout do NextAuth
    if (session) {
      await signOut({ callbackUrl: "/" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Scissors className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-zinc-100 tracking-wider uppercase">
            Barber<span className="text-amber-500">Shop</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link href="/" className="hover:text-amber-500 transition-colors">
            Início
          </Link>
          <Link href="/appointments/new" className="hover:text-amber-500 transition-colors">
            Agendar
          </Link>
          <Link href="/appointments" className="hover:text-amber-500 transition-colors">
            Meus Agendamentos
          </Link>
          <Link href="/plans" className="flex items-center gap-1.5 text-amber-500 hover:text-amber-400 transition-colors">
            <Crown className="w-4 h-4" /> Clube VIP
          </Link>
        </nav>

        {/* Desktop Auth / Perfil */}
        <div className="hidden md:flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-sm">
              <div className="flex items-center gap-2">
                {currentUser.image ? (
                  <img
                    src={currentUser.image}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-amber-500/40"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                    {currentUser.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-zinc-200">{currentUser.name}</span>
                {currentUser.isVip && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">VIP</span>
                )}
              </div>
              <button 
                onClick={handleLogout}
                title="Sair da conta"
                className="text-zinc-500 hover:text-red-400 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 px-3 py-2 rounded-xl text-sm transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-zinc-200 px-3.5 py-2 rounded-xl text-sm transition-all"
              >
                <UserPlus className="w-4 h-4 text-amber-500" />
                <span>Cadastro</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-100"
          aria-label="Abrir Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-6 py-4 space-y-3 shadow-2xl">
          {/* Card do Usuário (se logado) */}
          {currentUser && (
            <div className="pb-3 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {currentUser.image ? (
                  <img
                    src={currentUser.image}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                    {currentUser.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-zinc-200">{currentUser.name}</p>
                  <p className="text-xs text-zinc-500">{currentUser.phone || currentUser.email}</p>
                </div>
              </div>
              {currentUser.isVip && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">VIP</span>
              )}
            </div>
          )}

          <Link 
            href="/" 
            onClick={() => setIsOpen(false)} 
            className="flex items-center gap-3 text-zinc-300 hover:text-amber-500 py-2 text-sm font-medium"
          >
            <Scissors className="w-4 h-4 text-amber-500" /> Início
          </Link>

          <Link 
            href="/appointments/new" 
            onClick={() => setIsOpen(false)} 
            className="flex items-center gap-3 text-zinc-300 hover:text-amber-500 py-2 text-sm font-medium"
          >
            <Calendar className="w-4 h-4 text-amber-500" /> Novo Agendamento
          </Link>

          <Link 
            href="/appointments" 
            onClick={() => setIsOpen(false)} 
            className="flex items-center gap-3 text-zinc-300 hover:text-amber-500 py-2 text-sm font-medium"
          >
            <Calendar className="w-4 h-4 text-zinc-500" /> Meus Agendamentos
          </Link>

          <Link 
            href="/plans" 
            onClick={() => setIsOpen(false)} 
            className="flex items-center gap-3 text-amber-400 font-semibold py-2 text-sm"
          >
            <Crown className="w-4 h-4" /> Clube VIP & Planos
          </Link>

          {/* Botões de Acesso (Login / Cadastro / Sair) */}
          <div className="pt-3 border-t border-zinc-900 space-y-2">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between text-left text-sm text-red-400 hover:text-red-300 py-2"
              >
                <span>Sair da conta</span>
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 py-2.5 rounded-xl hover:text-amber-400 transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Entrar
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 py-2.5 rounded-xl hover:bg-amber-500/20 transition-colors"
                >
                  <UserPlus className="w-4 h-4" /> Cadastro
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}