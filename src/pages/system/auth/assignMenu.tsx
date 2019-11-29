import React from 'react';
import request from "src/utils/request";
import {Modal, Tree} from 'antd';
import {menuSort} from "src/utils/helper";

const {TreeNode} = Tree;

interface props {
    id: number
}

class AssignMenu extends React.Component<props> {
    state = {
        menu: {},
        menuIdsTree: []
    }

    componentDidMount() {
        this.load()
    }

    load() {
        request('/system/auth/getMenu').data({id: this.props.id}).success((r) => {
            this.setState({
                menu: (() => {
                    let menu = {}
                    r.data.forEach((item) => {
                        item['id'] = parseInt(item['id'], 10)
                        menu[item['id']] = item
                    })
                    return menu
                })(),
                menuIdsTree: menuSort(r.data).map(({id}) => parseInt(id, 10))
            })
        }).get();
    }

    checked() {
        let checked = new Set<number>(
            this.state.menuIdsTree.filter(id => this.state.menu[id]['checked'])
        )
        this.state.menuIdsTree.forEach(id => {
            let item = this.state.menu[id]
            // 过滤上级选中
            if (!item['checked']) {
                this.getParentIds(item['id']).forEach(id => {
                    checked.delete(id)
                })
            }
        })
        return Array.from(checked).map(id => id.toString())
    }

    tree(pid = 0) {
        return this.state.menuIdsTree.filter(id => this.state.menu[id]['parent_id'] === pid).map((id) => (
            <TreeNode title={this.state.menu[id]['name']} key={id}>
                {this.tree(id)}
            </TreeNode>
        ))
    }

    onCheck(checked) {
        let req = request('/system/auth/assignMenu').data({
            menuIds: this.addParentChecked(checked.map(id => {
                return parseInt(id, 10);
            })),
            id: this.props.id
        }).success(() => {
            this.load();
        })
        if (checked.length < 1) {
            return Modal.confirm({
                title: '确定要清空当前的所有菜单?',
                onOk: () => {
                    req.post()
                },
                onCancel: () => {
                    this.load()
                }
            })
        }
        req.post()
    }

    getParentIds(id) {
        let parent: number[] = []
        const item = this.state.menu[id]
        if (item['parent_id'] !== 0) {
            parent.push(
                item['parent_id'],
                ...this.getParentIds(item['parent_id'])
            )
        }
        return parent
    }

    addParentChecked(checked: number[]) {
        let parent: number[] = []
        checked.forEach(id => {
            parent.push(...this.getParentIds(id))
        })
        return Array.from(new Set<number>([...checked, ...parent]))
    }

    render() {
        return this.state.menuIdsTree.length > 0 ?
            <Tree
                checkable
                defaultExpandedKeys={this.state.menuIdsTree.map((id: number) => id.toString())}
                checkedKeys={this.checked()}
                onCheck={this.onCheck.bind(this)}
            >
                {this.tree()}
            </Tree>
            : ""
    }
}

export default AssignMenu
