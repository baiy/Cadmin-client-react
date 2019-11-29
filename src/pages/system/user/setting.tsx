import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Form, Input, Select} from "antd";

interface props extends FormComponentProps {
    default: object
    userStatus: []
}

class Setting extends React.Component<props> {
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form labelCol={{span: 4}} wrapperCol={{span: 20}}>
                {
                    this.props.default['id'] ?
                        getFieldDecorator('id', {initialValue: this.props.default['id']})(<Input type="hidden"/>)
                        : ""
                }
                <Form.Item label="用户名">
                    {
                        getFieldDecorator(
                            'username', {rules: [{required: true}], initialValue: this.props.default['username']}
                        )(<Input/>)
                    }
                </Form.Item>
                <Form.Item label="密码">
                    {
                        getFieldDecorator('password')(<Input/>)
                    }
                </Form.Item>
                <Form.Item label="类型">
                    {
                        getFieldDecorator('status', {initialValue: this.props.default['status']})(
                            <Select>
                                {
                                    this.props.userStatus.map(
                                        item => (
                                            <Select.Option value={item['v']} key={item['v']}>{item['n']}</Select.Option>
                                        )
                                    )
                                }
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item label="描述">
                    {
                        getFieldDecorator(
                            'description', {initialValue: this.props.default['description']}
                        )(<Input.TextArea rows={4}/>)
                    }
                </Form.Item>
            </Form>
        )
    }
}

export default Setting
