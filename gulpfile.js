var gulp        = require('gulp')
  , less        = require('gulp-less')
  , path        = require('path')
  , del         = require('del')
  , jade        = require('gulp-jade')
  , Server      = require('gulp-live-server')
  , s3          = require('gulp-s3')
  , fs          = require('fs')
  , rename      = require('gulp-rename')
  , markdown    = require('gulp-markdown-to-json')
  , q           = require('q')
  , gulpEnv     = require('gulp-env')
  , runSequence = require('run-sequence')
  , concat      = require('gulp-concat')
  , CleanCSS    = require('less-plugin-clean-css')
  , cleanCSS    = new CleanCSS({advanced: true})
  , reviseName  = require('gulp-rev')
  , inject      = require('gulp-inject');

// Script order matters!
var scripts = [
  'lib/scripts/jquery.min.js',
  'lib/scripts/bootstrap.min.js',
  'lib/scripts/navbar.js'
];

//Wraps a stream in a promise
function promisedStream (stream) {
  var defer = q.defer();
  stream.on('end', function () { defer.resolve() });
  stream.on('error', function () { defer.reject() });
  return defer.promise;
};

gulp.task('clean', function () {
  return del(['public/**/*']);
});

gulp.task('clean:styles', function () {
  return del(['public/styles.css']);
});

gulp.task('clean:templates', function () {
  return del(['public/*.html']);
});

gulp.task('clean:images', function () {
  return del(['public/images/**/*']);
});

gulp.task('clean:glyphs', function () {
  return del(['public/glyphs/**/*']);
});

gulp.task('clean:posts-json', function () {
  return del(['lib/posts/json/*']);
});

gulp.task('clean:scripts', function () {
  return del(['public/scripts/**/*']);
});

gulp.task('image', ['clean:images'], function() {
  return gulp.src('lib/images/**/*', { base: 'lib' })
    .pipe(gulp.dest('./public'));
});

gulp.task('script-dev', ['clean:scripts'], function () {
  return gulp.src(scripts, { base: 'lib' })
    .pipe(concat('adam-gibbons.js'))
    .pipe(gulp.dest('./public'));
});

gulp.task('script', ['clean:scripts'], function () {  
  return gulp.src(scripts, { base: 'lib' })
    .pipe(concat('adam-gibbons.js'))
    .pipe(reviseName())
    .pipe(gulp.dest('./public'));
});

gulp.task('inject', function() {
  var target = gulp.src('public/**/*.html', { base: 'public' });
  var sources = gulp.src(['public/*.css', 'public/*.js'], { read: false });

  return target.pipe(inject(sources, { ignorePath: 'public' }))
    .pipe(gulp.dest('public'));
});

gulp.task('style', ['clean:styles'], function () {
  return gulp.src('./lib/styles/styles.less')
    .pipe(less({ plugins: [cleanCSS] }))
    .pipe(reviseName())
    .pipe(gulp.dest('./public'));
});

gulp.task('style-dev', ['clean:styles'], function () {
  return gulp.src('./lib/styles/styles.less')
    .pipe(less({ plugins: [cleanCSS] }))
    .pipe(gulp.dest('./public'));
});

gulp.task('webfonts', function() {
  return gulp.src('./lib/webfonts/**/*')
    .pipe(gulp.dest('./public/webfonts'));
});

gulp.task('blog:posts', ['markdown'], function() {
  fs.readdir('./public/posts/json', function (err, files) {
    files.map(function (file) {
      return JSON.parse(fs.readFileSync('./public/posts/json/' + file));
    }).map(function (post) {
      return gulp.src('./lib/templates/blog/post.jade')
        .pipe(jade({locals: post}))
        .pipe(rename({ basename: 'index', extname: '.html' }))
        .pipe(gulp.dest('./public/blog/' + post.slug));
    });
  });
});

gulp.task('blog:index', ['markdown'], function() {
  fs.readdir('./public/posts/json', function (err, files) {
    var postsList = files.sort().reverse().map(function (file) {
      return JSON.parse(fs.readFileSync('./public/posts/json/' + file));
    });

    return gulp.src('./lib/templates/layouts/blog-index.jade')
      .pipe(jade({locals: { posts: postsList } }))
      .pipe(rename({ basename: 'index', extname: '.html' }))
      .pipe(gulp.dest('./public/blog'));
  });
});

gulp.task('blog', ['blog:posts', 'blog:index']);

// gulp.task('template', ['clean:templates', 'blog'], function() {
  // removed blog
gulp.task('template', ['clean:templates'], function() {
  return gulp.src('./lib/templates/pages/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./public'));
});

gulp.task('template-dev', ['clean:templates'], function() {
  return gulp.src('./lib/templates/pages/**/*.jade')
    .pipe(jade({ locals: { env: 'development' } }))
    .pipe(gulp.dest('./public'));
});

gulp.task('markdown', ['clean:posts-json'], function() {
  return gulp.src('./lib/posts/*.md')
    .pipe(markdown())
    .pipe(gulp.dest('./public/posts/json'));
});

gulp.task('favicon', function() {
  return gulp.src('./lib/favicon.ico')
    .pipe(gulp.dest('./public'));
});

gulp.task('glyph', ['clean:glyphs'], function() {
  return gulp.src('./node_modules/bootstrap/fonts/*')
    .pipe(gulp.dest('./public/glyphs'));
});

gulp.task('serve', function() {
  var PORT = process.env.PORT || 4000;
  var server = Server.static('public', PORT);

  server.start();
  console.log('Now serving on port ' + PORT);

  gulp.watch('./lib/styles/**/*.less', ['style-dev']);
  gulp.watch('./lib/templates/**/*.jade', ['template-dev']);
  gulp.watch('./lib/images/**/*', ['image']);
  gulp.watch('./lib/scripts/**/*', ['script']);
  gulp.watch(['./public/**/*.*'], reload);

  function reload(file) {
    server.notify.apply(server, [file]);
  }
});

gulp.task('api', function() {
  return gulp.src('./config/' + process.env.NODE_ENV + '.json')
    .pipe(rename('config.json'))
    .pipe(gulp.dest('public/'));
});

gulp.task('build', ['favicon', 'template', 'style', 'image', 'glyph', 'webfonts', 'script', 'api']);

gulp.task('build-dev', ['favicon', 'template-dev', 'style-dev', 'image', 'glyph', 'webfonts', 'script-dev', 'api']);

gulp.task('deploy', function() {
  var aws = JSON.parse(fs.readFileSync('./' + process.env.NODE_ENV + '.aws.json'));
  return gulp.src('./public/**/*').pipe(s3(aws));
});

[
  'development',
  'production'
].map(function (env) {
  gulp.task('run:' + env, function(cb) {
    gulpEnv({ file: './config/' + env + '.json'});

    if (env === 'development') {
      // Skip inject/fingerprinting if we're in development environment
      runSequence('build-dev', function (err) {
        if (err) {
          console.log(error.message);
        }
        cb(err);
      });
    // Don't build robots.txt file for production environment
    } else if (env !== 'production') {
      runSequence('robots-txt', 'build', 'inject', function (err) {
        if (err) {
          console.log(error.message);
        }
        cb(err);
      });
    } else {
      runSequence('clean:robots-txt', 'build', 'inject', function (err) {
        if (err) {
          console.log(error.message);
        }
        cb(err);
      });
    }
  });

  gulp.task('deploy:' + env, function(cb) {
    gulpEnv({ file: './config/' + env + '.json'});
    runSequence('build', 'inject', 'deploy', function (err) {
      if (err) {
        console.log(error.message);
      }
      cb(err);
    });
  });
});

gulp.task('default', function() {
  runSequence('run:development', 'serve');
});