import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

class Logout extends React.Component {
  componentWillMount() {
    this.props.logout();
  }
  render() {
    return <Redirect to="/login" />;
  }
}

Logout.propTypes = {
  logout: PropTypes.func.isRequired
};

export default Logout;
