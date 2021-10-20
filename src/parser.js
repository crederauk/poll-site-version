const { parse } = require('node-html-parser');

const parseMeta = (htmlText, tagName) => {
  const root = parse(htmlText);
  const versionMeta = root.querySelector(`meta[name="${tagName}"]`);
  if (!versionMeta) {
    throw new Error(`Unable to locate ${tagName} meta tag.`);
  }
  return versionMeta.attrs['content'];
}

module.exports = { parseMeta };
