import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get(/\/web|\/web\/*/, controller.home.index);

    router.post('/login', app.controller.user.login);
};
