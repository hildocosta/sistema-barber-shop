import Link from "next/link";
import { Scissors, MapPin, Phone, Clock, ShieldCheck } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-sm mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Identidade & Sobre */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Scissors className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-zinc-100 tracking-wider uppercase">
              Barber<span className="text-amber-500">Shop</span>
            </span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Excelência em cortes clássicos e modernos, barba terapia e clube de assinaturas com benefícios exclusivos.
          </p>
          <div className="pt-1 flex items-center gap-3 text-zinc-400">
            {/* Ícone Instagram em SVG nativo */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:text-amber-400 hover:border-amber-500/40 transition-all flex items-center justify-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Ambiente 100% Seguro</span>
            </div>
          </div>
        </div>

        {/* Links Rápidos */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Navegação</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-amber-400 transition-colors">Início & Serviços</Link>
            </li>
            <li>
              <Link href="/appointments" className="hover:text-amber-400 transition-colors">Meus Agendamentos</Link>
            </li>
            <li>
              <Link href="/plans" className="text-amber-500 hover:text-amber-400 transition-colors font-medium">Clube VIP (Corte Ilimitado)</Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-amber-400 transition-colors">Área do Cliente</Link>
            </li>
          </ul>
        </div>

        {/* Informações da Unidade */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Atendimento</h3>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2 text-zinc-400">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Rua Principal, 1234 - Centro</span>
            </li>
            <li className="flex items-center gap-2 text-zinc-400">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span>(41) 99280-2437</span>
            </li>
            <li className="flex items-start gap-2 text-zinc-400">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Segunda a Sábado: 09:00 às 20:00</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-zinc-900/80 py-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-600">
          <p>© {currentYear} BarberShop. Todos os direitos reservados.</p>
          <p className="text-zinc-500">Desenvolvido com Next.js & Neon</p>
        </div>
      </div>
    </footer>
  );
}