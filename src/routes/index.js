import DashBoard from "../containers/AdminLayout/DashBoard";
import AuthPage from "../containers/AuthPage";

import Product from "../components/Product";
import Category from "../components/Category";
import DiscountCode from "../components/DiscountCode";
import Campaign from "../components/Campaign";
import Order from "../components/Orders";
import LoyalCustomerCondition from "../components/LoyalCustomerCondition";
import LoyalCustomer from "../components/LoyalCustomer";
import Profile from "../components/Profile";

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
  {
    exact: true,
    path: "/loyal-customer/conditon",
    component: LoyalCustomerCondition,
  }, 
  {
    exact: true,
    path: "/loyal-customer/customer",
    component: LoyalCustomer,
  }, 
  {
    exact: true,
    path: "/profile",
    component: Profile,
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
