import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {Layout} from 'antd';
import "./style.css"
import {config} from "src/utils/helper";
import Menu from './menu';
import Header from './header';
import Content from './content';
import {action} from "src/reducers/admin";

const {Sider} = Layout;

interface props {
    updateCurrentMenu(data)

    location: object
}

class Main extends React.Component<props> {
    state = {
        collapsed: false,
    };

    constructor(props) {
        super(props)
        this.props.updateCurrentMenu(this.props.location['pathname'])
    }

    toggle() {
        this.setState({collapsed: !this.state.collapsed});
    };

    render() {
        return (
            <div className="admin-system-layout">
                <Layout style={{minHeight: "100vh"}}>
                    <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                        <div className="logo">
                            <Link to="/" style={{
                                display: "block",
                                textAlign: "center",
                                lineHeight: "32px",
                                color: "white",
                                fontWeight: 500,
                            }}>{config("SITE_NAME")}</Link>
                        </div>
                        <Menu/>
                    </Sider>
                    <Layout>
                        <Header collapsed={this.state.collapsed} toggle={this.toggle.bind(this)}/>
                        <Content/>
                    </Layout>
                </Layout>
            </div>
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

export default withRouter(connect(null, mapDispatchToProps)(Main))
