const axios = require('axios');
const { parseMeta } = require('./parser');
const { pollForVersion } = require('./poller');

jest.mock('axios');
jest.mock('@actions/core');
jest.mock('./parser');
jest.useFakeTimers('legacy');

const SITE_URL = 'https://my-site.com';
const DESIRED_VERSION = 'abcdefg';
const TIMEOUT = 300;
const POLL_INTERVAL = 30;

const SITE_DATA = 'site-data';

describe('pollForVersion', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        axios.get.mockReturnValue(Promise.resolve({ data: SITE_DATA }));
    });

    it('returns true if site has desired version immediately', async () => {
        parseMeta.mockReturnValue(DESIRED_VERSION);

        const wasSuccessful = await pollForVersion(SITE_URL, DESIRED_VERSION, POLL_INTERVAL, TIMEOUT);

        expect(wasSuccessful).toEqual(true);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenLastCalledWith(SITE_URL);
        expect(setTimeout).not.toHaveBeenCalled();
    });

    it('polls repeatedly until site has desired version', async () => {
        setTimeout.mockImplementation((callback, timeout) => callback());
        parseMeta
            .mockReturnValueOnce('nope')
            .mockReturnValueOnce('still nope')
            .mockReturnValueOnce(DESIRED_VERSION);

        const wasSuccessful = await pollForVersion(SITE_URL, DESIRED_VERSION, POLL_INTERVAL, TIMEOUT);

        expect(wasSuccessful).toBe(true);
        expect(setTimeout).toHaveBeenCalledTimes(2);
    });

    it('returns false if site never has desired version', async () => {
        setTimeout.mockImplementation((callback, timeout) => callback());
        parseMeta.mockReturnValue('nope');

        const wasSuccessful = await pollForVersion(SITE_URL, DESIRED_VERSION, POLL_INTERVAL, TIMEOUT);

        expect(wasSuccessful).toBe(false);
        expect(axios.get).toHaveBeenCalledTimes(TIMEOUT / POLL_INTERVAL);
    });

    it('throws an error if site returns a 4xx status code', async () => {
        setTimeout.mockImplementation((callback, timeout) => callback());
        const notFoundResponse = { response: { status: 404 } };
        axios.get.mockReturnValue(Promise.reject(notFoundResponse));

        await expect(() => pollForVersion(SITE_URL, DESIRED_VERSION, POLL_INTERVAL, TIMEOUT))
            .rejects
            .toBe(notFoundResponse)
    });

    it('keeps polling if site returns a 5xx status code (not including 500)', async () => {
        setTimeout.mockImplementation((callback, timeout) => callback());
        axios.get
            .mockReturnValueOnce(Promise.reject({ response: { status: 503 } }))
            .mockReturnValueOnce(Promise.resolve(Promise.resolve({ data: SITE_DATA })));
        parseMeta.mockReturnValueOnce(DESIRED_VERSION);

        const wasSuccessful = await pollForVersion(SITE_URL, DESIRED_VERSION, POLL_INTERVAL, TIMEOUT);

        expect(wasSuccessful).toBe(true);
    });

    it('throws an error if site returns a 500 status code', async () => {
        setTimeout.mockImplementation((callback, timeout) => callback());
        const serverErrorResponse = { response: { status: 500 } };
        axios.get.mockReturnValue(Promise.reject(serverErrorResponse));

        await expect(() => pollForVersion(SITE_URL, DESIRED_VERSION, POLL_INTERVAL, TIMEOUT))
            .rejects
            .toBe(serverErrorResponse);
    });
});
