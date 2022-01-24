import React from "react";
import { Route, Redirect, Link } from "react-router-dom";
import { Layout, Menu } from "antd";

import NavbarAdmin from "../../components/NavbarAdmin";

const { SubMenu } = Menu;
const { Sider } = Layout;

function AdminRender(props) {
  const { Content } = Layout;
  if (!localStorage.getItem("user")) {
    return <Redirect to="/login" />;
  } else {
    return (
      <Layout>
        <NavbarAdmin />
        <Layout>
          <Sider
            width={200}
            className="site-layout-background"
            collapsedWidth={0}
            breakpoint="md"
          >
            <Menu
              mode="inline"
              // defaultSelectedKeys={["catalog"]}
              defaultOpenKeys={["products"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <SubMenu key="products" title="Products">
                <Menu.Item key="categories"><Link className="LinkDecorations" to="/products/categories">Categories</Link></Menu.Item>
                <Menu.Item key="catalog"><Link className="LinkDecorations" to="/products/catalog">Catalog</Link></Menu.Item>
                <Menu.Item key="campaigns"><Link className="LinkDecorations" to="/products/campaigns">Campaign</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title="subnav 2">
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" title="subnav 3">
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
                <Menu.Item key="11">option11</Menu.Item>
                <Menu.Item key="12">option12</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: "24px 24px 0 24px" }}>
            {/* <div style={{ margin: "16px 0" }}></div> */}
            <Content
              className="site-layout-background scrollable-container"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              {props.children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
      // <div>
      //   <Layout style={{ background: "white" }}>
      //     <NavbarAdmin />
      //     <Layout>
      //       <Layout.Sider
      //         theme="light"
      //         collapsedWidth={0}
      //         breakpoint="md"
      //         width={200}
      //         className="site-layout-background"
      //       >
      //         <Menu
      //           defaultSelectedKeys={["1"]}
      //           mode="inline"
      //           theme="light"
      //           collapsedWidth=""
      //         >
      //           <Menu.Item key="1">
      //             <span>Option 1</span>
      //           </Menu.Item>
      //           <Menu.Item key="2">
      //             <span>Option 2</span>
      //           </Menu.Item>
      //           <Menu.Item key="3">
      //             <span>Option 3</span>
      //           </Menu.Item>
      //           <Menu.SubMenu
      //             key="sub1"
      //             title={
      //               <span>
      //                 <span>Navigation One</span>
      //               </span>
      //             }
      //           >
      //             <Menu.Item key="5">Option 5</Menu.Item>
      //             <Menu.Item key="6">Option 6</Menu.Item>
      //             <Menu.Item key="7">Option 7</Menu.Item>
      //             <Menu.Item key="8">Option 8</Menu.Item>
      //           </Menu.SubMenu>
      //           <Menu.SubMenu
      //             key="sub2"
      //             title={
      //               <span>
      //                 <span>Navigation Two</span>
      //               </span>
      //             }
      //           >
      //             <Menu.Item key="9">Option 9</Menu.Item>
      //             <Menu.Item key="10">Option 10</Menu.Item>
      //             <Menu.SubMenu key="sub3" title="Menu.SubMenu">
      //               <Menu.Item key="11">Option 11</Menu.Item>
      //               <Menu.Item key="12">Option 12</Menu.Item>
      //             </Menu.SubMenu>
      //           </Menu.SubMenu>
      //         </Menu>
      //       </Layout.Sider>
      //     </Layout>
      //     <Layout style={{ padding: "0 24px 24px" }}>
      //       <Content
      //         className="site-layout-background"
      //         style={{
      //           // marginLeft: "20%",
      //           // marginTop: "80px",
      //           padding: 24,
      //           margin: 0,
      //           minHeight: 280,
      //         }}
      //       >
      //         {props.children}
      //       </Content>
      //     </Layout>
      //   </Layout>
      // </div>
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
