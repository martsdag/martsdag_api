import { Router } from 'express';
import { Sudoku } from '@/endpoints/sudoku/handlers/sudokuHandler';

const router = Router();

router.get('/', (req, res) => {
  // TODO: исправить
  const difficulty = (req.query.difficulty as 'easy' | 'medium' | 'hard' | 'expert') || 'easy';
  const format = (req.query.format as 'string' | 'matrix') || 'string';

  res.send(new Sudoku(difficulty).getResult(format));
});

router.get('/model', (req, res) => {
  const difficulty = (req.query.difficulty as 'easy' | 'medium' | 'hard' | 'expert') || 'easy';
  const format = (req.query.format as 'matrix') || 'string';

  const userModel = req.query.model ? JSON.parse(req.query.model as string) : null;

  const sudoku = new Sudoku(difficulty);
  const model = sudoku.getModel(userModel, format);

  res.send(model);
});

export { router as sudoku };
