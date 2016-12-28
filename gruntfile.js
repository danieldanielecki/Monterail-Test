module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"), // Initialize configuration file, which is package.json.

    // Notify success and failure informations.
    notify_hooks: {
      options: {
        duration: 5,
        enable: true,
        max_jshint_notifications: 5,
        success: true
      }
    },

    // Nodemon to use with MEAN stack.
    nodemon: {
      dev: {
        cwd: "client/app",
        ext: "css,html",
        livereload: true,
        script: "server/app.js"
      }
    },

    // Watcher for changes in files.
    watch: {
      options: {
        dateFormat: function (time) {
          grunt.log.writeln('The watch finished in ' + time + 'ms at ' + (new Date()).toString());
          grunt.log.writeln('Waiting for more changes...');
        },
        livereload: true
      },
      // Watch for changes in .html files.
      watch_html: {
        files: ["client/app/**/*.html", "client/index.html"],
        options: {
          port: 35725
        }
      },
      // Watch for changes in .scss files.
      watch_sass: {
        files: ["client/app/**/*.scss"],
        tasks: ["sass"], // If changes occured, then run sass task (compile from SCSS to CSS).
        options: {
          livereload: {
            host: 'localhost',
            port: 9000
          }
        }
      },
      // Watch for changes in .js files.
      watch_js: {
        files: ["client/**/*.js", "server/**/*.js"],
        options: {
          port: 35728
        }
      },

      grunt: {
        files: ["gruntfile.js"],
        options: {
          port: 35727,
          reload: true
        }
      }
    },

    // Compile SCSS to CSS.
    sass: {
      dist: {
        options: {
          lineNumber: true,
          noCache: true,
          sourcemap: "none",
          style: "expanded"
        },
        files: [{
          cwd: "client/app/css",
          dest: "client/app/css",
          expand: true,
          ext: ".css",
          src: ["*.scss"]
        }]
      }
    },

    // Validate .html files before distribution.
    htmllint: {
      all: ["client/app/**/*.html"],
      options: {
        force: true
      }
    },

    // Help with writing clean SCSS code.
    scsslint: {
      allFiles: [
        "client/app/**/*.scss"
      ],
      options: {
        colorizeOutput: true,
        config: ".scss-lint.yml",
        force: true
      }
    },

    // Validate custom JS code.
    jshint: {
      options: {
        force: true,
        jshintrc: ".jshintrc",
        reporter: require('jshint-stylish')
      },
      all: ["client/app/**/*.js", "client/server/**/*.js", "!app/**/*.min.js"]
    },

    // Remove unused CSS code.
    uncss: {
      options: {
        // Solving problems with Bootstrap's navbar.
        ignore: [/\w\.in/,
          ".fade",
          ".collapse",
          ".collapsing",
          /(#|\.)navbar(\-[a-zA-Z]+)?/,
          /(#|\.)dropdown(\-[a-zA-Z]+)?/,
          /(#|\.)(open)/,
          ".modal",
          ".modal.fade.in",
          ".modal-dialog",
          ".modal-document",
          ".modal-scrollbar-measure",
          ".modal-backdrop.fade",
          ".modal-backdrop.in",
          ".modal.fade.modal-dialog",
          ".modal.in.modal-dialog",
          ".modal-open",
          ".in",
          ".modal-backdrop"]
      },
      dist: {
        files: {
          // All files to uncss should be uncommented in app/index.html, then new file style.css in app/css will be created.
          "app/**/*.css": ["app/index.html"]
        }
      }
    },

    // Minify CSS.
    cssmin: {
      my_target: {
        files: [{
          cwd: "app/css",
          dest: "app/css",
          expand: true,
          ext: ".min.css",
          src: ["style.css"]
        }]
      }
    },

    // Minify JS.
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */',
        preserveComments: "some"
      },
      my_target: {
        files: {
          cwd: "**/*.js",
          dest: "**/*.js",
          expand: true,
          ext: ".min.js",
          src: ["**/*.js", "!**/*.min.js"]
        }
      }
    },

    // Concat JS.
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */',
        separator: ";\n",
        stripBanner: true
      },
      dist: {
        dest: "app/js/index.min.js",
        src: ["app/js/jquery.min.js", "app/js/bootstrap.min.js", "app/js/*.min.js"] // Bootstrap always after jQuery.
      }
    },

    // Copy necessary resources and files.
    copy: {
      main: {
        cwd: "app",
        dest: "dist",
        expand: true,
        src: ["fonts/*", "img/*", "css/style.min.css", "js/index.min.js"]
      }
    },

    // Dynamically minify unminified .html files. Before using comment/uncomment necessary code in index.html, look for 'CSS./JavaScript' and 'CSS/JavaScript after Grunt.'.
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeComments: true
        },
        files: [{
          cwd: "client/app",
          dest: "client/dist",
          expand: true,
          src: "*.html"
        }]
      }
    },

    'node-inspector': {
      dev: {}
    },

    concurrent: {
      css: ["watch:watch_sass", "nodemon", "node-inspector"],
      html: ["watch:watch_html", "nodemon", "node-inspector"],
      js: ["watch:watch_js", "nodemon", "node-inspector"],
      quality: ["htmllint", "scsslint", "jshint", "nodemon", "node-inspector"],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  grunt.event.on('watch', function (action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  // Loading Grunt tasks.
  grunt.loadNpmTasks("grunt-notify");
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-html");
  grunt.loadNpmTasks("grunt-scss-lint");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-uncss");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks("grunt-concurrent");
  grunt.loadNpmTasks('grunt-node-inspector');


  // Default task - in this check make server and check whether or not gruntfile.js changed.
  grunt.registerTask("default", ["watch:grunt"]);

  // Custom tasks, all tasks are ordered like they should be executed during development life cycle.
  grunt.registerTask("html_dev", "concurrent:html"); // Task for HTML development development.
  grunt.registerTask("css_dev", "concurrent:css"); // Task for CSS development.
  grunt.registerTask("js_dev", "concurrent:js"); // Task for JS development.
  grunt.registerTask("quality", "concurrent:quality"); // Task for check code quality.
  grunt.registerTask("optimize", ["uncss", "cssmin", "uglify", "concat"]); // Task for code optimalization.
  grunt.registerTask("dist", ["copy", "htmlmin"]); // Task for distribution.

  // Necessary for grunt-notify task.
  grunt.task.run("notify_hooks");
};