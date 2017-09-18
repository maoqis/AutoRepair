import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import './Users.css';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      showEditUser: false,
      currentUser: null,
      currentUserPassword: '',
      saveButtonText: 'Save',
      saveButtonClickable: false
    };

    this.deleteUser = this.deleteUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.showEditUser = this.showEditUser.bind(this);
    this.validateEditForm = this.validateEditForm.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.closeEditUser = this.closeEditUser.bind(this);
  }

  componentWillMount() {
    this.getUsers();
  }

  getUsers() {
    this.props.restMethods.getUsers()
      .then((users) => {
        this.setState({ userList: users });
        return Promise.resolve();
      }).catch(() => {});
  }

  deleteUser(userId) {
    this.props.restMethods.deleteUser(userId)
      .then(() => {
        this.getUsers();
        return Promise.resolve();
      }).catch();
  }

  showEditUser(user) {
    this.setState({
      currentUser: user,
      showEditUser: true,
      currentUserPassword: '',
      saveButtonText: 'Save',
      saveButtonClickable: true
    });
  }

  handleEditChange(event) {
    this.setState({
      currentUserPassword: event.target.value
    });
  }

  validateEditForm() {
    return this.state.saveButtonClickable && this.state.currentUserPassword.length > 0;
  }

  handleEditSubmit(event) {
    event.preventDefault();
    this.setState({
      saveButtonText: 'Saving...',
      saveButtonClickable: false
    });
    this.props.restMethods.updateUser(this.state.currentUser, this.state.currentUserPassword)
      .then(() => {
        this.setState({
          saveButtonText: 'Saved'
        });
        setTimeout(() => { this.closeEditUser(); }, 3000);
        return Promise.resolve();
      }).catch(() => {
        this.setState({
          saveButtonText: 'Not Saved'
        });
        setTimeout(() => { this.closeEditUser(); }, 3000);
      });
  }

  closeEditUser() {
    this.setState({
      showEditUser: false
    });
  }

  render() {
    return (
      <div>
        <Table striped>
          <tbody>
            { this.state.userList.map((user) =>
              (<tr key={user.id}>
                <td>{user.username}</td>
                <td>
                  <Button bsStyle="success" onClick={() => this.showEditUser(user)}>Edit</Button>
                </td>
                <td>
                  <Button bsStyle="danger" onClick={() => this.deleteUser(user.id)}>Delete</Button>
                </td>
              </tr>)
            )}
          </tbody>
        </Table>
        <Modal show={this.state.showEditUser} onHide={this.closeEditUser}>
          <Modal.Header closeButton>
            <Modal.Title>Editing user {this.state.currentUser ? this.state.currentUser.username : ''}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="Edit">
              <form onSubmit={this.handleEditSubmit}>
                <FormGroup controlId="password" bsSize="large">
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    value={this.state.currentUserPassword}
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
      </div>);
  }
}

Users.propTypes = {
  restMethods: PropTypes.shape({
    getUsers: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired
  }).isRequired
};
export default Users;
