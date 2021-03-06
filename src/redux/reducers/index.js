import { combineReducers } from "redux";
import campaignReducer from "../../components/Campaign/modules/reducer";
import cancelledOrderReducer from "../../components/CancelledOrder/modules/reducer";
import categoryReducer from "../../components/Category/modules/reducer";
import discountReducer from "../../components/DiscountCode/modules/reducer";
import handleReturningOrderReducer from "../../components/HandleReturningOrder/modules/reducer";
import loyalCustomerReducer from "../../components/LoyalCustomer/modules/reducer";
import loyalCustomerConditionReducer from "../../components/LoyalCustomerCondition/modules/reducer";
import notificationReducer from "../../components/Notification/modules/reducer";
import orderReducer from "../../components/Orders/modules/reducer";
import productReducer from "../../components/Product/modules/reducer";
import productDetailReducer from "../../components/ProductDetail/modules/reducer";
import profileReducer from "../../components/Profile/modules/reducer";
import returningReducer, { default as complainOrder, default as ReturningOrderReducer } from "../../components/ReturningOrder/modules/reducer";
import transactionReducer from "../../components/Transaction/modules/reducer";
import dashboardReducer from "../../containers/AdminLayout/DashBoard/modules/reducer";
import authReducer from "../../containers/AuthPage/modules/reducer";

//Create rootReducer to use in store. This manages CHILD REDUCERS in the project
const rootReducer = combineReducers({
  authReducer,
  categoryReducer,
  productReducer,
  discountReducer,
  campaignReducer,
  orderReducer,
  loyalCustomerConditionReducer,
  loyalCustomerReducer,
  ReturningOrderReducer,
  profileReducer,
  dashboardReducer,
  transactionReducer,
  notificationReducer,
  handleReturningOrderReducer,
  complainOrder,
  cancelledOrderReducer,
  productDetailReducer,
  returningReducer
});

export default rootReducer;
