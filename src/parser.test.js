const { parseMeta } = require('./parser');

const SITE_VERSION = 'abcdefgh';
const HTML_WITH_VERSION = `
    <!doctype html>
    <html lang="en">
      <head>
        <title>Website</title>
        <meta name="version" content="${SITE_VERSION}" />
      </head>
      <body>
        <p>This is a website</p>
      </body>
    </html>
    `;
const HTML_WITHOUT_VERSION = `
    <!doctype html>
    <html lang="en">
      <head>
        <title>Website</title>
      </head>
      <body>
        <p>This is a website</p>
      </body>
    </html>
    `;

describe('parseMeta', () => {
    it('parses the specified meta tag from a valid HTML doc', () => {
        const parsedVersion = parseMeta(HTML_WITH_VERSION, 'version');
        expect(parsedVersion).toEqual(SITE_VERSION);
    });
    it('throws an error when meta tag is missing', () => {
        expect(() => {
            parseMeta(HTML_WITHOUT_VERSION, 'version');
        }).toThrow();
    });
});
