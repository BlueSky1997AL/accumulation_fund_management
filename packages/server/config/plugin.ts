import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    // static: true,
    // nunjucks: {
    //   enable: true,
    //   package: 'egg-view-nunjucks',
    // },
    ejs: {
        enable: true,
        package: 'egg-view-ejs'
    }
};

export default plugin;
