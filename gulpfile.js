var gulp        = require('gulp');
var browserSync = require('browser-sync');
var gutil       = require('gulp-util');
var sass        = require('gulp-sass');

var concat      = require('gulp-concat');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var imagemin    = require('gulp-imagemin');
var pngquant    = require('imagemin-pngquant');
var cache       = require('gulp-cache');
var cp          = require('child_process');
var del         = require('del');

var postcss     = require('gulp-postcss');
var prefix      = require('autoprefixer');
var customMedia = require('postcss-custom-media');
var csswring    = require('csswring');
var cssnano     = require('cssnano');

var critical   = require('critical');


var env = process.env.NODE_ENV || 'prod';
var jekyll   = process.platform === 'win32' ? 'jekyll' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};


var onError = function( err ) {
    console.log('An error occurred:', gutil.colors.magenta(err.message));
    gutil.beep();
    this.emit('end');
};


// Build the Jekyll Site
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});


// Rebuild Jekyll & do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});


// Wait for jekyll-build, then launch the Server
gulp.task('browser-sync', ['styles', 'scripts', 'images', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site',
            port: 2610
        }
    });
});


// Styles
gulp.task('styles', function () {
    var processors = [
        prefix(),
        csswring,
        customMedia,
        cssnano,
    ];
    return gulp.src('_scss/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(postcss(processors))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});

// Critical CSS
gulp.task('critical', function() {
    critical.generate({
        base: '_site/',
        src: 'index.html',
        css: ['css/main.css'],
       
        width: 1280,
        height: 900,
        dest: '_includes/critical.css',
        minify: true,
        extract: false,
        ignore: ['font-face']
    });
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src([
      '_js/lib/jquery-3.3.1.js',
      '_js/lib/modernizr-2.8.3.js',
      '_js/glide.js',
      '_js/jquery.easing.1.3.js',
      '_js/site.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))

    .pipe(concat('all.js'))

    .pipe(uglify().on('error', gutil.log)) // notice the error event here

    .pipe(gulp.dest('_site/js'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('js'));
});


// Images
gulp.task('images', function() {
	return gulp.src('images/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
    .pipe(gulp.dest('_site/images'))
    .pipe(browserSync.reload({stream:true}));
});


// Watch
gulp.task('watch', function () {
    gulp.watch('_scss/*.scss', ['styles']);
    gulp.watch('_js/*.js', ['scripts']);
    gulp.watch('images/**/*', ['images']);
    gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html', '_posts/*'], ['jekyll-rebuild']);
});


// Delete _site directory
gulp.task('clean', function () {
    return del(['_site', 'images/'])
});


// Default
gulp.task('default', ['browser-sync', 'watch']);

