import React from 'react';
import {Button, Modal, Card, Row, Col, notification, Tree, Icon} from "antd"
import request from "src/utils/request";
import Setting from "./setting";
import "./style.css"
import {menuSort} from "src/utils/helper";

const {TreeNode} = Tree;

class Menu extends React.Component {
    state = {
        menu: {},
        menuIdsTree: [],
        current: {}
    }

    settingRef: any = null

    componentDidMount() {
        this.load()
    }

    load() {
        request('/system/menu/lists').success(({data}) => {
            this.setState({
                menu: (() => {
                    let menu = {}
                    data.forEach((item) => {
                        item['id'] = parseInt(item['id'], 10)
                        menu[item['id']] = item
                    })
                    return menu
                })(),
                menuIdsTree: menuSort(data).map(({id}) => parseInt(id, 10))
            })
        }).get()
    }

    add(parent_id = 0) {
        this.set({parent_id})
    }

    edit(id) {
        this.set(this.state.menu[id])
    }

    set(current) {
        if (Object.keys(this.state.current).length > 0) {
            return notification.error({message: '请先保存或放弃当前编辑/添加的菜单'})
        }
        this.setState({current})
    }

    remove(id) {
        Modal.confirm({
            title: '确认要删除[' + this.state.menu[id]['name'] + ']?',
            onOk: () => {
                request("/system/menu/remove").data({id: id}).showSuccessTip().success(() => {
                    this.load()
                }).get()
            }
        })
    }

    sort(id, op) {
        let brother = this.brother(id)
        let location = this.location(id)
        if (brother.length < 2 || (location.type === "head" && op === "up") || (location.type === "last" && op === "down")) {
            return notification.error({message: '无法执行排序'})
        }

        let newLists: any[] = [...brother]
        newLists[location.index] = newLists[(op === "up" ? location.index - 1 : location.index + 1)]
        newLists[(op === "up" ? location.index - 1 : location.index + 1)] = id

        request("/system/menu/sort").data(
            {
                menus: newLists.map(
                    (id, sort) => {
                        return {id, sort}
                    }
                )
            }
        ).showSuccessTip().success(() => {
            this.load()
        }).post()
    }

    cancel() {
        Modal.confirm({
            title: '确认要取消添加/编辑?',
            onOk: () => {
                this.close()
            }
        })
    }

    save() {
        request("/system/menu/save").data(this.settingRef.getFieldsValue()).showSuccessTip().success(() => {
            this.load()
            this.close()
        }).post()
    }

    close() {
        this.setState({current: {}})
    }


    setting() {
        if (Object.keys(this.state.current).length > 0) {
            return (
                <Card
                    size="small"
                    title={this.state.current['id'] ? "添加" : "编辑"}
                    extra={
                        <div>
                            <Button type="danger" size="small"
                                    onClick={this.cancel.bind(this)} style={{marginRight: "10px"}}>放弃</Button>
                            <Button type="primary" size="small"
                                    onClick={this.save.bind(this)}>保存</Button>
                        </div>
                    }
                >
                    <Setting default={this.state.current} wrappedComponentRef={ref => this.settingRef = ref}/>
                </Card>
            )
        }
        return ""
    }

    menu() {
        if (this.state.menuIdsTree.length > 0) {
            return (
                <Tree selectable={false}
                      defaultExpandedKeys={this.state.menuIdsTree.map((id: number) => id.toString())}>
                    {this.tree()}
                </Tree>
            )
        }
        return ""
    }

    // 获取兄弟节点
    brother(id) {
        return this.state.menuIdsTree.filter(cid => {
            return this.state.menu[cid]['parent_id'] === this.state.menu[id]['parent_id']
        })
    }

    children(pid) {
        return this.state.menuIdsTree.filter(id => {
            return this.state.menu[id]['parent_id'] === pid
        })
    }

    location(id) {
        let brother = this.brother(id)
        let currentIndex = 0;
        for (let i = 0; i < brother.length; i++) {
            if (brother[i] === id) {
                currentIndex = i
                break;
            }
        }
        if (currentIndex === 0) {
            return {index: currentIndex, type: "head"}
        }
        if ((currentIndex + 1) === brother.length) {
            return {index: currentIndex, type: "last"}
        }
        return {index: currentIndex, type: "middle"}
    }

    tree(pid = 0, level = 1) {
        return this.children(pid).map((id) => (
            <TreeNode title={this.treeContent(id, level)} key={id}>
                {this.tree(id, level + 1)}
            </TreeNode>
        ))
    }

    treeContent(id, level) {
        return (
            <div style={{width: "100%"}}>
                <div style={{display: "inline-block"}}>
                    <Icon type="file-text"/> [{id}]{this.state.menu[id]['name']}
                </div>
                <div style={{display: "inline-block", float: "right"}}>
                    <Button disabled={this.location(id).type === "last"} icon="arrow-down" size="small"
                            onClick={() => this.sort(id, 'down')} style={{marginRight: "8px"}}/>
                    <Button disabled={this.location(id).type === "head"} icon="arrow-up" size="small"
                            onClick={() => this.sort(id, 'up')} style={{marginRight: "8px"}}/>
                    <Button disabled={level > 2} icon="plus" type="primary" size="small"
                            onClick={() => this.add(this.state.menu[id]['parent_id'])} style={{marginRight: "8px"}}/>
                    <Button icon="edit" size="small" onClick={() => this.edit(id)} style={{marginRight: "8px"}}/>
                    <Button disabled={this.children(id).length > 0} icon="delete" type="danger" size="small"
                            onClick={() => this.remove(id)}/>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <Row gutter={16}>
                    <Col className="gutter-row" span={9}>
                        <Card
                            size="small"
                            title="菜单层级"
                            extra={
                                <Button type="primary" size="small" onClick={() => this.add()}>添加一级菜单</Button>
                            }
                        >
                            <div className="admin-menu-lists">
                                {this.menu()}
                            </div>
                        </Card>
                    </Col>
                    <Col className="gutter-row" span={15}>{this.setting()}</Col>
                </Row>
            </div>
        )
    }
}

export default Menu;