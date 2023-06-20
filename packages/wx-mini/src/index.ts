import { InitOptions } from '@zhj/monitor-types' // '@zyf2e/monitor-types'
import { isWxMiniEnv } from '@zhj/monitor-utils' // '@zyf2e/monitor-utils'
import { setupReplace } from './load'
import { initOptions, log } from '@zhj/monitor-core' // '@zyf2e/monitor-core'
import { sendTrackData, track } from './initiative'
import { SDK_NAME, SDK_VERSION } from '@zhj/monitor-shared' // '@zyf2e/monitor-shared'
import { MitoVue } from '../../vue/dist/vue' // '@zyf2e/monitor-vue'
import { errorBoundaryReport } from '../../react/dist/react' // '@zyf2e/monitor-react'
export function init(options: InitOptions = {}) {
  if (!isWxMiniEnv) return
  initOptions(options)
  setupReplace()
  Object.assign(wx, { mitoLog: log, SDK_NAME, SDK_VERSION })
}
export { log, sendTrackData, track, MitoVue, errorBoundaryReport }
