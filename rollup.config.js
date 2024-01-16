import json from '@rollup/plugin-json' // 它允许 Rollup 从 JSON 文件导入数据
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import clear from 'rollup-plugin-clear'
import cleanup from 'rollup-plugin-cleanup' // 是一个用于清理、优化和压缩 JavaScript 代码的 Rollup 插件
import size from 'rollup-plugin-sizes'
import { visualizer } from 'rollup-plugin-visualizer'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified')
}
// 是否生成声明文件
const isDeclaration = process.env.TYPES !== 'false'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const masterVersion = require('./package.json').version
const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const packageDirDist = process.env.LOCALDIR === 'undefined' ? `${packageDir}/dist` : process.env.LOCALDIR
// package => file name
const name = path.basename(packageDir)
// const pathResolve = (p) => path.resolve(packageDir, p)

// major name
const M = '@zhj1214/qdjk'
const packageDirs = fs.readdirSync(packagesDir)
const paths = {}
packageDirs.forEach((dir) => {
  // filter hidden files
  if (dir.startsWith('.')) return
  // paths[`${M}/${dir}`] = [`${packagesDir}/${dir}/src`]
  paths[`@zhj1214/qdjk-${dir}`] = [`${packagesDir}/${dir}/src`]
})

const common = {
  input: `${packageDir}/src/index.ts`,
  output: {
    banner: `/* ${M}-${name} version ' + ${masterVersion} */`, // 压缩包-头部注释
    footer: '/* Thank you for your support！ */' // 压缩包-尾部注释
  },
  external: [...Object.keys(paths)], // 通过script引入包
  plugins: [
    resolve(), //  Rollup 如何查找外部模块
    size(),
    // 分析插件
    visualizer({
      title: `${M} analyzer`,
      filename: 'analyzer.html'
    }),
    // 将commonjs的库装换为es6的库
    commonjs({
      exclude: 'node_modules'
    }),
    json(),
    cleanup({
      comments: 'none' // 用于设置是否移除特定类型的注释。可以使用字符串或正则表达式来指定需要移除的注释类型。
    }),
    // ts 插件配置
    typescript({
      tsconfig: 'tsconfig.build.json',
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: isDeclaration,
          declarationMap: isDeclaration,
          declarationDir: `${packageDirDist}/packages/`, // 类型声明文件的输出目录
          module: 'ES2015',
          paths
        }
      },
      include: ['*.ts+(|x)', '**/*.ts+(|x)', '../**/*.ts+(|x)']
    })
  ]
}
const esmPackage = {
  ...common,
  output: {
    file: `${packageDirDist}/${name}.esm.js`,
    format: 'es',
    name: 'MITO',
    sourcemap: true,
    ...common.output
  },
  plugins: [
    ...common.plugins,
    clear({
      targets: [packageDirDist]
    })
  ]
}
const cjsPackage = {
  ...common,
  external: [],
  output: {
    file: `${packageDirDist}/${name}.js`,
    format: 'cjs',
    name: 'MITO',
    sourcemap: true,
    minifyInternalExports: true,
    ...common.output
  },
  plugins: [...common.plugins]
}

const iifePackage = {
  ...common,
  external: [],
  output: {
    file: `${packageDirDist}/${name}.min.js`,
    format: 'iife',
    name: 'MITO',
    ...common.output
  },
  plugins: [...common.plugins, terser()]
}
const total = {
  esmPackage,
  iifePackage,
  cjsPackage
}
let result = total
export default [...Object.values(result)]
