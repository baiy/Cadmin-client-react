import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Form} from 'antd';
import {FormComponentProps} from "antd/es/form";
import request from "src/utils/request";

interface props {
    action: string
    form: React.ComponentType
    formProps: object
    title: string
    width?:number
    okText?: string
    onClose: () => void
    onCancel: () => void
    onSuccess: (response) => void
    onFailure: (response) => void
}


class ModalBlock extends React.Component<props> {
    static defaultProps = {
        okText: "提交",
        width:600,
        onCancel: () => {
        },
        onSuccess: (response) => {
        },
        onFailure: (response) => {
        },
    }

    state = {visible:true}

    formRef: object | null = null

    constructor(props) {
        super(props)
        this.onOk = this.onOk.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.afterClose = this.afterClose.bind(this)
    }

    onOk() {
        if (this.formRef) {
            const {form} = this.formRef['props'];
            form.validateFields((err, values) => {
                if (!err) {
                    request(this.props.action).data(values).success((response) => {
                        this.props.onSuccess(response)
                        this.props.onClose()
                    }).error((response)=>{
                        this.props.onFailure(response)
                    }).post()
                }
            });
        }
    }

    onCancel() {
        this.setState({visible:false})
    }

    afterClose(){
        this.props.onClose()
    }

    render() {
        const F = Form.create()(this.props.form)
        return (
            <Modal
                width={this.props.width}
                visible={this.state.visible}
                title={this.props.title}
                okText={this.props.okText}
                onCancel={this.onCancel}
                onOk={this.onOk}
                afterClose={this.afterClose}
            >
                <F {...this.props.formProps} wrappedComponentRef={ref => this.formRef = ref}/>
            </Modal>
        )
    }
}

interface optionInterface {
    title: string
    width?:number
    okText?: string
    onCancel?: () => void  // 操作取消
    onSuccess?: (response) => void // 操作成功
    onFailure?: (response) => void // 操作失败
}

function render(props: any, node) {
    ReactDOM.render(<ModalBlock {...props} />, node);
}

function destroy(node) {
    const unmountResult = ReactDOM.unmountComponentAtNode(node);
    if (unmountResult && node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

export default function (action: string, form: React.ComponentType<FormComponentProps|any>, formProps: object, options: optionInterface) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const onClose = function () {
        destroy(div)
    }
    render({...options, action, form, formProps, onClose}, div)
}
