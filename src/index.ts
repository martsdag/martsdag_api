import 'dotenv/config';
import express from 'express';
import { router } from './routes';

const app = express();
const port = process.env.PORT;
const domainName = process.env.DOMAIN_NAME;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`http://${domainName}:${port}`);
});
