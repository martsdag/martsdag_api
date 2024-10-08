import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from './router';

const port = process.env.PORT;
const domainName = process.env.DOMAIN_NAME;

export const app = express().use(express.json()).use(router).use(cors());

app.listen(port, () => {
  console.log(`http://${domainName}:${port}`);
});
