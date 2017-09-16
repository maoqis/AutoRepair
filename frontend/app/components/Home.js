import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testState: 0
    };
  }

  render() {
    return (
      <div className="Home">
        <div className="main">
          <h1>AutoRepair</h1>
          <p>An Auto Repair Management Tool</p>
          <Link to={'/login'}>something</Link>
        </div>
      </div>
    );
  }
}
