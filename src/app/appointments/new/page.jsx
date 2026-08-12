"use client";

import { useState } from "react";
import Link from "next/link";
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
  CheckCircle2
} from "lucide-react";

// DADOS DO SISTEMA
const BRANCHES = [
  { id: "1", name: "Unidade Central - Boneca do Iguaçu", address: "Av. Castro Alves, 445" },
  { id: "2", name: "Unidade Shopping Boulevard", address: "Av. das Américas, 1200 - Piso L2" },
];

const BARBERS = [
  { id: "1", name: "Gustavo Mendes", role: "Mestre Barbeiro", rating: "4.9", badge: "Destaque" },
  { id: "2", name: "Guilherme Santos", role: "Especialista em Degradê", rating: "4.8", badge: null },
  { id: "3", name: "Fabio Oliveira", role: "Visagista & Barboterapia", rating: "5.0", badge: "Destaque" },
  { id: "any", name: "Sem preferência", role: "Qualquer profissional disponível", rating: "5.0", badge: null },
];

const SERVICES = [
  { id: "corte", name: "Corte Tradicional / Fade", price: 35.0, originalPrice: 40.0, duration: "30 min" },
  { id: "barba", name: "Barba Terapia Completa", price: 30.0, originalPrice: 35.0, duration: "30 min" },
  { id: "combo", name: "Combo Cabelo + Barba", price: 60.0, originalPrice: 75.0, duration: "60 min" },
  { id: "sobrancelha", name: "Sobrancelha na Navalha", price: 12.0, originalPrice: 15.0, duration: "15 min" },
  { id: "pezinho", name: "Acabamento & Pezinho", price: 15.0, originalPrice: 18.0, duration: "15 min" },
  { id: "limpeza", name: "Limpeza de Pele Black Mask", price: 45.0, originalPrice: 50.0, duration: "30 min" },
];

const DAYS_OF_WEEK = [
  { dayName: "Hoje", dayNum: "12", dateString: "12 de Agosto", fullDate: "2026-08-12", available: true },
  { dayName: "Qui", dayNum: "13", dateString: "13 de Agosto", fullDate: "2026-08-13", available: true },
  { dayName: "Sex", dayNum: "14", dateString: "14 de Agosto", fullDate: "2026-08-14", available: true },
  { dayName: "Sáb", dayNum: "15", dateString: "15 de Agosto", fullDate: "2026-08-15", available: true },
  { dayName: "Dom", dayNum: "16", dateString: "16 de Agosto", fullDate: "2026-08-16", available: false },
  { dayName: "Seg", dayNum: "17", dateString: "17 de Agosto", fullDate: "2026-08-17", available: true },
  { dayName: "Ter", dayNum: "18", dateString: "18 de Agosto", fullDate: "2026-08-18", available: true },
];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", 
  "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
];

export default function NewAppointmentPage() {
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [selectedBarber, setSelectedBarber] = useState(BARBERS[0]);
  const [selectedServices, setSelectedServices] = useState([SERVICES[0]]);
  const [selectedDay, setSelectedDay] = useState(DAYS_OF_WEEK[0]);
  const [selectedTime, setSelectedTime] = useState("10:00");

  const [activeSheet, setActiveSheet] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [isVipMember, setIsVipMember] = useState(false);

  const handleToggleService = (service) => {
    if (selectedServices.find((s) => s.id === service.id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
      }
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const rawTotal = selectedServices.reduce((acc, curr) => acc + curr.price, 0);
  const finalTotal = isVipMember ? 0.0 : rawTotal;

 if (confirmed) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-zinc-100">Agendamento Confirmado!</h1>
          <p className="text-sm text-zinc-400">
            Reserva marcada com sucesso para o dia <span className="text-amber-400 font-bold">{selectedDay.dateString}</span> às <span className="text-amber-400 font-bold">{selectedTime}</span>.
          </p>
        </div>

        {/* Card de Resumo Totalmente Centralizado */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-xs space-y-4">
          <div className="pb-3 border-b border-zinc-800/80 space-y-1">
            <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider block">Unidade</span>
            <p className="font-semibold text-zinc-200 text-sm">{selectedBranch.name}</p>
          </div>

          <div className="pb-3 border-b border-zinc-800/80 space-y-1">
            <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider block">Barbeiro</span>
            <p className="font-semibold text-zinc-200 text-sm">{selectedBarber.name}</p>
          </div>

          <div className="pb-3 border-b border-zinc-800/80 space-y-1">
            <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider block">Serviços</span>
            <p className="font-semibold text-zinc-200 text-sm leading-relaxed max-w-xs mx-auto">
              {selectedServices.map((s) => s.name).join(" • ")}
            </p>
          </div>

          <div className="pt-1 space-y-1">
            <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider block">Valor Total</span>
            <p className="font-black text-emerald-400 text-base">
              {isVipMember ? "R$ 0,00 (Plano VIP)" : `R$ ${finalTotal.toFixed(2).replace(".", ",")}`}
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

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5 relative">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-black text-zinc-100">Novo Agendamento</h1>
        <button 
          onClick={() => setIsVipMember(!isVipMember)} 
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 ${
            isVipMember ? "bg-amber-500/20 border-amber-500 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"
          }`}
        >
          <Crown className="w-3 h-3" /> {isVipMember ? "VIP Ativo" : "Simular VIP"}
        </button>
      </div>

      <p className="text-xs text-zinc-400 text-center">Toque em cada campo para personalizar sua reserva</p>

      {/* Cards de Seleção */}
      <div className="space-y-3">
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
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Unidade</span>
              <p className="text-sm font-bold text-zinc-100">{selectedBranch.name}</p>
              <p className="text-[11px] text-zinc-400">{selectedBranch.address}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600 shrink-0" />
        </button>

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
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Profissional</span>
              <p className="text-sm font-bold text-zinc-100">{selectedBarber.name}</p>
              <p className="text-[11px] text-zinc-400">{selectedBarber.role}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600 shrink-0" />
        </button>

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
                {selectedServices.map(s => s.name).join(" + ")}
              </p>
              <p className="text-[11px] text-amber-400 font-semibold">
                {isVipMember ? "Incluso no Plano VIP" : `R$ ${rawTotal.toFixed(2).replace(".", ",")}`}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600 shrink-0" />
        </button>

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
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Data & Horário</span>
              <p className="text-sm font-bold text-zinc-100">{selectedDay.dateString}, {selectedTime}</p>
              <p className="text-[11px] text-emerald-400 font-medium">Horário confirmado</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600 shrink-0" />
        </button>
      </div>

      {/* Resumo e Botão de Ação Embutido no Fluxo */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-400">Total a pagar</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-amber-400">
              {isVipMember ? "R$ 0,00" : `R$ ${finalTotal.toFixed(2).replace(".", ",")}`}
            </span>
            {isVipMember && (
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">VIP</span>
            )}
          </div>
        </div>

        <button
          onClick={() => setConfirmed(true)}
          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-[0.98] text-center"
        >
          Confirmar Agendamento
        </button>
      </div>

      {/* MODAL / BOTTOM SHEET RESPONSIVO */}
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
                onClick={() => setActiveSheet(null)} 
                className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* SELETOR DE FILIAIS */}
            {activeSheet === "branch" && (
              <div className="space-y-2.5">
                {BRANCHES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => { setSelectedBranch(b); setActiveSheet(null); }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      selectedBranch.id === b.id 
                        ? "bg-amber-500/10 border-amber-500 text-zinc-100" 
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-zinc-100">{b.name}</p>
                      <p className="text-xs text-zinc-400">{b.address}</p>
                    </div>
                    {selectedBranch.id === b.id && <Check className="w-5 h-5 text-amber-500" />}
                  </button>
                ))}
              </div>
            )}

            {/* SELETOR DE BARBEIROS */}
            {activeSheet === "barber" && (
              <div className="grid grid-cols-2 gap-3">
                {BARBERS.map((barber) => (
                  <button
                    key={barber.id}
                    onClick={() => { setSelectedBarber(barber); setActiveSheet(null); }}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                      selectedBarber.id === barber.id 
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
                      {barber.name.substring(0, 2).toUpperCase()}
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
                {SERVICES.map((srv) => {
                  const isSelected = selectedServices.some(s => s.id === srv.id);
                  return (
                    <button
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
                          <span className="text-xs font-bold text-amber-400">R$ {srv.price.toFixed(2).replace(".", ",")}</span>
                          <span className="text-[11px] text-zinc-500 line-through">R$ {srv.originalPrice.toFixed(2).replace(".", ",")}</span>
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {srv.duration}</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
                        isSelected ? "bg-amber-500 border-amber-500 text-zinc-950" : "border-zinc-700"
                      }`}>
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}

                <button
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
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Selecione o Dia</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {DAYS_OF_WEEK.map((d) => (
                      <button
                        key={d.fullDate}
                        disabled={!d.available}
                        onClick={() => setSelectedDay(d)}
                        className={`flex-none w-14 py-3 rounded-2xl border text-center transition-all ${
                          !d.available
                            ? "opacity-30 border-zinc-800 cursor-not-allowed bg-zinc-950"
                            : selectedDay.fullDate === d.fullDate
                            ? "bg-amber-500 text-zinc-950 border-amber-500 font-bold shadow-lg shadow-amber-500/10"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-[10px] uppercase block font-medium">{d.dayName}</span>
                        <span className="text-base font-black block mt-0.5">{d.dayNum}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Horários para {selectedDay.dateString}
                  </span>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
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
                </div>

                <button
                  onClick={() => setActiveSheet(null)}
                  className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3.5 rounded-xl text-sm transition-all"
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