import { jest } from '@jest/globals';
import { fetchDefinition } from '../../src/js/api.js';

global.fetch = jest.fn();

describe('API', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('fetchDefinition returns data on success', async () => {
        const mockData = [{ word: 'hello', meanings: [] }];
        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockData
        });

        const data = await fetchDefinition('hello');
        expect(data).toEqual(mockData);
        expect(fetch).toHaveBeenCalledWith('https://api.dictionaryapi.dev/api/v2/entries/en/hello');
    });

    test('fetchDefinition throws error object on failure', async () => {
        const errorData = {
            title: 'No Definitions Found',
            message: 'Sorry pal',
            resolution: 'Try again'
        };

        fetch.mockResolvedValue({
            ok: false,
            status: 404,
            json: async () => errorData
        });

        await expect(fetchDefinition('unknown')).rejects.toEqual({
            status: 404,
            title: 'No Definitions Found',
            message: 'Sorry pal',
            resolution: 'Try again'
        });
    });

    test('fetchDefinition propagates network errors', async () => {
        const networkError = new Error('Network Error');
        fetch.mockRejectedValue(networkError);

        await expect(fetchDefinition('hello')).rejects.toThrow('Network Error');
    });
});
