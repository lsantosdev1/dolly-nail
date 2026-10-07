import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { BookingModal } from "../components/BookingModal";
import type { Service } from "../types/index";
import { api } from "../services/api";
import { Sparkles, Clock, MapPin, Heart, Camera } from "lucide-react";

export const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await api.get("/services");
        setServices(response.data);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <div className="min-h-screen bg-dolly-50 flex flex-col">
      <Navbar onOpenBooking={() => setIsModalOpen(true)} />

      {/* Hero Section */}
      <section
        id="inicio"
        className="relative py-20 lg:py-28 overflow-hidden scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-dolly-100 text-dolly-800 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border border-dolly-200">
              <Sparkles className="w-3.5 h-3.5 text-roseGold" />
              <span>Dolly Nail Studio • Premium Experience</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-dolly-900 leading-tight">
              Sua beleza refletida na precisão de cada detalhe.
            </h1>

            <p className="text-base text-neutral-600 leading-relaxed">
              Bem-vinda ao{" "}
              <strong className="font-semibold text-dolly-900">
                Dolly Nail Studio
              </strong>
              . Sob a dedicação da especialista{" "}
              <strong className="font-semibold text-dolly-900">
                Ana Martins
              </strong>
              , oferecemos um ambiente sofisticado para cuidados com unhas,
              alongamento em gel e esmaltação de alta durabilidade.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-roseGold hover:bg-roseGold-dark text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-md transition-all text-center"
              >
                Agendar Atendimento
              </button>
              <a
                href="#servicos"
                className="border border-dolly-300 text-dolly-800 hover:bg-dolly-100 px-8 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all text-center"
              >
                Ver Serviços & Preços
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl bg-dolly-200 overflow-hidden shadow-2xl border-4 border-white relative">
              <img
                src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1000&auto=format&fit=crop"
                alt="Nail Designer em ação"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-dolly-100 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-dolly-100 flex items-center justify-center text-roseGold font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-semibold uppercase">
                  Atendimento
                </p>
                <p className="text-sm font-bold text-dolly-900">
                  100% Personalizado
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section
        id="servicos"
        className="py-20 bg-white border-y border-dolly-200/60 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-serif font-bold text-dolly-900">
              Menu de Serviços
            </h2>
            <p className="text-sm text-neutral-500">
              Tratamentos exclusivos com produtos selecionados de altíssima
              qualidade.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-neutral-500">
              Carregando menu...
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-dolly-50 rounded-2xl p-6 border border-dolly-200/80 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-serif text-lg font-bold text-dolly-900">
                        {service.name}
                      </h3>
                      <span className="text-lg font-bold text-roseGold">
                        R$ {Number(service.price).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
                      {service.description ||
                        "Atendimento profissional completo."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-dolly-200/60">
                    <span className="inline-flex items-center text-xs text-neutral-500">
                      <Clock className="w-3.5 h-3.5 mr-1 text-dolly-600" />
                      {service.durationMin} min
                    </span>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="text-xs font-bold text-roseGold hover:text-roseGold-dark uppercase tracking-wider"
                    >
                      Agendar →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Galeria Demonstrativa */}
      <section id="galeria" className="py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-serif font-bold text-dolly-900">
              Galeria de Resultados
            </h2>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 inline-block px-3 py-1 rounded-full">
              ⚠️ Imagens demonstrativas de alta definição para portfólio
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop",
            ].map((imgUrl, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={imgUrl}
                  alt="Nail Art Showcase"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contato */}
      <footer
        id="contato"
        className="mt-auto bg-dolly-900 text-dolly-100 py-12 border-t border-dolly-800 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 text-xs">
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-white">
              Dolly Nail Studio
            </h3>
            <p className="text-dolly-300">
              Especialista Ana Martins • Estética e cuidado refinado para suas
              unhas.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">
              Localização & Contato
            </h4>
            <p className="flex items-center text-dolly-300">
              <MapPin className="w-4 h-4 mr-2 text-roseGold-light" />
              Nova Iguaçu - RJ
            </p>
            <p className="flex items-center text-dolly-300">
              <Camera className="w-4 h-4 mr-2 text-roseGold-light" />
              @dollynail.studio
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">
              Horário de Atendimento
            </h4>
            <p className="text-dolly-300">Terça a Sábado: 09:00 - 18:00</p>
            <p className="text-dolly-300">Domingo e Segunda: Fechado</p>
          </div>
        </div>
      </footer>

      {/* Modal de Agendamento */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        services={services}
      />
    </div>
  );
};
