import app from '@/app';
import { env } from "@/env";

const NUMBER_PORT = env.APP_PORT;
const ENVIRONMENT = env.NODE_ENV;

app.listen(NUMBER_PORT, () => {
  console.log(`🚀 Server started on port ${NUMBER_PORT}! [${ENVIRONMENT}]`);
});
