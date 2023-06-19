/// <reference types="wechat-miniprogram" />

export declare class WxPerformance {
    appId: string;
    version: string;
    private store;
    constructor(options: WxPerformanceInitOptions);
    customPaint(): void;
}

declare interface WxPerformanceInitOptions {
    appId: string;
    version?: string;
    report: () => void;
    immediately?: boolean;
    ignoreUrl?: RegExp;
    maxBreadcrumbs?: number;
    needNetworkStatus?: boolean;
    needBatteryInfo?: boolean;
    needMemoryWarning?: boolean;
    onAppHideReport?: boolean;
}

export { }
