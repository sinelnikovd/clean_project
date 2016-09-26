var gulp = require('gulp'),
sass = require('gulp-sass'),
connect = require('gulp-connect'),
pug = require('gulp-pug'),
coffee = require('gulp-coffee'),
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
			.pipe(spritesmith({
				spritesmith: function (options) {
					options.imgPath = 'media/img/' + options.imgName;
					options.algorithm = 'binary-tree';
					options.cssFormat = 'sass';
				}
			}));
	spriteData.img.pipe(gulp.dest('app/media/img/'));
	spriteData.css.pipe(gulp.dest('dev/sass/basic/'));
});


gulp.task('coffee', function() {
	gulp.src('dev/coffee/*.coffee')
	.pipe(coffee({bare: true}).on('error', console.log))
	.pipe(gulp.dest('app/js/'));
});

gulp.task('watch', function () {
	gulp.watch('dev/sass/**/**/*.sass', ['sass']);
	gulp.watch('dev/pug/**/**/*.pug', ['pug']);
	gulp.watch('dev/coffee/**/**/*.coffee', ['coffee']);
	gulp.watch('dev/sprite/**/**/*.*', ['sprite']);
});

gulp.task('default', ['sprite', 'pug', 'sass', 'connect', 'watch', 'coffee']);
