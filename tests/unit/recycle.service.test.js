const RecycleService = require('../../services/recycle.service');
const createConnection = require('../../db');

jest.mock('../../db');

describe('RecycleService', () => {
  let mockQuery;

  beforeEach(() => {
    jest.clearAllMocks();

    mockQuery = jest.fn();

    createConnection.mockReturnValue({
      promise: () => ({
        query: mockQuery,
      }),
    });
  });

  describe('index', () => {
    it('should return recycle history for a user', async () => {
      const mockRows = [
        {
          item_type: 'plastic',
          item_name: 'soda bottle',
          quantity: 5,
          recycled_at: '2026-03-19',
        },
      ];

      mockQuery.mockResolvedValue([mockRows]);

      const result = await RecycleService.index(1);

      expect(createConnection).toHaveBeenCalledTimes(1);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT item_type, item_name, quantity, recycled_at'),
        [1]
      );

      expect(result).toEqual(mockRows);
    });

    it('should return empty array if no history exists', async () => {
      mockQuery.mockResolvedValue([[]]);

      const result = await RecycleService.index(999);

      expect(result).toEqual([]);
    });

    it('should throw if query fails', async () => {
      mockQuery.mockRejectedValue(new Error('DB error'));

      await expect(RecycleService.index(1)).rejects.toThrow('DB error');
    });

    // it('should throw if DB fails', async () => {
    //   createConnection.mockRejectedValue(new Error('DB error'));

    //   await expect(RecycleService.index(1)).rejects.toThrow('DB error');
    // });
  });

  describe('create', () => {
    it('should insert a recycle record and return result', async () => {
      const mockResult = { insertId: 42 };

      mockQuery.mockResolvedValue([mockResult]);

      const result = await RecycleService.create(
        1,
        'plastic',
        'water bottle',
        3,
        '2026-03-19'
      );

      expect(createConnection).toHaveBeenCalledTimes(1);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO recycle_history'),
        ['plastic', 'water bottle', 3, '2026-03-19', 1]
      );

      expect(result).toEqual(mockResult);
    });

    it('should throw if insert fails', async () => {
      mockQuery.mockRejectedValue(new Error('Insert failed'));

      await expect(
        RecycleService.create(1, 'glass', 'jar', 2, '2026-03-19')
      ).rejects.toThrow('Insert failed');
    });
  });
})