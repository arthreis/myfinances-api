import app from '@/app.js';
import { env } from "@/env/index.js";

const NUMBER_PORT = env.APP_PORT;
const ENVIRONMENT = env.NODE_ENV;

app.listen(NUMBER_PORT, () => {
  console.log(`🚀 Server started on port ${NUMBER_PORT}! [${ENVIRONMENT}]`);
});
