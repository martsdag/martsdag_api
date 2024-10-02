import { Router } from 'express';
import sudokuGenerator, { Difficulty } from '@/endpoints/sudoku/handlers/sudokuGenerator';

const router = Router();

router.get('/', (req, res) => {
  const difficulty = (req.query.difficulty as string) || 'easy';

  sudokuGenerator.setDifficulty(difficulty as Difficulty);

  const puzzle = sudokuGenerator.generatePuzzle();

  res.send(puzzle);
});
export { router as sudoku };
