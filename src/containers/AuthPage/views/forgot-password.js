import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Button, Col, Form, Input, Modal, Row, Typography
} from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { default as profileAction } from "../../../components/Profile/modules/action";
import action from "../modules/action";

const { Title } = Typography;
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

class ForgotPassword extends Component {
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

    onFinish = (values) => {
        this.props.changePassword(this.props.profile.id, values.password);
        this.resetFields();
    };

    onCheckPhoneNumber = () => {
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

    handleChange = ({ fileList }) => {
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

    checkOTP = e => {
        this.setState({
            OTPValue: e.target.value,
        })
        const value = e.target.value;

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

    handleEditAndClose = () => {
        this.formRef.current.resetFields();
        this.props.closeModal();
    };

    handleCancel = () => {
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
        const { load, OTPMessage } = this.state;
        const { phone, OTP, message, openModal, changePasswordMessage } = this.props;
        return (
            <>


                <Form
                    {...formItemLayout}
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

                        <Form.Item label="Phone Number">
                            <Row >
                                <Col flex={4}>
                                    <Form.Item
                                        name="phone"
                                        initialValue={phone}
                                        validateStatus={message === null ? "success" : "error"}
                                        help={message === null ? "We make sure phone number is available!" : message}

                                    >
                                        <Input
                                            type="number"
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
