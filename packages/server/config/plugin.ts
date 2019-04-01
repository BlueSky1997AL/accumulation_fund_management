import { EggPlugin } from 'egg';
import 'tsconfig-paths/register';

const plugin: EggPlugin = {
    // static: true,
    nunjucks: {
      enable: true,
      package: 'egg-view-nunjucks',
    },
    mongoose: {
        enable: true,
        package: 'egg-mongoose'
    }
};

export default plugin;
