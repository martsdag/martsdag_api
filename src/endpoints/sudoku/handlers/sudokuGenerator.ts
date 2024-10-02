import { Sudoku } from 'sudoku-gen/dist/types/sudoku.type';

enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
  Expert = 'expert',
}

class SudokuGenerator {
  private difficulty: Difficulty;

  constructor(difficulty: Difficulty = Difficulty.Easy) {
    this.difficulty = difficulty;
  }

  public setDifficulty(difficulty: Difficulty) {
    this.difficulty = difficulty;
  }

  public generatePuzzle(): Sudoku {
    const sudoku: Sudoku = {
      puzzle: '',
      solution: '',
      difficulty: this.difficulty,
    };

    const generated = this.generateSudokuByDifficulty();

    sudoku.puzzle = generated.puzzle;
    sudoku.solution = generated.solution;

    return sudoku;
  }

  private generateSudokuByDifficulty(): { puzzle: string; solution: string } {
    const puzzle = '';
    const solution = '';

    return { puzzle, solution };
  }
}

export { SudokuGenerator, Difficulty };

const sudokuGenerator = new SudokuGenerator();

sudokuGenerator.generatePuzzle();

export default sudokuGenerator;
