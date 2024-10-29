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

  getResult(format: (typeof FORMATS)[keyof typeof FORMATS], emptySymbol: string = '') {
    const stringToMatrix = (string: string) =>
      (string.match(/.{9}/g) ?? []).map((rowOrCol) =>
        rowOrCol.split('').map((rowOrCol) => (rowOrCol === '-' ? emptySymbol : rowOrCol)),
      );

    if (format === FORMATS.MATRIX) {
      return {
        puzzle: stringToMatrix(this.sudoku.puzzle),
        solution: stringToMatrix(this.sudoku.solution),
      };
    }

    return this.sudoku;
  }
}
