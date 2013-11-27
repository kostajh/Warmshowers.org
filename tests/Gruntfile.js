module.exports = function(grunt) {

  grunt.initConfig({
    casperjs: {
      options: {
        casperjsOptions: ['--environment=warmshowers.dev']
      },
      files: ['casperjs/**/*.js']
    },
    shell: {
        startDrushServer: {
            options: {
              async: true
            },
            command: 'drush @warmshowers.dev runserver --drush-server'
        }
    }
  });
  grunt.loadNpmTasks('grunt-casperjs');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.registerTask('default', ['shell', 'casperjs']);

};
