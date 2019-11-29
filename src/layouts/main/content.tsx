import React from 'react';
import {Route, Switch} from 'react-router-dom'
import {Layout} from 'antd';
import {getPages} from "src/utils/helper";
import Container from "./container"
import NoFound from './noFound';

class Content extends React.Component {
    render() {
        return (
            <Layout.Content
                style={{
                    margin: "12px 12px 0",
                    padding: "12px",
                    background: '#fff',
                    minHeight: 280,
                }}
            >
                <Switch>
                    {
                        getPages().map(({path, component}, index) => {
                            const Component = component
                            return (
                                <Route exact path={path} key={index}>
                                    <Container>
                                        <Component/>
                                    </Container>
                                </Route>
                            )
                        })
                    }
                    <Route>
                        <NoFound/>
                    </Route>
                </Switch>
            </Layout.Content>
        )
    }
}

export default Content
