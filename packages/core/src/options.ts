import { InitOptions } from '@supaur/qdjk-types' // '@supaur/qdjk-types'
import { generateUUID, toStringValidateOption, validateOption, _support, setSilentFlag, logger } from '@supaur/qdjk-utils' // '@supaur/qdjk-utils'
import { breadcrumb } from './breadcrumb'
import { transportData } from './transportData'
export class Options {
  beforeAppAjaxSend: Function = () => {} // 拦截用户页面的ajax请求，并在ajax请求发送前执行该hook。在页面所有ajax请求时添加请求头，类似`axios`的request拦截器
  enableTraceId: Boolean //  为`true`时，页面的所有请求都会生成一个uuid，放入请求头中，和配置项：`traceIdFieldName`搭配使用
  traceIdFieldName = 'Trace-Id' // 如果`enableTraceId`为true时，将会在所有请求头中添加`key`为`Trace-Id`，`value`为`uuid`的`traceId`，与`includeHttpUrlTraceIdRegExp`搭配使用
  includeHttpUrlTraceIdRegExp: RegExp //  如果你开启了`enableTraceId`，还需要配置该属性，比如将改属性置为：`/api/`，那么所有包含`api`的的接口地址都将塞入traceId
  filterXhrUrlRegExp: RegExp // 默认为空，所有ajax都会被监听，不为空时，filterXhrUrlRegExp.test(xhr.url)为true时过滤

  throttleDelayTime = 0 //  `0` | 默认会收集`click`到的标签，该参数可以设置按钮点击节流时间
  maxDuplicateCount = 1 // 最多可重复上报同一个错误的次数
  // wx-mini wx小程序的App下的 onxxx 执行完后再执行以下hook
  appOnLaunch: Function = () => {}
  appOnShow: Function = () => {}
  onPageNotFound: Function = () => {}
  appOnHide: Function = () => {}
  pageOnUnload: Function = () => {}
  pageOnShow: Function = () => {}
  pageOnHide: Function = () => {}
  onShareAppMessage: Function = () => {}
  onShareTimeline: Function = () => {}
  onTabItemTap: Function = () => {}
  // need return opitons，so defaul value is undefined
  wxNavigateToMiniProgram: Function // 重写wx.NavigateToMiniProgram将里面的参数抛出来，便于在跳转时更改query和extraData
  triggerWxEvent: Function = () => {} // 代理Action中所有函数，拿到第一个参数并抛出hook
  onRouteChange?: Function // 路有变化回调钩子

  constructor() {
    this.enableTraceId = false
  }
  bindOptions(options: InitOptions = {}): void {
    // const {
    //   beforeAppAjaxSend,
    //   enableTraceId,
    //   filterXhrUrlRegExp,
    //   traceIdFieldName,
    //   throttleDelayTime,
    //   includeHttpUrlTraceIdRegExp,
    //   appOnLaunch,
    //   appOnShow,
    //   appOnHide,
    //   pageOnUnload,
    //   pageOnShow,
    //   pageOnHide,
    //   onPageNotFound,
    //   onShareAppMessage,
    //   onShareTimeline,
    //   onTabItemTap,
    //   wxNavigateToMiniProgram,
    //   triggerWxEvent,
    //   maxDuplicateCount,
    //   onRouteChange
    // } = options
    validateOption(options.beforeAppAjaxSend, 'beforeAppAjaxSend', 'function') && (this.beforeAppAjaxSend = options.beforeAppAjaxSend)
    // wx-mini hooks
    validateOption(options.appOnLaunch, 'appOnLaunch', 'function') && (this.appOnLaunch = options.appOnLaunch)
    validateOption(options.appOnShow, 'appOnShow', 'function') && (this.appOnShow = options.appOnShow)
    validateOption(options.appOnHide, 'appOnHide', 'function') && (this.appOnHide = options.appOnHide)
    validateOption(options.pageOnUnload, 'pageOnUnload', 'function') && (this.pageOnUnload = options.pageOnUnload)
    validateOption(options.pageOnShow, 'pageOnShow', 'function') && (this.pageOnShow = options.pageOnShow)
    validateOption(options.pageOnHide, 'pageOnHide', 'function') && (this.pageOnHide = options.pageOnHide)
    validateOption(options.onPageNotFound, 'onPageNotFound', 'function') && (this.onPageNotFound = options.onPageNotFound)
    validateOption(options.onShareAppMessage, 'onShareAppMessage', 'function') && (this.onShareAppMessage = options.onShareAppMessage)
    validateOption(options.onShareTimeline, 'onShareTimeline', 'function') && (this.onShareTimeline = options.onShareTimeline)
    validateOption(options.onTabItemTap, 'onTabItemTap', 'function') && (this.onTabItemTap = options.onTabItemTap)
    validateOption(options.wxNavigateToMiniProgram, 'wxNavigateToMiniProgram', 'function') &&
      (this.wxNavigateToMiniProgram = options.wxNavigateToMiniProgram)
    validateOption(options.triggerWxEvent, 'triggerWxEvent', 'function') && (this.triggerWxEvent = options.triggerWxEvent)
    // browser hooks
    validateOption(options.onRouteChange, 'onRouteChange', 'function') && (this.onRouteChange = options.onRouteChange)

    validateOption(options.enableTraceId, 'enableTraceId', 'boolean') && (this.enableTraceId = options.enableTraceId)
    validateOption(options.traceIdFieldName, 'traceIdFieldName', 'string') && (this.traceIdFieldName = options.traceIdFieldName)
    validateOption(options.throttleDelayTime, 'throttleDelayTime', 'number') && (this.throttleDelayTime = options.throttleDelayTime)
    validateOption(options.maxDuplicateCount, 'maxDuplicateCount', 'number') && (this.maxDuplicateCount = options.maxDuplicateCount)
    toStringValidateOption(options.filterXhrUrlRegExp, 'filterXhrUrlRegExp', '[object RegExp]') &&
      (this.filterXhrUrlRegExp = options.filterXhrUrlRegExp)
    toStringValidateOption(options.includeHttpUrlTraceIdRegExp, 'includeHttpUrlTraceIdRegExp', '[object RegExp]') &&
      (this.includeHttpUrlTraceIdRegExp = options.includeHttpUrlTraceIdRegExp)
  }
}

const options = _support.options || (_support.options = new Options())

export function setTraceId(httpUrl: string, callback: (headerFieldName: string, traceId: string) => void) {
  const { includeHttpUrlTraceIdRegExp, enableTraceId } = options
  if (enableTraceId && includeHttpUrlTraceIdRegExp && includeHttpUrlTraceIdRegExp.test(httpUrl)) {
    const traceId = generateUUID()
    callback(options.traceIdFieldName, traceId)
  }
}

/**
 * init core methods
 * @param paramOptions
 */
export function initOptions(paramOptions: InitOptions = {}) {
  // 设置每个类型的监听状态是否开启
  setSilentFlag(paramOptions)

  breadcrumb.bindOptions(paramOptions)
  logger.bindOptions(paramOptions.debug)
  transportData.bindOptions(paramOptions)
  options.bindOptions(paramOptions)
}

export { options }
