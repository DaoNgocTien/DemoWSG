import AuthPage from "../containers/AuthPage";
import registration from "../containers/AuthPage/views/registration";

const authRoutePaths = {
  login: "/login",
  registration: "/registration",
};

const authRoutes = [
  {
    exact: false,
    path: "/login",
    component: AuthPage,
  },

  {
    exact: false,
    path: "/registration",
    component: registration,
  },
];

export { authRoutes, authRoutePaths };
