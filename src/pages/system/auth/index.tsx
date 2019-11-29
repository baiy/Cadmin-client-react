import React from 'react';
import {Button, Table, Modal, Drawer} from "antd"
import Filter from "../components/filter"
import TableLists from "src/components/tableLists"
import request from "src/utils/request";
import modalForm from "src/components/modalForm"
import Setting from "./setting";
import AssignMenu from "./assignMenu";
import AssignRequest from "./assignRequest";
import AssignUserGroup from "./assignUserGroup";

const {Column} = Table;

class UserGroup extends React.Component {
    state = {
        currentAssignId: 0,
        currentAssignType: "",
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
                request("/system/auth/remove").data({id: row.id}).showSuccessTip().success(() => {
                    this.tableRef.load()
                }).get()
            }
        })
    }

    set(row) {
        modalForm(
            "/system/auth/save",
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


    assign(row,type){
        this.setState({currentAssignId:row.id,currentAssignType:type})
    }
    assignClose(){
        this.setState({currentAssignId:0,currentAssignType:""})
        this.tableRef.load()
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
                    action="/system/auth/lists"
                >
                    <Column title="ID" dataIndex="id"/>
                    <Column title="名称" dataIndex="name"/>
                    <Column title="创建时间" dataIndex="create_time"/>
                    <Column title="请求" key="request" render={(text, row: object) => (
                        <Button size="small" onClick={()=>this.assign(row,'request')}>分配请求({row['request'].length})</Button>
                    )}/>
                    <Column title="用户组" key="userGroup" render={(text, row: object) => (
                        <Button size="small" onClick={()=>this.assign(row,'userGroup')}>分配用户组({row['userGroup'].length})</Button>
                    )}/>
                    <Column title="菜单" key="menu" render={(text, row: object) => (
                        <Button size="small" onClick={()=>this.assign(row,'menu')}>分配菜单({row['menu'].length})</Button>
                    )}/>
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
                    title="请求分配"
                    onClose={this.assignClose.bind(this)}
                    visible={this.state.currentAssignType === "request"}
                >
                    <AssignRequest id={this.state.currentAssignId} />
                </Drawer>
                <Drawer
                    destroyOnClose
                    width={900}
                    title="用户组分配"
                    onClose={this.assignClose.bind(this)}
                    visible={this.state.currentAssignType === "userGroup"}
                >
                    <AssignUserGroup id={this.state.currentAssignId} />
                </Drawer>
                <Drawer
                    destroyOnClose
                    width={400}
                    title="菜单分配"
                    onClose={this.assignClose.bind(this)}
                    visible={this.state.currentAssignType === "menu"}
                >
                    <AssignMenu id={this.state.currentAssignId} />
                </Drawer>
            </div>


        )
    }
}

export default UserGroup;
