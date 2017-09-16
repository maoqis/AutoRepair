import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import AdvanceRoute from './components/AdvanceRoute';

function Routes({ authStatus }) {
  return (
    <Switch>
      <AdvanceRoute path="/" exact component={Home} authStatus={authStatus} needAuthentication />
      <AdvanceRoute path="/login" exact component={Login} authStatus={authStatus} needAuthentication={false} />
    </Switch>
  );
}

Routes.propTypes = {
  authStatus: PropTypes.shape({
    isAuthenticated: PropTypes.func.isRequired,
    authenticate: PropTypes.func.isRequired
  }).isRequired
};

export default Routes;
