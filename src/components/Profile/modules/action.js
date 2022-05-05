import Axios from "axios";
import {
  GET_DATA_FAIL,
  GET_DATA_REQUEST,
  GET_DATA_SUCCESS,
  GET_EWALLET_VALIDATION,
  GET_IDENFICATION_VALIDATION,
  GET_PHONE_VALIDATION
} from "./constant";

const getProfile = () => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());

      const [profile] = await Promise.all([
        Axios({
          url: `/users/profile/me`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      ]);
      if (profile.status === 200) {
        let user = profile.data.data.user.rolename === "Supplier" ? {
          rolename: profile.data.data.user.rolename,
          ...profile.data.data.supplierData[0],
        } : {
          rolename: profile.data.data.user.rolename,
          ...profile.data.data.systemProfileData[0],
        };
        localStorage.setItem("user", JSON.stringify(user));
        return dispatch(getSuccess(user));
      }
      return dispatch(getFailed());
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const changePassword = (id, password) => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());

      const [changePasswordResponse] = await Promise.all([
        Axios({
          url: `/users/user/resetPassword`,
          method: "POST",
          data: { password: password, accountId: id },
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      ]);

      if (changePasswordResponse.status === 200) {
        return dispatch(
          getSuccess({
            changePasswordMessage: "Change password successfully!",
          })
        );
      }
      return dispatch(getFailed());
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const checkPhoneNumber = (phone) => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());

      const [phoneValidation] = await Promise.all([
        Axios({
          url: `/users/${phone}`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      ]);
      const exist = phoneValidation.data.data[0] ? true : false;

      if (exist) {
        return dispatch(
          getPhoneValidation({
            checkPhoneMessage: "Phone number exists",
            phone: null,
            phoneOTP: null,
          })
        );
      } else {
        return dispatch(
          getPhoneValidation({
            checkPhoneMessage: null,
            phone: phone,
            phoneOTP: "12345",
          })
        );
      }
    } catch (error) {
      return dispatch(getFailed(error));
    }
  };
};

const checkingPhoneNumber = (message) => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());

      return dispatch(
        getPhoneValidation({
          checkPhoneMessage: message,
          phone: null,
          phoneOTP: null,
        })
      );
    } catch (error) {
      return dispatch(getFailed(error));
    }
  };
};

const updateProfile = (user) => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());

      const [updateResponse] = await Promise.all([
        Axios({
          url: `/supplier/profile`,
          method: "PUT",
          data: user,
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      ]);

      if (updateResponse.status === 200) {
        return dispatch(
          getPhoneValidation({
            changeProfileMessage: "Profile changed successfully!",
          })
        );
      }
      return dispatch(getFailed());
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const onChangeUpdateProfile = () => {
  return async (dispatch) => {
    return dispatch(
      getPhoneValidation({
        changeProfileMessage: "",
      })
    );
  }
}

const updateIdentifcation = (card) => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());

      const [identificationResponse] = await Promise.all([
        Axios({
          url: `/supplier/identification`,
          method: "PUT",
          data: card,
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      ]);

      return dispatch(
        getIdenficationCard({
          identificationChangeMessage: "Identification validated successfully!",
        })
      );
    } catch (error) {
      return dispatch(getFailed(error));
    }
  };
};

const updateEWallet = (ewallet) => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());

      const [ewalletResponse] = await Promise.all([
        Axios({
          url: `/supplier/ewallet`,
          method: "PUT",
          data: ewallet,
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      ]);

      return dispatch(
        getEWalletCard({
          eWalletChangeMessage: "E-Wallet changed successfully!",
        })
      );
    } catch (error) {
      return dispatch(getFailed(error));
    }
  };
};

const getRequest = () => {
  return {
    type: GET_DATA_REQUEST,
  };
};

const getSuccess = (data) => {
  return {
    type: GET_DATA_SUCCESS,
    payload: data,
  };
};

const getFailed = (err) => {
  return {
    type: GET_DATA_FAIL,
    payload: err,
  };
};

const getPhoneValidation = (data) => {
  return {
    type: GET_PHONE_VALIDATION,
    payload: data,
  };
};

const getIdenficationCard = (data) => {
  return {
    type: GET_IDENFICATION_VALIDATION,
    payload: data,
  };
};

const getEWalletCard = (data) => {
  return {
    type: GET_EWALLET_VALIDATION,
    payload: data,
  };
};

const action = {
  changePassword,
  checkPhoneNumber,
  checkingPhoneNumber,
  updateProfile,
  getProfile,
  updateIdentifcation,
  updateEWallet,
  onChangeUpdateProfile,
};

export default action;
