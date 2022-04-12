import {
  AUTH_PAGE_REQUEST,
  AUTH_PAGE_SUCCESS,
  AUTH_PAGE_FAILED,
  GOOGLE_OAUTH2,
  PHONE_OTP,
  PROFILE,
  REGISTRATION,
} from "./constant";

let initialState = {
  loading: false,
  data: null,
  err: null,
  profile: null,
  phoneOTP: null,
  phone: null,
  OTP: null,
  message: null,
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
      state.err = action.payload;
      return { ...state };

    case GOOGLE_OAUTH2:
      state.loading = false;
      state.data = action.googleResponse;
      return { ...state };

    case PHONE_OTP:
      state.loading = false;
      state.phoneOTP = action.phoneOTP;
      return { ...state };

    case PROFILE:
      state.loading = false;
      state.phone = action.payload.phone;
      state.OTP = action.payload.OTP;
      state.message = action.payload.message;
      return { ...state };

    case REGISTRATION:
    //  console.log(action.payload);
      state.loading = false;
      state.profile = action.payload.profile;
      return { ...state };

    default:
      return { ...state };
  }
};

export default authReducer;
