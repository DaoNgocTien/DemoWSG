import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS, GET_PHONE_VALIDATION, GET_IDENFICATION_VALIDATION, GET_EWALLET_VALIDATION } from "./constant";
import Axios from "axios";

const getProfile = () => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());
      // console.log("test");
      const [profile] = await Promise.all([
        Axios({
          url: `/users/profile/me`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),

      ]);
      if (profile.status === 200) {

        return dispatch(
          getSuccess(profile.data.data));
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
      // console.log("test");
      const [changePasswordResponse] = await Promise.all([
        Axios({
          url: `/users/user/resetPassword`,
          method: "POST",
          data: { password: password, accountId: id },
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),

      ]);
      // changePasswordResponse.data
      // changePasswordResponse.message
      // console.log(changePasswordResponse);
      console.log(changePasswordResponse);
      if (changePasswordResponse.status === 200) {
        console.log(changePasswordResponse);

        return dispatch(
          getSuccess({
            changePasswordMessage: "Change password successfully!",

          }))
      }
      return dispatch(getFailed());

    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const checkPhoneNumber = phone => {
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
      // console.log(phoneValidation);
      if (exist) {
        console.log(phoneValidation);
        return dispatch(
          getPhoneValidation({
            checkPhoneMessage: "Phone number exists",
            phone: null,
            phoneOTP: null,
          }))
      }
      else {
        //  Send OTP to phone number through Firebase
        return dispatch(
          getPhoneValidation({
            checkPhoneMessage: "",
            phone: phone,
            phoneOTP: "12345",

          })
        );
      }
      // return dispatch(
      //   storeProfile({
      //     profile: phoneValidation.data.data.length !== 0 ? phoneValidation.data.data[0] : null,
      //   })
      // );
    } catch (error) {
      // console.log(error);
      return dispatch(getFailed(error));
    }
  };
};

const updateProfile = user => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());
      console.log(user);
      const [updateResponse] = await Promise.all([
        Axios({
          url: `/supplier/profile`,
          method: "PUT",
          data: user,
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
        // Axios({
        //   url: `/users/profile/me`,
        //   method: "GET",
        //   withCredentials: true,
        //   exposedHeaders: ["set-cookie"],
        // }),

      ]);
      console.log(updateResponse);
      if (updateResponse.status === 200) {
        dispatch(
          getPhoneValidation({
            changePhoneMessage: "Phone number changed successfully!",
          })
        );
        return dispatch(
          getSuccess({
            username: updateResponse.data.data.account.username,
            password: updateResponse.data.data.account.password,
            googleid: updateResponse.data.data.account.googleid,
            phone: updateResponse.data.data.account.phone,
            ...updateResponse.data.data.profile,
          }));
      }
      return dispatch(getFailed());

    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

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
      console.log(identificationResponse);
      return dispatch(
        getIdenficationCard({
          identificationChangeMessage: "Identification validated successfully!",
        }));
    } catch (error) {
      // console.log(error);
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
      console.log(ewalletResponse);
      return dispatch(
        getEWalletCard({
          eWalletChangeMessage: "E-Wallet changed successfully!",
        }));
    } catch (error) {
      // console.log(error);
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
  // console.log(data);
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

const getPhoneValidation = data => {
  return {
    type: GET_PHONE_VALIDATION,
    payload: data,
  };
}

const getIdenficationCard = data => {
  return {
    type: GET_IDENFICATION_VALIDATION,
    payload: data,
  };
}

const getEWalletCard = data => {
  return {
    type: GET_EWALLET_VALIDATION,
    payload: data,
  };
}

const action = {
  changePassword,
  checkPhoneNumber,
  updateProfile,
  getProfile,
  updateIdentifcation,
  updateEWallet,
};

export default action;
