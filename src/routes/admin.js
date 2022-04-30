import Campaign from "../components/Campaign";
import OrdersInCampaign from "../components/Campaign/views/detail-view";

import Category from "../components/Category";
import DiscountCode from "../components/DiscountCode";
import DiscountCodeDetail from "../components/DiscountCode/views/detail-view";

import HandleReturningOrder from "../components/HandleReturningOrder";
import LoyalCustomer from "../components/LoyalCustomer";
import LoyalCustomerCondition from "../components/LoyalCustomerCondition";
import Orders from "../components/Orders";
import OrderDetail from "../components/Orders/views/order-detail";
import Product from "../components/Product";
import ProductDetail from "../components/ProductDetail";
import Profile from "../components/Profile";
import ReturningOrder from "../components/ReturningOrder";
import Transaction from "../components/Transaction";
import SettlePaymentUI from "../components/Transaction/views/settle-payment-view";
import DashBoard from "../containers/AdminLayout/DashBoard";

const adminRoutePaths = {
  dashboard: "/",
  orders: "/orders"

};

const adminRoutes = [
  {
    exact: true,
    path: adminRoutePaths.dashboard,
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
    path: "/products/categories/:id",
    component: Category,
  },
  {
    exact: true,
    path: "/products/catalog",
    component: Product,
  },

  {
    exact: true,
    path: "/product/:id",
    component: ProductDetail,
  },

  {
    exact: true,
    path: adminRoutePaths.orders,
    component: Orders,
  },
  {
    exact: true,
    path: `${adminRoutePaths.orders}/:orderCode`,
    component: HandleReturningOrder,
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
    path: "/discount/campaign/:id",
    component: OrdersInCampaign,
  },
  {
    exact: true,
    path: "/discount/discount-codes",
    component: DiscountCode,
  },
  {
    exact: true,
    path: "/discount/discount-codes/:id",
    component: DiscountCodeDetail,
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

export { adminRoutes, adminRoutePaths }