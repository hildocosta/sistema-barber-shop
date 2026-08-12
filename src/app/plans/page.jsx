"use client";
import { Check, ShieldCheck, Crown } from "lucide-react";
import Link from "next/link";

const BENEFITS = [
  "Cortes de cabelo ilimitados durante o mês",
  "Agenda aberta com 7 dias de antecedência",
  "10% de desconto em cosméticos e produtos",
  "10% de desconto em serviços extras",
  "Sem taxa de cancelamento",
];

export default function PlansPage() {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Crown className="w-4 h-4" /> CLUBE VIP
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-100">Assinatura Mensal</h1>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Praticidade no pagamento com débito automático no cartão.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-zinc-900 border border-amber-500/50 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Recomendado</span>
            <h2 className="text-xl font-bold text-zinc-100">Corte Ilimitado</h2>
          </div>
          <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full">
            20 vagas restantes
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-zinc-100">R$ 74,90</span>
          <span className="text-zinc-400 text-sm">/mês</span>
        </div>

        <ul className="space-y-3 text-sm text-zinc-300">
          {BENEFITS.map((item, index) => (
            <li key={index} className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/checkout?plan=corte-ilimitado"
          className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3 rounded-xl text-center block transition-all"
        >
          Cadastrar Cartão & Assinar
        </Link>

        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-zinc-400" />
          <span>Processamento com cartão seguro via Stripe</span>
        </div>
      </div>
    </div>
  );
}