import DashBoard from "../containers/AdminLayout/DashBoard";
import AuthPage from "../containers/AuthPage";

import Product from "../components/Product";
import Category from "../components/Category";
import AddProduct from "../components/AddProduct";
import EditProduct from "../components/EditProduct";
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
    path: "/products/category",
    component: Category,
  },
  {
    exact: true,
    path: "/products/catalog",
    component: Product,
  },
  {
    exact: true,
    path: "/products/add",
    component: AddProduct,
  },
  {
    exact: true,
    path: "/products/campaigns",
    component: Campaign,
  },
  {
    exact: true,
    path: "/products/:id",
    component: EditProduct,
  },

  {
    exact: true,
    path: "/orders/catalog",
    component: Order,
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
