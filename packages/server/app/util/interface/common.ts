export interface ResponseData<T = any> {
    message: MsgType;
    data: T;
}

export enum MsgType {
    LOGIN_SUCCESS = '登陆成功',
    INCORRECT_USERNAME = '用户名不存在',
    INCORRECT_PASSWORD = '密码错误',

    UNAUTHORIZED = '未授权',

    UNKNOWN_ERR = '未知错误'
}
