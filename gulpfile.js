var gulp = require('gulp');
var gls = require('gulp-live-server');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var lib = require('bower-files')({
	cwd: __dirname + '/www/lib',
	overrides: {
		bootswatch: {
			main: './yeti/bootstrap.css',
			dependencies: {
				"bootstrap": "~3.3.6"
			}
		},
		pnotify: {
			main: [
				'./dist/pnotify.js',
				'./dist/pnotify.desktop.js',
				'./dist/pnotify.mobile.js',
				'./dist/pnotify.css',
				'./dist/pnotify.mobile.css'
			],
			dependencies: {
				"jquery": ">=1.6"
			}
		},
		'font-awesome': {
			main: './css/font-awesome.css',
			dependencies: {}
		},
		'auth0-lock-passwordless': {
			main: './build/lock-passwordless.js',
			dependencies: {}
		}
	}
});

gulp.task('js', function() {
	var files = gulp.src('www/lib/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
	var bowerfiles = gulp.src(lib.ext('js').files);
	return merge(bowerfiles, files)
		.pipe(sourcemaps.init())
			.pipe(concat('scripts.min.js'))
			.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./www/dist/js'));
});

gulp.task('css', function() {
	var files = gulp.src('www/lib/css/*.css');
	var bowerfiles = gulp.src(lib.ext('css').files);
	return merge(bowerfiles, files)
		.pipe(sourcemaps.init())
			.pipe(concat('styles.min.css'))
			.pipe(uglifycss())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./www/dist/css'));
});

gulp.task('serve', function() {
	var server = gls.new('index.js');
	server.start();
	console.log('Listening on port: ' + (process.env.PORT || 3000));

	gulp.watch(['www/lib/css/**/*.css', 'www/lib/js/**/*.js', 'www/**/*.html'], function(file) {
		setTimeout(function() {
			server.notify.apply(server, [file]);
		}, 100);
	});

	gulp.watch('index.js', function() {
		server.start.bind(server)();
	});
});

gulp.task('watch', function() {
	gulp.start(['js']);
	gulp.start(['css']);
	gulp.watch('www/lib/js/**/*.js', ['js']);
	gulp.watch('www/lib/css/**/*.css', ['css']);
});

gulp.task('default', function() {
	gulp.start(['watch']);
	gulp.start(['serve']);
});
