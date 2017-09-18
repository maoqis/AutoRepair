import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'react-bootstrap';

import './Users.css';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
    };

    this.deleteUser = this.deleteUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
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


  render() {
    return (
      <div>
        <Table striped>
          <tbody>
            { this.state.userList.map((user) =>
              (<tr key={user.id}>
                <td>{user.username}</td>
                <td>
                  <Button bsStyle="success">Edit</Button>
                </td>
                <td>
                  <Button bsStyle="danger" onClick={() => this.deleteUser(user.id)}>Delete</Button>
                </td>
              </tr>)
            )}
          </tbody>
        </Table>
      </div>);
  }
}

Users.propTypes = {
  restMethods: PropTypes.shape({
    getUsers: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired
  }).isRequired
};
export default Users;
