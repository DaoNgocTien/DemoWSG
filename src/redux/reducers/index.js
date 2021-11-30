import { combineReducers } from "redux";
import authReducer from "../../containers/AuthPage/modules/reducer";

//Create rootReducer to use in store. This manages CHILD REDUCERS in the project
const rootReducer = combineReducers({
  authReducer,
});

export default rootReducer;
