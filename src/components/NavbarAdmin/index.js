import {
  BellTwoTone,
  LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MessageTwoTone, SettingTwoTone, UserOutlined
} from "@ant-design/icons";
import { Button, Col, Divider, Menu, Row, Image } from "antd";
import Axios from "axios";
import React, { Component, memo } from "react";
import { Link } from "react-router-dom";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
class NavbarAdmin extends Component {
  handleLogOut = () => {
    Axios({
      url: `/users/logout`,
      method: "POST",
      withCredentials: true,
    }).then(() => {
      localStorage.clear();
      localStorage.removeItem("user");
      return window.location.reload();
    }).catch(() => {
      localStorage.clear();
      localStorage.removeItem("user");
      return window.location.reload();
    });
  };

  getIcon = (collapsed) => {
    return collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />;
  };

  render() {
    const {
      toggleCollapsed,
      collapsed,
      showChatDrawer,
      showNotificationDrawer,
    } = this.props;
    return (
      <Row>
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
            <Image.PreviewGroup>
              <Image
                src="/logo.png"
                width={42}
                height={42}
                preview={{
                  src: "/logo.png",
                }}
              />
            </Image.PreviewGroup>
            WHOLESALE GROUP
          </Link>
        </Col>

        <Col flex="auto" style={{ height: "50px" }}></Col>

        <Col flex="260px">
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
            <Menu.Item
              key="Chat"
              onClick={showChatDrawer}
              icon={<MessageTwoTone style={{ fontSize: "25px" }} />}
            ></Menu.Item>

            <Menu.Item
              key="Notice"
              onClick={showNotificationDrawer}
              icon={<BellTwoTone style={{ fontSize: "25px" }} />}
            ></Menu.Item>

            <Menu.SubMenu
              style={{
                position: "absolute",
                top: 0,
                right: 50,
                fontSize: "20px",
              }}
              key="Log out"
              title={<SettingTwoTone style={{ fontSize: "25px" }} />}
            >
              <Menu.Item
                key="4"
                icon={<UserOutlined style={{ fontSize: "25px" }} />}
              >
                <Link className="LinkDecorations" to="/profile">
                  User Profile
                </Link>
              </Menu.Item>
              <Menu.Item
                key="5"
                onClick={(e) => this.handleLogOut(e)}
                icon={<LogoutOutlined style={{ fontSize: "25px" }} />}
              >
                Logout
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Col>
      </Row>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps !== nextProps;
};

export default memo(NavbarAdmin, arePropsEqual);
