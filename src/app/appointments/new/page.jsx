"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Store,
  User,
  Scissors,
  Calendar as CalendarIcon,
  ChevronRight,
  X,
  Check,
  Clock,
  Crown,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function NewAppointmentPage() {
  const router = useRouter();

  // Estados dos Dados das APIs
  const [branches, setBranches] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  // Estados de Seleção
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  // Estados da UI e Controle
  const [activeSheet, setActiveSheet] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [isVipMember, setIsVipMember] = useState(false);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Função memoizada para gerar os próximos 7 dias
  const generateNextDays = useCallback(() => {
    console.log("[DEBUG] Gerando os próximos 7 dias...");
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const fullDate = `${year}-${month}-${day}`;

      const dayNum = day;
      const dayName =
        i === 0
          ? "Hoje"
          : date
              .toLocaleDateString("pt-BR", { weekday: "short" })
              .replace(".", "");

      const dateString = date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
      });

      // Domingo indisponível (0 = Domingo)
      const available = date.getDay() !== 0;

      days.push({ dayName, dayNum, dateString, fullDate, available });
    }

    setDaysOfWeek(days);
    const firstAvailable = days.find((d) => d.available) || days[0];
    setSelectedDay(firstAvailable);
    console.log("[DEBUG] Dia selecionado por padrão:", firstAvailable);
  }, []);

  // 1. CARREGAMENTO INICIAL (Filiais, Serviços e Perfil VIP)
  useEffect(() => {
    async function fetchInitialData() {
      setIsInitialLoading(true);
      setErrorMessage("");
      console.log("[DEBUG] Iniciando busca dos dados iniciais...");

      try {
        const [resBranches, resServices, resUser] = await Promise.allSettled([
          fetch("/api/filiais"),
          fetch("/api/servicos"),
          fetch("/api/usuario/me"),
        ]);

        // Trata Filiais
        if (resBranches.status === "fulfilled" && resBranches.value.ok) {
          const dataBranches = await resBranches.value.json();
          console.log("[DEBUG] Filiais carregadas:", dataBranches);

          const formattedBranches = (
            Array.isArray(dataBranches) ? dataBranches : []
          ).map((b) => ({
            id: b.id,
            nome: b.nome || b.name || "Filial sem nome",
            endereco: b.endereco || b.address || "Endereço não informado",
            telefone: b.telefone || b.phone || "",
          }));

          setBranches(formattedBranches);
          if (formattedBranches.length > 0) {
            setSelectedBranch(formattedBranches[0]);
          }
        } else {
          console.error("[DEBUG Error] Falha ao carregar filiais");
        }

        // Trata Serviços
        if (resServices.status === "fulfilled" && resServices.value.ok) {
          const dataServices = await resServices.value.json();
          console.log("[DEBUG] Serviços carregados:", dataServices);

          const formattedServices = (
            Array.isArray(dataServices) ? dataServices : []
          ).map((s) => ({
            id: s.id,
            name: s.name || s.nome || "Serviço sem nome",
            price: Number(s.price ?? s.preco ?? 0),
            duration: s.duration || s.duracao || "30 min",
          }));

          setServices(formattedServices);
          if (formattedServices.length > 0) {
            setSelectedServices([formattedServices[0]]);
          }
        } else {
          console.error("[DEBUG Error] Falha ao carregar serviços");
        }

        // Trata Usuário VIP
        if (resUser.status === "fulfilled" && resUser.value.ok) {
          const userData = await resUser.value.json();
          console.log("[DEBUG] Dados do usuário logado:", userData);
          setIsVipMember(Boolean(userData.isVip));
        }

        generateNextDays();
      } catch (err) {
        console.error("[DEBUG Error] Erro inesperado em fetchInitialData:", err);
        setErrorMessage("Erro ao carregar dados iniciais.");
      } finally {
        setIsInitialLoading(false);
      }
    }

    fetchInitialData();
  }, [generateNextDays]);

  // 2. BUSCAR BARBEIROS QUANDO A FILIAL MUDAR
  useEffect(() => {
    if (!selectedBranch?.id) return;

    async function fetchBarbers() {
      console.log(`[DEBUG] Buscando barbeiros para filial ID: ${selectedBranch?.id}`);
      try {
        const res = await fetch(`/api/barbeiros?filialId=${selectedBranch.id}`);
        if (res.ok) {
          const data = await res.json();
          console.log("[DEBUG] Barbeiros recebidos:", data);

          const anyBarberOption = {
            id: "any",
            name: "Sem preferência",
            role: "Qualquer profissional disponível",
          };

          const formattedBarbers = (
            Array.isArray(data) ? data : []
          ).map((b) => ({
            id: b.id,
            name: b.name || b.nome || "Profissional",
            role: b.role || b.cargo || "Barbeiro",
            badge: b.badge,
          }));

          const list = [anyBarberOption, ...formattedBarbers];
          setBarbers(list);
          setSelectedBarber(list[0]);
        } else {
          console.error("[DEBUG Error] Resposta inválida na API de barbeiros");
        }
      } catch (err) {
        console.error("[DEBUG Error] Erro ao carregar barbeiros:", err);
      }
    }

    fetchBarbers();
  }, [selectedBranch]);

  // 3. BUSCAR HORÁRIOS DISPONÍVEIS
  useEffect(() => {
    if (!selectedBranch?.id || !selectedDay?.fullDate) return;

    async function fetchTimeSlots() {
      setIsLoadingSlots(true);
      setTimeSlots([]);
      setSelectedTime("");

      try {
        const barberParam =
          selectedBarber && selectedBarber.id !== "any"
            ? `&barbeiroId=${selectedBarber.id}`
            : "";

        const url = `/api/agendamentos/horarios-disponiveis?filialId=${selectedBranch.id}&data=${selectedDay.fullDate}${barberParam}`;
        console.log(`[DEBUG] Requisitando horários: ${url}`);

        const res = await fetch(url);
        if (res.ok) {
          const slots = await res.json();
          console.log("[DEBUG] Horários disponíveis recebidos:", slots);

          if (Array.isArray(slots)) {
            setTimeSlots(slots);
            if (slots.length > 0) setSelectedTime(slots[0]);
          }
        } else {
          console.error("[DEBUG Error] Falha ao buscar horários disponíveis");
        }
      } catch (err) {
        console.error("[DEBUG Error] Erro ao buscar horários:", err);
      } finally {
        setIsLoadingSlots(false);
      }
    }

    fetchTimeSlots();
  }, [selectedBranch, selectedBarber, selectedDay]);

  // Alternar Seleção de Serviços
  const handleToggleService = (service) => {
    console.log("[DEBUG] Alternando serviço:", service);
    const exists = selectedServices.some((s) => s.id === service.id);

    if (exists) {
      if (selectedServices.length > 1) {
        setSelectedServices((prev) => prev.filter((s) => s.id !== service.id));
      } else {
        console.warn("[DEBUG] É necessário manter ao menos um serviço selecionado.");
      }
    } else {
      setSelectedServices((prev) => [...prev, service]);
    }
  };

  // Cálculo de Valores
  const rawTotal = selectedServices.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const finalTotal = isVipMember ? 0.0 : rawTotal;

  // 4. CONFIRMAR AGENDAMENTO
  const handleConfirmAppointment = async () => {
    console.log("[DEBUG] Tentando confirmar agendamento...");

    if (!selectedBranch || !selectedDay || !selectedTime) {
      setErrorMessage("Por favor, preencha todos os campos do agendamento.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // DataHora formatada no padrão seguro
      const dateTimeString = `${selectedDay.fullDate}T${selectedTime}:00`;
      console.log("[DEBUG] DataHora formatada:", dateTimeString);

      const servicosPayload = selectedServices.map((srv) => ({
        id: srv.id,
        preco: isVipMember ? 0.0 : srv.price,
      }));

      const payload = {
        filialId: selectedBranch.id,
        barbeiroId: selectedBarber?.id === "any" ? null : selectedBarber?.id,
        dataHora: dateTimeString,
        valorTotal: finalTotal,
        observacao: isVipMember ? "Agendamento VIP" : "",
        servicos: servicosPayload,
      };

      console.log("[DEBUG] Payload enviado ao POST /api/agendamentos:", payload);

      const response = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("[DEBUG] Resposta do servidor para o agendamento:", data);

      if (!response.ok) {
        if (response.status === 401) {
          console.warn("[DEBUG] Usuário não autenticado. Redirecionando...");
          router.push("/login");
          return;
        }
        throw new Error(data.error || data.message || "Ocorreu um erro ao agendar.");
      }

      setConfirmed(true);
    } catch (err) {
      console.error("[DEBUG Error] Erro ao submeter agendamento:", err);
      setErrorMessage(err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // RENDER: LOADING INICIAL
  if (isInitialLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-sm">Carregando opções de agendamento...</p>
      </div>
    );
  }

  // RENDER: AGENDAMENTO CONFIRMADO
  if (confirmed) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-zinc-100">Agendamento Confirmado!</h1>
          <p className="text-sm text-zinc-400">
            Reserva marcada com sucesso para o dia{" "}
            <span className="text-amber-400 font-bold">{selectedDay?.dateString}</span> às{" "}
            <span className="text-amber-400 font-bold">{selectedTime}</span>.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-xs space-y-4">
          <div className="pb-3 border-b border-zinc-800/80 space-y-1">
            <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider block">
              Unidade
            </span>
            <p className="font-semibold text-zinc-200 text-sm">{selectedBranch?.nome}</p>
          </div>

          <div className="pb-3 border-b border-zinc-800/80 space-y-1">
            <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider block">
              Barbeiro
            </span>
            <p className="font-semibold text-zinc-200 text-sm">{selectedBarber?.name}</p>
          </div>

          <div className="pb-3 border-b border-zinc-800/80 space-y-1">
            <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider block">
              Serviços
            </span>
            <p className="font-semibold text-zinc-200 text-sm leading-relaxed max-w-xs mx-auto">
              {selectedServices.map((s) => s.name).join(" • ")}
            </p>
          </div>

          <div className="pt-1 space-y-1">
            <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider block">
              Valor Total
            </span>
            <p className="font-black text-emerald-400 text-base">
              {isVipMember
                ? "R$ 0,00 (Plano VIP)"
                : `R$ ${finalTotal.toFixed(2).replace(".", ",")}`}
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3.5 rounded-xl block text-sm transition-all shadow-lg shadow-amber-500/20 text-center"
        >
          Voltar ao Início
        </Link>
      </div>
    );
  }

  // RENDER: FORMULÁRIO PRINCIPAL
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-black text-zinc-100">Novo Agendamento</h1>
        <button
          type="button"
          onClick={() => {
            console.log("[DEBUG] Alternando simulação VIP para:", !isVipMember);
            setIsVipMember(!isVipMember);
          }}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 ${
            isVipMember
              ? "bg-amber-500/20 border-amber-500 text-amber-400"
              : "bg-zinc-900 border-zinc-800 text-zinc-500"
          }`}
        >
          <Crown className="w-3 h-3" /> {isVipMember ? "VIP Ativo" : "Simular VIP"}
        </button>
      </div>

      <p className="text-xs text-zinc-400 text-center">
        Toque em cada campo para personalizar sua reserva
      </p>

      {/* Exibição de Erro */}
      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Cards de Seleção */}
      <div className="space-y-3">
        {/* Card: Unidade */}
        <button
          type="button"
          onClick={() => setActiveSheet("branch")}
          className="w-full bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 p-4 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                Unidade
              </span>
              <p className="text-sm font-bold text-zinc-100">
                {selectedBranch?.nome || "Selecione..."}
              </p>
              <p className="text-[11px] text-zinc-400">{selectedBranch?.endereco}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600 shrink-0" />
        </button>

        {/* Card: Profissional */}
        <button
          type="button"
          onClick={() => setActiveSheet("barber")}
          className="w-full bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 p-4 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                Profissional
              </span>
              <p className="text-sm font-bold text-zinc-100">
                {selectedBarber?.name || "Selecione..."}
              </p>
              <p className="text-[11px] text-zinc-400">{selectedBarber?.role}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600 shrink-0" />
        </button>

        {/* Card: Serviços */}
        <button
          type="button"
          onClick={() => setActiveSheet("services")}
          className="w-full bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 p-4 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                Serviços ({selectedServices.length})
              </span>
              <p className="text-sm font-bold text-zinc-100">
                {selectedServices.length > 0
                  ? selectedServices.map((s) => s.name).join(" + ")
                  : "Selecione..."}
              </p>
              <p className="text-[11px] text-amber-400 font-semibold">
                {isVipMember
                  ? "Incluso no Plano VIP"
                  : `R$ ${rawTotal.toFixed(2).replace(".", ",")}`}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600 shrink-0" />
        </button>

        {/* Card: Data & Horário */}
        <button
          type="button"
          onClick={() => setActiveSheet("datetime")}
          className="w-full bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 p-4 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                Data & Horário
              </span>
              <p className="text-sm font-bold text-zinc-100">
                {selectedDay && selectedTime
                  ? `${selectedDay.dateString}, ${selectedTime}`
                  : "Escolha a data"}
              </p>
              <p className="text-[11px] text-emerald-400 font-medium">
                {selectedTime ? "Horário selecionado" : "Selecione um horário"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600 shrink-0" />
        </button>
      </div>

      {/* Resumo e Botão de Ação */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-400">Total a pagar</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-amber-400">
              {isVipMember
                ? "R$ 0,00"
                : `R$ ${finalTotal.toFixed(2).replace(".", ",")}`}
            </span>
            {isVipMember && (
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">
                VIP
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfirmAppointment}
          disabled={isSubmitting || !selectedTime}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-black py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-[0.98] text-center flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Confirmar Agendamento"
          )}
        </button>
      </div>

      {/* MODAIS / BOTTOM SHEETS */}
      {activeSheet && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end sm:justify-center sm:items-center sm:p-4 transition-opacity">
          <div className="fixed inset-0" onClick={() => setActiveSheet(null)} />

          <div className="relative w-full sm:max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-6 space-y-5 max-h-[85vh] overflow-y-auto z-10 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-100">
                {activeSheet === "branch" && "Selecione a Filial"}
                {activeSheet === "barber" && "Selecione o Profissional"}
                {activeSheet === "services" && "Selecione os Serviços"}
                {activeSheet === "datetime" && "Escolha Data & Horário"}
              </h3>
              <button
                type="button"
                onClick={() => setActiveSheet(null)}
                className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* SELETOR DE FILIAIS */}
            {activeSheet === "branch" && (
              <div className="space-y-2.5">
                {branches.length > 0 ? (
                  branches.map((b) => (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => {
                        console.log("[DEBUG] Nova filial escolhida:", b);
                        setSelectedBranch(b);
                        setActiveSheet(null);
                      }}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        selectedBranch?.id === b.id
                          ? "bg-amber-500/10 border-amber-500 text-zinc-100"
                          : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-zinc-100">{b.nome}</p>
                        <p className="text-xs text-zinc-400">{b.endereco}</p>
                      </div>
                      {selectedBranch?.id === b.id && (
                        <Check className="w-5 h-5 text-amber-500" />
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-center text-xs text-zinc-500 py-4">
                    Nenhuma filial cadastrada no momento.
                  </p>
                )}
              </div>
            )}

            {/* SELETOR DE BARBEIROS */}
            {activeSheet === "barber" && (
              <div className="grid grid-cols-2 gap-3">
                {barbers.map((barber) => (
                  <button
                    type="button"
                    key={barber.id}
                    onClick={() => {
                      console.log("[DEBUG] Barbeiro selecionado:", barber);
                      setSelectedBarber(barber);
                      setActiveSheet(null);
                    }}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                      selectedBarber?.id === barber.id
                        ? "bg-amber-500/10 border-amber-500 text-zinc-100"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    {barber.badge && (
                      <span className="absolute top-3 right-3 bg-blue-600 text-[10px] font-bold text-white px-2 py-0.5 rounded-full">
                        {barber.badge}
                      </span>
                    )}
                    <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 font-bold mb-3">
                      {barber.name?.substring(0, 2).toUpperCase() || "B"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-100">{barber.name}</p>
                      <p className="text-[11px] text-zinc-500">{barber.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* SELETOR DE SERVIÇOS */}
            {activeSheet === "services" && (
              <div className="space-y-2.5">
                {services.map((srv) => {
                  const isSelected = selectedServices.some((s) => s.id === srv.id);
                  return (
                    <button
                      type="button"
                      key={srv.id}
                      onClick={() => handleToggleService(srv)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500 text-zinc-100"
                          : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-zinc-100">{srv.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-amber-400">
                            R$ {srv.price.toFixed(2).replace(".", ",")}
                          </span>
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {srv.duration}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
                          isSelected
                            ? "bg-amber-500 border-amber-500 text-zinc-950"
                            : "border-zinc-700"
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setActiveSheet(null)}
                  className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3.5 rounded-xl text-sm transition-all"
                >
                  Concluir Seleção ({selectedServices.length} selecionados)
                </button>
              </div>
            )}

            {/* SELETOR DE DATA E HORÁRIO */}
            {activeSheet === "datetime" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Selecione o Dia
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {daysOfWeek.map((d) => (
                      <button
                        type="button"
                        key={d.fullDate}
                        disabled={!d.available}
                        onClick={() => {
                          console.log("[DEBUG] Dia alterado:", d);
                          setSelectedDay(d);
                        }}
                        className={`flex-none w-14 py-3 rounded-2xl border text-center transition-all ${
                          !d.available
                            ? "opacity-30 border-zinc-800 cursor-not-allowed bg-zinc-950"
                            : selectedDay?.fullDate === d.fullDate
                            ? "bg-amber-500 text-zinc-950 border-amber-500 font-bold shadow-lg shadow-amber-500/10"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-[10px] uppercase block font-medium">
                          {d.dayName}
                        </span>
                        <span className="text-base font-black block mt-0.5">
                          {d.dayNum}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Horários para {selectedDay?.dateString}
                  </span>

                  {isLoadingSlots ? (
                    <div className="flex items-center justify-center py-8 text-amber-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : timeSlots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                      {timeSlots.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => {
                            console.log("[DEBUG] Horário selecionado:", slot);
                            setSelectedTime(slot);
                          }}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            selectedTime === slot
                              ? "bg-amber-500 text-zinc-950 border-amber-500 shadow-md shadow-amber-500/10"
                              : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 py-4 text-center">
                      Nenhum horário disponível para esta data.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSheet(null)}
                  disabled={!selectedTime}
                  className="w-full mt-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold py-3.5 rounded-xl text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  Confirmar Data & Horário
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}