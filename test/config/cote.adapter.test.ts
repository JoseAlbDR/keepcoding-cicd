import { CoteAdapter } from '../../src/config';
import { CustomError } from '../../src/domain';
import { Requester } from 'cote';

const mockRequesterSend = jest.fn();

jest.mock('cote', () => ({
  Requester: jest.fn(() => ({
    send: mockRequesterSend,
  })),
}));

describe('cote.adapter test', () => {
  let coteAdapter: CoteAdapter;

  const options = {
    name: 'TestService',
    type: 'TestEvent',
    additionalKey: 'TestValue',
  };

  beforeEach(() => {
    coteAdapter = new CoteAdapter();
  });

  test('should send a request using requester.send with correct parameters', async () => {
    mockRequesterSend.mockImplementation((event, cb) => {
      cb(null, { response: 'OK' });
    });

    const result = await coteAdapter.request(options);

    expect(Requester).toHaveBeenCalledWith({ name: 'TestService' });

    expect(mockRequesterSend).toHaveBeenCalledWith(
      {
        type: 'TestEvent',
        additionalKey: 'TestValue',
      },
      expect.any(Function)
    );

    expect(result).toEqual({ response: 'OK' });
  });

  test('should return an error when sendin a request', async () => {
    mockRequesterSend.mockImplementation((event, cb) => {
      cb('Failed to send request');
    });

    try {
      await coteAdapter.request(options);
    } catch (error) {
      expect(error).toEqual(
        CustomError.internalServer('Failed to send request')
      );
    }
  });
});
