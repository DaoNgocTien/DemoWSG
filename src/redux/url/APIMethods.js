import Axios from "axios";
import { } from "./APISettings";

const get = async url => {
    await Axios({
        url: url,
        method: "GET",
        withCredentials: true,
    })
        .then((result) => {
            if (result.status === 200) {
                return result.data.data;
            }
        })
        .catch((err) => {
            return err;
        });
};

const post = async (url, data) => {
    await Axios({
        url: url,
        method: "POST",
        headers: {
            Authorization: "JWT_TOKEN",
            "Content-Type": "application/json",
        },
        data: data,
        withCredentials: true,
        exposedHeaders: ["set-cookie"],
    })
        .then((response) => {

            if (response.status === 200) {
                return {
                    status: 1,
                    result: response
                }
            }
        })
        .catch((err) => {
            return {
                status: 0,
                result: err
            }
        });
};

const methods = {
    get,
    post
}

export default methods;