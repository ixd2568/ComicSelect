module.exports = function(grunt)
{
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify:
	{
		options:
		{
			banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		},
		build:
		{
			src: 'js/script.js',
			dest: 'build/js/script.js'
		}
    },
	
	htmlmin:
	{                                     // Task
		dist:
		{                                      // Target
			options:
			{                                 // Target options
				removeComments: true,
				collapseWhitespace: true
			},
			files:
			{                                   // Dictionary of files
				'build/index.html': 'index.html',
			}
		}
    },
	
	cssmin:
	{
		css:
		{
			src: 'css/style.css',
			dest: 'build/css/style.css'
		}
	},
	
	copy: 
	{
		main:
		{
			files: 
			[
				//xml files aren't minified because minification removes relevant data
				{src: ['images/*.*'], dest: 'build/'},
				{src: ['xml/*.*'], dest: 'build/'},
        
			]
		}
    },
	
	clean:
	{
		build: ['build'],
		remainingFiles: []
	}
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-css');
  // Default task(s).
  grunt.registerTask('default', ['clean:build', 'copy', 'uglify', 'cssmin', 'htmlmin']);

};