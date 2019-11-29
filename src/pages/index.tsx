import React from 'react';
import {Redirect} from 'react-router';
import {config, setTitle} from "src/utils/helper"
class Index extends React.Component {
    constructor(props){
        super(props)
        setTitle("默认首页")
    }
    render() {
        if (config('INDEX_URL') === "/"){
            return (
                "默认首页 可以.env文件中配置首页地址"
            )
        }
        return (
            <Redirect to={config("INDEX_URL")} />
        )
    };
}
export default Index;
