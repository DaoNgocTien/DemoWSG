import React, { Component } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import { Layout, Menu, Drawer, Button } from "antd";
import {
  ReconciliationTwoTone,
  RedEnvelopeTwoTone,
  ContactsTwoTone,
  HomeTwoTone,
  DollarCircleTwoTone,
} from "@ant-design/icons";
import NavbarAdmin from "../../components/NavbarAdmin";
import Notification from "../../components/Notification";

import { ref, onValue, get, set } from "firebase/database";
import { realtime } from "../../services/firebase";

const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;

class AdminRender extends Component {
  state = {
    collapsed: false,
    visible: false,
    drawerLength: 0,
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  componentDidMount = () => {
    this.getNotif();
    if (!localStorage.getItem("user")) {
      return window.location.replace("/login");
    }
  };

  getNotif = async () => {
    // console.log(get(ref(realtime, "notif")));
    set(ref(realtime, "hello"), { gg: "f" });
    onValue(ref(realtime, "hello"), (snapshot) => {
      // console.log("hello");
      // console.log(snapshot.val());
    });
  };

  showChatDrawer = () => {
    // console.log("showChatDrawer");
    this.setState({
      visible: true,
      drawerLength: 0.45,
    });
  };

  showNotificationDrawer = () => {
    // console.log("showNotificationDrawer");
    this.setState({
      visible: true,
      drawerLength: 0.3,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  getDrawerContent = () => {
    return this.state.drawerLength == 0.3 ? <Notification /> : <Notification />;
  };

  render() {
    const { collapsed, visible, drawerLength } = this.state;
    return (
      <Layout>
        <Header
          style={{
            background: "#fff",
            margin: "5px 0px 5px 0px",
            padding: "0px 5px 0px 5px",
          }}
        >
          <NavbarAdmin
            toggleCollapsed={this.toggleCollapsed}
            collapsed={collapsed}
            showChatDrawer={this.showChatDrawer}
            showNotificationDrawer={this.showNotificationDrawer}
          />
        </Header>
        <Layout>
          <Sider
            width={200}
            className="site-layout-background"
            collapsedWidth={50}
            breakpoint="md"
            collapsed={collapsed}
          >
            <Menu mode="inline" style={{ height: "100%", borderRight: 0 }}>
              <Menu.Item key="Dashboard" icon={<HomeTwoTone />}>
                <Link className="LinkDecorations" to="/">
                  Dashboard
                </Link>
              </Menu.Item>

              <Menu.Item key="complain" icon={<DollarCircleTwoTone />}>
                <Link className="LinkDecorations" to="/complain">
                  Complain
                </Link>
              </Menu.Item>

              <SubMenu
                key="product"
                title="Products"
                icon={<DollarCircleTwoTone />}
              >
                <Menu.Item key="1">
                  <Link className="LinkDecorations" to="/products/categories">
                    Categories
                  </Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link className="LinkDecorations" to="/products/catalog">
                    Catalog
                  </Link>
                </Menu.Item>
              </SubMenu>

              <SubMenu
                key="orders"
                title="Orders"
                icon={<ReconciliationTwoTone />}
              >
                <Menu.Item key="all-order">
                  <Link className="LinkDecorations" to="/orders/all-order">
                    All orders
                  </Link>
                </Menu.Item>
                <Menu.Item key="returned">
                  <Link className="LinkDecorations" to="/orders/returned">
                    Returned
                  </Link>
                </Menu.Item>
                <Menu.Item key="cancelled">
                  <Link className="LinkDecorations" to="/orders/cancelled">
                    Cancelled
                  </Link>
                </Menu.Item>
              </SubMenu>

              <SubMenu
                key="Discount"
                title="Discounts"
                icon={<RedEnvelopeTwoTone />}
              >
                <Menu.Item key="campaigns">
                  <Link className="LinkDecorations" to="/discount/campaigns">
                    Campaigns
                  </Link>
                </Menu.Item>
                <Menu.Item key="discount-codes">
                  <Link
                    className="LinkDecorations"
                    to="/discount/discount-codes"
                  >
                    Discount Codes
                  </Link>
                </Menu.Item>
              </SubMenu>

              <SubMenu
                key="loyalCustomer"
                title="Loyal Customer"
                icon={<ContactsTwoTone />}
              >
                <Menu.Item key="condition">
                  <Link
                    className="LinkDecorations"
                    to="/loyal-customer/conditon"
                  >
                    Conditions
                  </Link>
                </Menu.Item>
                <Menu.Item key="Customers">
                  <Link
                    className="LinkDecorations"
                    to="/loyal-customer/customer"
                  >
                    Loyal Customers
                  </Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0px 5px 0px 5px" }}>
            <Content
              className="site-layout-background scrollable-container"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              {this.props.children}
              <Drawer
                width={window.innerWidth * drawerLength}
                placement="right"
                size={"736px"}
                closable={false}
                onClose={this.onClose}
                visible={this.state.visible}
              >
                {this.getDrawerContent()}
              </Drawer>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
// }

export default function AdminLayout({ Component, ...props }) {
  return (
    <Route
      {...props}
      render={(propsComponent) => {
        return (
          <AdminRender>
            <Component {...propsComponent} />
          </AdminRender>
        );
      }}
    />
  );
}
