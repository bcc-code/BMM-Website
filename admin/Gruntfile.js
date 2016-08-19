// Generated on 2014-01-15 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.{js,json}'],
        tasks: ['newer:jshint:all'],
        options: {
          protocol: 'https',
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/**/*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
        tasks: ['compass:server', 'postcss:server']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/**/*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/translations/**/*.json',
          '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.app %>/fallback_images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9003,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        protocol: 'https',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          protocol: 'http',
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ],
          // http://danburzo.ro/grunt/chapters/server/
          middleware: function(connect, options, middlewares) {

            // 1. mod-rewrite behavior
            var rules = [
              '!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.gif|\\.woff|\\.woff2|\\.ttf$ /index.html'
            ];
            middlewares.unshift(require('connect-modrewrite')(rules));
            return middlewares;
          }
        }
      },
      test: {
        options: {
          port: 9004,
          protocol: 'http',
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp',
      tmp: '.tmp'
    },

    // Add vendor prefixed styles and minify the CSS
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: ['last 1 version']}),
          require('cssnano')()
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles',
          src: '**/*.css',
          dest: '<%= yeoman.dist %>/styles'
        }]
      },
      server: {
        options: {
          processors: [
            require('autoprefixer')({browsers: ['last 1 version']})
          ]
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles',
          src: '**/*.css',
          dest: '.tmp/styles'
        }]
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        outputStyle: 'expanded',
        sourcemap: true,
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.{js,map,json}',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/fallback_images/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/fonts/*.*',
            '<%= yeoman.dist %>/views/**/*.html'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        flow: {
          html: {
            steps: {
              css: [ 'concat' ],
              js: [ 'concat' ]
            }
          }
        },
        dest: '.tmp'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      js: ['<%= yeoman.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/fonts',
          '<%= yeoman.dist %>/fallback_images',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/scripts',
          '<%= yeoman.dist %>/views'
        ],
        patterns: {
          html: [
            [/ng-src=['"]([^'"]+)['"]/gm, 'All the Angular rules to (img) src'],
            [/ng-include=['"]{2}([^'"]+)['"]{2}/gm, 'All the Angular rules to ng-include']
          ],
          // While usemin won't have full support for revved files we have to put all references manually here
          js: [
            [/((?:fallback_)?images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images'],
            [/(views\/[a-zA-Z0-9\/\.\-]+\.html)/gm, 'Update the JS to reference our revved views'],
            [/([a-zA-Z0-9\/\.]+\.js.map)/gm, 'Update the JS to reference our revved js-maps'],
            [/(config\.json)/gm, 'Replacing reference to our config file']
          ]
        }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: [
            '**/*.{png,jpg,jpeg,gif}',
            '!**/flags/*'
          ],
          dest: '<%= yeoman.dist %>/images'
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/fallback_images',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/fallback_images'
        }]
      },
      tmp: {
        files: [{
          expand: true,
          cwd: '.tmp/images',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      options: {
        plugins: [
          //See full list of plugins @ https://github.com/svg/svgo/tree/master/plugins
          { removeUnknownsAndDefaults: false },
          { convertPathData: false },/*
           { cleanupAttrs: false },
           { cleanupEnableBackground: false },
           { cleanupIDs: false },
           { cleanupNumericValues: false },
           { collapseGroups: false },
           { convertColors: false },
           { convertShapeToPath: false },
           { convertStyleToAttrs: false },*/
          { convertTransform: false },/*
           { mergePaths: false },
           { moveElemsAttrsToGroup: false },/*
           { moveGroupAttrsToElems: false },
           { removeComments: false },
           { removeDoctype: false },
           { removeEditorsNSData: false },
           { removeEmptyAttrs: false },
           { removeEmptyContainers: false },
           { removeEmptyText: false },
           { removeHiddenElems: false },
           { removeMetadata: false },
           { removeNonInheritableGroupAttrs: false },
           { removeRasterImages: false },
           { removeTitle: false },
           { removeUnkownsAndDefaults: false },
           { removeUnusedNS: false },*/
          { removeUselessStrokeAndFill: false }/*
           { removeViewBox: false },
           { removeXMLProcInst: false },
           { sortAttrs: false },
           { transformsWithOnePath: false }*/
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '**/*.svg',
          dest: '<%= yeoman.dist %>/images'
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/fallback_images',
          src: '**/*.svg',
          dest: '<%= yeoman.dist %>/fallback_images'
        }]
      },
      tmp: {
        files: [{
          expand: true,
          cwd: '.tmp/images',
          src: '**/*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          //collapseWhitespace: true, - Had problems when htmlmin removed spaces around usemin-comments (see: https://github.com/yeoman/grunt-usemin/issues/44#issuecomment-16415863)
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html', 'views/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      },
      deploy: {
        options: {
          collapseWhitespace: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/scripts',
          src: '*.js',
          dest: '.tmp/scripts'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}'
          ]
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          dest: '<%= yeoman.dist %>/scripts',
          src: ['config.json']
        }, 
        {
          expand: true,
          cwd: '<%= yeoman.app %>/bower_components/sass-bootstrap/dist',
          dest: '<%= yeoman.dist %>',
          src: ['fonts/*']
        }]
      },

      translation: {
        files: [
        {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>/translations',
          dest: '<%= yeoman.dist %>/translations',
          src: '{,*/}*'
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      compileAndMinify: [
        'compileCssAndJs',

        // Minify and copy image files
        'imagemin:dist',
        'svgmin:dist',

        // Minify and copy Index and template files
        'htmlmin:dist'
      ],
      minify: [
        // Minify and copy the already concatenated (S)CSS and JS files
        'postcss',
        'uglify',

        // Minify and copy image files
        'imagemin:tmp',
        'svgmin:tmp'
      ]
    },

    concat: {
      options: {
        sourceMap: true
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        //Don't include the source code in the sourceMap,
        //the developer has to map his local sourceFiles
        //with the browser in order to debug.
        //
        //Activating this also increases build-time noticeably
        sourceMapIncludeSources: true,
        sourceMapIn: function(uglifySource) {
          return uglifySource + '.map';
        }
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/main.js': [ '.tmp/scripts/main.js' ],
          '<%= yeoman.dist %>/scripts/vendor.js': [ '.tmp/scripts/vendor.js' ]
        }
      }
    },

    wiredep: {
      task: {
        src: [
          'app/index.html'
        ]
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('compileCssAndJs', [
    // Generate configuration for 'concat'
    'useminPrepare',

    // Concatenate all JS and vendor-CSS files
    'concat',

    // Compile SCSS to CSS
    'compass:dist',

    // Must run before minification of JS files (see: https://docs.angularjs.org/guide/di#implicit-annotation)
    'ngAnnotate',

    // Minify and copy all the sprites
    'concurrent:minify'
  ]);

  /**
   * # Ensure all dependencies are in place
   * # Concat and compile (S)CSS and JS
   * #
   */
  grunt.registerTask('build', [
    'clean:dist',

    'copy:dist',
    'copy:translation',

    // Generates concatenated JS, CSS files and sprites
    'concurrent:compileAndMinify',

    // Prefix file-names by a hash
    'rev',

    // Update all paths in the CSS, JS and HTML files
    'usemin',

    // Finish HTML minification because some usemin-commands need the whitespaces ...
    'htmlmin:deploy',

    'clean:tmp'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'wiredep',
    'test',
    'build'
  ]);
};
