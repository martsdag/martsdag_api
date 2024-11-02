import { pick } from '@/utils/pick';
import { getSudoku } from 'sudoku-gen';

const DIFFICULTIES = Object.freeze({ EASY: 'easy', MEDIUM: 'medium', HARD: 'hard', EXPERT: 'expert' });
const FORMATS = Object.freeze({ STRING: 'string', MATRIX: 'matrix' });

interface ValidationResult {
  errors: Array<Array<'+' | '-'>>;
  isOK: boolean;
  isWin: boolean;
}

export class SudokuHandler {
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

  static validate(puzzle: string): ValidationResult {
    const errors: Array<Array<'+' | '-'>> = [];
    let isOK = true;
    let isWin = true;

    for (let i = 0; i < 9; i++) {
      const rowErrors: Array<'+' | '-'> = [];
      const noticedInRow = new Set();

      for (let j = 0; j < 9; j++) {
        const puzzleIndex = i * 9 + j;
        const value = puzzle[puzzleIndex];

        if (value === '0') {
          rowErrors.push('-');
        } else if (noticedInRow.has(value)) {
          rowErrors.push('+');
          isOK = false;
          isWin = false;
        } else {
          rowErrors.push('-');
          noticedInRow.add(value);
        }
      }

      errors.push(rowErrors);
    }

    for (let j = 0; j < 9; j++) {
      const colErrors: Array<'+' | '-'> = [];
      const noticedInCol = new Set();

      for (let i = 0; i < 9; i++) {
        const puzzleIndex = i * 9 + j;
        const value = puzzle[puzzleIndex];

        if (value === '0') {
          colErrors.push('-');
        } else if (noticedInCol.has(value)) {
          colErrors.push('+');
          isOK = false;
          isWin = false;
        } else {
          colErrors.push('-');
          noticedInCol.add(value);
        }
      }

      errors.push(colErrors);
    }

    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const boxErrors: Array<'+' | '-'> = [];
        const noticedInBox = new Set();

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const puzzleIndex = (boxRow * 3 + i) * 9 + (boxCol * 3 + j);
            const value = puzzle[puzzleIndex];

            if (value === '0') {
              boxErrors.push('-');
            } else if (noticedInBox.has(value)) {
              boxErrors.push('+');
              isOK = false;
              isWin = false;
            } else {
              boxErrors.push('-');
              noticedInBox.add(value);
            }
          }
        }

        errors.push(boxErrors);
      }
    }

    return {
      errors,
      isOK,
      isWin,
    };
  }
}
