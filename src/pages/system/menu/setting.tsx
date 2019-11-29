import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Form, Input} from "antd";
import IconSelect from "./iconSelect"

interface props extends FormComponentProps {
    default: object
}

interface state {
    icon: string
}

class Setting extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            icon: this.props.default["icon"] || ""
        }
    }

    getFieldsValue() {
        return {...this.props.form.getFieldsValue(), icon: this.state.icon}
    }


    updateIcon(icon) {
        this.setState({icon})
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
                <Form.Item label="父菜单ID">
                    {
                        getFieldDecorator(
                            'parent_id', {rules: [{required: true}],initialValue: this.props.default['parent_id']}
                        )(<Input/>)
                    }
                </Form.Item>
                <Form.Item label="链接">
                    {
                        getFieldDecorator(
                            'url', {initialValue: this.props.default['url']}
                        )(<Input placeholder="页面型菜单链接不能为空，目录型菜单链接要置空"/>)
                    }
                </Form.Item>
                <Form.Item label="图标">
                    <IconSelect icon={this.state.icon} update={this.updateIcon.bind(this)}/>
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

export default Form.create<props>()(Setting)
