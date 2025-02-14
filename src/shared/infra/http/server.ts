import app from '../../../app';

const NUMBER_PORT = process.env.APP_PORT;

app.listen(NUMBER_PORT, () => {
  console.log(`🚀 Server started on port ${NUMBER_PORT}!`);
});
