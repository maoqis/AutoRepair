import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import './Login.css';

export default function LoginForm(props) {
  return (
    <div className="Login">
      <form onSubmit={props.handleSubmit}>
        <FormGroup controlId="username" bsSize="large">
          <ControlLabel>Username</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={props.username}
            onChange={props.handleChange}
            disabled={props.disabledInput}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={props.password}
            onChange={props.handleChange}
            disabled={props.disabledInput}
            type="password"
          />
        </FormGroup>
        <Button
          block
          bsSize="large"
          disabled={!props.validateForm()}
          type="submit"
        >
          {props.buttonText}
        </Button>
        <Button
          block
          bsSize="large"
          onClick={() => props.toRegisterUser()}
        >
            Create Account
        </Button>
      </form>
    </div>
  );
}

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
  toRegisterUser: PropTypes.func.isRequired,
  disabledInput: PropTypes.bool.isRequired
};
