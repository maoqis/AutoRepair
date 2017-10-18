import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import './Login/Login.css';

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
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>Username</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
              disabled={this.state.disabledInput}
            />
          </FormGroup>
          <FormGroup controlId="passwordOne" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.passwordOne}
              onChange={this.handleChange}
              type="password"
              disabled={this.state.disabledInput}
            />
          </FormGroup>
          <FormGroup controlId="passwordTwo" bsSize="large">
            <ControlLabel>Repeat Password</ControlLabel>
            <FormControl
              value={this.state.passwordTwo}
              onChange={this.handleChange}
              type="password"
              disabled={this.state.disabledInput}
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            {this.state.buttonText}
          </Button>
        </form>
      </div>
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

