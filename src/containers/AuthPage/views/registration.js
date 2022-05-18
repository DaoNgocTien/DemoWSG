import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Button, Form, Input, Space, Tag, Tooltip} from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import action from "../modules/action";

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

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
class Registration extends Component {
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
        phone: ""
    };
    formRef = React.createRef();
    phoneRef = React.createRef();
    OTPRef = React.createRef();

    onFinish = (values) => {
        let record = {
            username: values.username,
            password: values.password,
            firstName: values.firstname,
            lastName: values.lastname,
            phone: values.phone,
            email: values.email,
            roleName: "Supplier"
        };
        this.props.registration(record, this.props.history);
    };

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
        // 2. Read from response and show file link
        fileList = fileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
                file.name = file.response.name;
                file.thumbUrl = null;
            }
            return file;
        });

        this.setState({ fileList });
    };

    render() {
        const { load, imageUrl, checkedProfile, OTPMessage, phoneAvailable } = this.state;
        const uploadButton = (
            <div>
                {load ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        const { loading, profile, phone, OTP, message } = this.props;
        return (
            <>
                <div className="main_form_body">
                    <div className="form__wrapper">
                        <div className="registration_form__container">
                            <h2 style={{ textAlign: "center" }}>REGISTRATION</h2>
                            <Form
                                {...formItemLayout}
                                name="registrationForm"
                                onFinish={this.onFinish}
                                initialValues={{
                                    residence: ['zhejiang', 'hangzhou', 'xihu'],
                                    prefix: '+084',
                                }}
                                scrollToFirstError
                            >
                                <Form.Item
                                    name="phone"
                                    label="Phone Number"
                                    hasFeedback
                                    tooltip={"Phone number is unique!"}
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!Number(value) < 0) {
                                                    return Promise.reject(new Error(`Number only`));
                                                }
                                                if ((value + "").length > 11 || (value + "").length < 10) {
                                                    return Promise.reject(new Error(`Phone number is between 10-11 characters`));
                                                }
                                                return Promise.resolve();

                                            },
                                        }),
                                    ]}  >
                                    <Input
                                        type="number"
                                        addonBefore="+84"
                                        ref={this.phoneRef}
                                        style={{ width: "100%" }}
                                        placeholder="10-11 characters"
                                    />

                                </Form.Item>
                                {this.props.error}

                                <Form.Item
                                    name="username"
                                    label="Username"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (value.length > 0 && value.length <= 50) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(new Error('Username is required, length is 1-50 characters!'));
                                            },
                                        }),
                                    ]}
                                    hasFeedback
                                    disabled={!phoneAvailable}

                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {

                                                if (value.length > 0 && value.length <= 50) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(new Error('Password is required, length is 1-50 characters!'));
                                            },
                                        }),
                                    ]}

                                    hasFeedback
                                    disabled={!phoneAvailable}

                                >
                                    <Input.Password placeholder="1-50 characters" />
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
                                    disabled={!phoneAvailable}

                                >
                                    <Input.Password placeholder="1-50 characters" />
                                </Form.Item>

                                <Form.Item
                                    name="firstname"
                                    label="Firstname"
                                    tooltip="What is your firstname?"
                                    rules={[{ required: true, message: 'Please input your firstname!', whitespace: true }]}
                                    disabled={!phoneAvailable}

                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="lastname"
                                    label="Lastname"
                                    tooltip="What is your lastname?"
                                    rules={[{ required: true, message: 'Please input your lastname!', whitespace: true }]}
                                    disabled={!phoneAvailable}

                                >
                                    <Input />
                                </Form.Item>


                                <Form.Item
                                    name="role"
                                    label="Role"
                                    tooltip="User's role in WSG System"
                                    disabled={!phoneAvailable}

                                >
                                    <Tooltip placement="topLeft" title="Suppliers are those who use the WSG System and website to process their business. Their main role is to cooperate with the WSG system to do business">
                                        <Tag color="blue">Supplier</Tag>
                                    </Tooltip>

                                </Form.Item>

                                <Form.Item
                                    name="loggingMethod"
                                    label="Logging method"
                                    tooltip="User's logging method in WSG System"
                                    disabled={!phoneAvailable}

                                >
                                    <Tooltip placement="topLeft" title="Logging by username / Logging by Google Mail">
                                        <Tag color="red">Username and password</Tag>
                                    </Tooltip>

                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="E-mail"
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'The input is not valid E-mail!',
                                        },
                                        {
                                            required: true,
                                            message: 'Please input your E-mail!',
                                        },
                                    ]}
                                    disabled={!phoneAvailable}

                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item {...tailFormItemLayout} disabled={!phoneAvailable}
                                >
                                    <Space>
                                        <Button htmlType="submit">
                                            <Link
                                                className="LinkDecorations"
                                                to={"/"}
                                            >
                                                Back
                                            </Link>
                                        </Button>
                                        <Button type="primary" htmlType="submit">
                                            Register
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </>
        );

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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (user, history) => {
            dispatch(action.actLoginApi(user, history));
        },
        googleOAuth2: (googleResponse) => {
            dispatch(action.googleOAuth2(googleResponse));
        },

        phoneNumberValidation: async phone => {
            await dispatch(action.phoneNumberValidation(phone));
        },

        checkPhoneNumber: async phone => {
            await dispatch(action.checkPhoneNumber(phone));
        },

        registration: async (data, history) => {
            await dispatch(action.registration(data));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
