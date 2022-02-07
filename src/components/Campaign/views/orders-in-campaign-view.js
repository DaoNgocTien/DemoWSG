import React, { Component, memo } from "react";
import moment from "moment";
import { Table, Button, Input, Row, Col, Space, PageHeader, Statistic, Descriptions, Divider, Form, InputNumber, Select, DatePicker } from "antd";

const { RangePicker } = DatePicker;
class OrdersInCampaign extends React.Component {
    state = {
        loading: false,
        selectedRowKeys: [], // Check here to configure the default column
        loadingActionButton: false,
        deleteButton: false,
        openDeleteModal: false,
        displayData: [],
        searchKey: "",
    };

    onSelectChange = (selectedRowKeys) => {
        console.log("selectedRowKeys changed: ", selectedRowKeys);
        console.log(this.props.orderList);
        let record = this.props.orderList.filter((item) => {
            return selectedRowKeys.includes(item.id);
        })[0];
        console.log(record);
        // this.setState({
        //   record: this.props.data.filter((item) => {
        //     return selectedRowKeys.includes(item.id);
        //   })[0]
        // });
        // console.log(this.state.record);
        this.setState({
            selectedRowKeys,
            record: record,
            deleteButton: selectedRowKeys.length >= 1,
        });
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
            fixed: "left",
        },

        {
            title: "Name",
            dataIndex: "categoryname",
            key: "categoryname",
            sorter: (a, b) => a.categoryname.length - b.categoryname.length,
            fix: "left",
        },

        {
            title: "Created At",
            dataIndex: "createdat",
            key: "createdat",
            sorter: (a, b) => a.createdat.length - b.createdat.length,
            render: (data) => moment(data).format("DD-MM-YYYY"),
            // render: (text, record) => {
            //   return new Date(record.createdat).toString().slice(0, 24);
            // },
        },

        {
            title: "Updated At",
            dataIndex: "updatedat",
            key: "updatedat",
            sorter: (a, b) => a.updatedat.length - b.updatedat.length,
            render: (data) => moment(data).format("DD-MM-YYYY"),
        },
    ];

    onChangeHandler = (e) => {
        let { data } = this.props;
        let searchList = data.filter(item => {
            return item.categoryname.includes(e.target.value)
                || item.createdat.includes(e.target.value)
                || item.updatedat.includes(e.target.value);
        });
        this.setState({
            displayData: searchList,
            searchData: e.target.value,
        })
    }

    render() {
        const {
            selectedRowKeys,
            deleteButton,
            displayData,
            searchData,
        } = this.state;

        const { record, orderList, loading } = this.props;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        // const hasSelected = selectedRowKeys.length > 0;

        const arr = (window.location.pathname).split("/");

        let productList = [];
        let productSelected = {};
        let price = 0;
        return (
            <> <Form>
                <Descriptions
                    bordered
                    title="Campaign information"
                    column={2}
                >

                    <Descriptions.Item label="Campaign duration">
                        <Form.Item name="date">
                            <RangePicker
                            disabled={true}
                                ranges={{
                                    Today: [moment(), moment()],
                                    'This Week': [moment().startOf('week'), moment().endOf('week')],
                                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                                }}
                                onChange={this.onChange}
                            />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Product">
                        <Form.Item
                            name="productId"
                            initialValues={{ value: productList[0] ? productList[0].name : "" }}
                        >
                            <Select
                            disabled={true}
                                onChange={this.onSelectProduct}
                            >
                                {productList.map((item) => {
                                    console.log("Product in create campaign: ");
                                    console.log(item);
                                    return <Select.Option key={item.key} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Quantity">
                        <Form.Item name="quantity">
                            <InputNumber disabled={true} addonAfter=" products" defaultValue={1} />
                        </Form.Item>
                    </Descriptions.Item>

                    <Descriptions.Item label="Wholesale percent">
                        <Form.Item name="wholesalePercent">
                            <InputNumber disabled={true} addonAfter=" %" defaultValue={1} onChange={this.onChangePrice} />
                        </Form.Item>
                    </Descriptions.Item>

                </Descriptions>
                <Divider />
                <Descriptions
                    bordered
                    title="Product in campaign"
                    column={2}
                >
                    <Descriptions.Item label="Name">{productSelected.name ?? ""}</Descriptions.Item>
                    <Descriptions.Item label="Category">{productSelected.categoryname ?? ""}</Descriptions.Item>
                    <Descriptions.Item label="Quantity in stock">{productSelected.quantity ?? ""}</Descriptions.Item>
                    <Descriptions.Item label="Quantity in campaign">{productSelected.name ?? ""}</Descriptions.Item>
                    <Descriptions.Item label="Retail price">{productSelected.price ?? ""}</Descriptions.Item>
                    <Descriptions.Item label="Wholesale price">{price ?? ""}</Descriptions.Item>
                    <Descriptions.Item label="Description">
                        Data disk type: MongoDB
                        <br />
                        Database version: 3.4
                        <br />
                        Package: dds.mongo.mid
                        <br />
                        Storage space: 10 GB
                        <br />
                        Replication factor: 3
                        <br />
                        Region: East China 1<br />
                    </Descriptions.Item>
                    <Descriptions.Item label="Image">
                        <img
                            alt="example"
                            style={{ width: "100%" }}
                            src={productSelected.previewImage}
                        />
                    </Descriptions.Item>
                </Descriptions>
                <Divider />
            </Form>
                <PageHeader
                    className="site-page-header-responsive"
                    // onBack={() => window.history.back()}
                    title={`Quantity: ${orderList.length} orders`}
                    // subTitle={record.name?? "Campaign name"}
                    footer={
                        <div>
                            <div style={{ marginBottom: 16 }}>
                                <Row>
                                    <Col flex="auto">
                                        <Space size={3}>

                                            <Button
                                                type="danger"
                                                onClick={() => this.start("openDeleteModal")}
                                                hidden={!deleteButton}
                                                style={{ width: 90 }}
                                            >
                                                Delete
                                            </Button>
                                            <span style={{ marginLeft: 8 }}>
                                                {selectedRowKeys.length > 0
                                                    ? `Selected ${selectedRowKeys.length} items`
                                                    : ""}
                                            </span>
                                        </Space>
                                    </Col>
                                    <Col flex="300px">
                                        <Input
                                            onChange={(e) => this.onChangeHandler(e)}
                                            placeholder="Search data"
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <Table
                                loading={loading}
                                rowSelection={rowSelection}
                                columns={this.columns}
                                dataSource={displayData.length === 0 && searchData === '' ? orderList : displayData}
                                scroll={{ y: 350 }}
                            />
                        </div>
                    }
                >
                </PageHeader>
            </>
        );
    }
}

const arePropsEqual = (prevProps, nextProps) => {
    return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default OrdersInCampaign;