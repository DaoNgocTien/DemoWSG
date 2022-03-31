import {
    Button,
    Form,
    Input, Modal
} from "antd";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";

//  prototype
const propsProTypes = {
    closeModal: PropTypes.func,
    updateCategory: PropTypes.func,
    record: PropTypes.object,
    openModal: PropTypes.bool
};

//  default props
const propsDefault = {
    closeModal: () => { },
    updateCategory: () => { },
    // record: {
    //     key: "b95685d6-e12e-4ea0-8fdf-47ec84af6912",
    //     id: "b95685d6-e12e-4ea0-8fdf-47ec84af6912",
    //     categoryname: "Ipad",
    //     supplierid: "99ba5ad1-612c-493f-8cdb-2c2af92ae95a",
    //     isdeleted: false,
    //     createdat: "2022-01-23T12:03:11.309Z",
    //     updatedat: "2022-01-23T12:03:11.309Z"
    // },
    openModal: false,
};

class EditModal extends Component {
    static propTypes = propsProTypes;
    static defaultProps = propsDefault;
    state = { record: this.props.record };
    formRef = React.createRef();

    componentDidMount() {
        // console.log("EditModal Didmount");

        // console.log(this.props);
        this.formRef.current.setFieldsValue({
            id: this.props.record?.id,
            categoryname: this.props.record?.categoryname,
        });
    }

    handleEditAndClose = (data) => {
        this.props.updateCategory(data);
        this.formRef.current.resetFields();
        this.props.closeModal();
    };

    handleCancel = () => {
        this.formRef.current.resetFields();
        this.props.closeModal();
    };

    render() {
        const { openModal, record, } = this.props;
        return (
            <>
                <Form
                    key={record?.key}
                    id="editCategoryForm"
                    ref={this.formRef}
                    onFinish={this.handleEditAndClose}
                    layout="vertical"
                >
                    <Modal
                        title="Edit a record"
                        visible={openModal}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button onClick={this.handleCancel}>Cancel</Button>,
                            <Button
                                type="primary"
                                form="editCategoryForm"
                                key="submit"
                                htmlType="submit"
                            >
                                Submit
                            </Button>,
                        ]}
                    >
                        <Form.Item
                            label="Category ID"
                            name="id"
                            initialValue={record?.id}
                            hidden="true"
                        >
                            <Input
                                placeholder="Category ID"
                                disabled={true}
                                hidden={true}
                                value={record?.id}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Category Name"
                            name="categoryName"
                            initialValue={record?.categoryname}
                            rules={[
                                {
                                  required: true,
                                  message: 'Name is required!',
                                },
                                () => ({
                                  validator(_, value) {
                                    if (value.length > 0 && value.length <= 20) {
                                      return Promise.resolve();
                                    }
                
                                    return Promise.reject(new Error('Category Name length is 1-20 characters!'));
                                  },
                                }),
                              ]}
                        >
                            <Input
                                placeholder="Name is required, 1-20 characters!"

                                value={record?.categoryname}
                            />
                        </Form.Item>
                    </Modal>
                </Form>
            </>
        );
    }
}

const arePropsEqual = (prevProps, nextProps) => {
    return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(EditModal, arePropsEqual);


