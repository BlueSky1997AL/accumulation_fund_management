import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router, middleware } = app;
    const authCheckMiddleware = middleware.authCheck();

    router.get(/\/web|\/web\/*/, authCheckMiddleware, controller.home.index);
    router.get('/login', controller.home.login);

    router.post('/api/login', app.controller.user.login);
    router.post('/api/logout', authCheckMiddleware, controller.user.logout);

    router.get('/api/user/info', authCheckMiddleware, controller.user.getUserInfo);

    router.post(
        '/api/work_order/fund/back/enterprise/create',
        authCheckMiddleware,
        controller.workOrder.creactEnterpriseFundBackWorkOrder
    );
    router.post(
        '/api/work_order/fund/back/personal/create',
        authCheckMiddleware,
        controller.workOrder.creactPersonalFundBackWorkOrder
    );
    router.get('/api/work_order/all', authCheckMiddleware, controller.workOrder.getAllWorkOrder);
    router.get('/api/work_order/detail', authCheckMiddleware, controller.workOrder.getWorkOrder);
    router.get('/api/work_order/mine', authCheckMiddleware, controller.workOrder.getPersonalWorkOrder);
    router.post('/api/work_order/audit', authCheckMiddleware, controller.workOrder.handleWorkOrder);

    // 测试专用接口，上线前应清除
    router.get('/api/test', app.controller.home.test);
};
