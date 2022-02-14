import DashBoard from "../containers/AdminLayout/DashBoard";
import AuthPage from "../containers/AuthPage";

import Product from "../components/Product";
import Category from "../components/Category";
import DiscountCode from "../components/DiscountCode";
import Campaign from "../components/Campaign";
import Order from "../components/Orders";
const routesAdmin = [
  {
    exact: true,
    path: "/",
    component: DashBoard,
  },
  {
    exact: true,
    path: "/products/categories",
    component: Category,
  },
  {
    exact: true,
    path: "/products/catalog",
    component: Product,
  },

  {
    exact: true,
    path: "/orders/catalog",
    component: Order,
  },

  {
    exact: true,
    path: "/discount/campaigns",
    component: Campaign,
  },
  {
    exact: true,
    path: "/discount/discount-codes",
    component: DiscountCode,
  },
    
];

const routesAuth = [
  {
    exact: false,
    path: "/login",
    component: AuthPage,
  },
];
export { routesAdmin, routesAuth };
