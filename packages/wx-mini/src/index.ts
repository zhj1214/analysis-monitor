import { InitOptions } from '@supaur/qdjk-types' // '@supaur/qdjk-types'
import { isWxMiniEnv } from '@supaur/qdjk-utils' // '@supaur/qdjk-utils'
import { setupReplace } from './load'
import { initOptions, log } from '@supaur/qdjk-core' // '@supaur/qdjk-core'
import { sendTrackData, track } from './initiative'
import { SDK_NAME, SDK_VERSION } from '@supaur/qdjk-shared' // '@supaur/qdjk-shared'
import { MitoVue } from '@supaur/qdjk-vue' // '@supaur/qdjk-vue'
import { errorBoundaryReport } from '@supaur/qdjk-react' // 
export function init(options: InitOptions = {}) {
  if (!isWxMiniEnv) return
  initOptions(options)
  setupReplace()
  Object.assign(wx, { mitoLog: log, SDK_NAME, SDK_VERSION })
}
export { log, sendTrackData, track, MitoVue, errorBoundaryReport }
