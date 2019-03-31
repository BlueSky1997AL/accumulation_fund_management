export interface ResponseData<T = any> {
    message: MsgType;
    data: T;
}

export enum MsgType {
    LOGIN_SUCCESS = '登陆成功',
    INCORRECT_USERNAME = '用户名不存在',
    INCORRECT_PASSWORD = '密码错误',

    OPT_SUCCESS = '操作成功',
    OPT_FAILED = '操作失败',
    UNAUTHORIZED = '未授权',
    NO_PERMISSION = '无此操作的权限',
    UNKNOWN_ERR = '未知错误',

    FILE_NOT_FOUND = '文件未找到'
}
