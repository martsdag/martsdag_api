import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from './router';

export const app = express().use(express.json()).use(cors()).use(router);
