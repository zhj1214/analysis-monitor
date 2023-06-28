const fs = require('fs-extra') // nodejs模块：fs-extra 是 fs模块的扩展，提供了更多便利的 API，并继承了fs模块的 API
const path = require('path') /** nodejs模块：提供文件路径相关api */
const chalk = require('chalk') /** nodejs模块：作用是修改控制台中字符串的样式 */

const { targets: allTargets, fuzzyMatchTarget, getArgv, binRun } = require('./utils')
let buildTypes = true
// local debug
let LOCALDIR = ''
let rollupWatch = false
run()
async function run() {
  const argv = getArgv()
  // console.log('--getArgv--', argv)
  // accept npm run build web browser...
  const paramTarget = argv._
  LOCALDIR = argv.local
  buildTypes = argv.types !== 'false'
  rollupWatch = argv.watch === 'true'
  if (paramTarget.length === 0) {
    buildAll(allTargets)
  } else {
    buildAll(paramTarget)
  }
}

function buildAll(targets) {
  console.log('--targets--', targets)
  // runParallel(10, targets, rollupBuild)
}

async function runParallel(maxConcurrency, sources, iteratorFn) {
  const ret = []
  // const executing = []
  for (const item of sources) {
    const p = Promise.resolve().then(() => iteratorFn(item))
    ret.push(p)
    // if (maxConcurrency <= source.length) {
    //   const e = p.then(() => executing.splice(executing.indexOf(e)), 1)
    //   executing.push(e)
    //   if (executing.length >= maxConcurrency) {
    //     await Promise.race(executing)
    //   }
    // }
  }
  return Promise.all(ret)
}

/**
 *
 * @param {*} target packages下的文件夹名称
 */

async function rollupBuild(target) {
  const pkgDir = path.resolve(`packages/${target}`)
  const pkg = require(`${pkgDir}/package.json`)
  if (pkg.private) {
    return
  }
  // const env = [pkg.buildOption && pkg.buildOption.env]
  /**
   * execa
   * 第1个参数：string类型 类似在cmd中运行脚本的时候敲的命令
   * 第2个参数：string[]  跟第1个参数绑定的命令的相关属性信息
   * 第3个参数：execa.Options<string>
   * rollup -wc --environment TARGET:[target],FORMATS:umd
   *
   * -wc: -w 和 -c 组合，-c 使用配置文件 rollup.config.js 打包 js ，-w 观测源文件变化，并自动重新打包
   *
   * –environment: 设置传递到文件中的环境变量，可以在JS文件中，通过 process.env 读取
   * 这里设置了：process.env.COMMIT、process.env.TARGET 等几个变量
   *
   */

  const args = [
    '-c',
    '--environment',
    [
      // `COMMIT:${commit}`,
      // `NODE_ENV:${env}`,
      `TARGET:${target}`,
      `TYPES:${buildTypes}`,
      `LOCALDIR:${LOCALDIR}`
    ]
      .filter(Boolean)
      .join(',')
    /**
     * stdio选项用于配置在父进程和子进程之间建立的管道
     * 默认情况下，子进程的stdin、stdout和stderr被重定向到相应的 subprocess.stdin, subprocess.stdout, subprocess.stderr 所属ChildProcess对象的流。
     * 这相当于 options.stdio = ['inherit'，'inherit'，'inherit']
     */
    // { stdio: 'inherit' }
  ]
  rollupWatch && args.push('--watch')
  // console.log('args--',args);
  
  const result = await binRun('rollup', args)
  console.log(chalk.bold(chalk.red(`Rolling 编译完成  ${target}...`)))
  return target
}

const next = async (target) => {
  const pkgDir = path.resolve(`packages/${target}`)
  const pkg = require(`${pkgDir}/package.json`)
  if (buildTypes && pkg.types) {
    console.log(chalk.bold(chalk.green(`api-extractor 开始整合 ${target}...`)))

    /**
     * build types
     * @microsoft/api-extractor 的大致工作流程如下：
     * 1、tsc将ts源码转成js之后，会生成一堆 *.d.ts
     * 2、API Extractor 通过读取这些 d.ts
     *  2.1 可以生成 api 报告
     *  2.2 将凌乱的 d.ts 打包并删减
     *  2.3 生成文档描述模型（xxx.api.json）可以通过微软提供的 api-documenter 进一步转换成 Markdown文档。
     */

    const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')

    // 读取extractor配置文件路径（package.json同级目录下的 api-extractor.json）
    const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
    // 加载api-extractor.json配置文件，并返回一个'ExtractorConfig'对象
    const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
    // 使用已准备好的'ExtractorConfig'对象调用API提取器。
    const extractorResult = Extractor.invoke(extractorConfig, {
      localBuild: true, // 示意API提取器作为本地build的一部分运行，例如在开发人员的计算机上。默认：false
      showVerboseMessages: false // 如果为true，API提取器将输出包含{@link ExtractorLogLevel.Verbose}冗余消息。
    })
    if (extractorResult.succeeded) {
      // const typesDir = path.resolve(pkgDir, 'types')
      // if (await fs.exists(typesDir)) {
      //   const dtsPath = path.resolve(pkgDir, pkg.types)
      //   const existing = await fs.readFile(dtsPath, 'utf-8')
      //   const typeFiles = await fs.readdir(typesDir)
      //   const toAdd = await Promise.all(
      //     typeFiles.map((file) => {
      //       return fs.readFile(path.resolve(typesDir, file), 'utf-8')
      //     })
      //   )
      //   console.log('add', toAdd)
      //   await fs.writeFile(dtsPath, existing + '\n' + toAdd.join('\n'))
      // }
      console.log(chalk.bold(chalk.green(`API Extractor completed successfully.`)))
    }
    console.log('pkgDir--', pkgDir)
    await fs.remove(`${pkgDir}/dist/packages`)
  }
}
