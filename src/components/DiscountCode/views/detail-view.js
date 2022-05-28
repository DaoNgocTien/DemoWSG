import { Button, DatePicker, Descriptions, Form, Image, Input, InputNumber, PageHeader, Popover, Space, Tag } from "antd";
import Axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";
import { connect } from "react-redux";
import action from "./../modules/action";
import DeleteModal from "./delete-view";
import EditModal from "./edit-view";

class DiscountCodeDetail extends Component {
    state = {
        openDeleteModal: false,
        openEditModal: false,
    };
    formRef = React.createRef();

    componentDidMount = () => {
        this.props.getDiscountCode(this.props.match.params.id);
    }

    start = (openModal) => {
        switch (openModal) {
            case "openDeleteModal":
                this.setState({
                    openDeleteModal: true
                });
                break;

            case "openEditModal":
                this.setState({
                    openEditModal: true,
                });
                break;

            default:
                break;
        }
    };

    closeModal = () => {
        this.setState({
            openDeleteModal: false,
            openEditModal: false,
        });
    };

    render() {
        const {
            openDeleteModal,
            openEditModal,
        } = this.state;

        const {
            record,
            updateDiscountCode,
            deleteDiscountCode,
        } = this.props;
        return (
            <PageHeader
                className="site-page-header-responsive"
                onBack={() => window.history.back()}
                title={"Discount Code Detail"}
                extra={[
                    <Button
                        hidden={(record?.status)?.toUpperCase() === "DEACTIVATED"}
                        onClick={() => this.start("openEditModal")}
                        type="primary"
                    >
                        Edit Discount Code
                    </Button>,

                    <Button
                        hidden={(record?.status)?.toUpperCase() === "DEACTIVATED"}
                        onClick={() => this.start("openDeleteModal")}
                        type="danger"
                    >
                        Delete Discount Code
                    </Button>,

                    <Button
                        hidden={(record?.status)?.toUpperCase() !== "DEACTIVATED"}
                        onClick={() => window.history.back()}
                    >
                        Back
                    </Button>,
                ]}
                footer={
                    <div>
                        <DeleteModal
                            loading={this.props.loading}
                            openModal={openDeleteModal}
                            closeModal={this.closeModal}
                            deleteDiscountCode={deleteDiscountCode}
                            record={this.props.record}
                        />
                        <EditModal
                            loading={this.props.loading}
                            openModal={openEditModal}
                            closeModal={this.closeModal}
                            updateDiscountCode={updateDiscountCode}
                            record={this.props.record}
                        />
                    </div>
                }
            >
                <Form>
                    <Descriptions
                        bordered
                        column={2}
                        size="small"
                        labelStyle={{ width: "20%", fontWeight: "bold" }}
                    >
                        <Descriptions.Item label="End Date">
                                {moment(record?.enddate).format("MM/DD/YYYY")}
                        </Descriptions.Item>

                        <Descriptions.Item label="Code">
                            {record?.code ?? ""}
                        </Descriptions.Item>

                        <Descriptions.Item label="Discount Price">
                            <NumberFormat
                                value={record?.discountprice ?? 0}
                                thousandSeparator={true}
                                suffix={" VND"}
                                decimalScale={0}
                                displayType="text"
                            />
                        </Descriptions.Item>

                        <Descriptions.Item label="Minimum Discount Price">
                            <NumberFormat
                                value={record?.minimunpricecondition ?? 0}
                                thousandSeparator={true}
                                suffix={" VND"}
                                decimalScale={0}
                                displayType="text"
                            />
                        </Descriptions.Item>

                        <Descriptions.Item label="Quantity">
                            <NumberFormat
                                value={record?.quantity ?? 0}
                                thousandSeparator={true}
                                decimalScale={0}
                                displayType="text"
                            />
                        </Descriptions.Item>

                        <Descriptions.Item label="Discount Code Status">
                            <Tag
                                color={
                                    record?.status === "ready"
                                        ? "blue"
                                        : record?.status === "active"
                                            ? "red"
                                            : record?.status === "done"
                                                ? "green"
                                                : "grey"
                                }
                            >
                                {(record?.status ?? "").toUpperCase()}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Description">
                            {record?.description}
                        </Descriptions.Item>
                    </Descriptions>
                </Form>
            </PageHeader>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.discountReducer.loading,
        data: state.discountReducer.data,
        error: state.discountReducer.err,
        record: state.discountReducer.record,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDiscountCode: async (id) => {
            await dispatch(action.getDiscountCode(id));
        },

        updateDiscountCode: async (record) => {
            await dispatch(action.updateDiscountCode(record));
            await dispatch(action.getDiscountCode(record.id));
        },

        deleteDiscountCode: async (id) => {
            await dispatch(action.deleteDiscountCode(id));
            await dispatch(action.getDiscountCode(id));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscountCodeDetail);
