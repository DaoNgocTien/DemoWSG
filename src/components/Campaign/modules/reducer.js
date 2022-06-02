import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS, STORE_CAMPAIGN } from "./constant";

let initialState = {
  loading: true,
  data: [],
  err: null,
  record: {},
  orders: [],
  isStartAbleMessage: "",
  isStartAble: false,
  availableProducts: [],
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
      state.availableProducts = action.payload.products;
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
      return { ...state };
    default:
      return { ...state };
  }
};

export default campaignReducer;
