import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";

class ChatMaterial extends Component {
    render() {
        console.log(this.props);
        return (
            <App />
        )
    }
}
const mapStateToProps = (state) => {
    return {
        loading: state.discountCodeReducer.loading,
        data: state.discountCodeReducer.data,
        error: state.discountCodeReducer.err,
        // productList: state.productReducer.data,
        // orderList: [],
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDiscountCode: async () => {
            await dispatch(action.getDiscountCode());
        },

        createDiscountCode: async (record) => {
            console.log(record);
            await dispatch(action.createDiscountCode(record));
            await dispatch(action.getDiscountCode());
        },

        updateDiscountCode: async (record, id) => {
            console.log(record);
            await dispatch(action.updateDiscountCode(record, id));
            await dispatch(action.getDiscountCode());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatMaterial);
