const validatePollIntervalInput = (input) => {
    const pollInterval = Number(input);
    if (!Number.isInteger(pollInterval) || pollInterval <= 0) {
        throw new Error('Poll interval must be a positive integer');
    }
    return pollInterval;
};

const validateTimeoutInput = (input, pollInterval) => {
    const timeout = Number(input);
    if (!Number.isInteger(timeout) || timeout < pollInterval) {
        throw new Error(`Timeout must be an integer >= ${pollInterval}`)
    }
    return timeout;
};

module.exports = { validatePollIntervalInput, validateTimeoutInput };
