import Link from "next/link";
import { 
  Scissors, 
  Crown, 
  Clock, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users 
} from "lucide-react";

const SERVICES = [
  {
    id: "1",
    name: "Corte Tradicional",
    category: "Cabelo",
    price: "45,00",
    time: "35 min",
    description: "Lavagem especial, corte alinhado na tesoura/máquina e finalização com pomada matte.",
    vipBadge: "Grátis no VIP",
  },
  {
    id: "2",
    name: "Barboterapia Clássica",
    category: "Barba",
    price: "40,00",
    time: "30 min",
    description: "Toalha quente com óleos essenciais, massagem facial, alinhamento de navalha e balm hidratante.",
    vipBadge: "10% OFF no VIP",
  },
  {
    id: "3",
    name: "Combo Imperial (Cabelo + Barba)",
    category: "Completo",
    price: "75,00",
    time: "60 min",
    description: "A experiência completa de cuidados com corte personalizado, barboterapia e acabamento refinado.",
    vipBadge: "Desconto VIP",
    popular: true,
  },
  {
    id: "4",
    name: "Acabamento & Sobrancelha",
    category: "Detalhes",
    price: "20,00",
    time: "15 min",
    description: "Pezinho, contorno navalhado de precisão e design de sobrancelha masculina.",
    vipBadge: "Incluso no VIP",
  },
];

const STATS = [
  { label: "Clientes Atendidos", value: "+2.500" },
  { label: "Avaliação Média", value: "4.9 ★" },
  { label: "Barbeiros Mestres", value: "4" },
  { label: "Membros no Clube VIP", value: "+180" },
];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        {/* Glow de fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" /> A melhor experiência da cidade
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-100 max-w-3xl mx-auto leading-tight">
            Estilo afiado, atendimento exclusivo e <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">sem esperar fila</span>.
          </h1>

          <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Agende seu horário em segundos com os melhores barbeiros ou faça parte do clube de corte ilimitado.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/appointments/new"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Scissors className="w-4 h-4" /> Agendar Horário Agora
            </Link>
            <Link
              href="/plans"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-zinc-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-500" /> Ver Clube VIP
            </Link>
          </div>

          {/* Números / Prova Social */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {STATS.map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
                <div className="text-2xl font-black text-amber-400">{stat.value}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER CLUBE VIP PREMIUM */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/30 p-8 md:p-12 shadow-2xl shadow-black/60">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5" /> Assinatura Mensal
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 leading-tight">
                Corte o cabelo quantas vezes quiser no mês
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Mantenha seu visual sempre impecável por um valor fixo mensal. Sem surpresas, direto no cartão e com prioridade máxima na agenda.
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-zinc-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Cortes ilimitados o mês todo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Agendamento prioritário com 7 dias de antecedência</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>10% OFF em todos os produtos e barboterapia</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 text-center">
              <div className="space-y-1">
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Plano Individual</span>
                <div className="flex items-center justify-center gap-1 text-zinc-100">
                  <span className="text-sm font-bold text-amber-500">R$</span>
                  <span className="text-5xl font-black">74,90</span>
                  <span className="text-zinc-500 text-sm">/mês</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium block">Cancele quando quiser</span>
              </div>

              <Link
                href="/plans"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm tracking-wide transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <span>Garantir Minha Vaga VIP</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DE SERVIÇOS */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider mb-2">
              <Scissors className="w-3.5 h-3.5" /> Menu de Atendimentos
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">Nossos Serviços</h2>
          </div>
          <Link
            href="/appointments/new"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 group"
          >
            Escolher barbeiro e data <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className={`relative rounded-2xl p-6 bg-zinc-900/60 border ${
                service.popular ? "border-amber-500/50 bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/20" : "border-zinc-800/80 hover:border-zinc-700"
              } transition-all flex flex-col justify-between gap-4 group`}
            >
              {service.popular && (
                <div className="absolute -top-2.5 right-6 bg-amber-500 text-zinc-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow">
                  Mais Pedido
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider">
                      {service.category}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                      {service.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-zinc-500">R$</span>
                    <span className="text-2xl font-black text-zinc-100"> {service.price}</span>
                  </div>
                </div>
                
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" /> {service.time}
                  </span>
                  <span>•</span>
                  <span className="text-amber-400/90 font-medium">{service.vipBadge}</span>
                </div>

                <Link
                  href={`/appointments/new?serviceId=${service.id}`}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 text-xs font-bold transition-all"
                >
                  Agendar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}