import { Router } from "express";
import { login } from "../controllers/authController.js";
import {
  listServices,
  listAllServicesAdmin,
  createService,
  updateService,
} from "../controllers/serviceController.js";
import {
  getAvailableSlots,
  createAppointment,
  listAppointmentsAdmin,
} from "../controllers/appointmentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const routes = Router();

// Auth
routes.post("/auth/login", login);

// Rotas Públicas
routes.get("/services", listServices);
routes.get("/appointments/available-slots", getAvailableSlots);
routes.post("/appointments", createAppointment);

// Rotas Privadas (Admin)
routes.get("/admin/services", authMiddleware, listAllServicesAdmin);
routes.post("/admin/services", authMiddleware, createService);
routes.put("/admin/services/:id", authMiddleware, updateService);
routes.get("/admin/appointments", authMiddleware, listAppointmentsAdmin);

export default routes;
