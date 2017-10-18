import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LoginForm from './LoginForm';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      buttonText: 'Login',
      disabledInput: false,
      disabledButton: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.toRegisterUser = this.toRegisterUser.bind(this);
  }

  toRegisterUser() {
    this.props.history.push('/registeruser');
  }

  validateForm() {
    return !this.state.disabledButton
          && this.state.username.length > 0
          && this.state.password.length > 0;
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
      buttonText: 'Login',
      disabledButton: false
    });
  }


  handleSubmit(event) {
    event.preventDefault();
    this.setState(
      {
        buttonText: 'Logging in ...',
        disabledButton: true,
        disabledInput: true
      }
    );
    this.props.restMethods.authenticate(this.state.username, this.state.password)
      .then(() => Promise.resolve())
      .catch(() => {
        this.setState({
          buttonText: 'Login Unsuccessful',
          disabledInput: false
        });
      });
  }

  render() {
    return (
      <LoginForm
        username={this.state.username}
        password={this.state.password}
        buttonText={this.state.buttonText}
        disabledInput={this.state.disabledInput}
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
        validateForm={this.validateForm}
        toRegisterUser={this.toRegisterUser}
      />
    );
  }
}

Login.propTypes = {
  restMethods: PropTypes.shape({
    authenticate: PropTypes.func
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

export default Login;

