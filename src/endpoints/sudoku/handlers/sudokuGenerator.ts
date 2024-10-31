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
      const stringToMatrix = (string: string) => (string.match(/.{9}/g) ?? []).map((rowOrCol) => rowOrCol.split(''));

      return {
        puzzle: stringToMatrix(this.sudoku.puzzle),
        solution: stringToMatrix(this.sudoku.solution),
      };
    }

    return this.sudoku;
  }

  isValidUsersBoard(userBoard: string[][]): string[] {
    const rows: string[][] = Array.from({ length: 9 }, () => []);
    const columns: string[][] = Array.from({ length: 9 }, () => []);
    const boxes: string[][] = Array.from({ length: 9 }, () => []);
    const errors: string[] = [];

    for (let i = 0; i < userBoard.length; i++) {
      for (let j = 0; j < userBoard[i].length; j++) {
        const cell: string = userBoard[i][j];

        if (cell !== '-') {
          if (rows[i].includes(cell)) {
            errors.push(`Ошибка в ряду ${i + 1}: дублируется число ${cell}`);
          } else {
            rows[i].push(cell);
          }

          if (columns[j].includes(cell)) {
            errors.push(`Ошибка в колонке ${j + 1}: дублируется число ${cell}`);
          } else {
            columns[j].push(cell);
          }

          const boxIndex: number = Math.floor(i / 3) * 3 + Math.floor(j / 3);

          if (boxes[boxIndex].includes(cell)) {
            errors.push(`Ошибка в блоке ${boxIndex + 1}: дублируется число ${cell}`);
          } else {
            boxes[boxIndex].push(cell);
          }
        }
      }
    }

    return errors;
  }

  checkBoardForWinning(userGrid: string[][]): boolean {
    for (let i = 0; i < userGrid.length; i++) {
      for (let j = 0; j < userGrid[i].length; j++) {
        if (userGrid[i][j] !== this.getResult(FORMATS.MATRIX).solution[i][j]) {
          return false;
        }
      }
    }

    return true;
  }
}
