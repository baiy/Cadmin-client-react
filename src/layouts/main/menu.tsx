import React from 'react';
import {menuSort} from "src/utils/helper";
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Menu as MenuBlock, Icon} from 'antd';

interface props {
    menu: object[]
    currentMenu:object,
    currentMenus:object[]
}

class Menu extends React.Component<props> {
    render() {
        return (
            <MenuBlock
                theme="dark"
                mode="inline"
                defaultOpenKeys={
                    this.props.currentMenus.map((item)=>{
                        return item['id'].toString()
                    })
                }
                defaultSelectedKeys={
                    this.props.currentMenu['id'] ? [this.props.currentMenu['id'].toString()] : []
                }
            >
                {this.lists(0)}
            </MenuBlock>
        )
    }

    lists(parentId: number) {
        let menu: React.ReactNode[] = []
        for (let i in this.props.menu) {
            const item = this.props.menu[i]
            if (parentId === item["parent_id"]) {
                if (!item['url']) {
                    menu.push(
                        <MenuBlock.SubMenu
                            title={
                                <span>
                                    <Icon type={item['icon'] ? item['icon'] : "unordered-list"}/>
                                    <span>{item['name']}</span>
                                </span>
                            }
                            key={item['id']}
                        >
                            {this.lists(item['id'])}
                        </MenuBlock.SubMenu>
                    )
                } else {
                    menu.push(
                        <MenuBlock.Item key={item['id']}>
                                <Link style={{color: "inherit"}} to={item['url']}>
                                    <Icon type={item['icon'] ? item['icon'] : "unordered-list"}/>
                                    {item['name']}
                                </Link>
                        </MenuBlock.Item>
                    )
                }
            }
        }
        return menu
    }
}

const mapStateToProps = (state) => {
    return {
        menu: menuSort(state.admin.menu),
        currentMenu: state.admin.currentMenu,
        currentMenus: state.admin.currentMenus,
    };
}

export default connect(mapStateToProps)(Menu)