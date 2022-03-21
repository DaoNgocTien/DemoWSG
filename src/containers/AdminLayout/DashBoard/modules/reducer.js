import {
  GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS,
  STORE_SETTLING_PAYMENT,
} from "./constant";

let initialState = {
  loading: true,
  data: [],
  err: null,
  settlingPaymentList: {},
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA_REQUEST:
      state.loading = true;
      state.data = [];
      state.err = null;
      return { ...state };

    case GET_DATA_SUCCESS:
      state.loading = false;
      state.data = action.payload;
      state.err = null;
      return { ...state };

    case STORE_SETTLING_PAYMENT:
      state.loading = false;
      state.settlingPaymentList = { ...action.payload };
      state.err = null;
      return { ...state };

    case GET_DATA_FAIL:
      state.loading = false;
      state.data = [];
      // state.err = action.payload;
      return { ...state };
    default:
      return { ...state };
  }
};

export default dashboardReducer;
