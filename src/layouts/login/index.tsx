import React from 'react';
import {Form, Icon, Input, Button, Card, Row, Col} from 'antd';
import {FormComponentProps} from 'antd/es/form';
import request from "src/utils/request"
import {setToken,setTitle} from "src/utils/helper"
import {action} from "src/reducers/admin";
import {connect} from 'react-redux'

interface props extends FormComponentProps {
    initialize(data)
}

class Login extends React.Component<props> {

    constructor(props){
        super(props)
        setTitle("登录")
    }

    handleSubmit (e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                request("/login").data(values).success((response) => {
                    setToken(response.data.token)
                    return request("/load").success(response => {
                        this.props.initialize(response.data)
                    }).get()
                }).post()
            }
        });
    };

    form() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit.bind(this)}>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: '请输入用户名'}],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="用户名"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入密码'}],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="密码"
                        />,
                    )}
                </Form.Item>
                <Form.Item style={{marginBottom:0}}>
                    <Button type="primary" htmlType="submit" block>登录</Button>
                </Form.Item>
            </Form>
        );
    }

    render() {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: "0",
                    left: "0",
                    background: "url(//gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg) #f0f2f5 no-repeat center 110px",
                    backgroundSize: "100%",
                }}>
                <Row type="flex" justify="center">
                    <Col span={6}>
                        <div style={{marginTop: "150px"}}>
                            <Card title="用户登录">
                                {this.form()}
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        initialize: (data) => {
            dispatch(action.all(data))
        }
    }
}

export default connect(null, mapDispatchToProps)(Form.create({name: 'login'})(Login));
