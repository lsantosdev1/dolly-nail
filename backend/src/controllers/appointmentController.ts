import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Appointment } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const createAppointmentSchema = z.object({
  clientName: z.string().min(2, "Nome do cliente é obrigatório"),
  clientPhone: z.string().min(10, "Telefone inválido"),
  clientEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),
  serviceId: z.string().uuid("ID de serviço inválido"),
  startTime: z.string().datetime({ message: "Data e hora inválidas" }),
  notes: z.string().optional(),
});

export async function getAvailableSlots(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { date, serviceId } = req.query;

    if (!date || !serviceId) {
      return res
        .status(400)
        .json({ message: "Parâmetros date e serviceId são obrigatórios." });
    }

    const targetDate = new Date(date as string);
    const dayOfWeek = targetDate.getUTCDay();

    // 1. Buscar horário de funcionamento do dia
    const businessHour = await prisma.businessHours.findFirst({
      where: { dayOfWeek },
    });

    if (!businessHour || !businessHour.isOpen) {
      return res.json({
        slots: [],
        message: "O estúdio não abre neste dia da semana.",
      });
    }

    // 2. Buscar duração do serviço
    const service = await prisma.service.findUnique({
      where: { id: serviceId as string },
    });

    if (!service) {
      return res.status(404).json({ message: "Serviço não encontrado." });
    }

    // 3. Definir horário de abertura e fechamento
    const [openHour, openMin] = businessHour.openTime.split(":").map(Number);
    const [closeHour, closeMin] = businessHour.closeTime.split(":").map(Number);

    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(openHour, openMin, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(closeHour, closeMin, 0, 0);

    // 4. Buscar agendamentos existentes no dia
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        startTime: { gte: startOfDay, lte: endOfDay },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    // 5. Calcular slots de 30 em 30 minutos
    const slots = [];
    const slotDurationMs = 30 * 60 * 1000;
    const serviceDurationMs = service.durationMin * 60 * 1000;

    let currentSlotTime = new Date(startOfDay);

    while (
      currentSlotTime.getTime() + serviceDurationMs <=
      endOfDay.getTime()
    ) {
      const slotEndTime = new Date(
        currentSlotTime.getTime() + serviceDurationMs,
      );

      // Verificar sobreposição com agendamentos existentes
      const hasConflict = existingAppointments.some(
        (appointmentItem: Appointment) => {
          const appStart = new Date(appointmentItem.startTime).getTime();
          const appEnd = new Date(appointmentItem.endTime).getTime();
          const currentStart = currentSlotTime.getTime();
          const currentEnd = slotEndTime.getTime();

          return (
            Math.max(currentStart, appStart) < Math.min(currentEnd, appEnd)
          );
        },
      );

      if (!hasConflict) {
        slots.push(currentSlotTime.toISOString());
      }

      currentSlotTime = new Date(currentSlotTime.getTime() + slotDurationMs);
    }

    return res.json({ slots });
  } catch (error) {
    return next(error);
  }
}

export async function createAppointment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      clientName,
      clientPhone,
      clientEmail,
      serviceId,
      startTime,
      notes,
    } = createAppointmentSchema.parse(req.body);

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      return res.status(404).json({ message: "Serviço não encontrado." });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + service.durationMin * 60 * 1000);

    // Buscar ou criar cliente pelo telefone
    let client = await prisma.client.findUnique({
      where: { phone: clientPhone },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: clientName,
          phone: clientPhone,
          email: clientEmail || null,
        },
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId: client.id,
        serviceId: service.id,
        startTime: start,
        endTime: end,
        notes: notes || null,
        status: "CONFIRMED",
      },
      include: {
        client: true,
        service: true,
      },
    });

    return res.status(201).json(appointment);
  } catch (error) {
    return next(error);
  }
}

export async function listAppointmentsAdmin(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        client: true,
        service: true,
      },
      orderBy: { startTime: "asc" },
    });
    return res.json(appointments);
  } catch (error) {
    return next(error);
  }
}
