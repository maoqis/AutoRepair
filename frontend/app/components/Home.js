import React, { Component } from 'react';
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
        </div>
      </div>
    );
  }
}
