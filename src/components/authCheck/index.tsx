import React from 'react';
import {connect} from 'react-redux'

interface props {
    action: string
    without?: string
    request: object[]
}

class AuthCheck extends React.Component<props> {

    static defaultProps = {
        without: "",
    }

    render() {
        let is = false
        this.props.request.forEach(item => {
            if (item['action'] === this.props.action) {
                is = true
            }
        })
        if (is) {
            return this.props.children
        }
        return this.props.without
    }
}

const mapStateToProps = (state) => {
    return {
        request: state.admin.request
    };
}

export default connect(mapStateToProps)(AuthCheck)
