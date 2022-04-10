import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Button, Col, DatePicker, Form, Input, InputNumber, Layout, Row, Select, Space, Tag, Tooltip, Typography, Modal
} from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import action from "../modules/action";
import { default as profileAction } from "../../../components/Profile/modules/action";


const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

const residences = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake',
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                    },
                ],
            },
        ],
    },
];
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

//  prototype
const propsProTypes = {
    closeModal: PropTypes.func,
    createCampaign: PropTypes.func,
    openModal: PropTypes.bool,
    productList: PropTypes.array,
};

//  default props
const propsDefault = {
    closeModal: () => { },
    createCampaign: () => { },
    openModal: false,
    productList: [],
};

class ForgotPassword extends Component {
    static propTypes = propsProTypes;
    static defaultProps = propsDefault;
    state = {
        previewVisible: false,
        previewImage: "",
        previewTitle: "",
        fileList: [],
        price: 0,
        autoCompleteResult: [],
        checkedProfile: {
            value: "",
            validateStatus: "",
            errorMsg: null,
        },
        phoneAvailable: false,
        OTPMessage: null,
        OPTHidden: false,
        OTPValue: "",
    };
    formRef = React.createRef();
    phoneRef = React.createRef();
    OTPRef = React.createRef();

    componentDidMount() {
    }

    onFinish = (values) => {
        // console.log('Received values of form: ', values);
        // let record = {
        //     username: values.username,
        //     password: values.password,
        //     firstName: values.firstname,
        //     lastName: values.lastname,
        //     phone: this.phoneRef.current.value,
        //     email: values.email,
        //     roleName: "Supplier"
        // };
        this.props.changePassword(this.props.profile.id, values.password);
        this.resetFields();
        // this.formRef.current.resetFields();
        // this.props.closeModal();
    };

    onCheckPhoneNumber = () => {
        const value = this.phoneRef.current.value;
        this.props.checkPhoneNumber(this.phoneRef.current.value);
        let profile = this.props.profile;
        return this.setState({
            checkedProfile: {
                validateStatus: profile === null ? "success" : "error",
                errorMsg: profile === null ? null : "Phone number exist",
            }
        });

    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    handleCancelUploadImage = () => this.setState({ previewVisible: false });

    handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url,
            previewVisible: true,
            previewTitle:
                file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
        });
    };

    handleChange = ({ fileList, file, event }) => {
        // fileList = fileList.slice(-2);
        // console.log(fileList);
        // 2. Read from response and show file link
        fileList = fileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response[0].url;
                file.name = file.response[0].name;
                file.thumbUrl = null;
            }
            return file;
        });

        this.setState({ fileList });
    };

    checkOTP = e => {
        this.setState({
            OTPValue: e.target.value,
        })
        const value = e.target.value;
        console.log(this.props.phone);
        console.log(this.phoneRef.current.value);
        console.log(this.props.OTP);

        if (value === this.props.OTP && this.phoneRef.current.value === this.props.phone) {
            this.setState({
                OPTHidden: true,
                OTPMessage: null,
            });
        }
        else {
            this.setState({
                phoneAvailable: false,
                OTPMessage: "OTP token is not correct!",
            });
        }
    }

    changePhoneNumber = () => {
        const value = this.phoneRef.current.value;
        this.props.phoneNumberValidation(this.phoneRef.current.value);

        if (this.OTPRef.current.value === this.props.OTP && this.phoneRef.current.value === this.props.phone) {
            this.setState({
                phoneAvailable: true,
                OTPMessage: null,
            });
        }
        else {
            this.setState({
                phoneAvailable: false,
                OTPMessage: "OTP token is not correct!",
            });
        }
    }

    handleEditAndClose = (data) => {
        this.formRef.current.resetFields();
        this.props.closeModal();
    };

    handleCancel = () => {
        this.formRef.current.resetFields();
        this.props.closeModal();
    };
    resetFields = () => {
        this.setState({
            OPTHidden: null,
            OTPMessage: null,
            OTPValue: ""
        });
        this.OTPRef.current.value = "";
        this.props.resetFields();
    }
    render() {
        const { load, imageUrl, checkedProfile, OTPMessage, phoneAvailable } = this.state;
        const uploadButton = (
            <div>
                {load ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        const { loading, profile, phone, OTP, message, openModal, changePasswordMessage } = this.props;
        console.log(this.props);
        // if (loading) return <Loader />;
        return (
            <>


                <Form
                    {...formItemLayout}
                    // form={form}
                    name="forgotPasswordForm"
                    onFinish={this.onFinish}
                    initialValues={{
                        residence: ['zhejiang', 'hangzhou', 'xihu'],
                        prefix: '+084',
                    }}
                    scrollToFirstError
                    ref={this.formRef}
                >


                    <Modal
                        title="Forgor your password"
                        visible={openModal}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button onClick={this.handleCancel}>Cancel</Button>,
                            <Button type="primary" onClick={() => this.resetFields()}>Reset Fields</Button>,
                            <Button
                                type="primary"
                                form="forgotPasswordForm"
                                key="submit"
                                htmlType="submit"
                            >
                                Submit
                            </Button>,
                        ]}
                    >
                        <Title type="success" style={{ textAlign: "center", }} level={3}> {changePasswordMessage ? `${changePasswordMessage}` : ""}</Title>

                        {/* <Form.Item {...tailFormItemLayout}>
                                    <Button type="primary" onClick={this.onCheckPhoneNumber}>
                                        Change
                                    </Button>

                                </Form.Item>

                                <Form.Item {...tailFormItemLayout}>


                                </Form.Item> */}
                        <Form.Item label="Phone Number">
                            <Row >
                                <Col flex={4}>
                                    <Form.Item
                                        name="phone"
                                        initialValue={phone}
                                        validateStatus={message === null ? "success" : "error"}
                                        help={message === null ? "We make sure phone number is available!" : message}
                                    >
                                        <InputNumber
                                            disabled={phone}
                                            onChange={this.changePhoneNumber}
                                            ref={this.phoneRef}
                                            style={{ width: "41.5vh" }}
                                            placeholder="10-11 characters"
                                        />

                                    </Form.Item>
                                </Col>
                                <Col flex={2}>
                                    <Button type="primary" onClick={this.onCheckPhoneNumber} disabled={phone}>
                                        Send OTP
                                    </Button>
                                </Col>
                            </Row>

                        </Form.Item>

                        <Form.Item
                            label="OTP"
                            validateStatus={OTPMessage === null ? "success" : "error"}
                            help={OTPMessage === null ? "Correct OTP Token will let you fill the rest of registration form!" : OTPMessage}
                            disabled={phone === null || OTP === null}
                            hidden={this.state.OPTHidden}

                        >
                            <Input
                                onChange={e => this.checkOTP(e)}
                                ref={this.OTPRef}
                            />

                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                            hasFeedback
                            hidden={!this.state.OPTHidden}

                        >
                            <Input.Password placeholder="1-255 characters" />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
                            ]}
                            hidden={!this.state.OPTHidden}

                        >
                            <Input.Password placeholder="1-255 characters" />
                        </Form.Item>
                        {/* <Form.Item {...tailFormItemLayout} disabled={!phoneAvailable}
                        >
                            <Space>
                                <Button htmlType="submit">
                                    Reset
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Register
                                </Button>
                            </Space>
                        </Form.Item> */}
                    </Modal>
                </Form>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.authReducer.loading,
        error: state.authReducer.err,
        profile: state.authReducer.profile,
        phone: state.authReducer.phone,
        OTP: state.authReducer.OTP,
        message: state.authReducer.message,
        changePasswordMessage: state.profileReducer.data.changePasswordMessage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (user, history) => {
            dispatch(action.actLoginApi(user, history));
        },
        resetFields: () => {
            dispatch(action.resetFields());
        },

        phoneNumberValidation: async phone => {
            await dispatch(action.phoneNumberValidation(phone));
        },

        checkPhoneNumber: async phone => {
            await dispatch(action.checkPhoneNumberForgotPassword(phone));
        },

        registration: async (data, history) => {
            await dispatch(action.registration(data));
            await dispatch(action.actLoginApi({ username: data.username, password: data.password }, history));
        },

        changePassword: async (id, password) => {
            await dispatch(profileAction.changePassword(id, password));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);