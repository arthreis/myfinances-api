import { Router, type Request, type Response } from 'express';
import packageJson from '../../../../../package.json' with { type: "json" };
const homeRouter = Router();

homeRouter.get('/', (_request: Request, response: Response) => {
  return response.json({
    status: 'online',
    version: packageJson.version,
    message: 'Welcome to MyFinances API',
  });
});

export default homeRouter;
