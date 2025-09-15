import app from '../../../app.js';

const NUMBER_PORT = process.env.APP_PORT;
const ENVIRONMENT = process.env.NODE_ENV;

app.listen(NUMBER_PORT, () => {
  console.log(`🚀 Server started on port ${NUMBER_PORT}! [${ENVIRONMENT}]`);
});
