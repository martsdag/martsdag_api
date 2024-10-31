import { pick } from '@/utils/pick';
import { getSudoku } from 'sudoku-gen';

const DIFFICULTIES = Object.freeze({ EASY: 'easy', MEDIUM: 'medium', HARD: 'hard', EXPERT: 'expert' });
const FORMATS = Object.freeze({ STRING: 'string', MATRIX: 'matrix' });

interface ValidationResult {
  errors?: Array<Array<'+' | '-'>>;
  isOK?: boolean;
  isWin?: boolean;
}

export class Sudoku {
  private sudoku: {
    puzzle: string;
    solution: string;
  };

  constructor(difficulty: (typeof DIFFICULTIES)[keyof typeof DIFFICULTIES]) {
    this.sudoku = pick(getSudoku(difficulty), ['puzzle', 'solution']);
  }

  getResult(format: (typeof FORMATS)[keyof typeof FORMATS]) {
    if (format === FORMATS.MATRIX) {
      const stringToMatrix = (string: string) => (string.match(/.{9}/g) ?? []).map((rowOrCol) => rowOrCol.split(''));

      return {
        puzzle: stringToMatrix(this.sudoku.puzzle),
        solution: stringToMatrix(this.sudoku.solution),
      };
    }

    return this.sudoku;
  }

  getModel(userModel: string[][], format: (typeof FORMATS)[keyof typeof FORMATS]) {
    if (userModel) {
      return this.validationForSudoku(userModel);
    }

    if (format === FORMATS.MATRIX) {
      const stringToMatrix = (string: string) => (string.match(/.{9}/g) ?? []).map((row) => row.split(''));

      return {
        puzzle: stringToMatrix(this.sudoku.puzzle),
      };
    }

    return this.sudoku.puzzle;
  }

  validationForSudoku(userModel: string[][]): ValidationResult {
    const puzzleMatrix = this.stringToMatrix(this.sudoku.puzzle);
    const errors: Array<Array<'+' | '-'>> = Array.from({ length: 9 }, () => Array(9).fill('-'));
    let isComplete = true;
    let hasErrors = false;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const userValue = userModel[row][col];
        const correctValue = puzzleMatrix[row][col];

        if (userValue === '') {
          isComplete = false;
        } else if (userValue !== correctValue) {
          errors[row][col] = '+';
          hasErrors = true;
        }
      }
    }

    if (isComplete && !hasErrors) {
      return { isWin: true };
    }

    if (!isComplete && !hasErrors) {
      return { isOK: true };
    }

    return { errors };
  }

  private stringToMatrix(sudokuString: string): string[][] {
    return (sudokuString.match(/.{9}/g) ?? []).map((row) => row.split(''));
  }
}
