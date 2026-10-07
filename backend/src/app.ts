import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de Segurança e Parsing
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
);
app.use(express.json());

// Limite de Requisições (Rate Limit)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo de 100 requisições por IP
  message:
    "Muitas requisições originadas deste IP, por favor tente novamente mais tarde.",
});
app.use(limiter);

// Rotas
app.use("/api", routes);

// Middleware de Erros
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✨ Servidor Dolly Nail rodando na porta ${PORT}`);
});

export default app;
