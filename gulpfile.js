var gulp = require('gulp');
var notify = require('gulp-notify');
var gls = require('gulp-live-server');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uncss = require('gulp-uncss');

gulp.task('js', function() {
	return gulp.src('www/lib/js/*.js')
		.pipe(sourcemaps.init())
			.pipe(jshint())
			.pipe(jshint.reporter('jshint-stylish'))
			.pipe(concat('scripts.min.js'))
			.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./www/dist/js'))
		.pipe(notify({message: 'JS has been compiled.', onLast: true}));
});

gulp.task('css', function() {
	return gulp.src('www/lib/css/*.css')
		.pipe(sourcemaps.init())
			.pipe(concat('styles.min.css'))
			.pipe(uglifycss())
			.pipe(uncss({
				html: ['www/index.html']
			}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./www/dist/css'))
		.pipe(notify({message: 'CSS has been compiled.', onLast: true}));
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
