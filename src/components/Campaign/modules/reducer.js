import { STORE_CREATING_ERR, GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS, STORE_CAMPAIGN } from "./constant";

let initialState = {
  loading: true,
  data: [],
  err: null,
  record: {},
  orders: [],
  isStartAbleMessage: "",
  isStartAble: false
};

const campaignReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA_REQUEST:
      state.loading = true;
      state.data = [];
      state.err = null;
      return { ...state };

    case STORE_CAMPAIGN:
      state.loading = false;
      state.record = action.payload.record;
      state.orders = action.payload.orders;
      state.isStartAbleMessage = action.payload.isStartAbleMessage;
      state.isStartAble = action.payload.isStartAble;
      state.err = null;
      return { ...state };

    case STORE_CREATING_ERR:
      state.loading = false;
      state.creatingMessage = action.payload.creatingMessage;
      state.creatingErr = action.payload.creatingErr;
      state.err = null;
      return { ...state };

    case GET_DATA_SUCCESS:
      state.loading = false;
      state.data = action.payload;
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

export default campaignReducer;
