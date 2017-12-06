'use strict'

// 환경 설정 옵션
const gulp = require('gulp');
const config = require('./gulp.config');
const del = require('del');
const env = require('gulp-util').env;
const handlebars = require('gulp-compile-handlebars');

// gulp-if 모듈을 로드 : 조건에 따른 업무 처리
const g_if = require('gulp-if');

// Gulp 유틸리티 : 플러그인 용 유틸리티 함수 https://www.npmjs.com/package/gulp-util
// g_util.log('massage');
const g_util = require('gulp-util');

// gulp-rename : 리네임 => 왜? 압축후 .min 붙이려고
const rename = require('gulp-rename');


// ------------- BROWSER 동기화
// 서버 환경 구성
// 서버를 띄워 놓고 감시하는 파일을 수정하면 자동으로 브라우저를 리로드.
const  browserSync = require('browser-sync').create();

// ------------- HTML
const htmlmin = require('gulp-htmlmin');

// ------------- CSS
// Sourcemaps 모듈을 로드 : 개발 시, Debug 용으로 사용할 소스맵을 생성.
const sourcemaps = require('gulp-sourcemaps');
// sass 모듈을 로드
const sass = require('gulp-sass');
// autoprefixer 모듈을 로드
// CSS3 브라우저 벤더 프리픽스를 설정에 따라 자동으로 적용 처리.
const autoprefixer = require('gulp-autoprefixer');
// gulp-combine-mq 모듈을 로드 : 미디어쿼리(MediaQueries) 병합
const combineMq = require('gulp-combine-mq');
// gulp-csscomb 모듈을 로드 : CSS 문서 포멧 정리 및 속성 별로 정렬
const csscomb = require('gulp-csscomb');
// gulp-csso : CSS 파일 압축
const g_csso = require('gulp-csso');

// ------------- JS
// gulp-concat : Javascript 파일 병합
const concat = require('gulp-concat');
// Javascript 압축
const uglify = require('gulp-uglify');

// ------------- IMAGE
// gulp-imagemin : 이미지 포멧(`GIF`, `JPG`, `PNG`, `SVG`) 최적화
const imagemin = require('gulp-imagemin');

const hbsConfig = {
  src: './src',
  dest: './dist',
  watchers: [
    {
      match: ['./src/**/*.hbs'],
      tasks: ['hbs']
    }
  ]
};

// gulp 기본 수행할 일(task) 등록
// 기본 문법
// gulp.task('테스크네임', function(){ gulp.run('compile:css'); });
// gulp.task('default', [ 배열로 던져 등록된 순서대로 수행됨 ]);
gulp.task('default', [
    'server',
    'hbs',
    'compile:html',
    'compile:css',
    'compile:js',
    'images',
    'watch'
]);

gulp.task('clean', () => del(config.dest));

// 관찰(Watch) 업무
gulp.task('watch', function() {
    hbsConfig.watchers.forEach(item => {
      gulp.watch(item.match, item.tasks);
    });
    // gulp.watch( 이곳이 변경이 생길때 마다, ['이 일을 수행해']);
    gulp.watch(config.paths.html.src, ['compile:html']);
    gulp.watch(config.paths.sass.src, ['compile:css']);
    gulp.watch(config.paths.js.src, ['compile:js']);
    gulp.watch(config.paths.images.src, ['images']);
    // src폴더의 모든폴더의 모든파일이 변경될때 마다 브라우저 동기화
    gulp.watch(config.project.source + '**/**' ).on( 'change', browserSync.reload );
});

// 서버(Server) 동기화 업무
// gulp.task('server',['html','css',,배열은 감시할 파일들], function() { });
gulp.task('server', function() {
    browserSync.init( config.options.browserSync );
});

// Sass 업무 등록  : Sass → CSS 업무
gulp.task('compile:css', ['clean'], function() {
    return gulp.src(config.paths.sass.src)
               .pipe( g_if(config.paths.sass.sourcemaps.use, sourcemaps.init() ) )
               .pipe( sass( config.paths.sass.options ).on('error', sass.logError) )
               .pipe( autoprefixer([
                    'ie >= 8',
                    'ie_mob >= 10',
                    'ff >= 30',
                    'chrome >= 34',
                    'safari >= 7',
                    'opera >= 23',
                    'ios >= 7',
                    'android >= 4.4',
                    'bb >= 10'
                  ]) )
               .pipe( combineMq() )
               .pipe( csscomb() )
               .pipe( gulp.dest(config.paths.sass.dest) )
               // 압축 후 접미사 '.min' 리네임
               .pipe( g_csso() )
               .pipe( rename({ suffix: '.min' }) )
               .pipe( g_if(config.paths.sass.sourcemaps.use, sourcemaps.write(config.paths.sass.sourcemaps.location) ) )
               .pipe( gulp.dest(config.paths.sass.dest) )
               .pipe( browserSync.stream() );
});

// handlebars
gulp.task('hbs', ['clean'], () => {
  return gulp.src(`${hbsConfig.src}/pages/*.hbs`)
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: [`${hbsConfig.src}/partials`]
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(hbsConfig.dest));
});

// js
gulp.task('compile:js', ['clean'], function() {
  return gulp.src( config.paths.js.src )
             .pipe( concat('all.js') )
             .pipe( gulp.dest( config.paths.js.dest ) )
             // 압축 후 접미사 '.min' 리네임
             .pipe( uglify() )
             .pipe( rename({ suffix: '.min' }) )
             .pipe( gulp.dest( config.paths.js.dest ) );
});

// img
gulp.task('images', ['clean'], function() {
  return gulp.src( config.paths.images.src )
             .pipe( imagemin() )
             .pipe( gulp.dest( config.paths.images.dest ) );
});

// html
gulp.task('compile:html', ['clean'], function() {
  return gulp.src( config.paths.html.src )
             .pipe( htmlmin({collapseWhitespace: true}) )
             .pipe( gulp.dest( config.paths.html.dest ) );
});
