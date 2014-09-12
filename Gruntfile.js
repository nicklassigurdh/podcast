module.exports = function(grunt) {

    grunt.registerTask('npm-install-build', 'install the productions dep in build', function() {

        var exec = require('child_process').exec;
        var cb = this.async();

        exec('npm install --production', {cwd: './build'}, function(err, stdout, stderr) {
            console.log(stdout);
            cb();
        });
    });

    grunt.registerTask('distToRelease', 'install the productions dep in build', function() {

        var exec = require('child_process').exec;
        var cb = this.async();

        exec('cp -r * ../../socialpodcast/', {cwd: './dist'}, function(err, stdout, stderr) {
            console.log(stdout);
            cb();
        });
    });


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        express: {
            local: {
                options: {
                    server: 'src/server.js',
                    port: 9000,
                    bases: 'src/static'
                }
            }
        },
        copy: {
            build: {
                files: [
                    {expand: true, cwd: 'src/', src: ['**'], dest: 'build/'},
                    {expand: true, src: ['package.json'], dest: 'build/'}
                ]
            },
            dist: {
                files: [
                    {expand: true, cwd: 'src/', src: ['**'], dest: 'dist/'},
                    {expand: true, src: ['package.json'], dest: 'dist/'}
                ]
            },
            distToRelease: {
                files: [
                    {expand: true, cwd: 'dist/', src: ['**'], dest: '../../socialpodcast/'},
                    {expand: true, src: ['package.json'], dest: 'build/'}
                ]
            }
        }
    });


    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('build', ['copy:build', 'npm-install-build']);

    grunt.registerTask('dist', ['copy:dist', 'distToRelease']);

    grunt.registerTask('server', ['express:local', 'express-keepalive']);
    grunt.registerTask('default', ['server']);

};