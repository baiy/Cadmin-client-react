import React from 'react';
import Table from './table';
import Header from './header';
import {Button, Form} from "antd";

interface props {
    update?: ((response, page?) => void)
    action: string
    rowKey?: string
    pageSize?: number
    right?: React.ReactNode
    filterProps?: object
    filter?: React.ComponentType<any>
    hiddenPage?:boolean
    listsDarse?: (response) => any[] // 分页数据解析方法
}

class TableLists extends React.Component<props> {
    static defaultProps = {
        pageSize: 20,
        rowKey: "id",
        right: null,
        filter: null,
        filterProps: {},
        hiddenPage:false,
        listsDarse:({data: {lists}}) => lists
    }

    tableRef: any = null
    filterRef: any = null

    componentDidMount(): void {
        this.load()
    }

    load() {
        this.tableRef.reload()
    }

    query() {
        return this.filterRef ? this.filterRef.getFieldsValue() : {}
    }

    render() {
        if (this.props.filter) {
            const Filter = this.props.filter
            return (
                <div>
                    <Header right={this.props.right}>
                        <Filter {...this.props.filterProps} wrappedComponentRef={ref => {
                                this.filterRef = ref
                        }}/>
                        <Form layout="inline" style={{display:"inline-block"}}>
                            <Form.Item>
                                <Button type="primary" onClick={this.load.bind(this)}>查询</Button>
                            </Form.Item>
                        </Form>
                    </Header>
                    <Table
                        ref={ref => {
                            this.tableRef = ref
                        }}
                        action={this.props.action}
                        query={this.query.bind(this)}
                        update={this.props.update}
                        rowKey={this.props.rowKey}
                        pageSize={this.props.pageSize}
                        hiddenPage={this.props.hiddenPage}
                        listsDarse={this.props.listsDarse}
                    >
                        {this.props.children}
                    </Table>
                </div>
            )
        }
        return (
            <div>
                <Header right={this.props.right}/>
                <Table
                    ref={ref => {
                        this.tableRef = ref
                    }}
                    action={this.props.action}
                    query={this.query.bind(this)}
                    update={this.props.update}
                    rowKey={this.props.rowKey}
                    pageSize={this.props.pageSize}
                    hiddenPage={this.props.hiddenPage}
                    listsDarse={this.props.listsDarse}
                >
                    {this.props.children}
                </Table>
            </div>
        )
    }
}

// 过滤器接口
export interface filterInterface {
    getFieldsValue(): object
}

export default TableLists