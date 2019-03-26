import React from 'react';
import ReactDOM from 'react-dom';

import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import Router from '~components/router';

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <Router />
    </LocaleProvider>,
    document.getElementById('main')
);
