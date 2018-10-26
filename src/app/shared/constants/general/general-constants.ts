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
export const CONSTANT_COMMON_HTTP_PARAM_PUBLIC_TOKEN: string                           = 'token';    //HTTP请求参数中公共令牌定义常量

export const CONSTANT_COMMON_HTTP_RESPONSE_TYPE_BLOB: 'text' | 'blob' | 'arraybuffer' | 'json'  = 'blob';    //HTTP请求选项中字符流（图片）定义常量

/**
 * CACHE 缓存常量定义
 */

export const CONSTANT_COMMON_CACHE_REGION: string                                      = 'region';             //区域缓存数据定义常量
export const CONSTANT_COMMON_CACHE_ORGANIZATION: string                                = 'organization';       //组织机构缓存数据定义常量
export const CONSTANT_COMMON_CACHE_SERIAL_NO: string                                   = 'serialNo';       //流水号缓存数据定义常量
export const CONSTANT_COMMON_CACHE_ERROR_CODE: string                                  = 'errorCode';       //错误码号缓存数据定义常量
export const CONSTANT_COMMON_CACHE_ACTIVE_TIME: string                                 = 'activeTime';       //活动时间缓存数据定义常量


/**
 * ROUTE 路由常量定义
 */
export const CONSTANT_COMMON_ROUTE_ROOT: string                                        = '/';    //根路由定义常量
export const CONSTANT_COMMON_ROUTE_LOGIN: string                                       = '/passport/login';    //登录路由定义常量
export const CONSTANT_COMMON_ROUTE_USER_CREATION: string                               = '/system/user-creation';    //创建用户路由定义常量
export const CONSTANT_COMMON_ROUTE_INTERNAL_SERVER_ERROR: string                       = '/500';    //服务器内部错误路由定义常量


export const CONSTANT_COMMON_ROUTE_PATH_LOGIN: string                                  = 'login'; //登录路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_USER: string                                   = 'users'; //用户路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_SESSION: string                                = 'sessions'; //会话路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_STRATEGY: string                               = 'strategies'; //策略路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_ORGANIZATION: string                           = 'organizations'; //组织机构路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_REGION: string                                 = 'organizations/regions'; //区域路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_STATISTICS: string                             = 'statistics'; //统计路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_OPERATION: string                              = 'operations'; //操作记录路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_STORAGE: string                                = 'storage'; //存储路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_PICTURE: string                                = 'pictures'; //图片路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_PRIVILEGE: string                              = 'privileges'; //权限路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_ROLE: string                                   = 'privileges/roles'; //角色路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_MENU: string                                   = 'menus'; //菜单路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_SEPARATOR: string                              = ','; //路由path路径数组的分隔符
export const CONSTANT_COMMON_ROUTE_PATH_REGISTER: string                               = 'register'; //注册路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_LOCK: string                                   = 'lock'; //锁屏路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_FORBIDDEN: string                              = '403'; //禁止路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_NOT_FOUND: string                              = '404'; //未找到路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_SERVER_INTERNAL_ERROR: string                  = '500'; //服务器内部错误路由的path路径
export const CONSTANT_COMMON_ROUTE_PATH_CALL_BACK: string                              = 'callback'; //回调路由的path路径

/**
 * 权限定义
 */
export const CONSTANT_COMMON_PRIVILEGE_COMPONENT_DASHBOARD: number                     = 80100001;

/**
 * 错误描述定义
 */
export const CONSTANT_COMMON_INTERNAL_SERVER_ERROR: string                             = '系统调用服务发生未可知错误，可能是后端问题，请联系管理员检查。';         //http应答500服务器内部错误描述的定义常量
export const CONSTANT_COMMON_DEFAULT_ERROR: string                                     = '系统发生未可知错误，请联系管理员检查。';         //http应答默认错误描述的定义常量
export const CONSTANT_COMMON_CORS_ERROR: string                                        = '系统发生未可知错误，可能是由于后端不支持CORS或无效配置引起，请联系管理员检查。'; //http应答CORS错误

/**
 * 事件定义
 */
export const CONSTANT_COMMON_LISTEN_MOUSE_EVENT: string                                = 'mousedown';//监听鼠标事件
export const CONSTANT_COMMON_LISTEN_MOUSE_EVENT_ARGUMENTS: string                      = '$event';//监听鼠标事件参数
export const CONSTANT_COMMON_LISTEN_KEY_EVENT: string                                  = 'keydown';//监听键盘事件
export const CONSTANT_COMMON_LISTEN_KEY_EVENT_ARGUMENTS: string                        = '$event';//监听键盘事件参数


/**
 * 心跳定义
 */
export const CONSTANT_COMMON_IDLE_INTERVAL:number                                      = 10000; //心跳的时间间隔（毫秒）定义
export const CONSTANT_COMMON_IDLE_NO_INTERACTIVE_TIME: number                          = 300000; //判断无交互的时间间隔
export const CONSTANT_COMMON_HEART_BEAT_INTERVAL:number                                = 30000; //心跳的时间间隔（毫秒）定义

/**
 * 常量数据定义
 */
export const CONSTANT_COMMON_YESTERDAY_MICRO_SECOND: number                            = 86400000;  //一天的毫秒数



/**
 * MODULE 模块常量定义
 */

//======================shared module======================
export const CONSTANT_MODULE_SHARED_MODEL_USER_STATUS_ACTIVE: string                   = 'ACTIVE';         //用户类中的正常用户状态定义常量
export const CONSTANT_MODULE_SHARED_MODEL_USER_STATUS_NOT_EXISTS: string               = 'NOT_EXISTS';         //用户类中的正常用户状态定义常量

export const CONSTANT_MODULE_SHARED_MODEL_STRATEGY_STATUS_ACTIVE: string               = 'ACTIVE';         //策略类中的正常策略状态定义常量
export const CONSTANT_MODULE_SHARED_MODEL_STRATEGY_TYPE_APPLICATION: string            = 'application';         //策略类中的应用系统自身定义常量
export const CONSTANT_MODULE_SHARED_MODEL_STRATEGY_TYPE_ERROR_CODE: string             = 'errorcode';         //策略类中的应用错误编码定义常量

export const CONSTANT_MODULE_SHARED_MODEL_OPERATION_STATUS_SUCCESS: string             = 'SUCCESS';         //操作记录类中的操作成功状态定义常量
export const CONSTANT_MODULE_SHARED_MODEL_OPERATION_STATUS_ACTIVE: string              = 'ACTIVE';         //操作记录类中的操作在用状态定义常量
export const CONSTANT_MODULE_SHARED_MODEL_OPERATION_TYPE: string                       = 'COMMON';          //操作记录类型定义常量
export const CONSTANT_MODULE_SHARED_MODEL_OPERATION_DESCRIPTION: string                = 'auto generated by cms.';          //操作记录描述定义常量
export const CONSTANT_MODULE_SHARED_MODEL_OPERATION_COMMON_ERROR: string               = '获取操作记录数据失败'; //操作记录获取失败通用应答定义常量

export const CONSTANT_MODULE_SHARED_MODEL_TOKEN_STATUS_SUCCESS: string                 = 'SUCCESS';         //令牌类中的操作成功状态定义常量

export const CONSTANT_MODULE_SHARED_MODEL_ROLE_STATUS_ACTIVE: string                   = 'ACTIVE';         //角色类中的在用状态定义常量

export const CONSTANT_MODULE_SHARED_MODEL_ORGANIZATION_STATUS_ACTIVE: string           = 'ACTIVE';         //组织机构类中的在用状态定义常量

export const CONSTANT_MODULE_SHARED_MODEL_REGION_STATUS_ACTIVE: string                 = 'ACTIVE';         //区域类中的在用状态定义常量

export const CONSTANT_MODULE_SHARED_MODEL_STORAGE_FILE_ATTRIBUTE_NAME: string          = 'file';         //存储类中的文件属性名称定义常量
export const CONSTANT_MODULE_SHARED_MODEL_STORAGE_TYPE_PICTURE: string                 = 'type=picture';         //存储类中的图片类型定义常量

export const CONSTANT_MODULE_SHARED_SERVICE_OPERATION_BUSINESS_TYPE_LOGIN: string      = 'LOGIN';  //操作记录登录业务类型定义常量
export const CONSTANT_MODULE_SHARED_SERVICE_OPERATION_BUSINESS_TYPE_LOGOUT: string     = 'LOGOUT';  //操作记录登出业务类型定义常量
export const CONSTANT_MODULE_SHARED_SERVICE_OPERATION_BUSINESS_TYPE_QUERY_USER: string = 'QUERY_USER';  //操作记录查询用户业务类型定义常量
export const CONSTANT_MODULE_SHARED_VALIDATOR_USER_EXIST_DE_BOUNCE_TIME: number        = 2000;  //用户是否存在校验器的等待时间定义常量

export const CONSTANT_MODULE_PASSPORT_LOGIN_COMMON_ERROR: string                       = '登录失败，可能是用户名不存在、密码校验失败，或者超过做大登录次数。';  //登录的错误信息定义常量


