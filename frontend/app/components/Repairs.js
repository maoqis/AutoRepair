import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Modal, FormGroup, FormControl, ControlLabel, ButtonToolbar, Alert } from 'react-bootstrap';

import './Repairs.css';

class Repairs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      userIdNameMap: {},
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
    this.deleteRepair = this.deleteRepair.bind(this);
    this.parseDateString = this.parseDateString.bind(this);
    this.getUserNameFromId = this.getUserNameFromId.bind(this);
  }

  componentWillMount() {
    this.getRepairs();
    this.getUsers();
  }

  getUsers() {
    if (this.state.isUser) {
      const currentUser = this.props.getCurrentUser();
      const users = [currentUser];
      const userIdNameMap = {};
      userIdNameMap[currentUser.id] = currentUser.username;
      this.setState({ userList: users, userIdNameMap });
      return;
    }
    this.props.restMethods.getUsers()
      .then((users) => {
        let userIdNameMap = this.state.userIdNameMap;
        userIdNameMap = {};
        users.forEach((user) => {
          userIdNameMap[user.id] = user.username;
        });
        this.setState({ userList: users, userIdNameMap });
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

  parseDateString() {
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
    return fullDate;
  }

  createRepair(isUpdate) {
    const fullDate = this.parseDateString();
    const method = isUpdate ? this.props.restMethods.updateRepair :
      this.props.restMethods.createRepair;
    const cId = isUpdate ? this.state.currentEditRepair.id : -1;
    method({
      id: cId,
      repairName: this.state.repairName,
      description: this.state.repairDescription,
      dateTime: fullDate,
      status: this.state.status,
      assignedUserId: parseInt(this.state.assignedUserId, 10) !== -1 ?
        parseInt(this.state.assignedUserId, 10) : null
    })
      .then(() => {
        this.setState({
          saveButtonText: isUpdate ? 'Repair Updated' : 'Repair Created'
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
        } else {
          this.setstate({
            savebuttontext: isUpdate ? 'unable to update' : 'unable to create',
            savebuttonclickable: true,
            deletebuttonclickable: true
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


  deleteRepair() {
    this.setState({
      deleteButtonClickable: false,
      saveButtonClickable: false,
      deleteButtonText: 'Deleting'
    });
    this.props.restMethods.deleteRepair(this.state.currentEditRepair.id)
      .then(() => {
        this.setState({
          deleteButtonText: 'Deleted Successfully'
        });
        this.getRepairs();
        setTimeout(() => { this.closeCreateRepair(); }, 1000);
        return Promise.resolve();
      }).catch(() => {
        this.setState({
          deleteButtonText: 'Unable to Delete'
        });
        this.getRepairs();
        setTimeout(() => { this.closeCreateRepair(); }, 1000);
      });
  }

  handleCreateRepairSubmit(event) {
    event.preventDefault();

    this.setState({
      deleteButtonClickable: false,
      saveButtonClickable: false,
      saveButtonText: this.state.isEditRepair ? 'Updating...' : 'Creating...',
    });
    this.createRepair(this.state.isEditRepair);
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
      currentEditRepair: repair,
      deleteButtonClickable: true,
      deleteButtonText: 'Delete'
    });
  }

  isStatusDisable() {
    if (this.state.isEditRepair === false) return false;
    if (this.state.isUser) {
      if (this.state.currentEditRepair.status === 'complete' ||
        this.state.currentEditRepair.status === 'approve') {
        return true;
      }
    }
    return false;
  }

  getUserNameFromId(userId) {
    if (userId === null) return 'None';
    const userIdNameMap = this.state.userIdNameMap;
    const username = userIdNameMap[userId];
    if (username !== null) return username;
    return userId;
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
                <td>{this.getUserNameFromId(repair.assignedUserId)}</td>
                <td>{repair.status === 'approve' ? 'need approval' : repair.status}</td>
              </tr>)
            )}
          </tbody>
        </Table>
        <Modal show={this.state.showCreateRepair} onHide={this.closeCreateRepair}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.isEditRepair ? 'Edit Repair' : 'New Repair'}</Modal.Title>
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
                    <option value="approve">Need Approval</option>
                    {!this.state.isUser ? <option value="complete">Complete</option> : null}
                  </FormControl>
                </FormGroup>
                {
                  this.state.isEditRepair ?
                    (<Button
                      block
                      bsSize="large"
                    >
                  Comments
                    </Button>) : null
                }
                <Button
                  block
                  bsSize="large"
                  type="submit"
                  disabled={!this.validateNewRepairForm()}
                >
                  {this.state.saveButtonText}
                </Button>
                {
                  (!this.state.isUser && this.state.isEditRepair) ?
                    (<Button
                      block
                      bsStyle="danger"
                      bsSize="large"
                      disabled={!this.state.deleteButtonClickable}
                      onClick={() => this.deleteRepair()}
                    >
                      {this.state.deleteButtonText}
                    </Button>) : null
                }
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
    getUsers: PropTypes.func.isRequired,
    deleteRepair: PropTypes.func.isRequired
  }).isRequired,
  getRole: PropTypes.func.isRequired,
  getCurrentUser: PropTypes.func.isRequired
};
export default Repairs;
