module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      options: {
        quiet: true
      },
      dist: {
        files: {
          'public/css/app.css': 'public/css/app.scss'
        }
      }
    },
    karma: {
      unit: {
        configFile: 'test/unit/karma.conf.js',
        tasks: ['karma:unit:run'],
        background: true
      }
    },
    watch: {
      files: ['**/*.scss', 'public/js/*.js', 'test/unit/*.js'],
      tasks: ['sass', 'karma:unit:run']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default',['watch']);
};
