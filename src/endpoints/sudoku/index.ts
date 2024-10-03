import { Router } from 'express';
import { SudokuGenerator } from '@/endpoints/sudoku/handlers/sudokuGenerator';

const router = Router();

//TODO: исправить 8 и 9 строчки
router.get('/', (req, res) => {
  const difficulty = (req.query.difficulty as 'easy' | 'medium' | 'hard' | 'expert') || 'easy';
  const format = (req.query.format as 'string' | 'matrix') || 'string';

  res.send(new SudokuGenerator(difficulty).getResult(format));
});

export { router as sudoku };
