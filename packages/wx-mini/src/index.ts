import { InitOptions } from '@zhj1214/qdjk-types' // '@zhj1214/qdjk-types'
import { isWxMiniEnv } from '@zhj1214/qdjk-utils' // '@zhj1214/qdjk-utils'
import { setupReplace } from './load'
import { initOptions, log } from '@zhj1214/qdjk-core' // '@zhj1214/qdjk-core'
import { sendTrackData, track } from './initiative'
import { SDK_NAME, SDK_VERSION } from '@zhj1214/qdjk-shared' // '@zhj1214/qdjk-shared'
import { MitoVue } from '@zhj1214/qdjk-vue' // '@zhj1214/qdjk-vue'
import { errorBoundaryReport } from '@zhj1214/qdjk-react' //
export function init(options: InitOptions = {}) {
  if (!isWxMiniEnv) return
  initOptions(options)
  setupReplace()
  Object.assign(wx, { mitoLog: log, SDK_NAME, SDK_VERSION })
}
export { log, sendTrackData, track, MitoVue, errorBoundaryReport }
