import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router, middleware, config } = app;
    const authCheckMiddleware = middleware.authCheck();
    const userProtectionMiddleware = middleware.userProtection();

    router.get(config.webPathRegExp, authCheckMiddleware, controller.home.index);
    router.get('/login', controller.home.login);
    router.get('/signup', controller.home.signup);

    router.post('/api/login', controller.user.login);
    router.post('/api/logout', authCheckMiddleware, controller.user.logout);
    router.post('/api/signup', controller.workOrder.createSignUpWorkOrder);
    router.post('/api/password', authCheckMiddleware, userProtectionMiddleware, controller.user.updatePassword);

    router.get('/api/user/info', authCheckMiddleware, controller.user.getUserInfo);
    router.get('/api/user/full_info', authCheckMiddleware, userProtectionMiddleware, controller.user.getFullUserInfo);
    router.get('/api/user/all', authCheckMiddleware, userProtectionMiddleware, controller.user.getAllUserInfo);
    router.get('/api/user/sub_users', authCheckMiddleware, userProtectionMiddleware, controller.user.getSubUserInfo);
    router.get(
        '/api/user/sub_user/info',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.user.getTargetUserInfo
    );
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
        '/api/user/enterprise/remove',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.createEnterpriseSubUserRemoveWorkOrder
    );

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
        '/api/work_order/fund/deposit/personal/create',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.creactPersonalFundDepositWorkOrder
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
        '/api/work_order/query_admin',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.getAllWorkOrdersByQuery
    );
    router.get(
        '/api/work_order/detail',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.getWorkOrder
    );
    router.get(
        '/api/work_order/query_user',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.getPersonalWorkOrdersByQuery
    );
    router.post(
        '/api/work_order/audit',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.handleWorkOrder
    );
    router.post(
        '/api/work_order/account/enterprise/subuser/add',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.workOrder.createEnterpriseSubUserAddWorkOrder
    );

    router.get(
        '/api/amount_change/query_admin',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.amountChange.getAllAmountChangesByQuery
    );
    router.get(
        '/api/amount_change/query_user',
        authCheckMiddleware,
        userProtectionMiddleware,
        controller.amountChange.getPersonalAmountChangesByQuery
    );

    router.get('/api/sys_overview', authCheckMiddleware, userProtectionMiddleware, controller.home.getSysOverviewInfo);

    router.post('/api/file/upload', controller.file.upload);
    router.get('/api/file/content/:fileID', controller.file.getFileContent);

    // 测试专用接口，上线前应清除
    router.get('/api/test', app.controller.home.test);
};
