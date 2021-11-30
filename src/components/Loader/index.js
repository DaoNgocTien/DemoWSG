import React, { Component } from "react";
import "./loader.css";

export default class Loading extends Component {
  render() {
    return (
      <div id="loading-page">
        <div id="loader"></div>
      </div>
    );
  }
}
