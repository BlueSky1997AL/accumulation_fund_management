export interface ResponseData<T = any> {
    message: MsgType;
    data: T;
}

export enum MsgType {
    LOGIN_SUCCESS = '登陆成功',
    INCORRECT_USERNAME = '用户名不存在',
    INCORRECT_PASSWORD = '密码错误',

    USERNAME_EXISTS = '用户名已存在',
    OPT_SUCCESS = '操作成功',
    OPT_FAILED = '操作失败',
    UNAUTHORIZED = '未授权',
    NO_PERMISSION = '无此操作的权限',
    ILLEGAL_ARGS = '参数不合法',
    UNKNOWN_ERR = '未知错误',
    FILE_NOT_FOUND = '文件不存在',
    USER_NOT_DOUND = '用户不存在',
    OPT_ILLEGAL = '操作非法',
    INSUFFICIENT_BALANCE = '余额不足',
    OPT_NOT_ALLOWED = '当前用户状态不允许该操作',
    USER_DISABLED = '该账号已被注销',
    ALREADY_IN_SUB_USERS = '目标账号已存在于当前账号的子账号中'
}
