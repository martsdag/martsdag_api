import { Router } from 'express';
import { sudoku } from '@/endpoints/sudoku';

const router = Router();

router.use('/sudoku', sudoku);

export { router };
