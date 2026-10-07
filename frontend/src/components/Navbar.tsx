import React from "react";
import { Sparkles, Calendar, Phone } from "lucide-react";

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  return (
    <header className="sticky top-0 z-40 bg-dolly-50/90 backdrop-blur-md border-b border-dolly-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-roseGold" />
          <span className="font-serif text-2xl font-bold tracking-wider text-dolly-900">
            Dolly Nail
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-dolly-800">
          <a href="#inicio" className="hover:text-roseGold transition-colors">
            Início
          </a>
          <a href="#servicos" className="hover:text-roseGold transition-colors">
            Serviços
          </a>
          <a href="#sobre" className="hover:text-roseGold transition-colors">
            Sobre
          </a>
          <a href="#galeria" className="hover:text-roseGold transition-colors">
            Galeria
          </a>
          <a href="#contato" className="hover:text-roseGold transition-colors">
            Contato
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <a
            href="https://wa.me/5521999999999?text=Olá,%20gostaria%20de%20tirar%20uma%20dúvida!"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 border border-dolly-300 rounded-full text-xs font-semibold text-dolly-800 hover:bg-dolly-100 transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-roseGold" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="inline-flex items-center space-x-2 bg-roseGold hover:bg-roseGold-dark text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Horário</span>
          </button>
        </div>
      </div>
    </header>
  );
};
