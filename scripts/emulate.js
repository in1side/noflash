const execa = require('execa')

const platform = process.argv[2]

const platforms = {
  android() {
    const emulatorBin = process.env.ANDROID_HOME + '/tools/emulator'

    execa(emulatorBin, ['-list-avds']).then(({ stdout }) => {
      const avd = stdout.split(/\n/g)[0]

      execa(emulatorBin, ['-avd', avd])

      ;(function waitForDevice() {
        execa('adb', [
          'shell',
          'getprop', 'sys.boot_completed'
        ]).then(({ stdout }) => {
          if ('1' !== stdout.trim()) {
            return setTimeout(waitForDevice, 1000)
          }
          console.log('📺  Emulator booted')
          execa('adb', [
            'install',
            '-r', 'platforms/android/app/build/outputs/apk/app-debug.apk'
          ]).then(_ => {
            console.log('⚡  NoFlash installed')
            execa('adb', [
              'shell', 'monkey',
              '-p', 'sh.ngryman.noflash',
              '-c', 'android.intent.category.LAUNCHER', '1'
            ]).then(_ => {
              console.log('💥  NoFlash started')
            })
          })
        }).catch(_ => {
          setTimeout(waitForDevice, 1000)
        })
      })()
    })
  }
}[platform]()
