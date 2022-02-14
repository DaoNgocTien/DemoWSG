import React, { Component } from "react";
// import { Link } from "react-router-dom";
import Axios from "axios";
import { Link } from "react-router-dom";
import { Menu, Button, Divider, Row, Col, } from "antd";
import {
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
export default class NavbarAdmin extends Component {
  handleLogOut = (e) => {
    Axios({
      url: `/users/logout`,
      method: "POST",
      withCredentials: true,
    }).then((result) => {
      localStorage.clear();
      return window.location.reload();
    });
  };

  getIcon = (collapsed) => {
    return collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />;
  };

  render() {
    const { toggleCollapsed, collapsed } = this.props;
    return (
      <Row>
        {/* <Space size={1}> */}
        <Col flex="195px">
          <Button
            type="primary"
            onClick={toggleCollapsed}
            icon={this.getIcon(collapsed)}
          />
        </Col>

        <Col flex="1px">
          <Divider type="vertical" />
        </Col>
        <Col flex="500px">
          <Link className="LinkDecorations" style={{ color: "black" }} to="/">
            WHOLESALE GROUP
          </Link>
        </Col>

        <Col flex="auto" style={{ height: "50px" }}>
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
            <Menu.SubMenu
              style={{
                position: "absolute",
                top: 0,
                right: 50,
                fontSize: "20px",
              }}
              key="Log out"
              title={<SettingOutlined style={{ fontSize: "25px" }} />}
            >
              <Menu.Item key="4">nav 4</Menu.Item>
              <Menu.Item key="5" onClick={(e) => this.handleLogOut(e)}>
                Logout
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Col>
        {/* </Space> */}
      </Row>
      // <div style={{ width: 256 }}>

      //   </div>

      //   <Menu.Item key="1" className="nav-menu">
      //     <Button type="primary" onClick={toggleCollapsed()} style={{ marginBottom: 16 }}>
      //       {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
      //     </Button>
      //   </Menu.Item>
      //   <Menu.Item key="2" className="nav-menu">
      //   </Menu.Item>
      //   <Menu.Item key="3" className="nav-menu">
      //   </Menu.Item>

      // </Menu>
    );
  }
}
