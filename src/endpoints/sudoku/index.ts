import { Router } from 'express';
import { Sudoku } from '@/endpoints/sudoku/handlers/sudokuHandler';

const router = Router();

router.get('/', (req, res) => {
  // TODO: исправить
  const difficulty = (req.query.difficulty as 'easy' | 'medium' | 'hard' | 'expert') || 'easy';
  const format = (req.query.format as 'string' | 'matrix') || 'string';

  res.send(new Sudoku(difficulty).getResult(format));
});

export { router as sudoku };
