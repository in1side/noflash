const zip = require('connect-phonegap/lib/middleware/zip')

module.exports = {
  port: 3000,
  open: false,
  files: ['build/www'],
  logLevel: 'silent',
  server: {
    baseDir: 'build/www'
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
}
