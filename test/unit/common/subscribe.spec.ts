import { EVENTTYPES } from '@supaur/qdjk-shared' // '@supaur/qdjk-shared'
import { subscribeEvent, triggerHandlers } from '@supaur/qdjk-core' // '@supaur/qdjk-core'

describe('subscribe.ts', () => {
  it('should subscribe work', () => {
    let isRun = false
    const tempData = { test: 1 }
    let callBackData
    subscribeEvent({
      type: EVENTTYPES.MITO,
      callback: (data) => {
        isRun = true
        callBackData = data
      }
    })
    triggerHandlers(EVENTTYPES.MITO, tempData)
    expect(isRun).toBeTruthy()
    expect(callBackData).toEqual(tempData)
  })
})
