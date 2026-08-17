"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Store, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  MapPin,
  Phone,
  Mail,
  Award,
  ShieldAlert
} from "lucide-react";

export default function AdminCadastroPage() {
  const [activeTab, setActiveTab] = useState("branch"); // "branch" | "barber"
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form State: Filial
  const [branchData, setBranchData] = useState({
    nome: "",
    endereco: "",
    telefone: "",
  });

  // Form State: Barbeiro
  const [barberData, setBarberData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cargo: "Barbeiro",
    badge: "",
    senha: "",
  });

  // Submit Filial
  const handleRegisterBranch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/filiais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branchData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar filial.");
      }

      setMessage({ type: "success", text: "Filial cadastrada com sucesso!" });
      setBranchData({ nome: "", endereco: "", telefone: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Barbeiro
  const handleRegisterBarber = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/barbeiros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...barberData,
          role: "BARBER", // Força o perfil para BARBER
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar barbeiro.");
      }

      setMessage({ type: "success", text: "Barbeiro cadastrado com sucesso!" });
      setBarberData({
        nome: "",
        email: "",
        telefone: "",
        cargo: "Barbeiro",
        badge: "",
        senha: "",
      });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/" 
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black text-zinc-100">Painel do Administrador</h1>
        <div className="w-9 h-9" /> {/* Spacer */}
      </div>

      {/* Navegação entre Abas */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setActiveTab("branch");
            setMessage({ type: "", text: "" });
          }}
          className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "branch"
              ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Store className="w-4 h-4" />
          Cadastrar Filial
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("barber");
            setMessage({ type: "", text: "" });
          }}
          className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "barber"
              ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Cadastrar Barbeiro
        </button>
      </div>

      {/* Exibição de Mensagens (Sucesso ou Erro) */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-medium animate-in fade-in duration-200 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          )}
          <p className="flex-1">{message.text}</p>
        </div>
      )}

      {/* FORMULÁRIO 1: FILIAL */}
      {activeTab === "branch" && (
        <form onSubmit={handleRegisterBranch} className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="space-y-1 pb-2 border-b border-zinc-800/80">
            <h2 className="text-base font-bold text-zinc-100">Nova Unidade / Filial</h2>
            <p className="text-xs text-zinc-400">Adicione um novo endereço para sua barbearia</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5">
                Nome da Unidade
              </label>
              <div className="relative">
                <Store className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Unidade Central - Centro"
                  value={branchData.nome}
                  onChange={(e) => setBranchData({ ...branchData, nome: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5">
                Endereço Completo
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Av. Castro Alves, 445 - Sala 02"
                  value={branchData.endereco}
                  onChange={(e) => setBranchData({ ...branchData, endereco: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5">
                Telefone de Contato (Opcional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="(41) 99999-9999"
                  value={branchData.telefone}
                  onChange={(e) => setBranchData({ ...branchData, telefone: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-black py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando Filial...
              </>
            ) : (
              "Salvar Filial"
            )}
          </button>
        </form>
      )}

      {/* FORMULÁRIO 2: BARBEIRO */}
      {activeTab === "barber" && (
        <form onSubmit={handleRegisterBarber} className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="space-y-1 pb-2 border-b border-zinc-800/80">
            <h2 className="text-base font-bold text-zinc-100">Novo Profissional</h2>
            <p className="text-xs text-zinc-400">Cadastre um novo membro para a equipe</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5">
                Nome do Barbeiro
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Gustavo Mendes"
                value={barberData.nome}
                onChange={(e) => setBarberData({ ...barberData, nome: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="barbeiro@email.com"
                    value={barberData.email}
                    onChange={(e) => setBarberData({ ...barberData, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="(41) 98888-8888"
                    value={barberData.telefone}
                    onChange={(e) => setBarberData({ ...barberData, telefone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5">
                  Cargo / Especialidade
                </label>
                <input
                  type="text"
                  placeholder="Ex: Visagista & Fade"
                  value={barberData.cargo}
                  onChange={(e) => setBarberData({ ...barberData, cargo: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5">
                  Selo / Badge (Opcional)
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Ex: Destaque"
                    value={barberData.badge}
                    onChange={(e) => setBarberData({ ...barberData, badge: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                placeholder="******"
                value={barberData.senha}
                onChange={(e) => setBarberData({ ...barberData, senha: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-black py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cadastrando Barbeiro...
              </>
            ) : (
              "Salvar Barbeiro"
            )}
          </button>
        </form>
      )}
    </div>
  );
}