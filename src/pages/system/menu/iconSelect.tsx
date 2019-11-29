import React from 'react';
import {Button, Drawer, Icon, Row, Col} from "antd";

import iconData from "./iconData"

interface props {
    icon: string

    update(icon)
}

interface state {
    iconSelectVisible: boolean
    icon: string
}

class IconSelect extends React.Component<props, state> {


    constructor(props) {
        super(props)
        this.state = {
            iconSelectVisible: false,
            icon: this.props.icon
        }
    }

    open() {
        this.setState({iconSelectVisible: true})
    }

    close = () => {
        this.setState({iconSelectVisible: false})
    };

    select(icon) {
        this.setState({icon}, () => {
            this.props.update(icon)
            this.close()
        })
    }

    render() {
        return (
            <div>
                <Drawer
                    width={800}
                    title="图标选择"
                    placement="left"
                    closable={true}
                    onClose={this.close.bind(this)}
                    visible={this.state.iconSelectVisible}
                >
                    <Row>
                        {iconData.map(item => {
                            return (
                                <Col span={4} key={item}>
                                    <div className="admin-menu-icon-select-item" onClick={() => this.select(item)}>
                                        <Icon type={item} style={{fontSize:"38px"}}/>
                                        <p>{item}</p>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                </Drawer>
                {
                    this.state.icon ? (
                            <span>
                                <Icon type={this.state.icon} style={{marginRight:"5px",fontSize:"14px"}}/>
                                <span>{this.state.icon}</span>
                            </span>
                        ) : ""
                }
                <Button size="default" onClick={this.open.bind(this)} style={{margin: "0 8px"}}>选择</Button>
            </div>
        )
    }
}

export default IconSelect
