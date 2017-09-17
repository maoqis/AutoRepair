import React, { Component } from 'react';
import Routes from './Routes';

import { LOGIN_URL, GET_USERS_URL } from './Constants';
import RouteNavBar from './components/RouteNavBar';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      username: '',
      password: '',
      role: '',
    };
    this.authenticate = this.authenticate.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.logout = this.logout.bind(this);
    this.getRole = this.getRole.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  getRole() {
    if (this.state.isAuthenticated) {
      return this.state.role;
    }
    return '';
  }

  getUsers() {
    return fetch(GET_USERS_URL, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${this.state.username}:${this.state.password}`)}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(Error(response.status));
    });
  }

  logout() {
    this.setState({
      isAuthenticated: false,
      username: '',
      password: '',
      role: '',
    });
  }

  authenticate(username, password, callBack) {
    // console.log(`Authenticate call with ${username} ${password}`);
    // console.log(`Login call with: ${LOGIN_URL}`);
    fetch(LOGIN_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then((response) => {
      if (response.ok) {
        this.setState({
          isAuthenticated: true,
          username,
          password
        });
        return response.json();
      }
      callBack(false);
      return Promise.reject(Error(response.status));
    }).then((data) => {
      callBack(true);
      this.setState({
        role: data.role,
      });
      return Promise.resolve();
    }).catch(() => {
    });
  }

  isAuthenticated() {
    return this.state.isAuthenticated;
  }

  render() {
    const authStatus = {
      isAuthenticated: this.isAuthenticated,
      authenticate: this.authenticate,
      logout: this.logout
    };

    const restMethods = {
      getUsers: this.getUsers
    };
    return (
      <div className="App container">
        <RouteNavBar getRole={this.getRole} />
        <Routes authStatus={authStatus} restMethods={restMethods} />
      </div>
    );
  }
}


export default App;
