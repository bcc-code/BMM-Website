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
      common: {
        files: ['<%= yeoman.app %>/**/*'],
        tasks: ['updateCommonFiles']
      },
      jsTest: {
        files: ['test/spec/**/*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      options: {
        nospawn: false
      }
    },

    // Empties folders to start fresh
    clean: {
      options: { force: true },
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*',
            '../client/app/styles/common/**/*',
            '../client/app/scripts/common/**/*',
            '../client/app/views/common/**/*',
            '../client/app/images/common/**/*',
            '../admin/app/styles/common/**/*',
            '../admin/app/scripts/common/**/*',
            '../admin/app/views/common/**/*',
            '../admin/app/images/common/**/*',
          ]
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      scripts: {
        expand: true,
        cwd: '<%= yeoman.app %>/scripts',
        dest: '<%= yeoman.dist %>/scripts/common',
        src: '**/*'
      },
      views: {
        expand: true,
        cwd: '<%= yeoman.app %>/views',
        dest: '<%= yeoman.dist %>/views/common',
        src: '**/*'
      },
      images: {
        expand: true,
        cwd: '<%= yeoman.app %>/images',
        dest: '<%= yeoman.dist %>/images/common',
        src: '**/*'
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '<%= yeoman.dist %>/styles/common',
        src: '**/*'
      },
      client: {
        expand: true,
        cwd: '<%= yeoman.dist %>',
        dest: '../client/app',
        src: '**/*'
      },
      admin: {
        expand: true,
        cwd: '<%= yeoman.dist %>',
        dest: '../admin/app',
        src: '**/*'
      }
    }
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('updateCommonFiles', [
    'clean:dist',
    'copy:scripts',
    'copy:images',
    'copy:styles',
    'copy:views',
    'copy:client',
    'copy:admin'
  ]);

  grunt.registerTask('default', ['updateCommonFiles', 'watch']);
};
