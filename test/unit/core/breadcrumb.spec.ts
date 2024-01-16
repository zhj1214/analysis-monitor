import { BREADCRUMBCATEGORYS, BREADCRUMBTYPES } from '@zhj1214/qdjk-shared' // '@zhj1214/qdjk-shared'
import { breadcrumb } from '@zhj1214/qdjk-core' // '@zhj1214/qdjk-core'
import { BreadcrumbPushData, Severity } from '@zhj1214/qdjk-types' // '@zhj1214/qdjk-types'

describe('breadcrumb.ts', () => {
  beforeAll(() => {
    breadcrumb.bindOptions({
      maxBreadcrumbs: 16
    })
  })
  afterEach(() => {
    breadcrumb.clear()
  })

  const breadcrumbDemo: BreadcrumbPushData = {
    category: BREADCRUMBCATEGORYS.DEBUG,
    type: BREADCRUMBTYPES.CONSOLE,
    data: 'unit',
    level: Severity.Debug
  }

  it("should less than 16 of breadcrumb's max lenght", () => {
    new Array(20).fill('').forEach(() => breadcrumb.push(breadcrumbDemo))
    expect(breadcrumb.getStack().length === 16)
  })

  it('should work on beforePushBreadcrumb', () => {
    breadcrumb.bindOptions({
      beforePushBreadcrumb(breadcrumb, hint) {
        if (hint.category === BREADCRUMBCATEGORYS.DEBUG) {
          return false
        }
        return hint
      }
    })
    breadcrumb.push(breadcrumbDemo)
    expect(breadcrumb.getStack().length).toBe(0)
    breadcrumbDemo.category = BREADCRUMBCATEGORYS.HTTP
    breadcrumb.push(breadcrumbDemo)
    expect(breadcrumb.getStack().length).toBe(1)
  })

  it('should work on breadcrumb.getCategory ', () => {
    expect(breadcrumb.getCategory(BREADCRUMBTYPES.XHR)).toBe(BREADCRUMBCATEGORYS.HTTP)
    expect(breadcrumb.getCategory(BREADCRUMBTYPES.FETCH)).toBe(BREADCRUMBCATEGORYS.HTTP)
    expect(breadcrumb.getCategory(BREADCRUMBTYPES.CLICK)).toBe(BREADCRUMBCATEGORYS.USER)
    expect(breadcrumb.getCategory(BREADCRUMBTYPES.ROUTE)).toBe(BREADCRUMBCATEGORYS.USER)
    expect(breadcrumb.getCategory(BREADCRUMBTYPES.CUSTOMER)).toBe(BREADCRUMBCATEGORYS.DEBUG)
    expect(breadcrumb.getCategory(BREADCRUMBTYPES.CUSTOMER)).toBe(BREADCRUMBCATEGORYS.DEBUG)
    expect(breadcrumb.getCategory(BREADCRUMBTYPES.UNHANDLEDREJECTION)).toBe(BREADCRUMBCATEGORYS.EXCEPTION)
    expect(breadcrumb.getCategory(BREADCRUMBTYPES.CODE_ERROR)).toBe(BREADCRUMBCATEGORYS.EXCEPTION)
    expect(breadcrumb.getCategory(BREADCRUMBTYPES.UNHANDLEDREJECTION)).toBe(BREADCRUMBCATEGORYS.EXCEPTION)
    expect(breadcrumb.getCategory(BREADCRUMBTYPES.RESOURCE)).toBe(BREADCRUMBCATEGORYS.EXCEPTION)
    expect(breadcrumb.getCategory(BREADCRUMBTYPES.VUE)).toBe(BREADCRUMBCATEGORYS.EXCEPTION)
    expect(breadcrumb.getCategory(BREADCRUMBTYPES.REACT)).toBe(BREADCRUMBCATEGORYS.EXCEPTION)
  })
})
