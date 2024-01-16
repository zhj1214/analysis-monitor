import { options, setTraceId } from '@zhj1214/qdjk-core' // '@zhj1214/qdjk-core'
import { _support } from '@zhj1214/qdjk-utils' // '@zhj1214/qdjk-utils'

describe('options.ts', () => {
  it('should setTraceId func work', () => {
    options.bindOptions({
      includeHttpUrlTraceIdRegExp: /cjh/,
      enableTraceId: true
    })
    let testIsRun = false
    setTraceId('http://www.test.com/a/b', (headerFieldName: string, traceId: string) => {
      testIsRun = true
    })
    expect(testIsRun).toBeFalsy()
    let cjhIsRun = false
    setTraceId('http://www.cjh.com/a/b', (headerFieldName: string, traceId: string) => {
      cjhIsRun = true
      expect(headerFieldName).toBe(options.traceIdFieldName)
    })
    expect(cjhIsRun).toBeTruthy()
  })
})
