import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import '../../../style_css/antd.css';  // Add
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Input, Card, Select, Button, Form, Tabs, Modal, Radio } from 'antd';
import MapSubject from '../echarts/MapSubject.js';
const Search = Input.Search;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class SelectSubject_Index extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      echartsoption: {
        grade: '初中', //学段
        version: '人教版', //版本
      },
      grade: null, //学段
      version: null, //版本
      is: true,
      MapSubject:MapSubject

    }
  }
  change_grade(e) {
    console.log("学段:" + e.target.value);
    const { mapGrage } = this.props
    mapGrage({
      type: 'mapGrage',
      payload: {
        grade: e.target.value,
      }
    });
    this.setState({
      echartsoption: {
        grade: e.target.value, //学段
        version: this.state.echartsoption.version, //版本
      },
    })
   
  }
  change_version(e) {
    console.log("版本:" + e.target.value);
    const { mapVersion } = this.props
    mapVersion({
      type: 'mapVersion',
      payload: {
        version: e.target.value,
      }
    });
    this.setState({
      echartsoption: {
        grade: this.state.echartsoption.grade, //学段
        version: e.target.value, //版本
      },
    })
    
  }
  componentWillMount(){
    const { mapGrage } = this.props
    mapGrage({
      type: 'mapGrage',
      payload: {
        grade: this.state.echartsoption.grade,
      }
    });
    const { mapVersion } = this.props
    mapVersion({
      type: 'mapVersion',
      payload: {
        version: this.state.echartsoption.version,
      }
    });

  }
  render() {
    const { mapType } = this.props;
    if(mapType.mapType=='标准地图'){
      return (
        <Layout>
          <Content style={{ padding: '0 50px' }}>
            <div >
              <Card>
                <div style={{ paddingBottom: '10px' }}>
                  <Row>
                    <Col span={9}>
                      学段：
                      <RadioGroup value={this.state.echartsoption.grade} onChange={this.change_grade.bind(this)} >
                        <RadioButton value="小学" >小学</RadioButton>
                        <RadioButton value="初中" >初中</RadioButton>
                        <RadioButton value="高中" >高中</RadioButton>
                      </RadioGroup>
                    </Col>
                    <Col span={14}>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col span={9}>
                      版本：
                      <RadioGroup value={this.state.echartsoption.version} onChange={this.change_version.bind(this)}>
                        <RadioButton value="人教版" >人教版</RadioButton>
                        <RadioButton value="苏教版" >苏教版</RadioButton>
                      </RadioGroup>
                    </Col>
                    <Col span={14}>
                    </Col>
                  </Row>
                </div>
                {/* <MapSubject eventsOption={this.state.echartsoption}></MapSubject> */}
                <MapSubject eventsOption={this.state.echartsoption}></MapSubject>
              </Card>
            </div>
          </Content>
        </Layout>
      );
    }
    else{
      return (
        <Layout>
          <Content style={{ padding: '0 50px' }}>
            <div >
              <Card>
                <Row>
                  <Col span={9}>
                    学段：
                      <RadioGroup value={this.state.echartsoption.grade} onChange={this.change_grade.bind(this)} >
                      <RadioButton value="小学" >小学</RadioButton>
                      <RadioButton value="初中" >初中</RadioButton>
                      <RadioButton value="高中" >高中</RadioButton>
                    </RadioGroup>
                  </Col>
                  <Col span={14}>
                  </Col>
                </Row>
                <MapSubject eventsOption={this.state.echartsoption}></MapSubject>
              </Card>
            </div>
          </Content>
        </Layout>
      );

    }
    
  }
}
function mapStateToProps(state) {
  return {
    mapType: state.reducer_map_type.mapType,

  };
}
function mapDispatchToProps(dispatch) {
  return {
    mapGrage: (state) => dispatch(state),
    mapVersion: (state) => dispatch(state),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectSubject_Index);
