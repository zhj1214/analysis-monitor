import { _support, validateOption, logger, isBrowserEnv, isWxMiniEnv, variableTypeDetection, Queue, isEmpty } from '@zhj1214/qdjk-utils' // '@zhj1214/qdjk-utils'
import { createErrorId } from './errorId'
import { SDK_NAME, SDK_VERSION } from '@zhj1214/qdjk-shared' // '@zhj1214/qdjk-shared'
import { breadcrumb } from './breadcrumb'
import {
  AuthInfo,
  TransportDataType,
  EMethods,
  InitOptions,
  isReportDataType,
  DeviceInfo,
  FinalReportType,
  ReportDataType
} from '@zhj1214/qdjk-types' // '@zhj1214/qdjk-types'
/**
 * 用来传输数据类，包含img标签、xhr请求
 * 功能：支持img请求和xhr请求、可以断点续存（保存在localstorage），
 * 待开发：目前不需要断点续存，因为接口不是很多，只有错误时才触发，如果接口太多可以考虑合并接口、
 *
 * ../class Transport
 */
export class TransportData {
  queue: Queue
  beforeDataReport: unknown = null
  backTrackerId: unknown = null
  configReportXhr: unknown = null
  configReportUrl: unknown = null
  configReportWxRequest: unknown = null
  useImgUpload = false
  apikey = ''
  trackKey = ''
  errorDsn = ''
  trackDsn = ''
  ignoreErrors = []
  constructor() {
    this.queue = new Queue()
  }
  imgRequest(data: any, url: string): void {
    const requestFun = () => {
      let img = new Image()
      const spliceStr = url.indexOf('?') === -1 ? '?' : '&'
      img.src = `${url}${spliceStr}data=${encodeURIComponent(JSON.stringify(data))}`
      img = null
    }
    this.queue.addFn(requestFun)
  }
  getRecord(): any[] {
    const recordData = _support.record
    if (recordData && variableTypeDetection.isArray(recordData) && recordData.length > 2) {
      return recordData
    }
    return []
  }
  getDeviceInfo(): DeviceInfo | any {
    return _support.deviceInfo || {}
  }
  async beforePost(data: FinalReportType) {
    // 不是埋点数据的话，创建错误id
    if (isReportDataType(data)) {
      const errorId = createErrorId(data, this.apikey)
      if (!errorId) return false
      data.errorId = errorId
    }
    // 组装上传数据
    let transportData = this.getTransportData(data)
    // 上传前的狗子函数
    if (typeof this.beforeDataReport === 'function') {
      transportData = await this.beforeDataReport(transportData)
      if (!transportData) return false
    }
    return transportData
  }
  async xhrPost(data: any, url: string) {
    const requestFun = (): void => {
      const xhr = new XMLHttpRequest()
      xhr.open(EMethods.Post, url)
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xhr.withCredentials = true
      if (typeof this.configReportXhr === 'function') {
        this.configReportXhr(xhr, data)
      }
      xhr.send(JSON.stringify(data))
    }
    this.queue.addFn(requestFun)
  }
  async wxPost(data: any, url: string) {
    const requestFun = (): void => {
      let requestOptions = { method: 'POST' } as WechatMiniprogram.RequestOption
      if (typeof this.configReportWxRequest === 'function') {
        const params = this.configReportWxRequest(data)
        // default method
        requestOptions = { ...requestOptions, ...params }
      }
      requestOptions = {
        ...requestOptions,
        data: JSON.stringify(data),
        url
      }
      wx.request(requestOptions)
    }
    this.queue.addFn(requestFun)
  }
  getAuthInfo(): AuthInfo {
    const trackerId = this.getTrackerId()
    const result: AuthInfo = {
      trackerId: String(trackerId),
      sdkVersion: SDK_VERSION,
      sdkName: SDK_NAME
    }
    this.apikey && (result.apikey = this.apikey)
    this.trackKey && (result.trackKey = this.trackKey)
    return result
  }
  getApikey() {
    return this.apikey
  }
  getTrackKey() {
    return this.trackKey
  }
  getTrackerId(): string | number {
    if (typeof this.backTrackerId === 'function') {
      const trackerId = this.backTrackerId()
      if (typeof trackerId === 'string' || typeof trackerId === 'number') {
        return trackerId
      } else {
        logger.error(`trackerId:${trackerId} 期望 string 或 number 类型，但是传入 ${typeof trackerId}`)
      }
    }
    return ''
  }
  getTransportData(data: FinalReportType): TransportDataType {
    return {
      authInfo: this.getAuthInfo(),
      breadcrumb: breadcrumb.getStack(),
      data,
      record: this.getRecord(),
      deviceInfo: this.getDeviceInfo()
    }
  }
  isSdkTransportUrl(targetUrl: string): boolean {
    let isSdkDsn = false
    if (this.errorDsn && targetUrl.indexOf(this.errorDsn) !== -1) {
      isSdkDsn = true
    }
    if (this.trackDsn && targetUrl.indexOf(this.trackDsn) !== -1) {
      isSdkDsn = true
    }
    return isSdkDsn
  }
  // 初始化配偶函数
  bindOptions(options: InitOptions = {}): void {
    // const {
    //   dsn,
    //   beforeDataReport,
    //   apikey,
    //   configReportXhr,
    //   backTrackerId,
    //   trackDsn,
    //   trackKey,
    //   configReportUrl,
    //   useImgUpload,
    //   configReportWxRequest
    // } = options
    validateOption(options.apikey, 'apikey', 'string') && (this.apikey = options.apikey)
    validateOption(options.trackKey, 'trackKey', 'string') && (this.trackKey = options.trackKey)
    validateOption(options.dsn, 'dsn', 'string') && (this.errorDsn = options.dsn)
    validateOption(options.trackDsn, 'trackDsn', 'string') && (this.trackDsn = options.trackDsn)
    validateOption(options.useImgUpload, 'useImgUpload', 'boolean') && (this.useImgUpload = options.useImgUpload)
    validateOption(options.ignoreErrors, 'ignoreErrors', 'object') && (this.ignoreErrors = options.ignoreErrors)
    validateOption(options.beforeDataReport, 'beforeDataReport', 'function') && (this.beforeDataReport = options.beforeDataReport)
    validateOption(options.configReportXhr, 'configReportXhr', 'function') && (this.configReportXhr = options.configReportXhr)
    validateOption(options.backTrackerId, 'backTrackerId', 'function') && (this.backTrackerId = options.backTrackerId)
    validateOption(options.configReportUrl, 'configReportUrl', 'function') && (this.configReportUrl = options.configReportUrl)
    validateOption(options.configReportWxRequest, 'configReportWxRequest', 'function') &&
      (this.configReportWxRequest = options.configReportWxRequest)
  }
  /**
   * 监控错误上报的请求函数
   * @param data 错误上报数据格式
   * @returns
   */
  async send(data: FinalReportType) {
    // 获取dsn
    let dsn = ''
    if (isReportDataType(data)) {
      dsn = this.errorDsn
      if (isEmpty(dsn)) {
        logger.error('dsn为空，没有传入监控错误上报的dsn地址，请在init中传入')
        return
      }
    } else {
      dsn = this.trackDsn
      if (isEmpty(dsn)) {
        logger.error('trackDsn为空，没有传入埋点上报的dsn地址，请在init中传入')
        return
      }
    }
    // 先过滤掉不需要上传的错误,埋点信息(不包含 name)不用过滤
    if (this.ignoreErrors && this.ignoreErrors.length > 0 && (data as ReportDataType).message) {
      let isFilter = false
      this.ignoreErrors.forEach((e) => {
        if (typeof e == 'string' && (data as ReportDataType).message == e) {
          isFilter = true
        }
      })
      if (isFilter) return
    }
    // 对数据加工处理
    const result = await this.beforePost(data)
    if (!result) return
    // 钩子函数，每次发送前都会调用，设置上报到服务端的地址
    if (typeof this.configReportUrl === 'function') {
      dsn = this.configReportUrl(result, dsn)
      if (!dsn) return
    }

    /****** zhj 错误打印 ******/
    if (dsn.includes('zhj1214debugger')) {
      logger.log('监控到错误：', result)
    }
    // 根据环境使用不同方式、上报
    else {
      if (isBrowserEnv) {
        return this.useImgUpload ? this.imgRequest(result, dsn) : this.xhrPost(result, dsn)
      }
      if (isWxMiniEnv) {
        return this.wxPost(result, dsn)
      }
    }
  }
}
const transportData = _support.transportData || (_support.transportData = new TransportData())
export { transportData }
