import { app } from '@/app';

import { describe, expect, test } from '@jest/globals';
import request from 'supertest';

describe('/sudoku', () => {
  test('It should get /sudoku', () =>
    request(app)
      .get('/sudoku')
      .then((res) => {
        expect(res.statusCode).toBe(200);
      }));

  test('Puzzle and solution exist', () =>
    request(app)
      .get('/sudoku')
      .then((res) => {
        expect(res.body).toHaveProperty('puzzle');
        expect(res.body).toHaveProperty('solution');
      }));

  test('If you enter the "string" format, you get the same format and they have 81 symbols', async () => {
    const format = 'string';

    return request(app)
      .get('/sudoku')
      .query({ format })
      .then((res) => {
        expect(typeof res.body.puzzle).toBe('string');
        expect(typeof res.body.solution).toBe('string');
        expect(res.body.puzzle).toHaveLength(81);
        expect(res.body.solution).toHaveLength(81);
      });
  });

  test('If you enter the "matrix" format, you get the same format', async () => {
    const format = 'matrix';

    return request(app)
      .get('/sudoku')
      .query({ format })
      .then((res) => {
        expect(Array.isArray(res.body.puzzle)).toBe(true);
        expect(Array.isArray(res.body.solution)).toBe(true);
      });
  });

  test('If you enter the type of difficulty, you get the same type of difficulty', async () => {
    const difficulty = 'expert';

    return request(app)
      .get(`/sudoku`)
      .query({ difficulty })
      .then((res) => {
        expect(res.body).toHaveProperty('difficulty', difficulty);
      });
  });

  test('If you enter the wrong type of difficulty, you get an error message', async () => {
    const difficulty = 'invalid type of difficulty';

    return request(app)
      .get('/sudoku')
      .query({ difficulty })
      .then((res) => {
        expect(res.statusCode).toBe(400);
      });
  });

  test('if you enter the wrong type of format, you get an error message ', async () => {
    const format = 'invalid type of format';

    return request(app)
      .get('/sudoku')
      .query({ format })
      .then((res) => {
        expect(res.statusCode).toBe(400);
      });
  });

  test('It should return default values when no query parameters are provided', () =>
    request(app)
      .get('/sudoku')
      .then((res) => {
        expect(res.body.difficulty).toBe('easy');
        expect(typeof res.body.puzzle).toBe('string');
        expect(typeof res.body.solution).toBe('string');
      }));

  test('It should return FALSE for Sudoku with duplicate numbers in a row', async () => {
    const puzzle = '---------------------------------------------------------------------------------';
    const wrongPuzzle = '---22----------------------------------------------------------------------------';
    const format = 'string';

    const validPuzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle, format })
      .then((res) => {
        expect(res.body.isOK).toBe(true);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toBe(
          '---------------------------------------------------------------------------------',
        );
      });

    const invalidPuzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle: wrongPuzzle, format })
      .then((res) => {
        expect(res.body.isOK).toBe(false);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toBe(
          '---++----------------------------------------------------------------------------',
        );
      });

    await Promise.all([validPuzzleRequest, invalidPuzzleRequest]);
  });

  test('It should return FALSE for Sudoku with duplicate numbers in a column', async () => {
    const puzzle = '---------------------------------------------------------------------------------';
    const wrongPuzzle = '---------------------------------------------2--------2--------------------------';
    const format = 'string';

    const validPuzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle, format })
      .then((res) => {
        expect(res.body.isOK).toBe(true);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toBe(
          '---------------------------------------------------------------------------------',
        );
      });

    const invalidPuzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle: wrongPuzzle, format })
      .then((res) => {
        expect(res.body.isOK).toBe(false);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toBe(
          '---------------------------------------------+--------+--------------------------',
        );
      });

    await Promise.all([validPuzzleRequest, invalidPuzzleRequest]);
  });

  test('It should return FALSE for Sudoku with duplicate numbers in a box', async () => {
    const puzzle = '---------------------------------------------------------------------------------';
    const wrongPuzzle = '4--------4-----------------------------------------------------------------------';
    const format = 'string';

    const validPuzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle, format })
      .then((res) => {
        expect(res.body.isOK).toBe(true);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toBe(
          '---------------------------------------------------------------------------------',
        );
      });

    const invalidPuzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle: wrongPuzzle, format })
      .then((res) => {
        expect(res.body.isOK).toBe(false);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toBe(
          '+--------+-----------------------------------------------------------------------',
        );
      });

    await Promise.all([validPuzzleRequest, invalidPuzzleRequest]);
  });

  test('It should return FALSE for sudoku with duplicate numbers and the "errors" should only be "+"', async () => {
    const puzzle = '111111111111111111111111111111111111111111111111111111111111111111111111111111111';
    const format = 'string';

    return request(app)
      .get('/sudoku/validate')
      .query({ puzzle, format })
      .then((res) => {
        expect(res.body.isOK).toBe(false);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toBe(
          '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++',
        );
      });
  });

  test('It should return TRUE if the sudoku is completely solved and matches isWin', async () => {
    const puzzle = '4172-8--9-651-----32-5--6-1-49-5-78-5-3-924-6---4----5294-7-1-3-3-9--24---------7';
    const solvedPuzzle = '417268539965137824328549671149653782583792416672481395294876153736915248851324967';
    const format = 'string';

    const puzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle, format })
      .then((res) => {
        expect(res.body.isOK).toBe(true);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toBe(
          '---------------------------------------------------------------------------------',
        );
      });

    const solvedPuzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle: solvedPuzzle, format })
      .then((res) => {
        expect(res.body.isOK).toBe(true);
        expect(res.body.isWin).toBe(true);
        expect(res.body.errors).toBe(
          '---------------------------------------------------------------------------------',
        );
      });

    await Promise.all([puzzleRequest, solvedPuzzleRequest]);
  });

  test('It should return TRUE if the sudoku is solved correctly and matches isOK', async () => {
    const puzzle = '4172-8--9-651-----32-5--6-1-49-5-78-5-3-924-6---4----5294-7-1-3-3-9--24---------7';
    const almostSolvedPuzzle = '4172685399651378243285496711496537825837924166724813952948761537369152488513249-7';
    const format = 'string';

    const puzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle, format })
      .then((res) => {
        expect(res.body.isOK).toBe(true);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toBe(
          '---------------------------------------------------------------------------------',
        );
      });

    const almostSolvedPuzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle: almostSolvedPuzzle, format })
      .then((res) => {
        expect(res.body.isOK).toBe(true);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toBe(
          '---------------------------------------------------------------------------------',
        );
      });

    await Promise.all([puzzleRequest, almostSolvedPuzzleRequest]);
  });

  test('It should return FALSE for sudoku with duplicate numbers and the "errors" should only be "+" (matrix)', async () => {
    const puzzle = [
      ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
      ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
      ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
      ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
      ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
      ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
      ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
      ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
      ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
    ];
    const format = 'matrix';

    return request(app)
      .get('/sudoku/validate')
      .query({ puzzle: JSON.stringify(puzzle), format })
      .then((res) => {
        expect(res.body.isOK).toBe(false);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toStrictEqual([
          ['+', '+', '+', '+', '+', '+', '+', '+', '+'],
          ['+', '+', '+', '+', '+', '+', '+', '+', '+'],
          ['+', '+', '+', '+', '+', '+', '+', '+', '+'],
          ['+', '+', '+', '+', '+', '+', '+', '+', '+'],
          ['+', '+', '+', '+', '+', '+', '+', '+', '+'],
          ['+', '+', '+', '+', '+', '+', '+', '+', '+'],
          ['+', '+', '+', '+', '+', '+', '+', '+', '+'],
          ['+', '+', '+', '+', '+', '+', '+', '+', '+'],
          ['+', '+', '+', '+', '+', '+', '+', '+', '+'],
        ]);
      });
  });

  test('It should return TRUE if the sudoku is solved correctly and matches isOK (matrix)', async () => {
    const puzzle = [
      ['-', '-', '4', '5', '-', '1', '7', '-', '-'],
      ['-', '1', '-', '-', '8', '9', '-', '-', '3'],
      ['-', '-', '-', '7', '-', '4', '6', '-', '1'],
      ['5', '-', '9', '2', '-', '7', '-', '-', '8'],
      ['-', '-', '6', '9', '-', '-', '-', '-', '7'],
      ['7', '-', '-', '8', '-', '3', '-', '6', '-'],
      ['8', '7', '-', '4', '9', '2', '3', '-', '-'],
      ['4', '-', '3', '-', '-', '-', '-', '9', '-'],
      ['-', '-', '-', '3', '5', '6', '-', '-', '-'],
    ];
    const almostSolvedPuzzle = [
      ['6', '3', '4', '5', '2', '1', '7', '8', '-'],
      ['2', '1', '7', '6', '8', '9', '4', '5', '3'],
      ['9', '5', '8', '7', '3', '4', '6', '2', '1'],
      ['5', '4', '9', '2', '6', '7', '1', '3', '8'],
      ['3', '8', '6', '9', '1', '5', '2', '4', '7'],
      ['7', '2', '1', '8', '4', '3', '9', '6', '5'],
      ['8', '7', '5', '4', '9', '2', '3', '1', '6'],
      ['4', '6', '3', '1', '7', '8', '5', '9', '2'],
      ['1', '9', '2', '3', '5', '6', '8', '7', '4'],
    ];
    const format = 'matrix';

    const puzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle: JSON.stringify(puzzle), format })
      .then((res) => {
        expect(res.body.isOK).toBe(true);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toStrictEqual([
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ]);
      });

    const almostSolvedPuzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle: JSON.stringify(almostSolvedPuzzle), format })
      .then((res) => {
        expect(res.body.isOK).toBe(true);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toStrictEqual([
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ]);
      });

    await Promise.all([puzzleRequest, almostSolvedPuzzleRequest]);
  });

  test('It should return TRUE if the sudoku is completely solved and matches isWin (matrix)', async () => {
    const puzzle = [
      ['-', '-', '4', '5', '-', '1', '7', '-', '-'],
      ['-', '1', '-', '-', '8', '9', '-', '-', '3'],
      ['-', '-', '-', '7', '-', '4', '6', '-', '1'],
      ['5', '-', '9', '2', '-', '7', '-', '-', '8'],
      ['-', '-', '6', '9', '-', '-', '-', '-', '7'],
      ['7', '-', '-', '8', '-', '3', '-', '6', '-'],
      ['8', '7', '-', '4', '9', '2', '3', '-', '-'],
      ['4', '-', '3', '-', '-', '-', '-', '9', '-'],
      ['-', '-', '-', '3', '5', '6', '-', '-', '-'],
    ];
    const solvedPuzzle = [
      ['6', '3', '4', '5', '2', '1', '7', '8', '9'],
      ['2', '1', '7', '6', '8', '9', '4', '5', '3'],
      ['9', '5', '8', '7', '3', '4', '6', '2', '1'],
      ['5', '4', '9', '2', '6', '7', '1', '3', '8'],
      ['3', '8', '6', '9', '1', '5', '2', '4', '7'],
      ['7', '2', '1', '8', '4', '3', '9', '6', '5'],
      ['8', '7', '5', '4', '9', '2', '3', '1', '6'],
      ['4', '6', '3', '1', '7', '8', '5', '9', '2'],
      ['1', '9', '2', '3', '5', '6', '8', '7', '4'],
    ];
    const format = 'matrix';

    const puzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle: JSON.stringify(puzzle), format })
      .then((res) => {
        expect(res.body.isOK).toBe(true);
        expect(res.body.isWin).toBe(false);
        expect(res.body.errors).toStrictEqual([
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ]);
      });

    const solvedPuzzleRequest = request(app)
      .get('/sudoku/validate')
      .query({ puzzle: JSON.stringify(solvedPuzzle), format })
      .then((res) => {
        expect(res.body.isOK).toBe(true);
        expect(res.body.isWin).toBe(true);
        expect(res.body.errors).toStrictEqual([
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ]);
      });

    await Promise.all([puzzleRequest, solvedPuzzleRequest]);
  });
});
