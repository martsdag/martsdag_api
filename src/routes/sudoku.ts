import { Router } from 'express';
import { getSudoku } from 'sudoku-gen';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

const router = Router();

const validDifficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

router.get('/', (req, res) => {
  const difficulty = validDifficulties.includes(req.query.difficulty as Difficulty)
    ? (req.query.difficulty as Difficulty)
    : 'easy';

  const sudoku = getSudoku(difficulty);

  res.send(sudoku);
});

export default router;
