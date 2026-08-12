"use client";

import { useState } from "react";
import { Calendar, Clock, User, CheckCircle2 } from "lucide-react";

const BARBERS = [
  { id: "1", name: "Carlos Cunha" },
  { id: "2", name: "Mateus Silva" },
];

const TIME_SLOTS = [
  "09:00", "09:40", "10:20", "11:00",
  "14:00", "14:40", "15:20", "16:00", "17:00"
];

export default function NewAppointmentPage() {
  const [selectedBarber, setSelectedBarber] = useState(BARBERS[0].id);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return alert("Selecione data e horário!");
    setConfirmed(true);
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Novo Agendamento</h1>

      {confirmed ? (
        <div className="bg-zinc-900 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-zinc-100">Agendamento Confirmado!</h2>
          <p className="text-sm text-zinc-400">
            Horário reservado com sucesso para o dia <strong>{selectedDate}</strong> às <strong>{selectedTime}</strong>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleBooking} className="space-y-6 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          {/* Selecionar Barbeiro */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-amber-500" /> Profissional
            </label>
            <div className="grid grid-cols-2 gap-3">
              {BARBERS.map((barber) => (
                <button
                  type="button"
                  key={barber.id}
                  onClick={() => setSelectedBarber(barber.id)}
                  className={`py-2.5 px-4 rounded-xl text-sm border font-medium text-left transition-all ${
                    selectedBarber === barber.id
                      ? "bg-amber-500/10 border-amber-500 text-amber-400"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400"
                  }`}
                >
                  {barber.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selecionar Data */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" /> Data
            </label>
            <input
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-zinc-100"
            />
          </div>

          {/* Selecionar Horário */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> Horários Disponíveis
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 rounded-lg text-xs border font-medium transition-all ${
                    selectedTime === slot
                      ? "bg-amber-500 border-amber-500 text-zinc-950 font-bold"
                      : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3 rounded-xl text-sm transition-all"
          >
            Confirmar Reserva
          </button>
        </form>
      )}
    </div>
  );
}