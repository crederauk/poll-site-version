# Poll Site Version Action
A Github Action to poll a site until it has a specific version.

The website must have a `meta` tag in its `<head>` section, that looks like:
```html
<meta name="version" content="abcdefg" />
```

## Inputs

### `site-url`

**Required** The URL of the website to poll.

### `desired-version`

**Required** The action will stop polling when the meta tag's `content` matches this.

### `poll-interval`

How often to poll the site in seconds. Must be a positive integer.

Default: `30`

### `timeout`

The maximum time to wait (in seconds) for the site to have the desired version. Must be an integer >= 30.

Default: `600`

## Example usage

```yaml
uses: crederauk/poll-site
with:
  site-url: 'https://my.website.com'
  desired-version: 'abcdefg'
  poll-interval: '15'
  timeout: '300'
```
