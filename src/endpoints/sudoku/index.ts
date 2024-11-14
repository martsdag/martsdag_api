import { Request, Response, Router } from 'express';
import { Difficulty, Format, SudokuGenerator } from '@/endpoints/sudoku/handlers/sudokuGenerator';
import { validatePuzzleQuery } from '@/middleware/validators';

const router = Router();

router.get('/', (req, res) => {
  const maybeDifficulty = req.query.difficulty;
  const maybeFormat = req.query.format;

  const isValidDifficultyQuery = (argument: unknown): argument is undefined | Difficulty =>
    argument === undefined || SudokuGenerator.isValidDifficulty(argument);

  const isValidFormatQuery = (argument: unknown): argument is undefined | Format =>
    argument === undefined || SudokuGenerator.isValidFormat(argument);

  if (!isValidDifficultyQuery(maybeDifficulty)) {
    res.status(400).json({ error: 'Invalid type of difficulty' });

    return;
  }

  if (!isValidFormatQuery(maybeFormat)) {
    res.status(400).json({ error: 'Invalid type of format' });

    return;
  }

  res.send(
    new SudokuGenerator(maybeDifficulty ?? SudokuGenerator.DIFFICULTIES.EASY).getResult(
      maybeFormat ?? SudokuGenerator.FORMATS.STRING,
    ),
  );
});

router.get('/validate', validatePuzzleQuery, (req: Request, res: Response) => {
  const maybePuzzle = req.query.puzzle as string | string[][];

  res.send(SudokuGenerator.validate(maybePuzzle));
});

export { router as sudoku };
