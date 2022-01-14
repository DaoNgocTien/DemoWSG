import {
  GET_DATA_FOR_PRODUCT_FAIL,
  GET_DATA_FOR_PRODUCT_REQUEST,
  GET_DATA_FOR_PRODUCT_SUCCESSS,
} from "./constant";

let initialState = {
  loading: true,
  data: null,
  err: null,
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA_FOR_PRODUCT_FAIL:
      state.loading = true;
      state.data = null;
      state.err = null;
      return { ...state };

    case GET_DATA_FOR_PRODUCT_SUCCESSS:
      state.loading = false;
      state.data = action.payload;
      state.err = null;
      return { ...state };

    case GET_DATA_FOR_PRODUCT_REQUEST:
      state.loading = true;
      state.data = null;
      return { ...state };

    default:
      return { ...state };
  }
};

export default Reducer;
