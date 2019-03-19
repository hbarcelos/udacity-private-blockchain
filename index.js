const app = require('./web/app');

const { PORT = 8000 } = process.env;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is running on http://localhost:${PORT}`);
});
