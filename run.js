const { cordova } = require('cordova-lib')
const zip = require('connect-phonegap/lib/middleware/zip')

const commands = {
  setup() {
    process.chdir('build')
    cordova.platform('add', ['android', 'ios'])
    cordova.plugin('add', 'cordova-plugin-device')
    cordova.plugin('add', 'cordova-plugin-headercolor')
    cordova.plugin('add', 'cordova-plugin-insomnia')
    cordova.plugin('add', 'cordova-plugin-statusbar')
    cordova.plugin('add', 'cordova-plugin-whitelist')
  },

  android() {
    process.chdir('build')
    cordova.run({ platforms: ['android']})
  },

  ios() {
    process.chdir('build')
    cordova.run({ platforms: ['ios'], options: { target: 'iPhone-6' }})
  }
}[process.argv[2]]()
