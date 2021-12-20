import React, { Component } from "react";
// import { Link } from "react-router-dom";
import Axios from "axios";
import { Menu } from "antd";
import { SettingOutlined } from "@ant-design/icons";

export default class NavbarAdmin extends Component {
  handleLogOut = (e) => {
    Axios({
      url: `/users/logout`,
      method: "POST",
      withCredentials: true,
    }).then((result) => {
      localStorage.clear();
      return window.location.reload()
    });
  };

  render() {
    return (
      <Menu
        theme="light"
        mode="horizontal"
        style={{
          display: "flex",
          justifyContent: "left",
          lineHeight: "64px",
          fontSize: "20px",
        }}
      >
        <Menu.Item key="1" className="nav-menu">
          nav 1
        </Menu.Item>
        <Menu.Item key="2" className="nav-menu">
        </Menu.Item>
        <Menu.Item key="3" className="nav-menu">
        </Menu.Item>
        <Menu.SubMenu
          style={{
            position: "absolute",
            top: 0,
            right: 50,
            fontSize: "20px",
          }}
          title={<SettingOutlined style={{ fontSize: "25px" }} />}
        >
          <Menu.Item key="4">nav 4</Menu.Item>
          <Menu.Item key="5" onClick={(e) => this.handleLogOut(e)}>
            Logout
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    );
  }
}
