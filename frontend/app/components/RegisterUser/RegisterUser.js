import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RegisterForm from './RegisterForm';

class RegisterUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      passwordOne: '',
      passwordTwo: '',
      buttonText: 'Create New User',
      disabledInput: false,
      disabledButton: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  validateForm() {
    return this.state.username.length > 0
        && this.state.passwordOne.length > 0
        && this.state.passwordTwo.length > 0
        && this.state.passwordOne === this.state.passwordTwo
        && !this.state.disabledInput
        && !this.state.disabledButton;
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
      disabledButton: false,
      buttonText: 'Create New User'
    });
  }


  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      buttonText: 'Creating New User',
      disabledInput: true,
      disabledButton: true
    });
    this.props.restMethods.registerUser(this.state.username, this.state.passwordOne)
      .then(() => {
        this.setState({ buttonText: 'User Created...' });
        window.setTimeout(() => this.props.history.push('/login'), 1000);
        return Promise.resolve();
      }).catch((error) => {
        let msg;
        if (error.message === '409') {
          msg = 'User Exists';
        } else {
          msg = 'Failed to Create User';
        }
        this.setState({
          buttonText: msg,
          disabledInput: false
        });
      });
  }

  render() {
    return (
      <RegisterForm
        username={this.state.username}
        passwordOne={this.state.passwordOne}
        passwordTwo={this.state.passwordTwo}
        buttonText={this.state.buttonText}
        disabledInput={this.state.disabledInput}
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
        validateForm={this.validateForm}
      />
    );
  }
}

RegisterUser.propTypes = {
  restMethods: PropTypes.shape({
    registerUser: PropTypes.func
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

export default RegisterUser;

