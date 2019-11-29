import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Form, Input, Select} from "antd";
import marked from 'marked'

interface props extends FormComponentProps {
    default: object
    requestType: []
}

class Setting extends React.Component<props> {
    currentTypeDescription () {
        let description = ""
        this.props.requestType.forEach((item)=>{
            if (item['type'] === this.props.form.getFieldValue('type')){
                description = marked(item["description"])
            }
        })
        return (
            description ? <Form.Item label="类型说明"><div dangerouslySetInnerHTML={{__html:description}} /></Form.Item> : ""
        )
    }
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
                <Form.Item label="ACTION">
                    {
                        getFieldDecorator(
                            'action', {rules: [{required: true}], initialValue: this.props.default['action']}
                        )(<Input/>)
                    }
                </Form.Item>
                <Form.Item label="类型">
                    {
                        getFieldDecorator('type', {initialValue: this.props.default['type']})(
                            <Select>
                                {
                                    this.props.requestType.map(
                                        item => (
                                            <Select.Option value={item['type']} key={item['type']}>{item['name']}</Select.Option>
                                        )
                                    )
                                }
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item label="类型配置">
                    {
                        getFieldDecorator(
                            'call', {initialValue: this.props.default['call']}
                        )(<Input.TextArea rows={4}/>)
                    }
                </Form.Item>
                {this.currentTypeDescription()}
            </Form>
        )
    }
}

export default Setting
