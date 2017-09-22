import React from 'react';
import { Route } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

import RouteNavItem from './RouteNavItem';

/* eslint react/prop-types: 0 */

function RouteNavBar({ getRole, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (props.location.pathname === '/login' || props.location.pathname === '/registeruser') {
          return null;
        }
        return (
          <Navbar>
            <Nav>
              <RouteNavItem href="/" content="Home" />
              <RouteNavItem href="/repairs" content="Repairs" />
              {getRole() === 'manager' ? <RouteNavItem href="/users" content="Users" /> : null }
              {getRole() === 'manager' ? <RouteNavItem href="/managers" content="Managers" /> : null }
              <RouteNavItem href="/logout" content="Logout" />
            </Nav>
          </Navbar>
        );
      }}
    />
  );
}


export default RouteNavBar;
