import { getSudoku } from 'sudoku-gen';

export type Difficulty = (typeof SudokuGenerator.DIFFICULTIES)[keyof typeof SudokuGenerator.DIFFICULTIES];
export type Format = (typeof SudokuGenerator.FORMATS)[keyof typeof SudokuGenerator.FORMATS];

export class SudokuGenerator {
  private sudoku: {
    puzzle: string;
    solution: string;
    difficulty: Difficulty;
  };

  static readonly DIFFICULTIES = Object.freeze({ EASY: 'easy', MEDIUM: 'medium', HARD: 'hard', EXPERT: 'expert' });
  static readonly FORMATS = Object.freeze({ STRING: 'string', MATRIX: 'matrix' });

  constructor(difficulty: Difficulty) {
    this.sudoku = getSudoku(difficulty);
  }

  static isValidDifficulty(argument: unknown): argument is Difficulty {
    return typeof argument === 'string' && Object.values<string>(SudokuGenerator.DIFFICULTIES).includes(argument);
  }

  static isValidFormat(argument: unknown): argument is Format {
    return typeof argument === 'string' && Object.values<string>(SudokuGenerator.FORMATS).includes(argument);
  }

  getResult(format: Format) {
    if (format === SudokuGenerator.FORMATS.MATRIX) {
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
