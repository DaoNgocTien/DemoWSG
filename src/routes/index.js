import DashBoard from "../containers/AdminLayout/DashBoard";
import AuthPage from "../containers/AuthPage";
const routesAdmin = [
  {
    exact: true,
    path: "/",
    component: DashBoard,
  },
];

const routesAuth = [
  {
    exact: false,
    path: "/login",
    component: AuthPage,
  }
];
export { routesAdmin, routesAuth };
