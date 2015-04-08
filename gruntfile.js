/**
 * Created by Tim on 4/8/15.
 */

module.exports = function(grunt) {
    var banner = '/*\n<%= pkg.name %> <%= pkg.version %>';
    banner += '- <%= pkg.description %>\n<%= pkg.repository.url %>\n';
    banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['gruntfile.js', 'index.js', 'src/*.js',
                'src/bin/*.js', 'src/lib/*.js'],
            options: {
                maxlen: 80,
                quotmark: 'single'
            }
        },
        simplemocha: {
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'tap'
            },
            all: { src: ['tests/*.js'] }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');

    grunt.registerTask('default',
        ['jshint', 'simplemocha']);
};