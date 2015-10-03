/* global module */

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bump: {
			options: {
				files: ["package.json", "bower.json"],
				updateConfigs: ["pkg"],
				commitFiles: ["package.json", "bower.json"],
				pushTo: "origin"
			}
		},
		watch: {
			js: {
				files: ["src/*.js"],
				tasks: ["default"]
			}
		},
		ngAnnotate: {
			js: {
				src: ["src/main.js", "src/factory.js", "src/directive.js"],
				dest: "dist/datetime.js"
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ng-annotate');

	// Default task(s).
	grunt.registerTask('default', ["ngAnnotate"]);

};
