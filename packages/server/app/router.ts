import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router, middleware } = app;
    const authCheckMiddleware = middleware.authCheck();

    router.get(/\/web|\/web\/*/, authCheckMiddleware, controller.home.index);
    router.get('/login', controller.home.login);

    router.post('/api/login', app.controller.user.login);
};
