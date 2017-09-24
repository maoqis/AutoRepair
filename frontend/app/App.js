import React, { Component } from 'react';
import Routes from './Routes';

import { LOGIN_URL, GET_USERS_URL, PING_URL, DELETE_USER_URL, UPDATE_USER_URL,
  CREATE_USER_URL, GET_MANAGERS_URL, DELETE_MANAGER_URL, UPDATE_MANAGER_URL,
  CREATE_MANAGER_URL, REGISTER_USER_URL, GET_REPAIRS_URL, CREATE_REPAIR_URL,
  UPDATE_REPAIR_URL, DELETE_REPAIR_URL } from './Constants';
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
    this.createUser = this.createUser.bind(this);
    this.getManagers = this.getManagers.bind(this);
    this.deleteManager = this.deleteManager.bind(this);
    this.updateManager = this.updateManager.bind(this);
    this.createManager = this.createManager.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.getRepairs = this.getRepairs.bind(this);
    this.createRepair = this.createRepair.bind(this);
    this.updateRepair = this.updateRepair.bind(this);
    this.deleteRepair = this.deleteRepair.bind(this);

    this.doWebRequest = this.doWebRequest.bind(this);
    this.doWebRequestWithoutAuth = this.doWebRequestWithoutAuth.bind(this);
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
    return this.doWebRequestWithoutAuth(LOGIN_URL, 'post', { username, password })
      .then((data) => {
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

  registerUser(username, password) {
    return this.doWebRequestWithoutAuth(REGISTER_USER_URL, 'post', { username, password });
  }

  doWebRequestWithoutAuth(url, method, body) {
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? (JSON.stringify(body)) : {},
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401) {
        if (this.isAuthenticated()) {
          this.logout();
        }
      }
      return Promise.reject(Error(response.status));
    });
  }


  isAuthenticated() {
    return this.state.isAuthenticated;
  }

  getManagers() {
    return this.doWebRequest(GET_MANAGERS_URL, 'get');
  }

  deleteManager(userId) {
    return this.doWebRequest(`${DELETE_MANAGER_URL}/${userId}`, 'delete');
  }

  updateManager(user, password) {
    return this.doWebRequest(`${UPDATE_MANAGER_URL}/${user.id}`, 'put', { ...user, password });
  }

  createManager(username, password) {
    return this.doWebRequest(CREATE_MANAGER_URL, 'post', { username, password });
  }

  getUsers() {
    return this.doWebRequest(GET_USERS_URL, 'get');
  }

  deleteUser(userId) {
    return this.doWebRequest(`${DELETE_USER_URL}/${userId}`, 'delete');
  }

  updateUser(user, password) {
    return this.doWebRequest(`${UPDATE_USER_URL}/${user.id}`, 'put', { ...user, password });
  }

  createUser(username, password) {
    return this.doWebRequest(CREATE_USER_URL, 'post', { username, password });
  }

  getRepairs() {
    return this.doWebRequest(GET_REPAIRS_URL, 'get');
  }

  createRepair(repair) {
    return this.doWebRequest(CREATE_REPAIR_URL, 'post', repair);
  }

  updateRepair(repair) {
    return this.doWebRequest(`${UPDATE_REPAIR_URL}/${repair.id}`, 'put', repair);
  }

  deleteRepair(repairId) {
    return this.doWebRequest(`${DELETE_REPAIR_URL}/${repairId}`, 'delete');
  }

  doWebRequest(url, method, body) {
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.state.basicAuthToken
      },
      body: body ? (JSON.stringify(body)) : {},
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401) {
        if (this.isAuthenticated()) {
          this.logout();
        }
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
      logout: this.logout,
      getRole: this.getRole
    };

    const restMethods = {
      getUsers: this.getUsers,
      deleteUser: this.deleteUser,
      updateUser: this.updateUser,
      createUser: this.createUser,
      getManagers: this.getManagers,
      deleteManager: this.deleteManager,
      updateManager: this.updateManager,
      createManager: this.createManager,
      authenticate: this.authenticate,
      registerUser: this.registerUser,
      getRepairs: this.getRepairs,
      createRepair: this.createRepair,
      updateRepair: this.updateRepair,
      deleteRepair: this.deleteRepair
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
