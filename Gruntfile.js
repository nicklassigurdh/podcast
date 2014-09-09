module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        express: {
            server: {
                options: {
                    port: 9000,
                    bases: 'static'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-express');

    grunt.registerTask('default', ['express', 'express-keepalive']);

};