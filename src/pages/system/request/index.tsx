import React from 'react';
import {Button, Table, Tooltip, Modal, Popover} from "antd"
import Filter from "../components/filter"
import TableLists from "src/components/tableLists"
import FieldMap from "src/components/fieldMap"
import request from "src/utils/request";
import modalForm from "src/components/modalForm"
import Setting from "./setting";

const {Column} = Table;

class Request extends React.Component {
    state = {
        requestType: []
    }

    tableRef: any = null

    constructor(props) {
        super(props)
        // 获取请求分类
        request("/system/request/type").success(r => {
            this.setState({
                requestType: r.data
            })
        }).get()
    }

    add() {
        this.set({type: 'default'})
    }

    edit(row) {
        this.set(row)
    }

    copy(row) {
        delete row["id"]
        this.set(row)
    }

    remove(row) {
        Modal.confirm({
            title: '确认要删除[' + row.name + ']?',
            onOk: () => {
                request("/system/request/remove").data({id: row.id}).showSuccessTip().success(() => {
                    this.tableRef.load()
                }).get()
            }
        })
    }

    set(row) {
        modalForm(
            "/system/request/save",
            Setting,
            {
                default: row || {},
                requestType: this.state.requestType
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
                action="/system/request/lists"
            >
                <Column title="ID" dataIndex="id"/>
                <Column title="名称" dataIndex="name"/>
                <Column title="类型" dataIndex="type" render={type => (
                    <FieldMap valueField="type" descField="name" map={this.state.requestType}
                              value={type}>未知分类({type})</FieldMap>
                )}/>
                <Column title="action" dataIndex="action" key="action" render={(action, row: object) => (
                    <Tooltip title={row['call']}>{action}</Tooltip>
                )}/>
                <Column title="创建时间" dataIndex="create_time" key="create_time"/>
                <Column title="权限" key="auth" render={(text, row: object) => {
                    const content = function () {
                        if (row['auth'].length < 1) {
                            return "暂无"
                        }
                        return row['auth'].map((auth) => {
                            return <div key={auth.id}>{auth.id}:{auth.name}</div>
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
                        <Button type="danger" size="small" onClick={() => this.remove(row)}
                                style={{marginRight: "8px"}}>删除</Button>
                        <Button size="small" onClick={() => this.copy(row)}>复制</Button>
                    </div>
                )}/>
            </TableLists>
        )
    }
}

export default Request;
