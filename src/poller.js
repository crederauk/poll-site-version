const axios = require('axios');
const core = require('@actions/core');
const { parseMeta } = require('./parser');

const pollForVersion = async (siteUrl, desiredVersion, pollInterval, timeout) => {
    let actualVersion;
    let timeElapsed = 0;

    while (timeElapsed < timeout) {
        actualVersion = await fetchAndParseVersion(siteUrl);
        core.info(`${formatTime(new Date())} - Version is ${actualVersion}`);

        if (actualVersion === desiredVersion) {
            return true;
        }

        await delay(pollInterval);
        timeElapsed += pollInterval;
    }

    return false;
};

const fetchAndParseVersion = async (siteUrl) => {
    const response = (await axios.get(siteUrl)).data;
    return parseMeta(response, 'version');
};

const formatTime = (datetime) => {
    const hours = formatNumberAsTwoDigits(datetime.getHours());
    const minutes = formatNumberAsTwoDigits(datetime.getMinutes());
    const seconds = formatNumberAsTwoDigits(datetime.getSeconds());

    return `${hours}:${minutes}:${seconds}`;
};

const formatNumberAsTwoDigits = (number) => {
    if (String(number).length === 1) {
        return `0${number}`;
    }
    return number;
};

const delay = (seconds) => new Promise(res => setTimeout(res, seconds * 1000));

module.exports = { pollForVersion };
