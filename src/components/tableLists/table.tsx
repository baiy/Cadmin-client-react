import React from 'react';
import {Table as AntdTable} from 'antd';
import request from "src/utils/request";

interface props {
    query()

    update?: ((response, page?) => void)
    action: string
    rowKey?: string
    pageSize?: number
    hiddenPage?: boolean

    listsDarse?: (response) => any[]
}

interface state {
    total: number
    page: number
    lists: any[],
    render: number
    pageSize: number
}


class Table extends React.Component<props, state> {

    static defaultProps = {
        pageSize: 20,
        rowKey: "id",
        listsDarse: ({data: {lists}}) => lists
    }

    constructor(props) {
        super(props)
        this.state = {
            lists: [],
            total: 0,
            page: 1,
            render: 0,
            pageSize: this.props.pageSize || 20,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.render !== nextState.render
    }

    onChange(page) {
        this.setState({page}, () => {
            this.load()
        })
    }

    onShowSizeChange(page, pageSize) {
        this.setState({page: 1, pageSize}, () => {
            this.load()
        })
    }

    reload() {
        this.setState({page: 1}, () => {
            this.load()
        })
    }

    load() {
        let query = this.props.query() || {}
        if (!this.props.hiddenPage) {
            query = {
                ...query,
                offset: (this.state.page - 1) * this.state.pageSize,
                pageSize:this.state.pageSize
            }
        }
        let req = request(this.props.action).data(query)
        req.success((response) => {
            this.setState((state) => {
                let change = {}
                if (response.data['total']) {
                    change["total"] = response.data['total']
                }
                change["lists"] = this.props.listsDarse ? this.props.listsDarse(response) : []
                return {render: state.render + 1, ...change}
            }, () => {
                this.props.update && this.props.update(response, this.state.page)
            })
        }).get()
    }

    render() {
        const pagination = !this.props.hiddenPage ? {
            defaultPageSize: this.props.pageSize,
            current: this.state.page,
            total: this.state.total,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '30', '50', '100'],
            showQuickJumper: true,
            showTotal: total => `总计 ${total} 条`,
            onChange: this.onChange.bind(this),
            onShowSizeChange: this.onShowSizeChange.bind(this)
        } : false
        return (
            <AntdTable dataSource={this.state.lists}
                       pagination={pagination}
                       rowKey={this.props.rowKey}
                       bordered
            >
                {this.props.children}
            </AntdTable>
        )
    }
}

export default Table
