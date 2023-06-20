import { EActionType, ITrackBaseParam, TrackReportData } from '@supaur/qdjk-types' // '@supaur/qdjk-types'
import { transportData } from '@supaur/qdjk-core' // '@supaur/qdjk-core'
import { generateUUID, getTimestamp } from '@supaur/qdjk-utils' // '@supaur/qdjk-utils'

export function track(actionType: EActionType, param: ITrackBaseParam) {
  const data = {
    ...param,
    // rewrite actionType
    actionType
  }
  sendTrackData(data)
  return data
}

/**
 * 手动发送埋点数据到服务端
 * @param data 埋点上报的数据，必须含有actionType属性
 */
export function sendTrackData(data: TrackReportData) {
  const id = generateUUID()
  const trackTime = getTimestamp()
  transportData.send({
    id,
    trackTime,
    ...data
  })
}
