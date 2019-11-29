import React from "react";
import {connect} from 'react-redux'
import {action} from "src/reducers/admin";
import {withRouter} from "react-router";

interface props {
    updateCurrentMenu(data)
    location:object
}

class Container extends React.Component<props> {
    constructor(props) {
        super(props)
        this.props.updateCurrentMenu(this.props.location['pathname'])
    }

    render() {
        return this.props.children
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateCurrentMenu: (data) => {
            dispatch(action.currentMenu(data))
        }
    }
}

export default withRouter(connect(null,mapDispatchToProps)(Container))