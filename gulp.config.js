/**
 * -------------------------------------
 * 디렉토리 정의 : 파일경로
 * -------------------------------------
 */

// @private project {}
const project = {
  'source': './src/',
  'destination': './dist/'
};

/**
 * -------------------------------------
 * src : 작업파일
    - project.source + '별별/별.html' ==> 모든 html확장자를 가진 파일
 * dest : 컴파일될 파일
    - project.destination   ==> 그냥 destination 경로 폴더에 컴파일
    - project.destination + '폴더명' ==> 폴더명안에 컴파일됨
 * -------------------------------------
 */

const paths = {
  'html':  {
    'src': project.source + '**/*.html',
    'dest': project.destination
  },
  'sass': {
    'src': project.source + 'sass/**/*.{sass,scss}',
    'dest': project.destination + 'css',
    'sourcemaps': {
      'use': true,
      'location': '../maps'
    },
    'options': {
      // Sass의 출력 스타일 : nested(중첩), expanded(일반적인 보기좋은), compact(한줄), compressed(압축:공백없음)
      'outputStyle': 'expanded'
    }
  },
  'js': {
    'src': project.source + '**/*.js',
    'dest': project.destination + 'js'
  },
  'images': {
    'src': project.source + '**/*.{gif,jpg,jpeg,png,svg}',
    'dest': project.destination
  }
};

/**
 * -------------------------------------
 * option
 * -------------------------------------
 */
 const options = {
  // https://www.browsersync.io/docs/options/
  // 브라우저를 동기화해주는 프로그램이다
  'browserSync': {
    'server': './dist',
    'notify': false
  }
};

/**
 * -------------------------------------
 * Config Module 공개  : 외부로 모듈 공개
 * module.exports = paths;
 * -------------------------------------
 */
module.exports = {
  'project':  project,
  'paths':   paths,
  'options': options
};
