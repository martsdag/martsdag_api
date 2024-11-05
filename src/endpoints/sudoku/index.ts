import { Router } from 'express';
import { SudokuHandler } from '@/endpoints/sudoku/handlers/sudokuHandler';

const router = Router();

router.get('/', (req, res) => {
  // TODO: исправить
  const difficulty = (req.query.difficulty as 'easy' | 'medium' | 'hard' | 'expert') || 'easy';
  const format = (req.query.format as 'string' | 'matrix') || 'string';

  res.send(new SudokuHandler(difficulty).getResult(format));
});

router.get('/validation', (req, res) => {
  const puzzle = req.query.puzzle as 'string' | 'matrix';

  if (typeof puzzle !== 'string' && !Array.isArray(puzzle)) {
    return res.sendStatus(404);
  }

  res.send(SudokuHandler.validate(puzzle));
});

export { router as sudoku };
