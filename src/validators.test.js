const { validatePollIntervalInput, validateTimeoutInput } = require('./validators');

describe('validatePollIntervalInput', () => {
    it('should return the numeric value of a valid input', () => {
        const pollInterval = validatePollIntervalInput('30');
        expect(pollInterval).toBe(30);
    });

    it('should throw error for non-numeric input', () => {
        expect(() => {
            validatePollIntervalInput('abcde');
        }).toThrow();
    });

    it('should throw error for fractional input', () => {
        expect(() => {
            validatePollIntervalInput('2.5');
        }).toThrow();
    });

    it('should throw error for zero input', () => {
        expect(() => {
            validatePollIntervalInput('0');
        }).toThrow();
    });

    it('should throw error for negative input', () => {
        expect(() => {
            validatePollIntervalInput('-5');
        }).toThrow();
    });
});

describe('validateTimeoutInput', () => {
    const POLL_INTERVAL = 30;
    const validate = (input) => validateTimeoutInput(input, POLL_INTERVAL);

    it('should return the numeric value of a valid input', () => {
        const timeout = validate('600');
        expect(timeout).toBe(600);
    });

    it('should throw error for non-numeric input', () => {
        expect(() => {
            validate('abcde');
        }).toThrow();
    });

    it('should throw error for fractional input', () => {
        expect(() => {
            validate('2.5');
        }).toThrow();
    });

    it('should throw error for timeout less than poll interval', () => {
        expect(() => {
            validate('20');
        }).toThrow();
    });
});
