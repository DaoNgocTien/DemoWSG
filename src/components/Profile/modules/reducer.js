import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS, GET_PHONE_VALIDATION, GET_IDENFICATION_VALIDATION, GET_EWALLET_VALIDATION } from "./constant";

let initialState = {
  loading: true,
  data: [],
  err: null,
  phoneValidation: {},
  identificationValidation: {
    identificationChangeMessage:"",
  },
  eWalletValidation: {
    eWalletChangeMessage:"",
  }

};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA_REQUEST:
      // //console.log("GET_DATA_REQUEST");
      state.loading = true;
      state.data = [];
      state.err = null;
      return { ...state };

    case GET_DATA_SUCCESS:
      // //console.log("GET_DATA_SUCCESS");
      state.loading = false;
      state.data = action.payload;
      state.err = null;
      return { ...state };

    case GET_PHONE_VALIDATION:
      // //console.log("GET_PHONE_VALIDATION");
      state.loading = false;
      state.phoneValidation = {
        ...action.payload,
      };
      state.err = null;
      return { ...state };

    case GET_IDENFICATION_VALIDATION:
      // //console.log("GET_IDENFICATION_VALIDATION");
      state.loading = false;
      state.identificationValidation = {
        ...action.payload,
      };
      state.err = null;
      return { ...state };


    case GET_EWALLET_VALIDATION:
      // //console.log("GET_EWALLET_VALIDATION");
      state.loading = false;
      state.eWalletValidation = {
        ...action.payload,
      };
      state.err = null;
      return { ...state };

    case GET_DATA_FAIL:
      // //console.log("GET_DATA_FAIL");
      state.loading = false;
      state.data = [];
      // state.err = action.payload;
      return { ...state };
    default:
      return { ...state };
  }
};

export default profileReducer;
