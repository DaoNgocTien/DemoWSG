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
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  // componentDidMount = () => {
  //   if (!localStorage.getItem("user")) {
  //     return <Redirect to="/login" />;
  //   }
  // }

  render() {
    const { collapsed } = this.state;
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
              <SubMenu
                key="products"
                title="Products"
                icon={<DropboxOutlined />}
              >
                <Menu.Item key="categories">
                  <Link className="LinkDecorations" to="/products/categories">
                    Categories
                  </Link>
                </Menu.Item>
                <Menu.Item key="catalog">
                  <Link className="LinkDecorations" to="/products/catalog">
                    Catalog
                  </Link>
                </Menu.Item>
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
