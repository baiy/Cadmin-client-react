import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Form, Input} from "antd";

interface props extends FormComponentProps {
    default: object
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
                <Form.Item label="名称">
                    {
                        getFieldDecorator(
                            'name', {rules: [{required: true}], initialValue: this.props.default['name']}
                        )(<Input/>)
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
