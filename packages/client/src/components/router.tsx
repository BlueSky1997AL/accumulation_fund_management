import { Exception } from 'ant-design-pro';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Frame from '~components/frame';

function Page404 () {
    return (
        <Exception type="404" backText="返回首页" redirect="/web" />
    );
}

export default function () {
    return (
        <BrowserRouter basename="/web">
            <Frame>
                <Switch>
                    <Route exact={true} path="/" component={Page404} />
                    <Route exact={true} path="/test" component={Page404} />
                    <Route component={Page404} />
                </Switch>
            </Frame>
        </BrowserRouter>
    );
}
