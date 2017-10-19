import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default function RegisterForm(props) {
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
        <FormGroup controlId="passwordOne" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={props.passwordOne}
            onChange={props.handleChange}
            type="password"
            disabled={props.disabledInput}
          />
        </FormGroup>
        <FormGroup controlId="passwordTwo" bsSize="large">
          <ControlLabel>Repeat Password</ControlLabel>
          <FormControl
            value={props.passwordTwo}
            onChange={props.handleChange}
            type="password"
            disabled={props.disabledInput}
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
      </form>
    </div>
  );
}

RegisterForm.propTypes = {
  username: PropTypes.string.isRequired,
  passwordOne: PropTypes.string.isRequired,
  passwordTwo: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
  disabledInput: PropTypes.bool.isRequired
};
