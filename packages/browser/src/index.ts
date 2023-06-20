export * from './handleEvents'
export * from './load'
export * from './replace'
import { setupReplace } from './load'
import { initOptions, log } from '@supaur/qdjk-core' // '@supaur/qdjk-core'
import { _global } from '@supaur/qdjk-utils' // '@supaur/qdjk-utils'
import { SDK_VERSION, SDK_NAME } from '@supaur/qdjk-shared'// '@supaur/qdjk-shared'
import { InitOptions } from '@supaur/qdjk-types' // '@supaur/qdjk-types'
function webInit(options: InitOptions = {}): void {
  if (!('XMLHttpRequest' in _global) || options.disabled) return
  initOptions(options)
  setupReplace()
}

function init(options: InitOptions = {}): void {
  webInit(options)
}

/**
 * @description: sdk最终导出的地方
 * @return {*} init 初始化  log 自定义上报
 * @author: zhj1214
 */
export { SDK_VERSION, SDK_NAME, init, log }
