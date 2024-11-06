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

  test('If you enter the "string" format, you get the same format and have 81 symbols', async () => {
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
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.puzzle)).toBe(true);
        expect(Array.isArray(res.body.solution)).toBe(true);
      });
  });

  test('default difficulty = easy', () => {
    request(app)
      .get('/sudoku')
      .then((res) => {
        expect(res.body.difficulty).toBe('easy');
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

  test('If i enter the wrong type of difficulty, you get an error message', async () => {
    const difficulty = 'extraHard';

    return request(app)
      .get('/sudoku')
      .query({ difficulty })
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid type of difficulty');
      });
  });
});
