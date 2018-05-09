import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Card, Input, Tag } from 'antd';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import './App.css';
import 'antd/dist/antd.css';
import BreadcrumbCustom from './BreadcrumbCustom';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;
class App extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props, context) {
    super(props, context);
  }
  mapType(maptype) {
    const { mapType } = this.props
    if (maptype == '主题图') {
      mapType({
        type: 'mapType',
        payload: {
          mapType: '主题图',
        }
      });
      // this.context.router.history.push("/App/MapType");
      this.context.router.history.push("/App/MapType_TopMap");
    }
    else if (maptype == '我的地图') {
      mapType({
        type: 'mapType',
        payload: {
          mapType: '我的地图',
        }
      });
      // this.context.router.history.push("/App/MapType");
      this.context.router.history.push("/App/MapType_MyMap");
    }
    else if (maptype == '知识库') {
      mapType({
        type: 'mapType',
        payload: {
          mapType: '知识库',
        }
      });
      this.context.router.history.push("/App/SelectSubject_Index");
    }
    else if (maptype == '标准地图') {
      mapType({
        type: 'mapType',
        payload: {
          mapType: '标准地图',
        }
      });
      this.context.router.history.push("/App/SelectSubject_Index");
    }
  }

  render() {
    const { login_info, type1 } = this.props;
    return (
      <Layout>
        <Header className="header">
          <h1 className="App-logo">资源融合平台</h1>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[type1.mapType]}
            defaultOpenKeys={[type1.mapType]}
            defaultActiveKey={[type1.mapType]}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="repository" style={{ fontSize: 20 }}><p onClick={this.mapType.bind(this, '知识库')}>知识库</p></Menu.Item>
            <Menu.Item key="map" style={{ fontSize: 20 }}><p onClick={this.mapType.bind(this, '标准地图')}>知识地图</p></Menu.Item>
            <Menu.Item key="mytopicmap" style={{ fontSize: 20 }}><p onClick={this.mapType.bind(this, '主题图')}>主题图</p></Menu.Item>
            {/* <Menu.Item key="resource" style={{ fontSize: 20 }}><Link to="/App/ResList">学习资源</Link></Menu.Item> */}
            {/* <Menu.Item key="statistics" style={{ fontSize: 20 }}><Link to="/App/Statistics_Index/MapStatistics">统计分析</Link></Menu.Item> */}
            <Menu.Item key="statistics" style={{ fontSize: 20 }}><Link to="/App/Statistics_Index">统计分析</Link></Menu.Item>
            <Menu.Item key="search" style={{ fontSize: 20 }}><Link to="/App/Search_Index">资源检索</Link></Menu.Item>
            <Menu.Item key="zyk-yun" style={{ fontSize: 20 }}><a href="http://zyk-yun.mypep.com.cn/app/resource/manage.php">学习资源库</a></Menu.Item>
            {/* <Menu.Item key="search" style={{ fontSize: 20 }}><Link to="/App/treeCheckbox">资源检索</Link></Menu.Item>          */}
            <SubMenu title={login_info.username}>
              {/* <Link to="/App/MapType_TopMap"></Link> <Link to="/App/MapType_MyMap">*/}
              <Menu.Item key="information"><Link to="/App/User_Index/MyInformation">个人信息</Link></Menu.Item>
              <Menu.Item key="mytask"><Link to="/App/MyTask">我的任务</Link></Menu.Item>
              {/* <Menu.Item key="mytopicmap"><p onClick={this.mapType.bind(this, '主题图')}>主题图</p></Menu.Item> */}
              <Menu.Item key="mymap"><p onClick={this.mapType.bind(this, '我的地图')}>我的地图</p></Menu.Item>
              <Menu.Item key="logout"><a href="/logout">退出登录</a></Menu.Item>
            </SubMenu>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <BreadcrumbCustom />
          {this.props.children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          ©2018 Created by 华中师范大学国家数字化工程技术研究中心
      </Footer>
      </Layout>
    );
  }
}
// export default App;
function mapStateToProps(state) {
  return {
    login_info: state.reducer_login.login_info,
    type1:state.reducer_type.type1,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    mapType: (state) => dispatch(state),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

