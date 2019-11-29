import React from 'react';
import Main from "src/layouts/main"
import Login from "src/layouts/login"
import request from "src/utils/request"
import {getToken} from "src/utils/helper"
import {action} from "./reducers/admin";
import {connect} from 'react-redux'
import { message } from 'antd';

interface props {
    initialize(data)

    logout()

    user: object
    isLogin: boolean
}

class App extends React.Component<props> {
    componentDidMount() {
        if (getToken()){
            return request("/load").success(response => {
                this.props.initialize(response.data)
            }).error(() => this.props.logout()).complete(() => {
                this.removeLoading()
            }).get()
        }
        this.removeLoading()
        console.log("123123123")
        message.info('注意:服务端每个小时会自动重置数据库,重置后需要重新登录',3600);
    }

    removeLoading(){
        // @ts-ignore
        document.querySelector("#loading").remove();
    }

    render() {
        return <div>{this.props.isLogin ? <Main/> : <Login/>}</div>
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.admin.user,
        isLogin: !!state.admin.user.id,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        initialize: (data) => {
            dispatch(action.all(data))
        },
        logout() {
            dispatch(action.user())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
