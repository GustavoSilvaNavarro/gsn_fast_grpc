import { newNodePayload } from '@interfaces';
import { validateBody } from '@middlewares';
import { invalidMockPayload, mockPayload, rootNodePayload } from '@mocks';
import type { NextFunction, Request, Response } from 'express';

describe('Schema Validation middleware tests', () => {
  const req = { body: {} } as unknown as Request;
  const next = jest.fn() as NextFunction;
  const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;

  beforeEach(() => {
    req.body = {};
    res.status = jest.fn().mockReturnThis();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateBody', () => {
    test('Should successfully validate payload schema and continue to endpoint', async () => {
      req.body = { ...mockPayload };
      await validateBody(newNodePayload)(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('Should return a status code 400 when validation fails.', async () => {
      req.body = { ...invalidMockPayload };
      await validateBody(newNodePayload)(req, res, next);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        details: [{ field: 'label', message: 'Invalid input: expected string, received undefined' }],
        error: 'Validation failed',
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('Should successfully pass the validation when is a root node.', async () => {
      req.body = { ...rootNodePayload };
      await validateBody(newNodePayload)(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('Should return 400 status code when validation fails if label is empty.', async () => {
      req.body = { ...mockPayload, label: '      ' };
      await validateBody(newNodePayload)(req, res, next);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        details: [{ field: 'label', message: 'Label can not be empty' }],
        error: 'Validation failed',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
