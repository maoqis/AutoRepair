import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from './components/App';
import Login from './components/Login';

export default () =>
  (<Switch>
    <Route path="/" exact component={App} />
    <Route path="/login" exact component={Login} />
  </Switch>);
