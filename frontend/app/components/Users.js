import React from 'react';
import PropTypes from 'prop-types';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
    };
  }
  componentWillMount() {
    this.props.restMethods.getUsers()
      .then((users) => {
        this.setState({ userList: users });
        return Promise.resolve();
      }).catch();
  }
  render() {
    return <div>{this.state.userList.map((user) => <li key={user.id}>{user.username}</li>)}</div>;
  }
}

Users.propTypes = {
  restMethods: PropTypes.shape({
    getUsers: PropTypes.func.isRequired
  }).isRequired
};
export default Users;
