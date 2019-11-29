import React from 'react';
import {Button, Table, Modal, Popover, Drawer} from "antd"
import Filter from "../components/filter"
import TableLists from "src/components/tableLists"
import request from "src/utils/request";
import modalForm from "src/components/modalForm"
import Setting from "./setting";
import AssignUser from "./assignUser";

const {Column} = Table;

class UserGroup extends React.Component {
    state = {
        currentAssignId: 0
    }
    tableRef: any = null

    add() {
        this.set({})
    }

    edit(row) {
        this.set(row)
    }

    remove(row) {
        Modal.confirm({
            title: '确认要删除[' + row.name + ']?',
            onOk: () => {
                request("/system/userGroup/remove").data({id: row.id}).showSuccessTip().success(() => {
                    this.tableRef.load()
                }).get()
            }
        })
    }

    set(row) {
        modalForm(
            "/system/userGroup/save",
            Setting,
            {
                default: row || {}
            },
            {
                title: row['id'] ? "编辑 [id:" + row["id"] + "]" : "添加",
                onSuccess: () => {
                    this.tableRef.load()
                }
            }
        )
    }

    assignUserClose(){
        this.setState({currentAssignId:0})
        this.tableRef.load()
    }
    assignUser(row){
        this.setState({currentAssignId:row.id})
    }

    render() {
        return (
            <div>
                <TableLists
                    ref={ref => {
                        this.tableRef = ref
                    }}
                    right={<Button type="primary" icon="plus" onClick={this.add.bind(this)}>添加</Button>}
                    filter={Filter}
                    action="/system/userGroup/lists"
                >
                    <Column title="ID" dataIndex="id"/>
                    <Column title="名称" dataIndex="name"/>
                    <Column title="创建时间" dataIndex="create_time"/>
                    <Column title="更新时间" dataIndex="update_time"/>
                    <Column title="用户" key="user" render={(text, row: object) => (
                        <Button size="small" onClick={()=>this.assignUser(row)}>分配用户({row['user'].length})</Button>
                    )}/>
                    <Column title="权限" key="auth" render={(text, row: object) => {
                        const content = function () {
                            if (row['auth'].length < 1) {
                                return "暂无"
                            }
                            return row['auth'].map((item) => {
                                return <div key={item.id}>{item.id}:{item.name}</div>
                            })
                        }
                        return (
                            <Popover content={content()}>
                                <Button size="small">权限({row['auth'].length})</Button>
                            </Popover>
                        )
                    }}/>
                    <Column title="操作" key="op" render={(text, row: object) => (
                        <div>
                            <Button type="primary" size="small" onClick={() => this.edit(row)}
                                    style={{marginRight: "8px"}}>编辑</Button>
                            <Button type="danger" size="small" onClick={() => this.remove(row)}>删除</Button>
                        </div>
                    )}/>
                </TableLists>
                <Drawer
                    destroyOnClose
                    width={900}
                    title="用户分配"
                    onClose={this.assignUserClose.bind(this)}
                    visible={this.state.currentAssignId > 0}
                >
                    <AssignUser id={this.state.currentAssignId} />
                </Drawer>
            </div>


        )
    }
}

export default UserGroup;
