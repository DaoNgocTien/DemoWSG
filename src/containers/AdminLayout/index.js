import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { Layout, Menu, } from "antd";
import {
  ReconciliationOutlined,
  DropboxOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import NavbarAdmin from "../../components/NavbarAdmin";

const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;

class AdminRender extends Component {
  state = {
    collapsed: false,
    openDrawer: false,
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  showDrawer = (mode) => {
    //  true: notice
    //  false: chatbox
    this.setState({
      openDrawer: mode,
    });
  };

  getDrawerContent = () => {
    return this.state.openDrawer ? <Chat /> : <ChatMaterial />;
  }

  render() {
    const { collapsed, openDrawer } = this.state;
    const drawerLength = openDrawer ? 0.4 : 0.7;
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
            showDrawer={this.showDrawer}
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
            <Menu
              mode="inline"
              style={{ height: "100%", borderRight: 0 }}
            >
              <SubMenu key="product" title="Products">
                <Menu.Item key="1"><Link className="LinkDecorations" to="/products/categories">Categories</Link></Menu.Item>
                <Menu.Item key="2"><Link className="LinkDecorations" to="/products/catalog">Catalog</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title="subnav 2">
                <Menu.Item key="5"><Link className="LinkDecorations" to="/campaigns">Catalog</Link></Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>

              {/* <SubMenu key="orders" title="Orders"> */}
              <Menu.Item key="Order" icon={<ReconciliationOutlined />}>
                <Link className="LinkDecorations" to="/orders/catalog">
                  Orders
                </Link>
              </Menu.Item>

              <SubMenu key="Discount" title="Discounts" icon={<PercentageOutlined />}>
                <Menu.Item key="campaigns">
                  <Link className="LinkDecorations" to="/discount/campaigns">
                    Campaign
                  </Link>
                </Menu.Item>
                <Menu.Item key="discount-codes">
                  <Link className="LinkDecorations" to="/discount/discount-codes">
                    Discount Code
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
                onClose={this.showDrawer()}
                visible={openDrawer}
              >
                {this.getDrawerContent()}
              </Drawer>
            </Content>
          </Layout>
        </Layout>
      </Layout >
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
