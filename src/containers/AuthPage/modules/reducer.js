import {
  AUTH_PAGE_REQUEST,
  AUTH_PAGE_SUCCESS,
  AUTH_PAGE_FAILED,
  GOOGLE_OAUTH2
} from "./constant";

let initialState = {
  loading: false,
  data: null,
  err: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_PAGE_REQUEST:
      state.loading = true;
      state.data = null;
      state.err = null;
      return { ...state };

    case AUTH_PAGE_SUCCESS:
      state.loading = false;
      state.data = action.payload;
      state.err = null;
      return { ...state };

    case AUTH_PAGE_FAILED:
      state.loading = false;
      state.data = null;
      // state.err = action.payload;
      return { ...state };
    case GOOGLE_OAUTH2:
      state.loading = false;
      state.data = action.googleResponse;
      return { ...state };
    default:
      return { ...state };
  }
};

export default authReducer;
