import React from 'react';
import ReactDOM from 'react-dom';

import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import Login from '~components/login';

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <Login />
    </LocaleProvider>,
    document.getElementById('main')
);
