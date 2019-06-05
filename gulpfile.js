const path = require('path')

const gulp = require('gulp')
const through2 = require('through2')
const yaml = require('gulp-yaml')
const rename = require("gulp-rename")
const debug = require('gulp-debug')
 
const noop = () => { }

const DIR = {
    syntaxes: './syntaxes/',
    snippets: './snippets/'
}

function yaml2json (filePath, destPath, {
    extname = null
} = {}) {
    return gulp.src(filePath)
        .pipe(through2.obj(function (chunk, enc, cb) {
            debugger
            if (chunk.contents.toString().trim().length == 0) {
                return cb('file should not empty')
            }
            this.push(chunk)
            cb()
        }))
        .on('error', function(err) {
            console.log(err)
        })
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
        .pipe(extname ? rename({ extname }) : through2.obj())
        .pipe(gulp.dest(destPath))
}

const watchYaml = function () {
    const syntaxWatcher = gulp.watch(path.join(DIR.syntaxes, '*.yaml'))
    const snippetWatcher = gulp.watch(path.join(DIR.snippets, '*.yaml'), { ignoreInitial: false })
    syntaxWatcher.on('change', (path, stats) => {
        console.log(`File ${path} was changed, make it to json`)
        yaml2json(path, DIR.syntaxes, {
            extname: '.tmLanguage.json'
        })
    })
    snippetWatcher.on('change', (path, stats) => {
        console.log(`File ${path} was changed, make it to json`)
        yaml2json(path, DIR.snippets)
    })
    snippetWatcher.on('error', (path, stats) => {
        console.log(`File ${path} was changed, make it to json`)
    })
}

exports.default = function () {
    watchYaml()
}
