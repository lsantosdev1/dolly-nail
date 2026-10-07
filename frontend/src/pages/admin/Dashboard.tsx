import React, { useState, useEffect } from "react";
import type { Appointment } from "../../types/index";
import { api } from "../../services/api";
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await api.get("/admin/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-dolly-900">
          Agendamentos do Studio
        </h1>
        <p className="text-xs text-neutral-500">
          Acompanhe os horários marcados por suas clientes em tempo real.
        </p>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-dolly-200 shadow-sm">
          <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">
            Total de Horários
          </p>
          <p className="text-3xl font-serif font-bold text-dolly-900">
            {appointments.length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-dolly-200 shadow-sm">
          <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">
            Confirmados
          </p>
          <p className="text-3xl font-serif font-bold text-emerald-600">
            {appointments.filter((a) => a.status === "CONFIRMED").length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-dolly-200 shadow-sm">
          <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">
            Pendentes / Outros
          </p>
          <p className="text-3xl font-serif font-bold text-amber-600">
            {appointments.filter((a) => a.status !== "CONFIRMED").length}
          </p>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="bg-white rounded-3xl border border-dolly-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-dolly-100 flex justify-between items-center">
          <h2 className="font-serif font-bold text-dolly-900">
            Lista Geral de Atendimentos
          </h2>
          <button
            onClick={loadAppointments}
            className="text-xs font-bold text-roseGold hover:text-roseGold-dark uppercase tracking-wider"
          >
            Atualizar
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            Carregando agendamentos...
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            Nenhum agendamento registrado até o momento.
          </div>
        ) : (
          <div className="divide-y divide-dolly-100">
            {appointments.map((app) => {
              const startDate = new Date(app.startTime);
              const dateFormatted = startDate.toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              const timeFormatted = startDate.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={app.id}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-2.5 py-1 bg-dolly-100 text-dolly-900 rounded-full text-xs font-bold">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-roseGold" />
                        {dateFormatted} às {timeFormatted}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs">
                      <span className="font-bold text-dolly-900 flex items-center">
                        <User className="w-3.5 h-3.5 mr-1 text-neutral-400" />
                        {app.client.name}
                      </span>
                      <a
                        href={`https://wa.me/55${app.client.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-600 hover:text-roseGold flex items-center font-medium"
                      >
                        <Phone className="w-3.5 h-3.5 mr-1 text-neutral-400" />
                        {app.client.phone}
                      </a>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-dolly-900">
                      {app.service.name}
                    </p>
                    <p className="text-xs text-roseGold font-bold">
                      R$ {Number(app.service.price).toFixed(2)} (
                      {app.service.durationMin} min)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
