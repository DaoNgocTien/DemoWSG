import { combineReducers } from "redux";
import authReducer from "../../containers/AuthPage/modules/reducer";
import categoryReducer from "../../components/Category/modules/reducer";
import productReducer from "../../components/Product/modules/reducer";
import addProductReducer from "../../components/AddProduct/modules/reducer";
import editProductReducer from "../../components/EditProduct/modules/reducer";
import campaignReducer from "../../components/Campaign/modules/reducer";
import orderReducer from "../../components/Orders/modules/reducer";


//Create rootReducer to use in store. This manages CHILD REDUCERS in the project
const rootReducer = combineReducers({
  authReducer,
  categoryReducer,
  productReducer,
  addProductReducer,
  editProductReducer,
  campaignReducer,
  orderReducer
});

export default rootReducer;
