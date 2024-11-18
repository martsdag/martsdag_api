import { Router } from 'express';
import { Difficulty, Format, SudokuGenerator } from '@/endpoints/sudoku/handlers/sudokuGenerator';

import { query } from 'express-validator';
import { validationCheck } from '@/middleware/validationCheck';

export const validateDifficultyQuery = //
  query('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard', 'expert'])
    .withMessage('Invalid difficulty. Must be one of: easy, medium, hard, expert');

export const validateFormatQuery = //
  query('format') //
    .optional()
    .isIn(['string', 'matrix'])
    .withMessage('Invalid format. Must be one of: string, matrix');

export const validatePuzzleQuery = //
  query('puzzle')
    .exists()
    .withMessage('The puzzle parameter is required')
    .isString()
    .notEmpty()
    .withMessage('Puzzle must be not empty string')
    .customSanitizer((value) => {
      try {
        const parsedValue = JSON.parse(value);

        return Array.isArray(parsedValue) ? parsedValue : value;
      } catch (error) {
        return value;
      }
    })

    .if((value) => typeof value === 'string')
    .isLength({ min: 81, max: 81 })
    .withMessage('The puzzle must be exactly 81 characters long')
    .matches(/^[1-9-]{81}$/)
    .withMessage('The puzzle must be a valid Sudoku puzzle format (containing digits 1-9 or hyphens).')

    .if(
      (value) =>
        Array.isArray(value) && value.length === 9 && value.every((row) => Array.isArray(row) && row.length === 9),
    )
    .withMessage('The puzzle must be a valid 9x9 Sudoku grid represented as a two-dimensional array.')
    .custom((value) => {
      if (Array.isArray(value)) {
        if (value.every((row) => row.every((cell: string) => /^[1-9-]$/.test(cell)))) {
          return true;
        }
      }
    });

const router = Router();

router.get('/', validateDifficultyQuery, validateFormatQuery, validationCheck, (req, res) => {
  const maybeDifficulty = req.query.difficulty as Difficulty;
  const maybeFormat = req.query.format as Format;

  res.send(
    new SudokuGenerator(maybeDifficulty ?? SudokuGenerator.DIFFICULTIES.EASY).getResult(
      maybeFormat ?? SudokuGenerator.FORMATS.STRING,
    ),
  );
});

router.get('/validate', validatePuzzleQuery, validationCheck, (req, res) => {
  const maybePuzzle = req.query.puzzle as string | string[][];
  const maybeFormat = req.query.format as Format;

  res.send(SudokuGenerator.validate(maybePuzzle, maybeFormat));
});

export { router as sudoku };
