import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'

/*
  Waiting https://github.com/differui/rollup-plugin-sass/issues/29
 */

export default {
  entry: 'src/index.js',
  targets: [{
    dest: 'build/www/index.js',
    format: 'iife',
    sourceMap: true
  }],
  plugins: [
    json(),
    resolve({
      module: true
    }),
    commonjs(),
    buble({
      objectAssign: 'Object.assign',
      transforms: {
        dangerousTaggedTemplateString: true
      }
    })
    // uglify()
  ],
  onwarn(err) {
    if (!err.startsWith('Use of `eval`')) {
      console.log(err)
    }
  }
}
