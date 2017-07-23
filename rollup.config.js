import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
// import uglify from 'rollup-plugin-uglify'

/*
  Waiting https://github.com/differui/rollup-plugin-sass/issues/29
 */

export default {
  entry: 'src/index.js',
  targets: [{
    dest: 'build/index.js',
    format: 'iife',
    sourceMap: true
  }],
  plugins: [
    json(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
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
