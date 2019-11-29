import React from 'react';
import {connect} from 'react-redux'

interface props {
    id: number
    default?: string
    user: object[]
}

class Username extends React.Component<props> {

    static defaultProps = {
        default: "未知用户",
    }

    render() {
        let username = this.props.default
        this.props.user.forEach(user => {
            if (user['id'] === this.props.id) {
                username = user['username']
            }
        })
        return (
            <span>{username}</span>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.admin.allUser,
    };
}

export default connect(mapStateToProps)(Username)
