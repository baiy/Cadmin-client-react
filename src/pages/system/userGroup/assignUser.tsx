import React from 'react';
import {Button, Table} from "antd";
import TableLists from "src/components/tableLists";
import request from "src/utils/request";
import Filter from "../components/filter"

const {Column} = Table;

interface props {
    id: number
}

class AssignUser extends React.Component<props> {
    state = {
        assign: [], // 已分配数据
    }
    noAssigntableRef: any = null

    load({data: {lists: {assign}}}) {
        this.setState({assign})
    }

    join(row) {
        request('/system/userGroup/assignUser').data({
            id: this.props.id,
            userId: row.id
        }).success(() => {
            this.reload();
        }).get();
    }

    remove(row) {
        request('/system/userGroup/removeUser').data({
            id: this.props.id,
            userId: row.id
        }).success(() => {
            this.reload();
        }).get();
    }

    reload() {
        this.noAssigntableRef.load()
    }

    render() {
        return (
            <div>
                <TableLists
                    ref={ref => {
                        this.noAssigntableRef = ref
                    }}
                    pageSize={5}
                    filter={Filter}
                    filterProps={
                        {
                            hidden: [
                                {name: "id", value: this.props.id}
                            ]
                        }
                    }
                    action="/system/userGroup/getUser"
                    update={this.load.bind(this)}
                    listsDarse={({data: {lists: {noAssign}}}) => noAssign}
                >
                    <Column title="ID" dataIndex="id"/>
                    <Column title="用户名" dataIndex="username"/>
                    <Column title="操作" key="op" render={(text, row: object) => (
                        <Button type="primary" size="small" onClick={() => this.join(row)}>加入</Button>
                    )}/>
                </TableLists>

                <Table dataSource={this.state.assign} rowKey="id" bordered>
                    <Column title="ID" dataIndex="id"/>
                    <Column title="用户名" dataIndex="username"/>
                    <Column title="操作" key="op" render={(text, row: object) => (
                        <Button type="danger" size="small" onClick={() => this.remove(row)}>移出</Button>
                    )}/>
                </Table>
            </div>
        )
    }
}

export default AssignUser
