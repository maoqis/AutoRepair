import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Modal, FormGroup, FormControl, ControlLabel, ButtonToolbar } from 'react-bootstrap';

import './Users.css';

class Managers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      managerList: [],
      showEditManager: false,
      currentManager: null,
      currentManagerPassword: '',
      saveButtonText: 'Save',
      saveButtonClickable: false,
      showCreateManager: false,
      username: '',
      password: ''
    };

    this.deleteManager = this.deleteManager.bind(this);
    this.getManagers = this.getManagers.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.showEditManager = this.showEditManager.bind(this);
    this.validateEditForm = this.validateEditForm.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.closeEditManager = this.closeEditManager.bind(this);

    this.showCreateManager = this.showCreateManager.bind(this);
    this.closeCreateManager = this.closeCreateManager.bind(this);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
    this.handleCreateChange = this.handleCreateChange.bind(this);
    this.validateNewManagerForm = this.validateNewManagerForm.bind(this);
  }

  componentWillMount() {
    this.getManagers();
  }

  getManagers() {
    this.props.restMethods.getManagers()
      .then((managers) => {
        this.setState({ managerList: managers });
        return Promise.resolve();
      }).catch(() => {});
  }

  deleteManager(managerId) {
    this.props.restMethods.deleteManager(managerId)
      .then(() => {
        this.getManagers();
        return Promise.resolve();
      }).catch();
  }

  showEditManager(manager) {
    this.setState({
      currentManager: manager,
      showEditManager: true,
      currentManagerPassword: '',
      saveButtonText: 'Save',
      saveButtonClickable: true
    });
  }

  handleEditChange(event) {
    this.setState({
      currentManagerPassword: event.target.value
    });
  }

  validateEditForm() {
    return this.state.saveButtonClickable && this.state.currentManagerPassword.length > 0;
  }

  handleEditSubmit(event) {
    event.preventDefault();
    this.setState({
      saveButtonText: 'Saving...',
      saveButtonClickable: false
    });
    this.props.restMethods.updateManager(this.state.currentManager,
      this.state.currentManagerPassword)
      .then(() => {
        this.setState({
          saveButtonText: 'Saved'
        });
        setTimeout(() => { this.closeEditManager(); }, 1000);
        return Promise.resolve();
      }).catch(() => {
        // todo handle conflict username
        this.setState({
          saveButtonText: 'Not Saved'
        });
        setTimeout(() => { this.closeEditManager(); }, 1000);
      });
  }

  closeEditManager() {
    this.setState({
      showEditManager: false
    });
  }

  showCreateManager() {
    this.setState({
      showCreateManager: true,
      username: '',
      password: '',
      saveButtonClickable: true,
      saveButtonText: 'Save'
    });
  }

  closeCreateManager() {
    this.setState({
      showCreateManager: false
    });
  }

  handleCreateSubmit(event) {
    event.preventDefault();
    this.setState({
      saveButtonText: 'Saving...',
      saveButtonClickable: false
    });
    this.props.restMethods.createManager(this.state.username, this.state.password)
      .then(() => {
        this.setState({
          saveButtonText: 'Saved'
        });
        setTimeout(() => { this.closeCreateManager(); }, 1000);
        this.getManagers();
        return Promise.resolve();
      }).catch((responseStatus) => {
        if (responseStatus.message === '409') {
          this.setState({
            saveButtonText: 'Manager Exists'
          });
        } else {
          this.setState({
            saveButtonText: 'Not Saved'
          });
        }
        setTimeout(() => { this.closeCreateManager(); }, 1000);
      });
  }

  handleCreateChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  validateNewManagerForm() {
    return this.state.saveButtonClickable
            && this.state.username.length > 0
            && this.state.password.length > 0;
  }

  render() {
    return (
      <div>
        <ButtonToolbar>
          <Button bsStyle="primary" className="buttonBar" onClick={this.showCreateManager}>Create New Manager</Button>
        </ButtonToolbar>
        <Table striped>
          <tbody>
            { this.state.managerList.map((manager) =>
              (<tr key={manager.id}>
                <td>{manager.username}</td>
                <td>
                  <Button bsStyle="success" onClick={() => this.showEditManager(manager)}>Edit</Button>
                </td>
                <td>
                  <Button bsStyle="danger" onClick={() => this.deleteManager(manager.id)}>Delete</Button>
                </td>
              </tr>)
            )}
          </tbody>
        </Table>
        <Modal show={this.state.showEditManager} onHide={this.closeEditManager}>
          <Modal.Header closeButton>
            <Modal.Title>Editing manager {this.state.currentManager ? this.state.currentManager.username : ''}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="Edit">
              <form onSubmit={this.handleEditSubmit}>
                <FormGroup controlId="password" bsSize="large">
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    value={this.state.currentManagerPassword}
                    onChange={this.handleEditChange}
                    type="password"
                  />
                </FormGroup>
                <Button
                  block
                  bsSize="large"
                  disabled={!this.validateEditForm()}
                  type="submit"
                >
                  {this.state.saveButtonText}
                </Button>
              </form>
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.showCreateManager} onHide={this.closeCreateManager}>
          <Modal.Header closeButton>
            <Modal.Title>New Manager</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="Edit">
              <form onSubmit={this.handleCreateSubmit}>
                <FormGroup controlId="username" bsSize="large">
                  <ControlLabel>Managername</ControlLabel>
                  <FormControl
                    autoFocus
                    type="text"
                    value={this.state.username}
                    onChange={this.handleCreateChange}
                  />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    value={this.state.password}
                    onChange={this.handleCreateChange}
                    type="password"
                  />
                </FormGroup>
                <Button
                  block
                  bsSize="large"
                  disabled={!this.validateNewManagerForm()}
                  type="submit"
                >
                  {this.state.saveButtonText}
                </Button>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>);
  }
}

Managers.propTypes = {
  restMethods: PropTypes.shape({
    getManagers: PropTypes.func.isRequired,
    deleteManager: PropTypes.func.isRequired,
    updateManager: PropTypes.func.isRequired,
    createManager: PropTypes.func.isRequired
  }).isRequired
};
export default Managers;
