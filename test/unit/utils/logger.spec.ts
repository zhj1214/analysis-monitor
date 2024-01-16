import { logger } from '@zhj1214/qdjk-utils' // '@zhj1214/qdjk-utils'

describe('logger.ts', () => {
  it('should logger config enabled can take effect', () => {
    logger.bindOptions(true)
    expect(logger.getEnableStatus()).toBeTruthy()
    logger.disable()
    expect(logger.getEnableStatus()).toBeFalsy()
    logger.enable()
    expect(logger.getEnableStatus()).toBeTruthy()
  })
})
