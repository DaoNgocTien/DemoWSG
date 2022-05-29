import Axios from "axios";
import {GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS} from "./constant";

const getAllCategory = () => {
    return async(dispatch) => {
        dispatch(getRequest());
        Axios({url: `/categories/All`, method: "GET", withCredentials: true}).then((result) => {
            if (result.status === 200) {
                if (result.data.redirectUrl) {
                    if (result.data.redirectUrl === '/login') {
                        localStorage.clear()
                    }
                    return window.location = result.data.redirectUrl
                }
                const data = (result.data.data).map(category => {
                    return {
                        key: category.id,
                        ...category
                    }
                });
                return dispatch(getSuccess(data));
            }
        }).catch(() => {
            return dispatch(getFailed());
        });
    };
};

const getRequest = () => {
    return {type: GET_DATA_REQUEST};
};

const getSuccess = (data) => {
    return {type: GET_DATA_SUCCESS, payload: data};
};

const getFailed = (err) => {
    return {type: GET_DATA_FAIL, payload: err};
};

const action = {
    getAllCategory: getAllCategory
}

export default action;