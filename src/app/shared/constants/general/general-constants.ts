/**
 * 通用模块及共享模块常量定义
 */


/**
 * HTTP 请求常量定义
 */
export const CONSTANT_COMMON_HTTP_HEADER_CONTENT_TYPE: string                          = 'Content-Type';    //HTTP请求头请求数据类型定义常量
export const CONSTANT_COMMON_HTTP_HEADER_ACCEPT: string                                = 'Accept';    //HTTP请求头接收数据类型定义常量
export const CONSTANT_COMMON_HTTP_HEADER_API_KEY: string                               = 'apiKey';    //HTTP请求头调用api网关密钥定义常量

export const CONSTANT_COMMON_HTTP_PARAM_PUBLIC_SERIAL_NO: string                       = 'serialNo';    //HTTP请求参数中公共流水号定义常量
export const CONSTANT_COMMON_HTTP_PARAM_PUBLIC_APP_TYPE: string                        = 'appType';    //HTTP请求参数中公共应用类型定义常量
export const CONSTANT_COMMON_HTTP_PARAM_PUBLIC_CATEGORY: string                        = 'category';    //HTTP请求参数中公共类别（企业）定义常量
export const CONSTANT_COMMON_HTTP_PARAM_PUBLIC_SESSION: string                         = 'session';    //HTTP请求参数中公共会话编号定义常量
export const CONSTANT_COMMON_HTTP_PARAM_PUBLIC_USER: string                            = 'user';    //HTTP请求参数中公共用户编号定义常量

/**
 * CACHE 缓存常量定义
 */

export const CONSTANT_COMMON_CACHE_REGION: string                                      = 'region';             //区域缓存数据定义常量
export const CONSTANT_COMMON_CACHE_ORGANIZATION: string                                = 'organization';       //组织机构缓存数据定义常量
export const CONSTANT_COMMON_CACHE_SERIAL_NO: string                                   = 'serialNo';       //流水号缓存数据定义常量


/**
 * ROUTE 路由常量定义
 */
export const CONSTANT_COMMON_ROUTE_LOGIN: string                                       = '/passport/login';    //登录路由定义常量
export const CONSTANT_COMMON_ROUTE_USER_CREATION: string                               = '/system/user-creation';    //创建用户路由定义常量
export const CONSTANT_COMMON_ROUTE_INTERNAL_SERVER_ERROR: string                       = '/500';    //服务器内部错误路由定义常量


export const CONSTANT_COMMON_ROUTE_PATH_LOGIN: string                                  = 'login'; //登录路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_USER: string                                   = 'users'; //用户路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_SESSION: string                                = 'sessions'; //会话路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_STRATEGY: string                               = 'strategies'; //策略路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_ORGANIZATION: string                           = 'organizations'; //组织机构路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_REGION: string                                 = 'regions'; //区域路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_STATISTICS: string                             = 'statistics'; //统计路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_OPERATION: string                              = 'operations'; //操作记录路由的path路径


/**
 * 错误描述定义
 */
export const CONSTANT_COMMON_INTERNAL_SERVER_ERROR: string                             = '系统调用服务发生未可知错误，可能是后端问题，请联系管理员检查。';         //http应答500服务器内部错误描述的定义常量
export const CONSTANT_COMMON_DEFAULT_ERROR: string                                     = '系统发生未可知错误，请联系管理员检查。';         //http应答默认错误描述的定义常量



/**
 * 常量数据定义
 */
export const CONSTANT_COMMON_YESTERDAY_MICRO_SECOND: number                            = 86400000;  //一天的毫秒数

/**
 * MODULE 模块常量定义
 */

//======================shared module======================
export const CONSTANT_MODULE_SHARED_MODEL_USER_STATUS_ACTIVE: string                   = 'ACTIVE';         //用户类中的正常用户状态定义常量

export const CONSTANT_MODULE_SHARED_MODEL_STRATEGY_STATUS_ACTIVE: string               = 'ACTIVE';         //策略类中的正常策略状态定义常量

export const CONSTANT_MODULE_SHARED_MODEL_OPERATION_STATUS_SUCCESS: string             = 'SUCCESS';         //操作记录类中的操作成功状态定义常量

export const CONSTANT_MODULE_SHARED_MODEL_TOKEN_STATUS_SUCCESS: string                 = 'SUCCESS';         //令牌类中的操作成功状态定义常量


export const CONSTANT_MODULE_SHARED_SERVICE_OPERATION_BUSINESS_TYPE_LOGIN: string      = 'LOGIN';  //操作记录登录业务类型定义常量
export const CONSTANT_MODULE_SHARED_SERVICE_OPERATION_BUSINESS_TYPE_LOGOUT: string     = 'LOGOUT';  //操作记录登出业务类型定义常量
export const CONSTANT_MODULE_SHARED_SERVICE_OPERATION_BUSINESS_TYPE_QUERY_USER: string = 'QUERY_USER';  //操作记录查询用户业务类型定义常量

