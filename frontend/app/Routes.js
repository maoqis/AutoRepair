import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import AdvanceRoute from './components/AdvanceRoute';
import NotFound from './components/NotFound';
import Logout from './components/Logout';
import Users from './components/Users';
import Managers from './components/Managers';

function Routes({ authStatus, restMethods }) {
  return (
    <Switch>
      <AdvanceRoute path="/" exact component={Home} authStatus={authStatus} needAuthentication />
      <AdvanceRoute path="/login" exact component={Login} authStatus={authStatus} needAuthentication={false} />
      <AdvanceRoute path="/logout" exact component={Logout} authStatus={authStatus} needAuthentication={false} />
      <AdvanceRoute path="/users" exact component={Users} authStatus={authStatus} restMethods={restMethods} needAuthentication />
      <AdvanceRoute path="/managers" exact component={Managers} authStatus={authStatus} restMethods={restMethods} needAuthentication />
      <AdvanceRoute path="/repairs" exact component={NotFound} authStatus={authStatus} needAuthentication />
      <Route component={NotFound} />
    </Switch>
  );
}

Routes.propTypes = {
  authStatus: PropTypes.shape({
    isAuthenticated: PropTypes.func.isRequired,
    authenticate: PropTypes.func.isRequired
  }).isRequired,
  restMethods: PropTypes.shape({
    getUsers: PropTypes.func.isRequired
  }).isRequired
};

export default Routes;
