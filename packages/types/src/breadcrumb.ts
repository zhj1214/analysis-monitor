import { Severity } from './severity'
import { BREADCRUMBTYPES } from '@zhj1214/qdjk-shared' // '@zhj1214/qdjk-shared'
import { ReportDataType } from './transportData'
import { Replace } from './replace'
import { TNumStrObj } from './common'
import { InitOptions } from './options' // '@zhj1214/qdjk-types'

export interface BreadcrumbPushData {
  /**
   * 事件类型
   */
  type: BREADCRUMBTYPES
  // string for click dom
  data: ReportDataType | Replace.IRouter | Replace.TriggerConsole | TNumStrObj
  /**
   * 分为user action、debug、http、
   */
  category?: string
  time?: number
  level: Severity
}

export interface Breadcrumb {
  maxBreadcrumb: Number
  beforePushBreadcrumbFn?: unknown
  stack: BreadcrumbPushData[]
  push(data: BreadcrumbPushData): void
  immediatePush(data: BreadcrumbPushData): void
  shift(): Boolean
  clear(): void
  getStack(): BreadcrumbPushData[]
  getCategory(type: BREADCRUMBTYPES): string
  bindOptions(options?: InitOptions): void
}
