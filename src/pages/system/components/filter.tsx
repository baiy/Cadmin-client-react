import React from 'react';
import {Form, Input} from "antd";
import {FormComponentProps} from "antd/es/form";
import {filterInterface} from "src/components/tableLists";

interface props extends FormComponentProps {
    hidden?:{name:string,value:any}[]
}

class Filter extends React.Component<props> implements filterInterface {
    state = {
        keyword: "",
    }

    getFieldsValue() {
        return this.props.form.getFieldsValue()
    }

    hidden(){
        if (this.props.hidden){
            return this.props.hidden.map(({name,value})=>(
                this.props.form.getFieldDecorator(name, {initialValue: value})(<Input type="hidden" key={name}/>)
            ))
        }
        return ""
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form layout="inline" style={{display: "inline-block"}}>
                {this.hidden()}
                <Form.Item>
                    {getFieldDecorator('keyword', {initialValue: this.state.keyword})(
                        <Input placeholder="搜索关键字"/>
                    )}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create<props>()(Filter)
