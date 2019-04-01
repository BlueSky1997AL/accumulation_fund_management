import React from 'react';
import ReactDOM from 'react-dom';

import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import Signup from '~components/signup';

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <Signup />
    </LocaleProvider>,
    document.getElementById('main')
);
