import DashBoard from "../containers/AdminLayout/DashBoard";
import AuthPage from "../containers/AuthPage";
import Registration from "../containers/AuthPage/views/registration";

import Product from "../components/Product";
import Category from "../components/Category";
import DiscountCode from "../components/DiscountCode";
import Campaign from "../components/Campaign";
import Order from "../components/Orders";
import ComplainOrder from "../components/ComplainOrder";
import HandleUI from "../components/ComplainOrder/views/handle-view";
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
    path: "/orders/wholesale",
    component: Order,
  },

  {
    exact: true,
    path: "/orders/retail",
    component: Order,
  },

  {
    exact: true,
    path: "/complain",
    component: ComplainOrder,
  },

  {
    exact: true,
    path: "/complain/handle",
    component: HandleUI,
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

  {
    exact: false,
    path: "/registration",
    component: Registration,
  },
];
export { routesAdmin, routesAuth };
