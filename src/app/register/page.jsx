"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Formatação automática do celular/WhatsApp: (XX) XXXXX-XXXX
  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 11) val = val.slice(0, 11);

    if (val.length > 6) {
      val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
    } else if (val.length > 2) {
      val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
    }
    setPhone(val);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Por favor, digite seu nome completo.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Por favor, digite um e-mail válido.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Por favor, digite um número de WhatsApp válido com DDD.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      isVip: false,
      registeredAt: new Date().toISOString()
    };

    try {
      localStorage.setItem("barber_user", JSON.stringify(userData));
      window.dispatchEvent(new Event("storage"));
      setSuccess(true);
      setTimeout(() => {
        router.push("/appointments/new");
      }, 1200);
    } catch {
      setError("Erro ao salvar seus dados no dispositivo.");
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Cadastro Criado com Sucesso!</h2>
        <p className="text-xs text-zinc-400">Redirecionando para o agendamento...</p>
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
          <h1 className="text-lg font-bold text-zinc-100">Criar Conta</h1>
          <p className="text-xs text-zinc-500">Cadastre-se para agendar seus horários</p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleRegister} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Nome */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" /> Nome Completo
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Carlos Eduardo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

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

        {/* WhatsApp */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-amber-400" /> WhatsApp
          </label>
          <input
            type="tel"
            required
            placeholder="(41) 99999-9999"
            value={phone}
            onChange={handlePhoneChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Senha com visualizador */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" /> Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Mínimo 6 caracteres"
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

        {/* Botão de Envio */}
        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-[0.98]"
        >
          Criar Minha Conta
        </button>

        {/* Link para Login */}
        <p className="text-center text-xs text-zinc-500 pt-1">
          Já possui conta?{" "}
          <Link href="/login" className="text-amber-400 hover:underline font-medium">
            Fazer login
          </Link>
        </p>
      </form>
    </div>
  );
}