const core = require('@actions/core');
const { validatePollIntervalInput, validateTimeoutInput } = require('./src/validators');
const { pollForVersion } = require('./src/poller');

try {
  const siteUrl = core.getInput('site-url');
  const desiredVersion = core.getInput('desired-version');
  const pollInterval = validatePollIntervalInput(core.getInput('poll-interval'));
  const timeout = validateTimeoutInput(core.getInput('timeout'), pollInterval);

  core.info(`Polling ${siteUrl} for version ${desiredVersion} with timeout ${timeout}`);

  pollForVersion(siteUrl, desiredVersion, pollInterval, timeout)
      .then((wasSuccessful) => {
        if (!wasSuccessful) {
          core.setFailed(`Site didn't return version ${desiredVersion} within ${timeout}s`);
        }
      })
      .catch((error) => core.setFailed(error.message));

} catch (error) {
  core.setFailed(error.message);
}
