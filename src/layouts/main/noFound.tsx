import React from "react";
import {connect} from 'react-redux'
import {withRouter} from "react-router";
import {action} from "src/reducers/admin";

interface props {
    location: object

    updateCurrentMenu(data)
}

class NoFound extends React.Component<props> {
    render() {
        this.props.updateCurrentMenu(this.props.location['pathname'])
        return (
            "未找到页面组件(" + this.props.location['pathname'] + ")"
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateCurrentMenu: (data) => {
            dispatch(action.currentMenu(data))
        }
    }
}

export default withRouter(connect(null, mapDispatchToProps)(NoFound))