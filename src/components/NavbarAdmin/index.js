// import "./style-navbar-admin.css";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { Menu, Layout } from "antd";
import { SettingOutlined } from "@ant-design/icons";

export default class NavbarAdmin extends Component {
  handleLogOut = () => {
    localStorage.clear();
    Axios({
      url: `${process.env.REACT_APP_BE_API_KEY}/users/logout`,
      method: "POST",
      withCredentials: true,
    });
  };

  renderUserName = () => {
    if (localStorage.getItem("user") === null) {
      return (
        <Link to={"/login"}>
          <div className="btn btn-danger mr-2">Login</div>
        </Link>
      );
    } else {
    }
  };

  render() {
    return (
      <div className="fixed-top">
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
            nav 2
          </Menu.Item>
          <Menu.Item key="3" className="nav-menu">
            nav 3
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
          </Menu.SubMenu>
        </Menu>
        <Layout.Sider
          theme="light"
          collapsedWidth={0}
          breakpoint="md"
          width="250px"
        >
          <Menu
            defaultSelectedKeys={["1"]}
            mode="inline"
            theme="light"
            collapsedWidth=""
          >
            <Menu.Item key="1">
              <span>Option 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <span>Option 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <span>Option 3</span>
            </Menu.Item>
            <Menu.SubMenu
              key="sub1"
              title={
                <span>
                  <span>Navigation One</span>
                </span>
              }
            >
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
              key="sub2"
              title={
                <span>
                  <span>Navigation Two</span>
                </span>
              }
            >
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <Menu.SubMenu key="sub3" title="Menu.SubMenu">
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
              </Menu.SubMenu>
            </Menu.SubMenu>
          </Menu>
        </Layout.Sider>
      </div>
    );
  }
}
