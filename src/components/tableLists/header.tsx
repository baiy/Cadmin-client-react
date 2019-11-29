import React from 'react';
import {Layout} from "antd";

interface props {
    right?: React.ReactNode
}

class Header extends React.PureComponent<props> {

    render() {
        let node:any[] = []
        if(this.props.children){
            node.push(
                <Layout.Content key="content">
                    {this.props.children}
                </Layout.Content>
            )
        }
        if(this.props.right){
            node.push(
                <Layout.Sider key="sider" style={{background: "#FFF",lineHeight:"40px",textAlign:"right"}}>
                    {this.props.right}
                </Layout.Sider>
            )
        }
        if (node.length > 0){
            return (
                <Layout style={{background: "#FFF",marginBottom:"10px"}}>{node}</Layout>
            )
        }
        return ""
    }
}

export default Header
