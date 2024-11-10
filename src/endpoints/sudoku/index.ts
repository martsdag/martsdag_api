import { Router } from 'express';
import { Difficulty, Format, SudokuGenerator } from '@/endpoints/sudoku/handlers/sudokuGenerator';

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

router.get('/validate', (req, res) => {
  const maybePuzzle = req.query.puzzle;

  const isValidPuzzleQuery = (argument: unknown): argument is string =>
    argument === undefined || SudokuGenerator.isValidPuzzle(argument);

  if (!isValidPuzzleQuery(maybePuzzle)) {
    res.status(400).json({ error: 'Invalid puzzle format' });

    return;
  }

  res.send(SudokuGenerator.validate(maybePuzzle));
});

export { router as sudoku };
