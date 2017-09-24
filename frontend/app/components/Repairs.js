import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Modal, FormGroup, FormControl, ControlLabel, ButtonToolbar, Alert } from 'react-bootstrap';

import './Repairs.css';

class Repairs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      repairList: [],
      showEditRepair: false,
      saveButtonText: 'Save',
      saveButtonClickable: false,
      deleteButtonText: 'Delete',
      deleteButtonClickable: false,
      showCreateRepair: false,

      repairName: '',
      repairDescription: '',
      repairDateTime: '',
      assignedUserId: -1,
      status: 'incomplete',
      validateionMessage: '',
      dateIsValid: false,

      isEditRepair: false,
      currentEditRepair: null,
      isUser: props.getRole() === 'user'
    };

    this.showEditRepair = this.showEditRepair.bind(this);
    this.showCreateRepair = this.showCreateRepair.bind(this);
    this.handleCreateRepairChange = this.handleCreateRepairChange.bind(this);
    this.validateNewRepairForm = this.validateNewRepairForm.bind(this);
    this.validateDateTime = this.validateDateTime.bind(this);
    this.handleCreateRepairSubmit = this.handleCreateRepairSubmit.bind(this);
    this.closeCreateRepair = this.closeCreateRepair.bind(this);
    this.createRepair = this.createRepair.bind(this);
    this.isStatusDisable = this.isStatusDisable.bind(this);
  }

  componentWillMount() {
    this.getRepairs();
    this.getUsers();
  }

  getUsers() {
    if (this.state.isUser) return;
    this.props.restMethods.getUsers()
      .then((users) => {
        this.setState({ userList: users });
        return Promise.resolve();
      }).catch(() => {});
  }

  getRepairs() {
    this.props.restMethods.getRepairs()
      .then((repairs) => {
        this.setState({ repairList: repairs });
        return Promise.resolve();
      }).catch(() => {});
  }

  createRepair() {
    const dateTime = new Date(this.state.repairDateTime);
    let day = String(dateTime.getDate());
    let month = `${dateTime.getMonth() + 1}`;
    const year = `${dateTime.getFullYear()}`;
    let hour = String(dateTime.getHours());
    let minute = String(dateTime.getMinutes());

    if (day.length < 2) {
      day = `0${day}`;
    }
    if (month.length < 2) {
      month = `0${month}`;
    }
    if (hour.length < 2) {
      hour = `0${hour}`;
    }
    if (minute.length < 2) {
      minute = `0${minute}`;
    }
    const fullDate = `${year}-${month}-${day} ${hour}:${minute}`;
    this.props.restMethods.createRepair({
      repairName: this.state.repairName,
      description: this.state.repairDescription,
      dateTime: fullDate,
      status: this.state.status,
      assignedUserId: parseInt(this.state.assignedUserId, 10) !== -1 ?
        parseInt(this.state.assignedUserId, 10) : null
    })
      .then(() => {
        this.setState({
          saveButtonText: 'Repair Created'
        });
        this.getRepairs();
        setTimeout(() => { this.closeCreateRepair(); }, 1000);
        return Promise.resolve();
      }).catch((status) => {
        if (status.message === '409') {
          this.setState({
            saveButtonText: 'Time Overlap',
            saveButtonClickable: true,
          });
        }
      });
  }

  updateRepair() {
    const dateTime = new Date(this.state.repairDateTime);
    let day = String(dateTime.getDate());
    let month = String(dateTime.getMonth() + 1);
    const year = String(dateTime.getFullYear());
    let hour = String(dateTime.getHours());
    let minute = String(dateTime.getMinutes());

    if (day.length < 2) {
      day = `0${day}`;
    }
    if (month.length < 2) {
      month = `0${month}`;
    }
    if (hour.length < 2) {
      hour = `0${hour}`;
    }
    if (minute.length < 2) {
      minute = `0${minute}`;
    }
    const fullDate = `${year}-${month}-${day} ${hour}:${minute}`;
    this.props.restMethods.updateRepair({
      id: this.state.currentEditRepair.id,
      repairName: this.state.repairName,
      description: this.state.repairDescription,
      dateTime: fullDate,
      status: this.state.status,
      assignedUserId: parseInt(this.state.assignedUserId, 10) !== -1 ?
        parseInt(this.state.assignedUserId, 10) : null
    })
      .then(() => {
        this.setState({
          saveButtonText: 'Repair Updated'
        });
        this.getRepairs();
        setTimeout(() => { this.closeCreateRepair(); }, 1000);
        return Promise.resolve();
      }).catch((status) => {
        if (status.message === '409') {
          this.setState({
            saveButtonText: 'Time Overlap',
            saveButtonClickable: true,
          });
        }
      });
  }

  showCreateRepair() {
    this.setState({
      showCreateRepair: true,
      saveButtonClickable: true,
      repairName: '',
      repairDescription: '',
      repairDateTime: '',
      saveButtonText: 'Create',
      status: 'incomplete',
      assignedUserId: -1,
      dateIsValid: false,
      isEditRepair: false
    });
  }

  closeCreateRepair() {
    this.setState({
      showCreateRepair: false
    });
  }

  /*
  deleteRepair(userId) {

  } */

  handleCreateRepairSubmit(event) {
    event.preventDefault();

    if (this.state.isEditRepair) {
      this.setState({
        saveButtonClickable: false,
        saveButtonText: 'Updating...',
      });
      this.updateRepair();
    } else {
      this.setState({
        saveButtonClickable: false,
        saveButtonText: 'Creating...',
      });
      this.createRepair();
    }
  }

  handleCreateRepairChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
      saveButtonText: this.state.isEditRepair ? 'Update' : 'Create'
    });
    if (event.target.id === 'repairDateTime') {
      this.validateDateTime();
    }
  }

  validateNewRepairForm() {
    if (this.isStatusDisable()) return false;
    if (!this.state.saveButtonClickable) return false;
    return this.state.repairName.length > 0 && this.state.dateIsValid;
  }

  validateDateTime() {
    const datetime = new Date(this.state.repairDateTime);
    if (this.state.repairDateTime.length === 0 || isNaN(datetime.getTime())) {
      this.setState({
        validateionMessage: 'Date is invalid',
        dateIsValid: false
      });
    } else {
      this.setState({
        validateionMessage: '',
        dateIsValid: true
      });
    }
  }

  showEditRepair(repair) {
    this.setState({
      showCreateRepair: true,
      saveButtonClickable: true,
      repairName: repair.repairName,
      repairDescription: repair.description,
      repairDateTime: repair.dateTime.replace(' ', 'T'),
      status: repair.status,
      assignedUserId: repair.assignedUserId === null ? -1 : repair.assignedUserId,
      saveButtonText: 'Update',
      dateIsValid: true,
      isEditRepair: true,
      currentEditRepair: repair
    });
  }

  isStatusDisable() {
    if (this.state.isEditRepair === false) return false;
    if (this.state.isUser) {
      if (this.state.currentEditRepair.status === 'complete') { return true; }
    }
    return false;
  }

  render() {
    return (
      <div>
        { this.state.isUser ? null :
          (<ButtonToolbar>
            <Button bsStyle="primary" className="buttonBar" onClick={this.showCreateRepair}>Create New Repair</Button>
          </ButtonToolbar>) }
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Repair Name</th>
              <th>Date and Time</th>
              <th>Assigned To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody >
            { this.state.repairList.map((repair) =>
              (<tr key={repair.id} onClick={() => { this.showEditRepair(repair); }}>
                <td>{repair.id}</td>
                <td>{repair.repairName}</td>
                <td>{repair.dateTime}</td>
                <td>{repair.assignedUserId}</td>
                <td>{repair.status}</td>
              </tr>)
            )}
          </tbody>
        </Table>
        <Modal show={this.state.showCreateRepair} onHide={this.closeCreateRepair}>
          <Modal.Header closeButton>
            <Modal.Title>New Repair</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="Edit">
              <form onSubmit={this.handleCreateRepairSubmit}>
                <FormGroup controlId="repairName" bsSize="large">
                  <ControlLabel>Repair Name</ControlLabel>
                  <FormControl
                    autoFocus
                    type="text"
                    value={this.state.repairName}
                    onChange={this.handleCreateRepairChange}
                    disabled={this.state.isUser}
                  />
                </FormGroup>
                <FormGroup controlId="repairDescription" bsSize="large">
                  <ControlLabel>Description</ControlLabel>
                  <FormControl
                    componentClass="textarea"
                    value={this.state.repairDescription}
                    onChange={this.handleCreateRepairChange}
                    disabled={this.state.isUser}
                  />
                </FormGroup>
                <FormGroup controlId="repairDateTime" bsSize="large">
                  <ControlLabel>Date and Time</ControlLabel>
                  <FormControl
                    type="datetime-local"
                    value={this.state.repairDateTime}
                    onChange={this.handleCreateRepairChange}
                    disabled={this.state.isUser}
                  />
                </FormGroup>
                <FormGroup controlId="assignedUserId" bsSize="large">
                  <ControlLabel>Assign To</ControlLabel>
                  <FormControl
                    componentClass="select"
                    onChange={this.handleCreateRepairChange}
                    value={this.state.assignedUserId}
                    disabled={this.state.isUser}
                  >
                    <option value="-1">None</option>
                    {this.state.userList.map((user) =>
                      (<option key={user.id} value={user.id}>{user.username}</option>)
                    )}
                  </FormControl>
                </FormGroup>
                <FormGroup controlId="status" bsSize="large">
                  <ControlLabel>Status</ControlLabel>
                  <FormControl
                    componentClass="select"
                    onChange={this.handleCreateRepairChange}
                    value={this.state.status}
                    disabled={this.isStatusDisable()}
                  >
                    <option value="incomplete">Incomplete</option>
                    <option value="complete">Complete</option>
                  </FormControl>
                </FormGroup>
                <Button
                  block
                  bsSize="large"
                  type="submit"
                  disabled={!this.validateNewRepairForm()}
                >
                  {this.state.saveButtonText}
                </Button>
              </form>
              {this.state.validateionMessage.length > 0 ? (<Alert bsStyle="danger" className="alert">
                {this.state.validateionMessage}
              </Alert>) : null
              }
            </div>
          </Modal.Body>
        </Modal>
      </div>);
  }
}

Repairs.propTypes = {
  restMethods: PropTypes.shape({
    getRepairs: PropTypes.func.isRequired,
    updateRepair: PropTypes.func.isRequired,
    createRepair: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired
  }).isRequired,
  getRole: PropTypes.func.isRequired
};
export default Repairs;
