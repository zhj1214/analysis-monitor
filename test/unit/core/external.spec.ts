import { BREADCRUMBTYPES } from '@supaur/qdjk-shared' // '@supaur/qdjk-shared'
import { breadcrumb, log } from '@supaur/qdjk-core' // '@supaur/qdjk-core'
import { Severity } from '@supaur/qdjk-types' // '@supaur/qdjk-utils'

describe('external log function', () => {
  it('should log func work', () => {
    const message = 'error info'
    const tag = 'error tag'
    const level = Severity.High
    log({
      message,
      tag,
      level
    })
    const stack = breadcrumb.getStack()
    expect(stack.length).toBe(1)
    expect(stack[0].type).toBe(BREADCRUMBTYPES.CUSTOMER)
    expect(stack[0].level).toBe(Severity.Error)
    expect(stack[0].data).toBe(message)
    expect(breadcrumb.getStack().length).toBe(1)
  })
})
