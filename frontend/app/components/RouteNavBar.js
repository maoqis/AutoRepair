import React from 'react';
import { Route } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

import RouteNavItem from './RouteNavItem';

/* eslint react/prop-types: 0 */

function RouteNavBar({ ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (props.location.pathname === '/login') {
          return null;
        }
        return (
          <Navbar>
            <Nav>
              <RouteNavItem href="/" content="Home" />
              <RouteNavItem href="/repairs" content="Reparis" />
              <RouteNavItem href="/users" content="Users" />
              <RouteNavItem href="/managers" content="Managers" />
              <RouteNavItem href="/logout" content="Logout" />
            </Nav>
          </Navbar>
        );
      }}
    />
  );
}


export default RouteNavBar;
