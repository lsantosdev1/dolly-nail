import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const serviceSchema = z.object({
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
  description: z.string().optional(),
  price: z.number().positive("O preço deve ser um valor positivo"),
  durationMin: z
    .number()
    .int()
    .positive("A duração deve ser em minutos positivos"),
  active: z.boolean().optional(),
});

export async function listServices(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
    return res.json(services);
  } catch (error) {
    return next(error);
  }
}

export async function listAllServicesAdmin(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(services);
  } catch (error) {
    return next(error);
  }
}

export async function createService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = serviceSchema.parse(req.body);
    const service = await prisma.service.create({ data });
    return res.status(201).json(service);
  } catch (error) {
    return next(error);
  }
}

export async function updateService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const data = serviceSchema.partial().parse(req.body);

    const service = await prisma.service.update({
      where: { id },
      data,
    });

    return res.json(service);
  } catch (error) {
    return next(error);
  }
}
