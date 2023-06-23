import app from '../../../app';

const NUMBER_PORT = 3344;

app.listen(NUMBER_PORT, () => {
  console.log(`🚀 Server started on port ${NUMBER_PORT}!`);
});
