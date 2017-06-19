var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var less        = require('metalsmith-less');
var watch       = require('metalsmith-watch');
var browserify  = require('metalsmith-browserify');

Metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .clean(false)
  .use(markdown())
  .use(permalinks())
  .use(less())
  .use(layouts({
    engine: 'pug'
  }))
  .use(browserify({
    dest: 'scripts/index.js',
    entries: ['./src/scripts/index.js'],
    watch: true
  }))
  .use(
    watch({
      paths: {
       "${source}/**/*": true,
        "layouts/**/*": "**/*.md",
      },
      livereload: true
    })
  )
  .build(function(err, files) {
    if (err) { throw err; }
  });