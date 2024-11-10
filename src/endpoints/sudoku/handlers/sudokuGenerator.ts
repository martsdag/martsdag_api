import { getSudoku } from 'sudoku-gen';

export type Difficulty = (typeof SudokuGenerator.DIFFICULTIES)[keyof typeof SudokuGenerator.DIFFICULTIES];
export type Format = (typeof SudokuGenerator.FORMATS)[keyof typeof SudokuGenerator.FORMATS];

interface ValidationResult {
  isOK: boolean;
  isWin: boolean;
  errors: string;
}

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

  static isValidPuzzle(argument: unknown): argument is string {
    return typeof argument === 'string' && /^[1-9-]{1,81}$/.test(argument);
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

  static validate(puzzle: string): ValidationResult {
    let isOK = true;
    let isWin = true;
    const errorsArray = Array(81).fill(false);

    const rows: Array<string[]> = Array.from({ length: 9 }, () => []);
    const columns: Array<string[]> = Array.from({ length: 9 }, () => []);
    const boxes: Array<string[]> = Array.from({ length: 9 }, () => []);

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const index = i * 9 + j;
        const cell = puzzle[index];

        if (cell === '-') {
          isWin = false;
          continue;
        }

        if (rows[i].includes(cell)) {
          for (let k = 0; k < 9; k++) {
            if (puzzle[i * 9 + k] === cell) {
              errorsArray[i * 9 + k] = true;
            }
          }

          isOK = false;
        } else {
          rows[i].push(cell);
        }

        if (columns[j].includes(cell)) {
          for (let k = 0; k < 9; k++) {
            if (puzzle[k * 9 + j] === cell) {
              errorsArray[k * 9 + j] = true;
            }
          }

          isOK = false;
        } else {
          columns[j].push(cell);
        }

        const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

        if (boxes[boxIndex].includes(cell)) {
          for (let bi = 0; bi < 3; bi++) {
            for (let bj = 0; bj < 3; bj++) {
              const boxIndex = (Math.floor(i / 3) * 3 + bi) * 9 + (Math.floor(j / 3) * 3 + bj);

              if (puzzle[boxIndex] === cell) {
                errorsArray[boxIndex] = true;
              }
            }
          }

          isOK = false;
        } else {
          boxes[boxIndex].push(cell);
        }
      }
    }

    const errors = errorsArray.map((hasError) => (hasError ? '+' : '-')).join('');

    return {
      errors,
      isOK,
      isWin: isWin && isOK,
    };
  }
}
