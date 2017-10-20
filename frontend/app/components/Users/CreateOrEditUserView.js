import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default function CreateOrEditUserView(props) {
  return (
    <Modal show={props.showModal} onHide={props.onHideCallback}>
      <Modal.Header closeButton>
        <Modal.Title>{props.modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="Edit">
          <form onSubmit={props.handleSubmit}>
            {props.showUserName ? (
              <FormGroup controlId="username" bsSize="large">
                <ControlLabel>Username</ControlLabel>
                <FormControl
                  autoFocus
                  type="text"
                  value={props.username}
                  onChange={props.handleChange}
                />
              </FormGroup>) : null }
            <FormGroup controlId="password" bsSize="large">
              <ControlLabel>Password</ControlLabel>
              <FormControl
                value={props.password}
                onChange={props.handleChange}
                type="password"
              />
            </FormGroup>
            <Button
              block
              bsSize="large"
              disabled={!props.validateForm()}
              type="submit"
            >
              {props.saveButtonText}
            </Button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

CreateOrEditUserView.propTypes = {
  showModal: PropTypes.bool,
  onHideCallback: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  showUserName: PropTypes.bool,
  username: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  validateForm: PropTypes.func.isRequired,
  saveButtonText: PropTypes.string.isRequired
};

CreateOrEditUserView.defaultProps = {
  showModal: false,
  showUserName: false,
  username: ''
};
