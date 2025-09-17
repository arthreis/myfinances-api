import { Router, type Request, type Response } from 'express';
import packageJson from '@/../package.json' with { type: "json" };
import { dataSource } from "../../typeorm/config/datasources/ormconfig.js";
import { env } from '@/env/index.js';
const healthRouter = Router();

const appStartTime = Date.now();

healthRouter.get("/", async (_req: Request, res: Response) => {
  let dbStatus = "ok";
  let dbResponseTime: number | null = null;

  try {
    const start = Date.now();
    await dataSource.query("SELECT 1");
    dbResponseTime = Date.now() - start;
  } catch (err) {
    console.error("Database connection error:", err);
    dbStatus = "offline";
  }

  const ENV = env.NODE_ENV || "development";

  const response: any = {
    status: dbStatus === "ok" ? "ok" : "offline",
    database: {
      status: dbStatus,
      responseTimeMs: dbResponseTime,
    },
    version: packageJson.version,
    uptimeSeconds: Math.floor((Date.now() - appStartTime) / 1000),
    message: "MyFinances API Healthcheck",
  };

  if (ENV !== "production") {
    response.env = ENV;
  }

  return res.json(response);
});

export default healthRouter;
