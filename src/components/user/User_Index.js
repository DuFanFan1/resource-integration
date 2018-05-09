import React, { Component } from 'react';
import { Link} from 'react-router-dom'
import '../../../style_css/antd.css';  // Add
import { Layout, Menu, Breadcrumb, Icon, Tree, Input } from 'antd';
const Search = Input.Search;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class User_Index extends Component {

    render() {
        return (
            <Layout>
                <Layout style={{ padding: '24px 0', background: '#fff',height: '800px' }}>
                    <Sider width={200} style={{ background: '#fff' }}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%' }}
                        >
                            <Menu.Item key="1"><Link to="/App/User_Index/MyInformation"><Icon type="user" />我的信息</Link></Menu.Item>
                            <Menu.Item key="2"><Link to="/App/User_Index/ReviseInformation"><Icon type="setting" />完善信息</Link></Menu.Item>
                            <Menu.Item key="3"><Link to="/App/User_Index/RevisePassword"><Icon type="lock" />修改密码</Link></Menu.Item>
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
export default User_Index;