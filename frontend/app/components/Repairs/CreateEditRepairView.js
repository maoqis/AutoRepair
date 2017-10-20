import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, FormGroup, FormControl, ControlLabel, Alert } from 'react-bootstrap';

export default function CreateEditRepairView(props) {
  return (
    <Modal show={props.showModal} onHide={props.onModalHide}>
      <Modal.Header closeButton>
        <Modal.Title>{props.isEditRepair ? 'Edit Repair' : 'New Repair'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="Edit">
          <form onSubmit={props.handleCreateRepairSubmit}>
            <FormGroup controlId="repairName" bsSize="large">
              <ControlLabel>Repair Name</ControlLabel>
              <FormControl
                autoFocus
                type="text"
                value={props.repairName}
                onChange={props.handleCreateRepairChange}
                disabled={props.isUser}
              />
            </FormGroup>
            <FormGroup controlId="repairDescription" bsSize="large">
              <ControlLabel>Description</ControlLabel>
              <FormControl
                componentClass="textarea"
                value={props.repairDescription}
                onChange={props.handleCreateRepairChange}
                disabled={props.isUser}
              />
            </FormGroup>
            <FormGroup controlId="repairDateTime" bsSize="large">
              <ControlLabel>Date and Time</ControlLabel>
              <FormControl
                type="datetime-local"
                value={props.repairDateTime}
                onChange={props.handleCreateRepairChange}
                disabled={props.isUser}
              />
            </FormGroup>
            <FormGroup controlId="assignedUserId" bsSize="large">
              <ControlLabel>Assign To</ControlLabel>
              <FormControl
                componentClass="select"
                onChange={props.handleCreateRepairChange}
                value={props.assignedUserId}
                disabled={props.isUser}
              >
                <option value="-1">None</option>
                {props.userList.map((user) =>
                  (<option key={user.id} value={user.id}>{user.username}</option>)
                )}
              </FormControl>
            </FormGroup>
            <FormGroup controlId="status" bsSize="large">
              <ControlLabel>Status</ControlLabel>
              <FormControl
                componentClass="select"
                onChange={props.handleCreateRepairChange}
                value={props.status}
                disabled={props.isStatusDisable()}
              >
                <option value="incomplete">Incomplete</option>
                <option value="approve">Need Approval</option>
                {!props.isUser ? <option value="complete">Complete</option> : null}
              </FormControl>
            </FormGroup>
            {
              props.isEditRepair ?
                (<Button
                  block
                  bsSize="large"
                  onClick={() => props.showCommentView()}
                >
                  Comments
                </Button>) : null
            }
            <Button
              block
              bsSize="large"
              type="submit"
              disabled={!props.validateNewRepairForm()}
            >
              {props.saveButtonText}
            </Button>
            {
              (!props.isUser && props.isEditRepair) ?
                (<Button
                  block
                  bsStyle="danger"
                  bsSize="large"
                  disabled={!props.deleteButtonClickable}
                  onClick={() => props.deleteRepair()}
                >
                  {props.deleteButtonText}
                </Button>) : null
            }
          </form>
          {props.validationMessage.length > 0 ? (<Alert bsStyle="danger" className="alert">
            {props.validationMessage}
          </Alert>) : null
          }
        </div>
      </Modal.Body>
    </Modal>
  );
}

CreateEditRepairView.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onModalHide: PropTypes.func.isRequired,
  isEditRepair: PropTypes.bool.isRequired,
  handleCreateRepairSubmit: PropTypes.func.isRequired,
  repairName: PropTypes.string.isRequired,
  handleCreateRepairChange: PropTypes.func.isRequired,
  isUser: PropTypes.bool.isRequired,
  repairDescription: PropTypes.string.isRequired,
  repairDateTime: PropTypes.string.isRequired,
  assignedUserId: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  isStatusDisable: PropTypes.func.isRequired,
  showCommentView: PropTypes.func.isRequired,
  validateNewRepairForm: PropTypes.func.isRequired,
  saveButtonText: PropTypes.string.isRequired,
  deleteButtonClickable: PropTypes.bool.isRequired,
  deleteButtonText: PropTypes.string.isRequired,
  validationMessage: PropTypes.string.isRequired,
  deleteRepair: PropTypes.func.isRequired,
  userList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired
  })).isRequired
};
