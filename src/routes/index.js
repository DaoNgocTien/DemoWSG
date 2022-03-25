import DashBoard from "../containers/AdminLayout/DashBoard";
import SettlePaymentUI from "../components/Transaction/views/settle-payment-view";
import AuthPage from "../containers/AuthPage";
import Registration from "../containers/AuthPage/views/registration";

import Product from "../components/Product";

import Transaction from "../components/Transaction";
import Category from "../components/Category";
import DiscountCode from "../components/DiscountCode";
import Campaign from "../components/Campaign";
import Order from "../components/Orders";
import ReturningOrder from "../components/ReturningOrder";
import HandleUI from "../components/ReturningOrder/views/handle-view";
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
    path: "/transaction/settle",
    component: SettlePaymentUI,
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
    path: "/orders/all-order",
    component: Order,
  },

  {
    exact: true,
    path: "/orders/returned",
    component: Order,
  },

  {
    exact: true,
    path: "/orders/cancelled",
    component: Order,
  },

  {
    exact: true,
    path: "/returning",
    component: ReturningOrder,
  },

  {
    exact: true,
    path: "/transaction/transaction",
    component: Transaction,
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
