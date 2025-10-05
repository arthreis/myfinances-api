import { Router } from 'express';
import { register } from '../../monitoring/metrics';

const metricsRouter = Router();

metricsRouter.get('/', async (_request, response) => {
  response.set('Content-Type', register.contentType);
  response.end(await register.metrics());
});

export default metricsRouter;
