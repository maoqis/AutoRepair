import React from 'react';
import { Route } from 'react-router-dom';
import { NavItem } from 'react-bootstrap';
import PropTypes from 'prop-types';

function RouteNavItem(props) {
  return (<Route
    path={props.href}
    exact
    children={({ match, history }) =>
      (<NavItem
        onClick={e => {
          e.preventDefault();
          history.push(e.currentTarget.getAttribute('href'));
        }}
        {...props}
        active={!!match}
      >
        {props.content}
      </NavItem>)}
  />);
}

RouteNavItem.propTypes = {
  href: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
};

export default RouteNavItem;
