import "./App.css";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// import { routesAdmin, routesAuth } from "./routes";
import "antd/dist/antd.css";
import AdminLayout from "./containers/AdminLayout";
import PageNotFound from "./containers/PageNotFound";
import { adminRoutes } from "./routes/admin";
import { authRoutes } from "./routes/auth";

function App() {
  const showLayoutAdmin = (routes) => {
    if (routes && routes.length > 0) {
      return routes.map((item, index) => {
        return (
          <AdminLayout
            key={index}
            exact={item.exact}
            path={item.path}
            Component={item.component}
          />
        );
      });
    }
  };

  const showLayoutAuth = (routes) => {
    if (routes && routes.length > 0) {
      return routes.map((item, index) => {
        return (
          <Route
            key={index}
            exact={item.exact}
            path={item.path}
            render={(propsComponent) => <item.component {...propsComponent} />}
          />
        );
      });
    }
  };
  return (
    <>
      <BrowserRouter forceRefresh>
        <div>
          <Switch>
            {showLayoutAdmin(adminRoutes)}
            {showLayoutAuth(authRoutes)}
            <Route path="/" component={PageNotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
