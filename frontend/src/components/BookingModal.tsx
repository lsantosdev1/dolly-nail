import React, { useState, useEffect } from "react";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import type { Service } from "../types/index";
import { api } from "../services/api";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  services,
}) => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Selecionar o primeiro serviço por padrão ao abrir
  useEffect(() => {
    if (services.length > 0 && !selectedService) {
      setSelectedService(services[0].id);
    }
  }, [services, selectedService]);

  // Buscar slots disponíveis sempre que a data ou serviço mudar
  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchSlots();
    }
  }, [selectedDate, selectedService]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    setSelectedSlot("");
    setErrorMsg("");
    try {
      const response = await api.get("/appointments/available-slots", {
        params: { date: selectedDate, serviceId: selectedService },
      });
      setAvailableSlots(response.data.slots || []);
    } catch (err) {
      setErrorMsg("Não foi possível carregar os horários para esta data.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setSubmitting(true);
    setErrorMsg("");

    try {
      await api.post("/appointments", {
        clientName,
        clientPhone,
        clientEmail,
        serviceId: selectedService,
        startTime: selectedSlot,
      });

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Erro ao realizar o agendamento.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Função para gerar o link formatado do WhatsApp
  const handleWhatsAppRedirect = () => {
    const serviceObj = services.find((s) => s.id === selectedService);
    const serviceName = serviceObj ? serviceObj.name : "Atendimento";

    const slotDate = new Date(selectedSlot);
    const dateFormatted = slotDate.toLocaleDateString("pt-BR");
    const timeFormatted = slotDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const message = `Olá, Dolly Nail! 👋\n\nAcabei de realizar um agendamento online pelo site:\n\n👤 *Nome:* ${clientName}\n💅 *Serviço:* ${serviceName}\n📅 *Data:* ${dateFormatted}\n⏰ *Horário:* ${timeFormatted}\n\nGostaria de confirmar meu atendimento!`;

    // Telefone fictício do estúdio: (21) 99999-9999
    const studioPhone = "5521999999999";
    const whatsappUrl = `https://wa.me/${studioPhone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-dolly-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-dolly-900 font-bold mb-2">
              Agendamento Confirmado!
            </h3>
            <p className="text-xs text-neutral-600 mb-6 max-w-xs mx-auto">
              Seu horário foi registrado em nosso sistema. Envie uma confirmação
              direta para o WhatsApp do estúdio para concluir!
            </p>

            <div className="space-y-3">
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar Confirmação via WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setSuccess(false);
                  onClose();
                }}
                className="w-full bg-dolly-100 hover:bg-dolly-200 text-dolly-900 py-2.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all"
              >
                Concluir e Fechar
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-serif font-bold text-dolly-900 mb-1">
              Agendar Atendimento
            </h2>
            <p className="text-xs text-neutral-500 mb-6">
              Escolha o serviço, data e horário de sua preferência.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Seleção de Serviço */}
              <div>
                <label className="block text-xs font-bold text-dolly-800 uppercase tracking-wider mb-1">
                  Serviço
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-2.5 bg-dolly-50 border border-dolly-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-roseGold"
                  required
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - R$ {Number(service.price).toFixed(2)} (
                      {service.durationMin} min)
                    </option>
                  ))}
                </select>
              </div>

              {/* Data */}
              <div>
                <label className="block text-xs font-bold text-dolly-800 uppercase tracking-wider mb-1">
                  Data desejada
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-dolly-50 border border-dolly-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-roseGold"
                    required
                  />
                  <CalendarIcon className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Horários Disponíveis */}
              {selectedDate && (
                <div>
                  <label className="block text-xs font-bold text-dolly-800 uppercase tracking-wider mb-1">
                    Horários Disponíveis
                  </label>
                  {loadingSlots ? (
                    <p className="text-xs text-neutral-500 py-2">
                      Buscando horários livres...
                    </p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-xs text-rose-600 py-2">
                      Sem horários vagos nesta data.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                      {availableSlots.map((slot) => {
                        const timeFormatted = new Date(slot).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        );
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                              isSelected
                                ? "bg-roseGold text-white border-roseGold shadow-sm"
                                : "bg-dolly-50 text-dolly-900 border-dolly-200 hover:border-roseGold"
                            }`}
                          >
                            <Clock className="w-3 h-3 inline mr-1" />
                            {timeFormatted}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <hr className="border-dolly-100 my-4" />

              {/* Dados do Cliente */}
              <div>
                <label className="block text-xs font-bold text-dolly-800 uppercase tracking-wider mb-1">
                  Seu Nome
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-dolly-50 border border-dolly-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-roseGold"
                    required
                  />
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dolly-800 uppercase tracking-wider mb-1">
                  WhatsApp / Telefone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="(21) 99999-9999"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-dolly-50 border border-dolly-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-roseGold"
                    required
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dolly-800 uppercase tracking-wider mb-1">
                  E-mail (opcional)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-dolly-50 border border-dolly-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-roseGold"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !selectedSlot}
                className="w-full mt-4 bg-roseGold hover:bg-roseGold-dark disabled:opacity-50 text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                {submitting ? "Confirmando..." : "Confirmar Agendamento"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
