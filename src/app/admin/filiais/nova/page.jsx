"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Store, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

export default function NovaFilialPage() {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nomeTrim = nome.trim();
    const enderecoTrim = endereco.trim();

    if (!nomeTrim || !enderecoTrim) {
      setError("Nome e endereço são obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/filiais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeTrim,
          endereco: enderecoTrim,
          telefone: telefone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao cadastrar filial.");
      }

      setSuccess(true);
      setNome("");
      setEndereco("");
      setTelefone("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Filial cadastrada!</h2>
        <p className="text-xs text-zinc-400">A nova unidade já está disponível no sistema.</p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors mt-2"
        >
          Cadastrar outra filial
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Topo / Voltar */}
      <div className="flex items-center gap-3">
        <Link 
          href="/admin" 
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-zinc-100">Nova Filial</h1>
          <p className="text-xs text-zinc-500">Cadastre uma nova unidade da barbearia</p>
        </div>
      </div>

      {/* Card Principal */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl leading-relaxed flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nome */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-amber-400" /> Nome da Filial
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Unidade Centro"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (error) setError("");
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Campo Endereço */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Endereço Completo
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Av. Principal, 1000 - Centro"
              value={endereco}
              onChange={(e) => {
                setEndereco(e.target.value);
                if (error) setError("");
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Campo Telefone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> Telefone / WhatsApp (Opcional)
            </label>
            <input
              type="text"
              placeholder="(41) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Botão Salvar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-[0.98] mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Cadastrando...</span>
              </>
            ) : (
              <>
                <Store className="w-4 h-4" /> Cadastrar Filial
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}