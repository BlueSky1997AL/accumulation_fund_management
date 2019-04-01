import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router, middleware } = app;
    const authCheckMiddleware = middleware.authCheck();
    const userProtectionMiddleware = middleware.userProtection();
    const fileAPIProtectionMiddleware = middleware.fileAPIProtection();

    router.get(/\/web|\/web\/*/, authCheckMiddleware, controller.home.index);
    router.get('/login', controller.home.login);

    router.post('/api/login', controller.user.login);
    router.post('/api/logout', authCheckMiddleware, controller.user.logout);

    router.get('/api/user/info', authCheckMiddleware, controller.user.getUserInfo);
    router.get('/api/user/full_info', authCheckMiddleware, userProtectionMiddleware, controller.user.getFullUserInfo);
    router.get('/api/user/all', authCheckMiddleware, userProtectionMiddleware, controller.user.getAllUserInfo);
    router.post(
        '/api/user/update_status',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.user.updateUserStatus
    );
    router.post('/api/user/update', authCheckMiddleware, userProtectionMiddleware, controller.user.updateUserInfo);
    router.post('/api/user/create', authCheckMiddleware, userProtectionMiddleware, controller.user.createUser);
    router.post('/api/user/lost', authCheckMiddleware, controller.user.handleUserLost);

    router.post(
        '/api/work_order/fund/back/enterprise/create',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.creactEnterpriseFundBackWorkOrder
    );
    router.post(
        '/api/work_order/fund/back/personal/create',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.creactPersonalFundBackWorkOrder
    );
    router.post(
        '/api/work_order/fund/remit/enterprise/create',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.createEnterpriseFundRemitWorkOrder
    );
    router.post(
        '/api/work_order/fund/draw/personal/create',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.createPersonalFundDrawWorkOrder
    );
    router.post('/api/work_order/common/create', authCheckMiddleware, controller.workOrder.createCommonWorkOrder);
    router.get(
        '/api/work_order/all',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.getAllWorkOrder
    );
    router.get(
        '/api/work_order/detail',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.getWorkOrder
    );
    router.get(
        '/api/work_order/mine',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.getPersonalWorkOrder
    );
    router.post(
        '/api/work_order/audit',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.handleWorkOrder
    );

    router.post('/api/file/upload', authCheckMiddleware, fileAPIProtectionMiddleware, controller.file.upload);
    router.get(
        '/api/file/content/:fileID',
        authCheckMiddleware,
        fileAPIProtectionMiddleware,
        controller.file.getFileContent
    );

    // 测试专用接口，上线前应清除
    router.get('/api/test', app.controller.home.test);
};
