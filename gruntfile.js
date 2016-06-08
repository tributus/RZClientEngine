/**
 * Created by anderson.santos on 08/01/2016.
 */
module.exports = function (grunt) {
    grunt.initConfig({
            options: {
                srcFiles: [
                    "src/Polyfills.js",
                    "src/utils.js",
                    "src/NamespaceDeclares.js",
                    "src/helpers.js",
                    "src/RuteZangada.js",
                    "src/WidgetEngine.js",
                    "src/rz.utils.uri.js",
                    "src/plugins/jsonFilterEngine.js"
                ],
                libs: [
                    "bower_components/jquery/dist/jquery.min.js"
                ],
                test: {
                    getFilesToTest: function () {
                        return this.generateFileRefs('test/src/*.js', 'src');
                    },
                    getSpecs: function () {
                        return this.generateFileRefs('test/spec/*.spec.js', 'spec');
                    },
                    /*getLibs: function (libs) {
                        var $this = this;
                        //var libs = ["lib/jquery-2.1.4.min.js"];
                        var output = '';
                        libs.forEach(function (it) {
                            output += $this.generateFileRefs(it, 'lib');
                        });
                        return output;
                    },*/
                    generateFileRefs: function (src, dest) {
                        var basestr = '<script type="text/javascript" src="#/*"></script>\n    ';
                        var jsDeclarations = '';
                        grunt.file.expand({}, src).forEach(function (path) {
                            var fileParts = path.split('/');
                            var fileName = fileParts[fileParts.length - 1];
                            jsDeclarations += basestr.replace("*", fileName).replace("#", dest);
                        });
                        return jsDeclarations;
                    }
                }
            },
            concat: {
                dist: {
                    src: ['<%= options.srcFiles %>'],
                    dest: "dist/RZClientEngine.js"
                },
                standalone:{
                    src: ["<%= options.libs %>","dist/RZClientEngine.min.js"],
                    dest: "dist/RZClientEngine-standalone.min.js"
                },
                test_libs: {
                    src: ['<%= options.libs %>'],
                    dest: "test/lib/libs.js"
                }
            },
            uglify: {
                options: {
                    mangle: false
                },
                default: {
                    files: {
                        "dist/RZClientEngine.min.js": ['dist/RZClientEngine.js']
                    }
                }
            },
            copy: {
                test: {
                    src: 'dist/RZClientEngine.js',
                    dest: 'test/src/RZClientEngine.js'
                },
                test_template: {
                    options: {
                        processContent: function (content) {
                            return grunt.template.process(content);
                        }
                    },
                    src: 'test/template/SpecRunner.html.ejs',
                    dest: 'test/SpecRunner.html'
                }
            },
            jasmine: {
                src: 'test/src/*.js',
                options: {
                    specs: 'test/spec/*.spec.js',
                    helpers: 'test/specs/helpers/*.js',
                    vendor: ['test/lib/*.js']
                }
            }
        }
    );
// Plugins do Grunt
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');


    grunt.registerTask('default', ['concat:dist','uglify','concat:standalone','concat:test_libs',  'copy:test', 'copy:test_template']);
    grunt.registerTask('test', ['jasmine']);

};