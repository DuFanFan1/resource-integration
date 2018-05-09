import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom'
import '../../../style_css/antd.css';  // Add
import { Layout, Menu, Breadcrumb, Icon, Tree, Input } from 'antd';
const Search = Input.Search;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class Statistics_Index extends Component {

    render() {
        return (
            <Layout>
            {/*     <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>知识地图</Breadcrumb.Item>
                    <Breadcrumb.Item>一年级人教版知识地图列表</Breadcrumb.Item>
                </Breadcrumb> */}
                <Layout style={{ padding: '24px 0', background: '#fff' }}>
                    <Sider width={200} style={{ background: '#fff' }}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%' }}
                        >
                            <Menu.Item key="1"><Link to="/App/Statistics_Index/MapStatistics"><Icon type="area-chart" />知识地图统计</Link></Menu.Item>
                            <Menu.Item key="2"><Link to="/App/Statistics_Index/ResourceStatistic"><Icon type="bar-chart" />资源统计</Link></Menu.Item>
                            <Menu.Item key="3"><Link to="/App/Statistics_Index/KnowledgeStatistic"><Icon type="pie-chart" />知识点统计</Link></Menu.Item>
                        </Menu>
                    </Sider>
                    <Content style={{ padding: '0 24px', minHeight: 280 }}>
                        {this.props.children}
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
export default Statistics_Index;
