import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Frame from '~components/frame';

function SampleComponent1 () {
    return (
        <div className="sample-component">
            Sample Text
        </div>
    )
}
function SampleComponent2 () {
    return (
        <div className="sample-component">
            Sample Text 2
        </div>
    )
}

export default function () {
    return (
        <BrowserRouter basename="/web">
            <Frame>
                <Switch>
                    <Route exact={true} path="/" component={SampleComponent1} />
                    <Route exact={true} path="/test" component={SampleComponent2} />
                </Switch>
            </Frame>
        </BrowserRouter>
    );
}
