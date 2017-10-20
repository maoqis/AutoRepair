import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'react-bootstrap';

export default function UserListView(props) {
  return (
    <Table striped>
      <tbody>
        { props.userList.map((user) =>
          (<tr key={user.id}>
            <td>{user.username}</td>
            <td>
              <Button bsStyle="success" onClick={() => props.showEditUser(user)}>Edit</Button>
            </td>
            <td>
              <Button bsStyle="danger" onClick={() => props.deleteUser(user.id)}>Delete</Button>
            </td>
          </tr>)
        )}
      </tbody>
    </Table>
  );
}

UserListView.propTypes = {
  userList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired
  })).isRequired
};
