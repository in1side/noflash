const historyApiFallback = require('connect-history-api-fallback')

module.exports = {
  port: 3000,
  open: false,
  files: ['build'],
  logLevel: 'silent',
  server: {
    baseDir: 'build'
  },
  middleware: [
    historyApiFallback()
  ]
}
