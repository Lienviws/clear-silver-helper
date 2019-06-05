const path = require('path')

const gulp = require('gulp')
const yaml = require('gulp-yaml')
const rename = require("gulp-rename")
const debug = require('gulp-debug')
 
const emptyCb = () => {}
const INCLUDE_DIR = {
    yaml: './syntaxes/'
}
const OUTPUT_DIR = {
    yaml: './syntaxes/'
}

function yaml2json (cb, filePath) {
    if (!filePath) filePath = path.join(INCLUDE_DIR.yaml, '*.yaml')
    return gulp.src(filePath)
        .pipe(debug({
            title: 'yaml2json:',
            showFiles: true,
            showCount: true
        }))
        .pipe(yaml({ 
            space: 4,
            onWarning: () => {
                console.log('----------')
            }
        }))
        .pipe(rename({
            extname: '.tmLanguage.json'
        }))
        .pipe(gulp.dest(OUTPUT_DIR.yaml))
}

function yaml2jsonAll () {
    return () => {
        return yaml2json
    }
}

const watchYaml = gulp.series(yaml2json, function (cb) {
    const watcher = gulp.watch(path.join(INCLUDE_DIR.yaml, '*.yaml'))
    watcher.on('change', (path, stats) => {
        console.log(`File ${path} was changed, make it to json`)
        yaml2json(emptyCb, path)
    })
    cb()
})

exports.default = gulp.series(watchYaml)
