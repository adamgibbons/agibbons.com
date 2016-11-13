# agibbons.com

Barebones static site generator for agibbons.com

This site is generated using a Gulp build process that compiles static assets (HTML, CSS, Javascript, webfonts, etc) site that can be deployed to an AWS S3 bucket.

- Template language: Jade
- Stylesheet language: Less
- Front-end framework: Bootstrap 3

## Installation Prerequisites

- Node
- Gulp

## Install

`git clone https://github.com/adamgibbons/agibbons`

`cd agibbons`

`npm install`

## Develop and serve locally

Create a file, `/config/development.json` (as a sibling to `production.json`),
and set the url to your local instance of Tractor.

```
{
  "API": "your.local.api_url"
}
```

Now run `npm start` (this just runs `gulp build:development; gulp serve` for you).

Visit [localhost:4000](http://localhost:4000) in your browser and start devving! When you save
changes to a file within the `/lib` directory, gulp will recompile the changed file and live-reload the browser.

## Deploy

You can deploy the contents of the `/public` directory to staging or production AWS S3 buckets.
First, you must have a file associated with your destination deployment environment
(e.g. `staging2.aws.json`, `production.aws.json`) located at this repository's root directory (i.e. as a sibling to `gulpfile.js`).
The file should have the below format (add your AWS `key` and `secret`).

```
{
  "key": "YOUR_KEY",
  "secret": "YOUR_SECRET",
  "bucket": "YOUR_BUCKET",
  "region": "AWS_BUCKET_REGION"
}
```

Then run `npm run deploy-staging` or `npm run deploy-production`.
