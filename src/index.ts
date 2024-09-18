import 'dotenv/config';
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT;
const domainName = process.env.DOMAIN_NAME;

app.get('/', (req: Request, res: Response) => {
  res.send('Sudoku!!!');
});

app.listen(port, () => {
  console.log(`http:${domainName}${port}`);
});
