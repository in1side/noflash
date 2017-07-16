const historyApiFallback = require('connect-history-api-fallback')

module.exports = {
  port: 3000,
  open: false,
  files: ['build/www'],
  logLevel: 'silent',
  server: {
    baseDir: 'build/www'
  },
  middleware: [
    historyApiFallback()
  ]
}
