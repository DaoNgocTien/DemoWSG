import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS, STORE_CAMPAIGN } from "./constant";

let initialState = {
  loading: true,
  data: [],
  err: null,
  record: {}
};

const campaignReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA_REQUEST:
      state.loading = true;
      state.data = [];
      state.err = null;
      return { ...state };

    case STORE_CAMPAIGN:
      console.log(action);
      state.loading = false;
      state.record = action.payload.record;
      state.err = null;
      console.log(state);
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
