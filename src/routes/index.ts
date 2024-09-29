import { Router } from 'express';
import sudoku from './sudoku';

const router = Router();

router.use('/sudoku', sudoku);

export { router };
