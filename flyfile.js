import browserSync from 'browser-sync'
import mkdirp from 'mkdirp-then'
import path from 'path'
import { cordova as cordovaLib } from 'cordova-lib'
import zip from 'connect-phonegap/lib/middleware/zip'

const cordova = cordovaLib.raw

const paths = {
  app: 'app/**/*.js',
  appEntry: 'app/index.js',
  assets: 'assets/{,*/}*',
  build: 'build',
  config: 'config.xml',
  sass: 'sass/**/*.scss',
  sassEntry: 'sass/index.scss',
  dist: 'build/www'
}

export async function build() {
  await this.start('buildApp')
  await this.start('buildSass')
  await this.start('copyConfig')
  await this.start('copyAssets')
}

export async function buildApp() {
  await this
    .source(paths.appEntry)
    .rollup({
      rollup: {
        plugins: [
          require('rollup-plugin-babel')({
            presets: [ ['es2015', { modules: false }], 'es2017' ],
            plugins: [ 'transform-runtime' ],
            exclude: 'node_modules/**',
            runtimeHelpers: true
          }),
          require('rollup-plugin-node-resolve')(),
          require('rollup-plugin-commonjs')(),
          require('rollup-plugin-json')()
        ]
      },
      bundle: {
        moduleName: 'noflash',
        format: 'iife',
        sourceMap: true,
        sourceMapFile: path.resolve(paths.dist, 'index.js')
      }
    })
    .target(paths.dist)
}

export async function buildSass() {
  await this
    .source(paths.sassEntry)
    .sass({
      includePaths: ['sass', 'node_modules'],
      outputStyle: 'compressed'
    })
    .target(paths.dist)
}

export async function clean() {
  await this
    .clear(paths.build)
}

export async function copyAssets() {
  await this
    .source(paths.assets)
    .target(paths.dist)
}

export async function copyConfig() {
  await this
    .source(paths.config)
    .target(paths.build)
}

export async function serve() {
  await browserSync({
    open: false,
    notify: false,
    files: [paths.dist],
    server: {
      baseDir: paths.dist
    },
    middleware: [(req, res, next) => {
      // XXX: waiting https://github.com/phonegap/connect-phonegap/issues/96
      if (0 === req.url.indexOf('/__api__/appzip')) {
        process.chdir(paths.build)
        res.on('finish', () => process.chdir(__dirname))
        zip({})(req, res)
      }
      else {
        next()
      }
    }]
  })
}

export async function setup() {
  await this.start('copyConfig')
  await mkdirp(paths.dist)
  process.chdir(paths.build)
  await cordova.platform('add', ['android', 'ios'])
}

export default async function() {
  await this.start('serve')
  await this.watch(paths.app, 'buildApp')
  await this.watch(paths.config, 'copyConfig')
  await this.watch(paths.sass, 'buildSass')
  await this.watch(paths.assets, 'copyAssets')
}
