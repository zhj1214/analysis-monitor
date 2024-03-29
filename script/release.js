const chalk = require('chalk')

const { getArgv, targets: allTargets, binRun, getPkgRoot, step } = require('./utils')

const path = require('path')
const fs = require('fs')

let beReleasedPackages = []

run()
async function run() {
  const argv = getArgv()
  beReleasedPackages = argv._
  release()
}

async function release() {
  step('\ncollect be released packages...')
  if (beReleasedPackages.length === 0) {
    beReleasedPackages = allTargets
  }
  step(`\nbeReleasedPackages: ${beReleasedPackages.join('\n')}`)
  beReleasedPackages.forEach((target) => {
    publicPackage(target)
  })
}

async function publicPackage(pkgName) {
  const pkgRoot = getPkgRoot(pkgName)
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const pkg = require(pkgPath)
  const version = pkg.version
  if (pkg.private) return
  fs.access(`${pkgRoot}/dist`, fs.constants.F_OK, async (err) => {
    if (err) {
      console.log(chalk.red(`${pkgName} don't have dist folder`))
      return
    }
    step(`Publishing ${pkgName}...`)
    try {
      // console.log(chalk.green(`Successfully published ${pkgName}@${version}`))

      // zhj1214 自己的仓库: 先执行 npm login 在执行这个脚本
      await binRun('npm', ['publish', '--registry', 'https://registry.npmjs.org'], {
        cwd: pkgRoot,
        stdio: 'pipe'
      })

      // 东合私服
      // await binRun('yarn', ['publish', '--registry', 'http://35.234.13.143:4873/'], {
      //   cwd: pkgRoot,
      //   stdio: 'pipe'
      // })

      // 先升级一个版本（没有使用）
      // await binRun('yarn', ['version', '--patch'], {
      //   cwd: pkgRoot,
      //   stdio: 'pipe'
      // })

      console.log(chalk.green(`Successfully published ${pkgName}@${version}`))
    } catch (error) {
      console.log(`failed publish ${pkgName}@${version}`, error)
    }
  })
}
