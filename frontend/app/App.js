import React, { Component } from 'react';
import Routes from './Routes';

import { LOGIN_URL, GET_USERS_URL, PING_URL, DELETE_USER_URL, UPDATE_USER_URL } from './Constants';
import RouteNavBar from './components/RouteNavBar';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      basicAuthToken: '',
      role: '',
    };
    this.authenticate = this.authenticate.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.logout = this.logout.bind(this);
    this.getRole = this.getRole.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.setCookie = this.setCookie.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentWillMount() {
    const token = this.getCookie('basicAuthToken');
    if (token) {
      const userRole = this.getCookie('role');
      this.setState({
        isAuthenticated: true,
        basicAuthToken: token,
        role: userRole
      });

      fetch(PING_URL, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        }
      }).then((response) => {
        if (response.status === 401) {
          this.logout();
        }
        return Promise.resolve();
      }).catch(() => this.logout());
    }
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
        Authorization: `${this.state.basicAuthToken}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      if (response.status === 401) {
        this.logout();
      }
      return Promise.reject(Error(response.status));
    });
  }

  setCookie(cname, cvalue, exhour) {
    const d = new Date();
    d.setTime(d.getTime() + (exhour * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
  }

  getCookie(cname) {
    const name = `${cname}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  authenticate(username, password) {
    // console.log(`Authenticate call with ${username} ${password}`);
    // console.log(`Login call with: ${LOGIN_URL}`);
    return fetch(LOGIN_URL, {
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
        return response.json();
      }
      return Promise.reject(Error(response.status));
    }).then((data) => {
      const bauthToken = `Basic ${btoa(`${username}:${password}`)}`;
      this.setState({
        isAuthenticated: true,
        basicAuthToken: bauthToken,
        role: data.role
      });
      this.setCookie('basicAuthToken', bauthToken, 1);
      this.setCookie('role', data.role, 1);
      return Promise.resolve();
    });
  }

  isAuthenticated() {
    return this.state.isAuthenticated;
  }

  deleteUser(userId) {
    return fetch(`${DELETE_USER_URL}/${userId}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${this.state.basicAuthToken}`
      }
    }).then((response) => {
      if (response.ok) {
        return Promise.resolve();
      }
      return Promise.reject(Error(response.status));
    });
  }

  updateUser(user, password) {
    return fetch(`${UPDATE_USER_URL}/${user.id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${this.state.basicAuthToken}`
      },
      body: JSON.stringify({
        ...user,
        password
      })
    }).then((response) => {
      if (response.ok) {
        return Promise.resolve();
      }
      return Promise.reject(Error(response.status));
    });
  }

  logout() {
    this.setState({
      isAuthenticated: false,
      role: '',
    });
    this.setCookie('basicAuthToken', '', 1);
    this.setCookie('role', '', 1);
  }

  render() {
    const authStatus = {
      isAuthenticated: this.isAuthenticated,
      authenticate: this.authenticate,
      logout: this.logout
    };

    const restMethods = {
      getUsers: this.getUsers,
      deleteUser: this.deleteUser,
      updateUser: this.updateUser
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
