import React from 'react';
import {connect} from 'react-redux'
import {clearToken} from 'src/utils/helper'
import {Layout, Icon, Breadcrumb, Dropdown, Menu, Button} from 'antd';
import {action} from "src/reducers/admin";
import modalForm from "src/components/modalForm";
import UserSetting from "./userSetting";
import request from "../../utils/request";

interface props {
    user: object
    currentMenus: object[]
    collapsed: boolean

    toggle(collapsed)

    initialize(data)

    logout()
}

class Header extends React.Component<props> {
    menu() {
        return (
            <Menu>
                <Menu.Item key="0">
                    <Button type="link" onClick={this.userSetting.bind(this)}>个人设置</Button>
                </Menu.Item>
                <Menu.Item key="1">
                    <Button type="link" onClick={this.logout.bind(this)}>退出</Button>
                </Menu.Item>
            </Menu>
        )
    }

    userSetting() {
        modalForm(
            "/current/user/setting",
            UserSetting,
            {
                default: this.props.user
            },
            {
                title: "个人设置",
                onSuccess: () => {
                    return request("/load").success(response => {
                        this.props.initialize(response.data)
                    }).get()
                }
            }
        )
    }

    logout() {
        clearToken()
        this.props.logout()
    }

    render() {
        return (
            <Layout.Header style={{background: '#fff', padding: 0}}>
                <Icon
                    className="trigger"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.props.toggle}
                />
                <Breadcrumb style={{display: "inline-block"}}>
                    {this.props.currentMenus.map(item => {
                        return <Breadcrumb.Item key={item['id']}>{item['name']}</Breadcrumb.Item>
                    })}
                </Breadcrumb>
                <div style={{float: "right", marginRight: "12px"}}>
                    <Dropdown overlay={this.menu()}>
                        <Button type="link" className="ant-dropdown-link">{this.props.user['username']} <Icon
                            type="down"/></Button>
                    </Dropdown>
                </div>
            </Layout.Header>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.admin.user,
        currentMenus: state.admin.currentMenus,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            dispatch(action.logout())
        },
        initialize: (data) => {
            dispatch(action.all(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)