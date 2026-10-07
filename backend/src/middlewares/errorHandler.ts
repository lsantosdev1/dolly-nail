import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      message: "Erro de validação nos dados enviados.",
      errors: error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  console.error("❌ Internal Error:", error);

  return res.status(500).json({
    status: "error",
    message: "Erro interno no servidor.",
  });
}
