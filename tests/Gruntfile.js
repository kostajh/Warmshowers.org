module.exports = function(grunt) {

  grunt.initConfig({
  casperjs: {
    options: {
      casperjsOptions: ['--environment=warmshowers.dev']
    },
    files: ['casperjs/**/*.js']
  },
  });
  grunt.loadNpmTasks('grunt-casperjs');
  grunt.registerTask('default', 'casperjs');

};
