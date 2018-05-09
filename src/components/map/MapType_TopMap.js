import React, { Component } from 'react';
import $ from 'jquery';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from "prop-types";
// import './MapList.css';
import '../../../style_css/antd.css';  // Add
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Input, Card, Select, Button, Form, Tabs, Modal, Radio } from 'antd';
import MapType from '../echarts/MapType.js';
const Search = Input.Search;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const buttoncolor = {
  color: "#fff",
  background: "#2a95de",
  border: "#2a95de",
}
// 另存为弹出框
const AddKnowledgeCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="知识地图另存为"
        okText="确定"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          {/* <FormItem style={{ marginBottom: 0 }}>
            <Input placeholder="重命名知识地图名称" />
          </FormItem> */}
          <FormItem label="重命名">
            {getFieldDecorator('mapName', {
              rules: [{ required: true, message: '请输入地图名称!' }],
            })(
              <Input />
              )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);
class MapType_TopMap extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  // 状态机
  constructor(props, context) {
    super(props, context);
    // this.showConfirm = this.showConfirm.bind(this);
    // this.getPersonalMapList_personal = this.getPersonalMapList_personal.bind(this);
    this.state = {
      display_name: 'none',
      echartsoption: {
        ifDelete: false,//ok
        selectIndex: -1,
        // mapType:null,
      },
      visible_delete: false,
      visible: false,
      MapTypeIndex: '1',
      saveAnotherMap: null,
      standardKnowledgeMap: [],
    }
  }
  // 编辑确定弹出框
  editConfirm() {
    const { mapInfo } = this.props;
    if (mapInfo.mapContent == true) {
      this.context.router.history.push("/App/EditMap");
    }
    else {
      Modal.warning({
        title: '友情提示',
        content: '请先选中知识地图',
      });
    }
  }
  // 删除确定弹出框
  deleteConfirm() {
    const { mapInfo } = this.props;
    if (mapInfo.mapContent == true) {
      this.showConfirm();
    }
    else {
      Modal.warning({
        title: '友情提示',
        content: '请先选中知识地图',
      });
    }
  }
  showConfirm() {
    this.setState({
      visible_delete: true,
    });
  }
  handleOk() {
    // 实时数据
    const { mapInfo } = this.props;
    this.setState({
      echartsoption: {
        ifDelete: true,
        selectIndex: mapInfo.index,
      },
      visible_delete: false,
    });
    // 数据库删除
    console.log('进入Delete ajax');
    let ajaxTimeOut = $.ajax({
      url: "/api_v1.1/knowledge_struct_index/deleteKnowledgeMaps",
      type: "GET",
      dataType: "json",
      data: { "mapid": mapInfo.map_id },
      timeout: 2000,
      success: function (data) {
        console.log('data');
        console.log(data);
        if (data.errorCode == 0) { this.success(); }
        else { this.failure() }
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this),
      complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
        if (status == 'timeout') {//超时,status还有success,error等值的情况
          ajaxTimeOut.abort(); //取消请求
          this.time_out()
        }
      }
    });
  }
  handleCancel_delete() {
    this.setState({
      visible_delete: false,
    });
  }

  // 弹出框-添加知识地图成功
  success() {
    Modal.success({
      title: '友情提示',
      content: '操作成功',
    });
  }
  // 弹出框-添加知识地图成功
  failure() {
    Modal.error({
      title: '友情提示',
      content: '操作失败',
    });
  }

  mapTypechange = () => {
    this.setState({
      echartsoption: {
        ifDelete: false,
        mapType: 2,
      },
    });
  }
  display_name() {
    if (this.state.display_name == 'none') {
      this.setState({
        display_name: 'block',
      })
    }
    else if (this.state.display_name == 'block') {
      this.setState({
        display_name: 'none',
      })

    }
  }

  // componentWillMount(){
  //   const { mapInfo } = this.props
  //   mapInfo({
  //       type: 'mapInfo',
  //       payload: {                
  //           mapContent: false,
  //       }
  //   });
  // }
  render() {
    return (
      <Layout>
        <Content style={{ padding: '0 50px' }}>
          <Card>
            <div >
              <div>
                {/* <div style={{ paddingBottom: '10px', display: this.state.display_name }}>
                  <Row >
                    <Col span={17}>
                    </Col>
                    <Col span={7} >
                      <div style={{ float: 'right' }}>
                        <Link to="/App/AddTopicMap"><span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large">新建主题图</Button></span></Link>
                        <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.editConfirm.bind(this)}>修改主题图</Button></span>
                        <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.deleteConfirm.bind(this)}>删除主题图</Button></span>
                      </div>
                    </Col>
                  </Row>
                </div> */}
                <div style={{ background: '#fff', paddingTop: '10px',paddingBottom: '10px' }}>
                  <Row>
                    <Col span={23}>
                      <div style={{ float: 'right' ,display: this.state.display_name}}>
                        <Link to="/App/AddTopicMap"><span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large">新建主题图</Button></span></Link>
                        <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.editConfirm.bind(this)}>修改主题图</Button></span>
                        <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.deleteConfirm.bind(this)}>删除主题图</Button></span>
                      </div>
                    </Col>
                    <Col span={1} onClick={this.display_name.bind(this)}>
                      <Icon type='edit' style={{ fontSize: '30px' }} />
                    </Col>
                  </Row>
                </div>
                <Card>
                  <MapType eventsOption={this.state.echartsoption}></MapType>
                </Card>
              </div>
            </div>
          </Card>
          <Modal
            visible={this.state.visible_delete}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel_delete.bind(this)}
          >
            <span><Icon type="close" style={{ color: "#F00", fontSize: 15 }} />确定要删除该知识地图吗？
          </span>
          </Modal>
        </Content>
      </Layout>
    );
  }
}
// export default MapTypes;
function mapStateToProps(state) {
  return {
    selectMapSubject: state.reducer_map_subject.selectMapSubject,
    mapInfo: state.reducer_map_info.mapInfo,
    knowledgeInfo: state.reducer_map_knowledge.knowledgeInfo,


  };
}
function mapDispatchToProps(dispatch) {
  return {
    // mapInfo: (state) => dispatch(state)

  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapType_TopMap);





