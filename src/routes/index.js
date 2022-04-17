import Campaign from "../components/Campaign";
import OrdersInCampaign from "../components/Campaign/views/orders-in-campaign-view";

import CancelledOrder from "../components/CancelledOrder";
import Category from "../components/Category";
import DiscountCode from "../components/DiscountCode";
import HandleReturningOrder from "../components/HandleReturningOrder";
import LoyalCustomer from "../components/LoyalCustomer";
// import HandleUI from "../components/ReturningOrder/views/handle-view";
import LoyalCustomerCondition from "../components/LoyalCustomerCondition";
import Order from "../components/Orders";
import Product from "../components/Product";
import Profile from "../components/Profile";
import ReturningOrder from "../components/ReturningOrder";
import Transaction from "../components/Transaction";
import SettlePaymentUI from "../components/Transaction/views/settle-payment-view";
import DashBoard from "../containers/AdminLayout/DashBoard";
import AuthPage from "../containers/AuthPage";
import Registration from "../containers/AuthPage/views/registration";




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
    path: "/orders/cancelled",
    component: CancelledOrder,
  },

  {
    exact: true,
    path: "/orders/:status",
    component: Order,
  },

  {
    exact: true,
    path: "/returning",
    component: ReturningOrder,
  },

  {
    exact: true,
    path: "/transaction",
    component: Transaction,
  },


  {
    exact: true,
    path: "/discount/campaigns",
    component: Campaign,
  },
  
  {
    exact: true,
    path: "/discount/orders-in-campaign",
    component: OrdersInCampaign,
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

  {
    exact: true,
    path: "/order/handle/returning/:orderCode",
    component: HandleReturningOrder,
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

