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
            '.html': 'nunjucks'
        }
    };

    config.mongoose = {
        client: {
            url: 'mongodb://127.0.0.1:27017/afm',
            options: {}
        }
    };

    config.schedule = {
        interest: {
            cron: '0 0 0 * * *',
            type: 'worker',
            rate: 0.015
        }
    };

    config.multipart = {
        mode: 'file',
        fileExtensions: [ '.rar', '.iso', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.wps', '.txt', '.pdf' ]
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
