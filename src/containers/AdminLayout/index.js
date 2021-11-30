import React from "react";
import { Route } from "react-router-dom";
import { Layout } from "antd";

import NavbarAdmin from "../../components/NavbarAdmin";

function AdminRender(props) {
  const { Content } = Layout;
  return (
    <div>
      <Layout style={{ background: "white" }}>
        <NavbarAdmin />
        <Content
          style={{
            marginLeft: "20%",
            marginTop: "80px",
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </div>
  );
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
