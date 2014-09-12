module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            scss: {
                files: "scss/**/*.scss",
                tasks: 'compass'
            }
        },

        compass: {
            dist: {
                options: {
                    sassDir: "scss",
                    cssDir: "css",
                    config: "config.rb",
                    trace: false,
                }
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src: ["index.html", "css/**/*.css", "elements/**/*", "js/**/*.js", "app/**/*"]
                },
                options: {
                    server: {
                        baseDir: "./",
                        index: './index.html'
                    },
                    port: 9001,
                    watchTask: true // < VERY important
                },
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-browser-sync');

    grunt.registerTask('default', ['browserSync', 'watch']);
};
