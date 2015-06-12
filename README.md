# Web Project

A simple default web project starter which sets up things like gulpfile, basic folder structure, etc.

Gulpfile for easy building / minifying of CSS + JS, including 'dev' watch tasks for easy debugging during development.

Expects a folder structure like:

Project Name

= gulpfile.js

= package.json

= inc_css.php

= inc_js.php

= website

=== css

=== img

=== js

= workbench

=== img

=== js

=== scss

inc_css.php and inc_js.php are included here for injection of the created .CSS and .JS files. Resulting filenames are based on the 'name' property from package.json.

Run the following to install everything:

sudo npm install gulp sass gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-uglify gulp-rename gulp-conc main-bower-files gulp-inject event-stream del gulp-filter gulp-notify gulp-jscs gulp-jshint run-sequence gulp-plumber gulp-combine-media-queries --save-dev

Running 'gulp watch' will monitor the given info.src CSS, JS and img folders for changes and run the dev build accordingly.

Run 'gulp build' to rebuild everything.

Individual functions:

clean: clears everything out of the info.dest CSS and JS folders.

styles: compiles the SASS files in info.src.css, minifies, combines media queries and adds to the info.dest.css folder.

dev-styles: as 'styles' but no minification or combining of medua queries (for easy debugging).

styles-IE: builds an IE-specific .scss file.

dev-styles-IE: as above, without minification or media query combination.

js: concatenates and minifies all info.src .js files to info.dest js folder.

dev-js: moves info.src js files as-is to the info.dest folder.

bower: concatenates and minifies bower CSS and JS files into the info.dest folders -- adding a '_vendor' prefix to the resulting filename.

dev-bower: moveds the bower files, no concat or minification.

imgmin:
minimizes png files into the info.dest folder.

html:
merges the info.dest CSS and JS filenames into relevant files (included files containing the inject tags).
