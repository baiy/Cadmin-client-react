import React from 'react';
import {Button, Table, Modal, Popover} from "antd"
import Filter from "../components/filter"
import TableLists from "src/components/tableLists"
import FieldMap from "src/components/fieldMap"
import request from "src/utils/request";
import modalForm from "src/components/modalForm"
import Setting from "./setting";

const {Column} = Table;

class User extends React.Component {
    state = {
        userStatus: [
            {v: 1, n: '启用'},
            {v: 2, n: '禁用'}
        ]
    }

    tableRef: any = null

    add() {
        this.set({status: 1})
    }

    edit(row) {
        this.set(row)
    }

    remove(row) {
        Modal.confirm({
            title: '确认要删除[' + row.username + ']?',
            onOk: () => {
                request("/system/user/remove").data({id: row.id}).showSuccessTip().success(() => {
                    this.tableRef.load()
                }).get()
            }
        })
    }

    set(row) {
        modalForm(
            "/system/user/save",
            Setting,
            {
                default: row || {},
                userStatus: this.state.userStatus
            },
            {
                title: row['id'] ? "编辑 [id:" + row["id"] + "]" : "添加",
                onSuccess: () => {
                    this.tableRef.load()
                }
            }
        )
    }

    render() {
        return (
            <TableLists
                ref={ref => {
                    this.tableRef = ref
                }}
                right={<Button type="primary" icon="plus" onClick={this.add.bind(this)}>添加</Button>}
                filter={Filter}
                action="/system/user/lists"
            >
                <Column title="ID" dataIndex="id"/>
                <Column title="用户名" dataIndex="username"/>
                <Column title="最后登录ip" dataIndex="last_login_ip"/>
                <Column title="最后登录时间" dataIndex="last_login_time"/>
                <Column title="创建时间" dataIndex="create_time"/>
                <Column title="状态" dataIndex="status" render={status => (
                    <FieldMap map={this.state.userStatus} value={status}>未知({status})</FieldMap>
                )}/>
                <Column title="用户组" key="group" render={(text, row: object) => {
                    const content = function () {
                        if (row['userGroup'].length < 1) {
                            return "暂无"
                        }
                        return row['userGroup'].map((item) => {
                            return <div key={item.id}>{item.id}:{item.name}</div>
                        })
                    }
                    return (
                        <Popover content={content()}>
                            <Button size="small">用户组({row['userGroup'].length})</Button>
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
        )
    }
}

export default User;
