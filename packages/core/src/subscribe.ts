import { EVENTTYPES, WxEvents } from '@zyf2e/monitor-shared'
import { getFlag, getFunctionName, logger, nativeTryCatch, setFlag } from '@zyf2e/monitor-utils'
export interface ReplaceHandler {
  type: EVENTTYPES | WxEvents
  callback: ReplaceCallback
}

type ReplaceCallback = (data: any) => void

const handlers: { [key in EVENTTYPES]?: ReplaceCallback[] } = {}

// 注册type到handlers中，形成订阅
export function subscribeEvent(handler: ReplaceHandler): boolean {
  if (!handler || getFlag(handler.type)) return false
  setFlag(handler.type, true)
  handlers[handler.type] = handlers[handler.type] || []
  handlers[handler.type].push(handler.callback)
  return true
}

// 订阅被触发的第一层进行捕获错误
export function triggerHandlers(type: EVENTTYPES | WxEvents, data: any): void {
  if (!type || !handlers[type]) return
  handlers[type].forEach((callback) => {
    nativeTryCatch(
      () => {
        callback(data)
      },
      (e: Error) => {
        logger.error(`重写事件triggerHandlers的回调函数发生错误\nType:${type}\nName: ${getFunctionName(callback)}\nError: ${e}`)
      }
    )
  })
}
