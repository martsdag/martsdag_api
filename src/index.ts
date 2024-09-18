import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT;
const domainName = process.env.DOMAIN_NAME;

app.get('/', (req, res) => {
  res.send('Sudoku!!!');
});

app.listen(port, () => {
  console.log(`http://${domainName}:${port}`);
});
