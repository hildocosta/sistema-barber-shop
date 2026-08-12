"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CreditCard, 
  User, 
  Lock, 
  ArrowLeft, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  Crown 
} from "lucide-react";

// Dados simulados do plano, para exibição no resumo
const PLAN_DETAILS = {
  "corte-ilimitado": {
    name: "Plano Corte Ilimitado",
    price: "74,90",
    period: "mês",
    description: "Acesso a cortes ilimitados, agenda prioritária e descontos."
  }
};

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Lê o plano da URL, padrão é 'corte-ilimitado'
  const planId = searchParams.get("plan") || "corte-ilimitado";
  const plan = PLAN_DETAILS[planId];

  // Estados do formulário
  const [fullName, setFullName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  
  // Estados de controle
  const [status, setStatus] = useState("idle"); // idle | processing | success | error

  // Se o plano não for encontrado (segurança básica)
  if (!plan) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-zinc-500">Plano não encontrado.</p>
        <Link href="/plans" className="text-amber-500 hover:underline text-sm">Voltar aos planos</Link>
      </div>
    );
  }

  const handlePayment = (e) => {
    e.preventDefault();
    if (!fullName || !cardNumber || !expiry || !cvc) {
      alert("Por favor, preencha todos os dados do cartão.");
      return;
    }

    setStatus("processing");

    // Simulação da comunicação com o Stripe (2 segundos)
    setTimeout(() => {
      // Aqui integrariamos a chamada real da API
      setStatus("success");
    }, 2500);
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl bg-zinc-900 border border-emerald-500/30 p-10 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-zinc-100">Assinatura Ativada!</h1>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Bem-vindo ao <strong className="text-amber-400">Clube VIP BarberShop</strong>. Seu pagamento foi processado com sucesso e seu plano já está ativo.
          </p>
        </div>
        <Link
          href="/appointments/new"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm transition-all"
        >
          Agendar Meu Primeiro Corte VIP
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* 1. Formulário de Pagamento (Esquerda) */}
      <div className="md:col-span-2 space-y-6 bg-zinc-900/60 border border-zinc-800 p-7 rounded-2xl">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-500" />
          <h1 className="text-xl font-bold text-zinc-100">Pagamento Seguro</h1>
        </div>

        <form onSubmit={handlePayment} className="space-y-5">
          {/* Nome no Cartão */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Nome Completo (como no cartão)
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: JOAO S SILVA"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-zinc-100 uppercase"
            />
          </div>

          {/* Número do Cartão */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Número do Cartão
            </label>
            <input
              type="text"
              required
              maxLength="19" // Para aceitar espaços (simulação básica)
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="0000 0000 0000 0000"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-zinc-100"
            />
          </div>

          {/* Validade e CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Validade (MM/AA)</label>
              <input
                type="text"
                required
                maxLength="5"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/AA"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-zinc-100 text-center"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium flex items-center gap-1.5 justify-center">
                 CVC <Lock className="w-3 h-3 text-zinc-500" />
              </label>
              <input
                type="text"
                required
                maxLength="4"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="123"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-zinc-100 text-center"
              />
            </div>
          </div>

          {/* Botão de Pagamento */}
          <button
            type="submit"
            disabled={status === "processing"}
            className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {status === "processing" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processando...
              </>
            ) : (
              `Confirmar Assinatura (R$ ${plan.price})`
            )}
          </button>
        </form>
      </div>

      {/* 2. Resumo do Pedido (Direita) */}
      <div className="space-y-5">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2.5 text-amber-400">
             <Crown className="w-4 h-4" />
             <h2 className="text-sm font-bold uppercase tracking-wider">Resumo do Plano</h2>
          </div>
          
          <div className="space-y-1.5 pt-2 border-t border-zinc-800">
            <p className="text-base font-semibold text-zinc-100">{plan.name}</p>
            <p className="text-xs text-zinc-400 leading-relaxed">{plan.description}</p>
          </div>

          <div className="flex items-baseline gap-1 pt-3 border-t border-zinc-800 text-zinc-100">
            <span className="text-sm font-bold text-amber-500">R$</span>
            <span className="text-4xl font-extrabold">{plan.price}</span>
            <span className="text-xs text-zinc-500">/{plan.period}</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium block">Cobrança automática recorrente</span>
        </div>

        <div className="flex flex-col items-center gap-3 px-4 text-center text-[11px] text-zinc-600">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
          <p>
            Seus dados estão protegidos por criptografia de ponta a ponta. 
            Esta é uma transação segura simulada via Vercel.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Voltar */}
      <Link 
        href="/plans" 
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Alterar Plano
      </Link>
      
      {/* Componente envelopado em Suspense devido ao useSearchParams */}
      <Suspense fallback={<div className="text-center py-10 text-zinc-600 text-sm">Carregando checkout...</div>}>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}