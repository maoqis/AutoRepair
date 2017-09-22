import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup, FormControl, ControlLabel, Modal } from 'react-bootstrap';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      show: false,
      loginInfo: 'Please wait...'
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
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }


  handleSubmit(event) {
    event.preventDefault();
    this.setState(
      {
        show: true
      }
    );
    this.props.restMethods.authenticate(this.state.username, this.state.password)
      .then(() => Promise.resolve())
      .catch(() => {
        this.setState({ loginInfo: 'login unsuccessful' });
        window.setTimeout(() => { this.setState({ show: false, loginInfo: 'Please wait' }); }, 3000);
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
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
          <Button
            block
            bsSize="large"
            onClick={() => this.toRegisterUser()}
          >
            Create Account
          </Button>
        </form>
        <Modal show={this.state.show}>
          <Modal.Header>
            <Modal.Title>Logging in</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.state.loginInfo}</p>
          </Modal.Body>
        </Modal>
      </div>
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

