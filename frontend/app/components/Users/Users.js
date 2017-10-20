import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar } from 'react-bootstrap';

import UserListView from './UserListView';
import CreateOrEditUserView from './CreateOrEditUserView';
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
      saveButtonClickable: false,
      showCreateUser: false,
      username: '',
      password: ''
    };

    this.deleteUser = this.deleteUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.showEditUser = this.showEditUser.bind(this);
    this.validateEditForm = this.validateEditForm.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.closeEditUser = this.closeEditUser.bind(this);

    this.showCreateUser = this.showCreateUser.bind(this);
    this.closeCreateUser = this.closeCreateUser.bind(this);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
    this.handleCreateChange = this.handleCreateChange.bind(this);
    this.validateNewUserForm = this.validateNewUserForm.bind(this);
  }

  componentWillMount() {
    this.getUsers();
  }

  getUsers() {
    this.props.restMethods.getUsers()
      .then((users) => {
        this.setState({ userList: users });
        return Promise.resolve();
      }).catch();
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
        setTimeout(() => { this.closeEditUser(); }, 1000);
        return Promise.resolve();
      }).catch(() => {
        // handle conflict username
        this.setState({
          saveButtonText: 'Not Saved'
        });
        setTimeout(() => { this.closeEditUser(); }, 1000);
      });
  }

  closeEditUser() {
    this.setState({
      showEditUser: false
    });
  }

  showCreateUser() {
    this.setState({
      showCreateUser: true,
      username: '',
      password: '',
      saveButtonClickable: true,
      saveButtonText: 'Save'
    });
  }

  closeCreateUser() {
    this.setState({
      showCreateUser: false
    });
  }

  handleCreateSubmit(event) {
    event.preventDefault();
    this.setState({
      saveButtonText: 'Saving...',
      saveButtonClickable: false
    });
    this.props.restMethods.createUser(this.state.username, this.state.password)
      .then(() => {
        this.setState({
          saveButtonText: 'Saved'
        });
        setTimeout(() => { this.closeCreateUser(); }, 1000);
        this.getUsers();
        return Promise.resolve();
      }).catch((responseStatus) => {
        if (responseStatus.message === '409') {
          this.setState({
            saveButtonText: 'User Exists'
          });
        } else {
          this.setState({
            saveButtonText: 'Not Saved'
          });
        }
        setTimeout(() => { this.closeCreateUser(); }, 1000);
      });
  }

  handleCreateChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  validateNewUserForm() {
    return this.state.saveButtonClickable
            && this.state.username.length > 0
            && this.state.password.length > 0;
  }

  render() {
    return (
      <div>
        <ButtonToolbar>
          <Button bsStyle="primary" className="buttonBar" onClick={this.showCreateUser}>Create New User</Button>
        </ButtonToolbar>
        <UserListView
          userList={this.state.userList}
          showEditUser={this.showEditUser}
          deleteUser={this.deleteUser}
        />
        <CreateOrEditUserView
          showModal={this.state.showEditUser}
          onHideCallback={this.closeEditUser}
          modalTitle={'Editing user'.concat(this.state.currentUser ? this.state.currentUser.username : '')}
          handleSubmit={this.handleEditSubmit}
          handleChange={this.handleEditChange}
          password={this.state.currentUserPassword}
          validateForm={this.validateEditForm}
          saveButtonText={this.state.saveButtonText}
        />
        <CreateOrEditUserView
          showModal={this.state.showCreateUser}
          onHideCallback={this.closeCreateUser}
          modalTitle="New User"
          handleSubmit={this.handleCreateSubmit}
          showUserName
          username={this.state.username}
          handleChange={this.handleCreateChange}
          password={this.state.password}
          validateForm={this.validateNewUserForm}
          saveButtonText={this.state.saveButtonText}
        />
      </div>);
  }
}

Users.propTypes = {
  restMethods: PropTypes.shape({
    getUsers: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired
  }).isRequired
};
export default Users;
