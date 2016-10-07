var gulp = require('gulp'),
sass = require('gulp-sass'),
bulkSass = require('gulp-sass-bulk-import'),
connect = require('gulp-connect'),
pug = require('gulp-pug'),
coffee = require('gulp-coffee'),
order = require("gulp-order"),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
autoprefixer = require('gulp-autoprefixer'),
cleanCSS = require('gulp-clean-css'),
rename = require('gulp-rename'),
spritesmith = require('gulp.spritesmith-multi'),
plumber = require('gulp-plumber');


gulp.task('connect', function() {
	connect.server({
	root: 'app',
	livereload: true
	});
});

gulp.task('sass', function () {
	gulp.src('dev/sass/*.sass')
	.pipe(bulkSass())
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	})).on('error', sass.logError)
	.pipe(rename({suffix: '.min', prefix : '_'}))
	.pipe(autoprefixer({
		browsers: ['last 15 versions'],
		cascade: false
	}))
	.pipe(cleanCSS())
	.pipe(connect.reload())
	.pipe(gulp.dest('app'));
});


gulp.task('pug', function() {
	gulp.src('dev/pug/pages/*.pug')
	.pipe(plumber({
		handleError: function (err) {
			console.log(err);
		}
	}))
	.pipe(pug({
		pretty: true
	})).on('error', console.log)
	.pipe(connect.reload())
	.pipe(gulp.dest('app'));
});

gulp.task('sprite', function() {
	var spriteData = 
		gulp.src('dev/sprite/**/*.*')
			.pipe(plumber({
					handleError: function (err) {
						console.log(err);
					}
				}))
			.pipe(spritesmith({
				spritesmith: function (options) {
					options.imgPath = 'media/img/' + options.imgName;
					options.retinaImgName = 'media/img/' + options.retinaImgName;
					options.algorithm = 'binary-tree';
					options.cssName = sprite + '.scss';
				}
			}));
	spriteData.img.pipe(gulp.dest('app/media/img/'));
	spriteData.css.pipe(gulp.dest('dev/sass/basic/'));
});

gulp.task('vendor', function() {
	 gulp.src('dev/js/**/**/*.js')
	 .pipe(order([
		"modernizr/modernizr.js",
		"jquery/jquery-3.1.0.min.js",
		"libs/**/*.js"
	]))
	.pipe(concat('vendor.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js/'));
});


gulp.task('coffee', function() {
	gulp.src('dev/coffee/*.coffee')
	.pipe(coffee({bare: true}).on('error', console.log))
	.pipe(connect.reload())
	.pipe(uglify())
	.pipe(gulp.dest('app/js/'));
});

gulp.task('watch', function () {
	gulp.watch('dev/sass/**/**/*.sass', ['sass']);
	gulp.watch('dev/pug/**/**/*.pug', ['pug']);
	gulp.watch('dev/coffee/**/**/*.coffee', ['coffee']);
	gulp.watch('dev/js/**/**/*.js', ['vendor']);
	gulp.watch('dev/sprite/**/**/*.*', ['sprite']);
});

gulp.task('default', ['sprite', 'pug', 'sass', 'connect', 'watch', 'coffee', 'vendor']);
