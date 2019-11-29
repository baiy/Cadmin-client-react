import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Form, Input} from "antd";

interface props extends FormComponentProps {
    default: object
}

class UserSetting extends React.Component<props> {
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form labelCol={{span: 4}} wrapperCol={{span: 20}}>
                <Form.Item label="用户名">
                    {
                        getFieldDecorator(
                            'username', {rules: [{required: true}], initialValue: this.props.default['username']}
                        )(<Input/>)
                    }
                </Form.Item>
                <Form.Item label="密码">
                    {
                        getFieldDecorator('password')(<Input type="password"/>)
                    }
                </Form.Item>
                <Form.Item label="重复密码">
                    {
                        getFieldDecorator('repeatPassword')(<Input type="password"/>)
                    }
                </Form.Item>
            </Form>
        )
    }
}

export default UserSetting
