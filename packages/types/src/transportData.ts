import { voidFun } from '@zhj1214/qdjk-shared' // '@zhj1214/qdjk-shared'
import { BreadcrumbPushData } from './breadcrumb'
import { DeviceInfo, EActionType } from './track'
import { InitOptions } from './options'
export interface AuthInfo {
  apikey?: string
  trackKey?: string
  sdkVersion: string
  sdkName: string
  trackerId: string
}
export interface Queue {
  addFn(fn: voidFun): void
  clear(): void
  getStack(): void
  flushStack(): void
}

export interface TransportData {
  queue: Queue
  beforeDataReport: unknown
  backTrackerId: unknown
  configReportXhr: unknown
  configReportUrl: unknown
  configReportWxRequest: unknown
  useImgUpload: boolean
  apikey: string
  trackKey: string
  errorDsn: string
  trackDsn: string
  imgRequest(data: any, url: string): void
  getRecord(): any[]
  getDeviceInfo(): DeviceInfo | any
  beforePost(data: FinalReportType): void
  xhrPost(data: any, url: string): void
  wxPost(data: any, url: string)
  getAuthInfo(): AuthInfo
  getApikey(): void
  getTrackKey(): void
  getTrackerId(): string | number
  getTransportData(data: FinalReportType): TransportDataType
  isSdkTransportUrl(targetUrl: string): boolean
  bindOptions(options?: InitOptions): void
  send(data: FinalReportType): void
}

export interface TransportDataType {
  authInfo: AuthInfo
  breadcrumb?: BreadcrumbPushData[]
  data?: FinalReportType
  record?: any[]
  deviceInfo?: DeviceInfo
}

export type FinalReportType = ReportDataType | TrackReportData

interface ICommonDataType {
  // 是否是埋点数据
  isTrackData?: boolean
}

export interface ReportDataType extends ICommonDataType {
  type?: string
  message?: string
  url: string
  name?: string
  stack?: any
  time?: number
  errorId?: number
  level: string
  // ajax
  elapsedTime?: number
  request?: {
    httpType?: string
    traceId?: string
    method: string
    url: string
    data: any
  }
  response?: {
    status: number
    data: string
  }
  // vue
  componentName?: string
  propsData?: any
  // logError 手动报错 MITO.log
  customTag?: string
}

export interface TrackReportData extends ICommonDataType {
  // uuid
  id?: string
  // 埋点code 一般由人为传进来，可以自定义规范
  trackId?: string
  // 埋点类型
  actionType: EActionType
  // 埋点开始时间
  startTime?: number
  // 埋点停留时间
  durationTime?: number
  // 上报时间
  trackTime?: number
}

export function isReportDataType(data: ReportDataType | TrackReportData): data is ReportDataType {
  return (<TrackReportData>data).actionType === undefined && !data.isTrackData
}
