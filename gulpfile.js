var gulp = require('gulp'),
sass = require('gulp-sass'),
connect = require('gulp-connect'),
jade = require('gulp-jade'),
autoprefixer = require('gulp-autoprefixer'),
cleanCSS = require('gulp-clean-css'),
rename = require('gulp-rename'),
spritesmith = require('gulp.spritesmith'),
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


gulp.task('jade', function() {
	gulp.src('dev/jade/pages/*.jade')
	.pipe(plumber({
		handleError: function (err) {
			console.log(err);
		}
	}))
	.pipe(jade({
		pretty: true
	})).on('error', console.log)
	.pipe(connect.reload())
	.pipe(gulp.dest('app'));
});

gulp.task('sprite', function() {
	var spriteData = 
		gulp.src('dev/sprite/*.*')
			.pipe(spritesmith({
				imgName: 'sprite.png',
				cssName: 'sprite.sass',
				cssFormat: 'sass',
				algorithm: 'binary-tree',
				cssTemplate: 'sass.template.mustache',
				cssVarMap: function(sprite) {
						sprite.name = 's-' + sprite.name
				}
			}));
	spriteData.img.pipe(gulp.dest('app/media/img/'));
	spriteData.css.pipe(gulp.dest('dev/sass/basic/'));
});

gulp.task('watch', function () {
	gulp.watch('dev/sass/**/**/**/*.sass', ['sass']);
	gulp.watch('dev/jade/**/**/**/*.jade', ['jade']);
	gulp.watch('dev/sprite/*.*', ['sprite']);
});

gulp.task('default', ['sprite', 'jade', 'sass', 'connect', 'watch']);
