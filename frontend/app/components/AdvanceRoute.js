import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

/* eslint react/prop-types: 0 */

function AdvanceRoute({ component: CmpntToShow, authStatus, needAuthentication, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (props.match.path === '/login') {
          if (authStatus.isAuthenticated()) {
            return <Redirect to="/" />;
          }
        }
        if (!needAuthentication || (needAuthentication && authStatus.isAuthenticated())) {
          return <CmpntToShow {...props} {...authStatus} {...rest} />;
        }
        return <Redirect to="/login" />;
      }}
    />
  );
}

AdvanceRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authStatus: PropTypes.shape({
    isAuthenticated: PropTypes.func,
    authenticate: PropTypes.func
  }),
  needAuthentication: PropTypes.bool.isRequired
};

AdvanceRoute.defaultProps = {
  authStatus: {}
};

export default AdvanceRoute;
