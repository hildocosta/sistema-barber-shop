"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle2, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const emailTrim = email.trim().toLowerCase();

    if (!emailTrim || !password) {
      setError("Preencha todos os campos para continuar.");
      return;
    }

    try {
      const rawUser = localStorage.getItem("barber_user");

      if (!rawUser) {
        setError("Nenhum usuário cadastrado neste aparelho. Crie uma conta primeiro.");
        return;
      }

      const savedUser = JSON.parse(rawUser);

      // Validação simples de credenciais
      if (savedUser.email && savedUser.email !== emailTrim) {
        setError("E-mail não encontrado. Verifique os dados ou crie uma nova conta.");
        return;
      }

      // Emite evento para sincronizar o Header imediatamente
      window.dispatchEvent(new Event("storage"));
      setSuccess(true);

      setTimeout(() => {
        router.push("/appointments/new");
      }, 1000);
    } catch {
      setError("Ocorreu um erro ao tentar autenticar. Tente novamente.");
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Login realizado!</h2>
        <p className="text-xs text-zinc-400">Acessando seus agendamentos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Topo / Voltar */}
      <div className="flex items-center gap-3">
        <Link 
          href="/" 
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-zinc-100">Acessar Conta</h1>
          <p className="text-xs text-zinc-500">Entre para gerenciar seus horários e cortes</p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleLogin} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl leading-relaxed">
            {error}
          </div>
        )}

        {/* E-mail */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-amber-400" /> E-mail
          </label>
          <input
            type="email"
            required
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Senha */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Senha
            </label>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-4 pr-11 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Botão de Entrar */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-[0.98]"
        >
          <LogIn className="w-4 h-4" /> Entrar
        </button>

        {/* Link para Cadastro */}
        <p className="text-center text-xs text-zinc-500 pt-1">
          Ainda não tem conta?{" "}
          <Link href="/register" className="text-amber-400 hover:underline font-medium">
            Cadastre-se agora
          </Link>
        </p>
      </form>
    </div>
  );
}