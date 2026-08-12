"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, Loader2, AlertCircle } from "lucide-react";
import { registerQuickUser } from "@/app/actions/users";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerQuickUser(formData);

    if (result.success) {
      // Guarda a sessão temporária do usuário cadastrado
      if (typeof window !== "undefined") {
        localStorage.setItem("barber_user", JSON.stringify(result.user));
      }
      // Redireciona diretamente para o fluxo de agendamento
      router.push("/appointments/new");
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Cadastro Rápido</span>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-xl font-black text-zinc-100">Criar Conta</h1>
        <p className="text-xs text-zinc-400">Leva menos de 30 segundos.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Nome</label>
          <div className="relative">
            <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              name="nome"
              required
              placeholder="Seu nome"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">E-mail</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              name="email"
              required
              placeholder="seuemail@exemplo.com"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            WhatsApp <span className="text-zinc-600 text-[10px] normal-case">(opcional)</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="tel"
              name="telefone"
              placeholder="(41) 99999-9999"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-500 font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Criando...</span>
            </>
          ) : (
            "Avançar para Agendamento"
          )}
        </button>
      </form>
    </div>
  );
}