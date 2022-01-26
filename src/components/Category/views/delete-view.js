import React, { Component, memo } from "react";
import {
    Modal,
    Button,
    Form,
    Input,
    Table,
    Popconfirm,
} from "antd";
import PropTypes from "prop-types";

//  prototype
const propsProTypes = {
    data: PropTypes.array,
    selectedRowKeys: PropTypes.array,
    closeModal: PropTypes.func,
    deleteCategory: PropTypes.func,
    defaultCategory: PropTypes.object,
    openModal: PropTypes.bool,
};

//  default props
const propsDefault = {
    data: [],
    selectedRowKeys: [],
    closeModal: () => { },
    deleteCategory: () => { },
    defaultCategory: {
        key: "b95685d6-e12e-4ea0-8fdf-47ec84af6912",
        id: "b95685d6-e12e-4ea0-8fdf-47ec84af6912",
        categoryname: "Ipad",
        supplierid: "99ba5ad1-612c-493f-8cdb-2c2af92ae95a",
        isdeleted: false,
        createdat: "2022-01-23T12:03:11.309Z",
        updatedat: "2022-01-23T12:03:11.309Z"
    },
    openModal: false,
};

class DeleteModal extends Component {
    static propTypes = propsProTypes;
    static defaultProps = propsDefault;

    componentDidMount() {
        console.log("DeleteModal");
        console.log(this.props);
    }

    handleDelete = () => {
        (this.props.selectedRowKeys).map(item => {
            console.log(item);
            this.props.deleteCategory(item);
        })
        this.props.closeModal();
    };

    handleCancel = () => {
        this.props.closeModal();
    };


    columns = [
        {
            title: "No.",
            dataIndex: "No.",
            key: "No.",
            render: (text, object, index) => {
                return index + 1;
            },
            width: 100,
            fixed: 'left',
        },

        {
            title: "Name",
            dataIndex: "categoryname",
            key: "categoryname",
            sorter: (a, b) => a.categoryname.length - b.categoryname.length,
            fix: "left"
        },

        {
            title: "Created Date",
            dataIndex: "createdat",
            key: "createdat",
            sorter: (a, b) => a.createdat.length - b.createdat.length,
            render: (text, record) => {
                return ((new Date(record.createdat)).toString()).slice(0, 24);
            }
        },

        {
            title: "Updated Date",
            dataIndex: "updatedat",
            key: "updatedat",
            sorter: (a, b) => a.updatedat.length - b.updatedat.length,
            render: (text, record) => {
                return ((new Date(record.updatedat)).toString()).slice(0, 24);
            }
        },
    ];

    render() {
        const { openModal, selectedRowKeys } = this.props;
        return (
            <>

                <Form id="deleteForm" onFinish={this.handleDelete}>
                    <Modal
                        width={window.innerWidth * 0.7}
                        heigh={window.innerHeight * 0.5}
                        style={{
                            top: 10,
                        }}
                        title={`Records to be deleted: ${selectedRowKeys.length} items`}
                        visible={openModal}
                        // onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button onClick={this.handleCancel}>Cancel</Button>,
                            <Button
                                type="primary"
                                form="deleteForm"
                                key="submit"
                                htmlType="submit"
                            >
                                Submit
                            </Button>,
                        ]}
                    >
                        { }
                        <Table
                            columns={this.columns}
                            dataSource={(this.props.data).filter(item => { return selectedRowKeys.includes(item.id) })}
                            scroll={{ y: 350 }} />
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
export default memo(DeleteModal, arePropsEqual);


