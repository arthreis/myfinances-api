import { Router, type Request, type Response } from 'express';
import packageJson from '../../../../../package.json';
import { env } from '@/env';
import { dataSource } from '../../typeorm/config/datasources/ormconfig';

const healthRouter = Router();
const appStartTime = Date.now();

interface HealthcheckResponse {
  status: "ok" | "degraded";
  database: {
    status: "online" | "offline";
    responseTimeMs: number | null;
  };
  version: string;
  uptimeSeconds: number;
  message: string;
  env?: string;
}

healthRouter.get("/", async (_req: Request, res: Response) => {
  let dbStatus: 'ok' | 'offline' = "ok";
  let dbResponseTime: number | null = null;
  const currentTime = Date.now();

  try {
    const start = Date.now();
    await dataSource.query("SELECT 1");
    dbResponseTime = Date.now() - start;
  } catch (err) {
    console.error("Database connection error:", err);
    dbStatus = "offline";
  }

  const response: HealthcheckResponse = {
    status: dbStatus === "ok" ? "ok" : "degraded",
    database: {
      status: dbStatus === "ok" ? "online" : "offline",
      responseTimeMs: dbResponseTime,
    },
    version: packageJson.version,
    message: process.env.HEALTHCHECK_MESSAGE || "MyFinances API Healthcheck",
    uptimeSeconds: Math.floor((currentTime - appStartTime) / 1000),
  };

  const _env = env.NODE_ENV;
  if (_env !== "production") {
    response.env = _env;
  }

  return res.json(response);
});

export default healthRouter;
