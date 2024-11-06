import { Router } from 'express';
import { SudokuGenerator } from '@/endpoints/sudoku/handlers/sudokuGenerator';

const router = Router();

router.get('/', (req, res) => {
  // TODO: исправить
  const difficulty = (req.query.difficulty as 'easy' | 'medium' | 'hard' | 'expert') || 'easy';
  const format = (req.query.format as 'string' | 'matrix') || 'string';

  if (SudokuGenerator.isValidDifficulty(difficulty)) {
    return res.status(400).json({ error: 'Invalid type of difficulty' });
  }

  res.send(new SudokuGenerator(difficulty).getResult(format));
});

export { router as sudoku };
