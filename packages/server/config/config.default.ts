import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1551160578538_5676';

    // add your egg config in here
    config.middleware = [];

    config.static = {
        prefix: '/static/'
    };

    config.view = {
        mapping: {
            '.html': 'ejs'
        }
    };

    // config.security = {
    //     csrf: {
    //         enable: false
    //     }
    // }

    config.mongoose = {
        client: {
            url: 'mongodb://127.0.0.1:27017/afm',
            options: {},
        }
    };

    // add your special config in here
    const bizConfig = {
        sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig
    };
};
