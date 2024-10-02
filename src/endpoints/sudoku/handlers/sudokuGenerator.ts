import { pick } from '@/utils/pick';
import { getSudoku } from 'sudoku-gen';

const DIFFICULTIES = Object.freeze({ EASY: 'easy', MEDIUM: 'medium', HARD: 'hard', EXPERT: 'expert' });
const FORMATS = Object.freeze({ STRING: 'string', MATRIX: 'matrix' });

export class SudokuGenerator {
  private sudoku: {
    puzzle: string;
    solution: string;
  };

  constructor(difficulty: (typeof DIFFICULTIES)[keyof typeof DIFFICULTIES]) {
    this.sudoku = pick(getSudoku(difficulty), ['puzzle', 'solution']);
  }

  getResult(format: (typeof FORMATS)[keyof typeof FORMATS]) {
    if (format === FORMATS.MATRIX) {
      return {
        puzzle: this.sudoku.puzzle.match(/.{9}/g)!.map((row) => row.split('')),
        solution: this.sudoku.solution.match(/.{9}/g)!.map((row) => row.split('')),
      };
    }

    return this.sudoku;
  }
}
