module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      build: {
        src: 'resources/components/foundation/js/vendor/custom.modernizr.js',
        dest: 'resources/public/js/modernizr.min.js'
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      build: {
        files: {
          'resources/public/js/main.min.js': [
            'resources/components/jquery/jquery.min.js',
            'resources/components/foundation/js/foundation.min.js',
            'resources/components/jquery/jquery.min.js',
            'resources/components/angular/angular.min.js',
            'resources/components/angular-route/angular-route.min.js',
            'resources/js/lib/*.js',
          ]
        }
      }
    },

    sass: {
      options: {
        includePaths: ['resources/components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'resources/public/css/app.css': 'resources/scss/app.scss'
        }
      }
    },

    watch: {
      grunt: {
        files: ['Gruntfile.js']
      },

      js: {
        files: 'resources/js/**/*.js',
        tasks: ['uglify']
      },

      sass: {
        files: 'resources/scss/**/*.scss',
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['copy', 'uglify', 'sass']);
  grunt.registerTask('default', ['build', 'watch']);
};
