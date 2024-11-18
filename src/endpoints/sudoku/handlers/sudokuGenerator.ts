import { getSudoku } from 'sudoku-gen';

export type Difficulty = (typeof SudokuGenerator.DIFFICULTIES)[keyof typeof SudokuGenerator.DIFFICULTIES];
export type Format = (typeof SudokuGenerator.FORMATS)[keyof typeof SudokuGenerator.FORMATS];

interface ValidationResult {
  isOK: boolean;
  isWin: boolean;
  errors: string | string[][];
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

  private static stringToMatrix(string: string) {
    return (string.match(/.{9}/g) ?? []).map((rowOrCol) => rowOrCol.split(''));
  }

  getResult(format: Format) {
    if (format === SudokuGenerator.FORMATS.MATRIX) {
      return {
        puzzle: SudokuGenerator.stringToMatrix(this.sudoku.puzzle),
        solution: SudokuGenerator.stringToMatrix(this.sudoku.solution),
        difficulty: this.sudoku.difficulty,
      };
    }

    return this.sudoku;
  }

  static validate(puzzle: string | string[][], format: Format): ValidationResult {
    let isOK = true;
    const errorsArray = Array(81).fill(false);

    const rows: Array<string[]> = Array.from({ length: 9 }, () => []);
    const columns: Array<string[]> = Array.from({ length: 9 }, () => []);
    const boxes: Array<string[]> = Array.from({ length: 9 }, () => []);

    const getCell = (i: number, j: number): string => {
      if (typeof puzzle === 'string') {
        return puzzle[i * 9 + j];
      } else {
        return puzzle[i][j];
      }
    };

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cell = getCell(i, j);

        if (cell === '-') {
          continue;
        }

        if (rows[i].includes(cell)) {
          for (let k = 0; k < 9; k++) {
            if (getCell(i, k) === cell) {
              errorsArray[i * 9 + k] = true;
            }
          }

          isOK = false;
        } else {
          rows[i].push(cell);
        }

        if (columns[j].includes(cell)) {
          for (let k = 0; k < 9; k++) {
            if (getCell(k, j) === cell) {
              errorsArray[k * 9 + j] = true;
            }
          }

          isOK = false;
        } else {
          columns[j].push(cell);
        }

        const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        const boxStartRow = Math.floor(i / 3) * 3;
        const boxStartCol = Math.floor(j / 3) * 3;

        if (boxes[boxIndex].includes(cell)) {
          for (let bi = 0; bi < 3; bi++) {
            for (let bj = 0; bj < 3; bj++) {
              const boxIndex = (boxStartRow + bi) * 9 + (boxStartCol + bj);

              if (getCell(boxStartRow + bi, boxStartCol + bj) === cell) {
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

    const isWin = isOK && (typeof puzzle === 'string' ? !puzzle.includes('-') : !puzzle.flat().includes('-'));

    return {
      isOK,
      isWin,
      errors:
        format === SudokuGenerator.FORMATS.MATRIX
          ? SudokuGenerator.stringToMatrix(errorsArray.map((hasError) => (hasError ? '+' : '-')).join(''))
          : errorsArray.map((hasError) => (hasError ? '+' : '-')).join(''),
    };
  }
}
