import { getSudoku } from 'sudoku-gen';

const DIFFICULTIES = Object.freeze({ EASY: 'easy', MEDIUM: 'medium', HARD: 'hard', EXPERT: 'expert' });
const FORMATS = Object.freeze({ STRING: 'string', MATRIX: 'matrix' });

type Difficulty = (typeof DIFFICULTIES)[keyof typeof DIFFICULTIES];
type Format = (typeof FORMATS)[keyof typeof FORMATS];

export class SudokuGenerator {
  private sudoku: {
    puzzle: string;
    solution: string;
    difficulty: Difficulty;
  };

  constructor(difficulty: Difficulty) {
    this.sudoku = getSudoku(difficulty);
  }

  static isValidDifficulty(argument: unknown): argument is Difficulty {
    return argument === 'string' && Object.values(DIFFICULTIES).includes(argument as Difficulty);
  }

  getResult(format: Format) {
    if (format === FORMATS.MATRIX) {
      const stringToMatrix = (string: string) => (string.match(/.{9}/g) ?? []).map((rowOrCol) => rowOrCol.split(''));

      return {
        puzzle: stringToMatrix(this.sudoku.puzzle),
        solution: stringToMatrix(this.sudoku.solution),
        difficulty: this.sudoku.difficulty,
      };
    }

    return this.sudoku;
  }
}
