import { combineReducers } from "redux";
import authReducer from "../../containers/AuthPage/modules/reducer";
import categoryReducer from "../../components/Category/modules/reducer";
import productReducer from "../../components/Product/modules/reducer";
import discountCodeReducer from "../../components/DiscountCode/modules/reducer";
import campaignReducer from "../../components/Campaign/modules/reducer";
import orderReducer from "../../components/Orders/modules/reducer";
import loyalCustomerConditionReducer from "../../components/LoyalCustomerCondition/modules/reducer";
import loyalCustomerReducer from "../../components/LoyalCustomer/modules/reducer";
import complainReducer from "../../components/ReturningOrder/modules/reducer";
import profileReducer from "../../components/Profile/modules/reducer";
import transactionReducer from "../../components/Transaction/modules/reducer";

import dashboardReducer from "../../containers/AdminLayout/DashBoard/modules/reducer";



//Create rootReducer to use in store. This manages CHILD REDUCERS in the project
const rootReducer = combineReducers({
  authReducer,
  categoryReducer,
  productReducer,
  discountCodeReducer,
  campaignReducer,
  orderReducer,
  loyalCustomerConditionReducer,
  loyalCustomerReducer,
  complainReducer,
  profileReducer,
  dashboardReducer,
  transactionReducer,
});

export default rootReducer;
