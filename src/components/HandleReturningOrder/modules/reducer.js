import {
  GET_DATA_FAIL,
  GET_DATA_REQUEST,
  GET_DATA_SUCCESS,
  STORE_COMPLAIN_ORDER
} from "./constant";

let initialState = {
  loading: true,
  data: [],
  err: null,
  complainRecord: {},
};

const handleReturningOrderReducer = (state = initialState, action) => {
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

    case STORE_COMPLAIN_ORDER:
      state.loading = false;
      state.complainRecord = action.payload;
      state.err = null;
      return { ...state };

    case GET_DATA_FAIL:
      state.loading = true;
      state.data = [];
      return { ...state };

    default:
      return { ...state };
  }
};

export default handleReturningOrderReducer;
