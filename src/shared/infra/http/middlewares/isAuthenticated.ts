import { Request, Response, NextFunction, request } from 'express';
import jwt from 'jsonwebtoken';

import AppError from '../../../errors/AppError.js';
import { env } from '../../../../env/index.js';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const { authorization } = req.headers;

  if (!authorization) throw new AppError('JWT Token is Missing', 401);

  const [, token] = authorization.split(' ');

  try {
    const decoded = jwt.verify(token, env.AUTH_JWT_SECRET);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    next();
  } catch {
    throw new AppError('Invalid JWT', 401);
  }
}
