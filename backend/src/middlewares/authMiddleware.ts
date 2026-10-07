import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .json({ message: "Token de autenticação não fornecido." });
  }

  const [, token] = authorization.split(" ");

  try {
    const secret =
      process.env.JWT_SECRET || "dolly_nail_super_secret_jwt_key_2026";
    const decoded = jwt.verify(token, secret) as TokenPayload;

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}
