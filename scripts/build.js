const execa = require('execa')

const platform = process.argv[2]
const platformPath = __dirname + `/../platforms/${platform}`

const platforms = {
  android() {
    const cwd = platformPath
    execa(`${cwd}/gradlew`, ['build'], { cwd }).then(res => {
      console.log('🎉  Build successful')
    })
  }
}[platform]()
