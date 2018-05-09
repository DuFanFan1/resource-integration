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
let uid;
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
class MapTypes extends Component {
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
        grade: '初中', //学段
        version: '人教版', //版本
        isChangType: false
      },
      visible_delete: false,
      visible: false,
      MapTypeIndex: '1',
      saveAnotherMap: null,
      standardKnowledgeMap: [],
    }
  }
  // 另存为弹出框
  saveAS_Confirm = () => {
    const { mapInfo } = this.props;
    if (mapInfo.mapContent == true) {
      this.showModal();
    }
    else {
      Modal.warning({
        title: '友情提示',
        content: '请先选中知识地图',
      });
    }
  }
  showModal = () => {
    this.setState({ visible: true });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleCreate() {
    const { mapInfo } = this.props;
    let map_id = mapInfo.map_id
    console.log('另存为知识地图：map_id' + map_id);
    const form = this.form;
    console.log('另存为知识地图：formform.validateFields' + form);
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('map_id' + map_id);
      let ajaxTimeOut = $.ajax({
        url: "/api_v1.1/knowledge_struct_index/saveAsAnOtherMaps",//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
        type: "GET",
        dataType: "json",
        data: {
          "mapid": map_id,
          "map_name": values.mapName,
          "uid": uid
        },
        timeout: 2000,
        success: function (data) {
          console.log('添加知识地图成功');
          console.log(data);
          // this.setState({ addResult: data });
          // if (data.errorCode == 0) { console.log('另存为成功'); this.success() }
          // else { console.log('另存为失败'); this.failure() }
          console.log('另存为成功'); this.success()
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
      console.log(values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };
  saveFormRef = (form) => {
    this.form = form;
  };
  // 编辑确定弹出框
  editConfirm = () => {
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
  deleteConfirm = () => {
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
        isChangType: false,
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
  // 学段
  change_grade(e) {
    console.log("学段:" + e.target.value);
    // const { mapGrage } = this.props
    // mapGrage({
    //   type: 'mapGrage',
    //   payload: {
    //     grade: e.target.value,
    //   }
    // });
    this.setState({
      echartsoption: {
        isChangType: true,
        ifDelete: false,
        grade: e.target.value, //学段
        version: this.state.echartsoption.version, //版本
      },
    })

  }
  // 版本
  change_version(e) {
    console.log("版本:" + e.target.value);
    // const { mapVersion } = this.props
    // mapVersion({
    //   type: 'mapVersion',
    //   payload: {
    //     version: e.target.value,
    //   }
    // });
    this.setState({
      echartsoption: {
        isChangType: true,
        ifDelete: false,
        grade: this.state.echartsoption.grade, //学段
        version: e.target.value, //版本
      },
    })

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
  componentWillMount() {
    const { mapGrage } = this.props;
    const { mapVersion } = this.props;
    const { login_info } = this.props;
    console.log("99999999999999999")
    console.log(login_info)
    uid=login_info.userid;
    this.setState({
      echartsoption: {
        grade: mapGrage.grade, //学段
        version: mapVersion.version, //版本
      },
    })
  }

  render() {
    const { mapType } = this.props;
    if (mapType.mapType == '标准地图') {
      return (
        <Layout>
          <Content style={{ padding: '0 50px' }}>
            <Card>
              <div >
                <div>
                  {/* <div style={{ paddingBottom: '10px', display: this.state.display_name }}>
                    <Row>
                      <Col span={16}>
                      </Col>
                      <Col span={8} >
                        <div style={{ float: 'right' }}>
                          <Link to="/App/AddMap"><span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large">新建地图</Button></span></Link>
                          <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.editConfirm.bind(this)}>修改地图</Button></span>
                          <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.deleteConfirm.bind(this)}>删除地图</Button></span>
                          <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.saveAS_Confirm}>另存为地图</Button></span>
                        </div>
                      </Col>
                    </Row>
                  </div> */}
                  <div style={{ background: '#fff', paddingTop: '10px',paddingBottom:'10px' }}>
                    <Row>
                      <Col span={23}>
                        <div style={{ float: 'right' ,display: this.state.display_name}}>
                          <Link to="/App/AddMap"><span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large">新建地图</Button></span></Link>
                          <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.editConfirm.bind(this)}>修改地图</Button></span>
                          <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.deleteConfirm.bind(this)}>删除地图</Button></span>
                          <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.saveAS_Confirm}>另存为地图</Button></span>
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
            <AddKnowledgeCreateForm
              ref={this.saveFormRef}
              visible={this.state.visible}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate.bind(this)}
            />
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
    else if (mapType.mapType == '主题图') {
      return (
        <Layout>
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>知识地图</Breadcrumb.Item>
              <Breadcrumb.Item>一年级人教版知识地图</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
              <div >
                <div>
                  <div style={{ paddingBottom: '10px' }}>
                    <Row>
                      <Col span={18}>
                        学段：
                    <RadioGroup  >
                          {/* <RadioGroup value={this.state.echartsoption.grade} onChange={this.change_grade.bind(this)} > */}
                          <RadioButton value="小学" >小学</RadioButton>
                          <RadioButton value="初中" >初中</RadioButton>
                          <RadioButton value="高中" >高中</RadioButton>
                        </RadioGroup>
                        <span style={{ marginLeft: '10px' }}>版本：</span>
                        <RadioGroup  >
                          {/* <RadioGroup value={this.state.echartsoption.grade} onChange={this.change_grade.bind(this)} > */}
                          <RadioButton value="人教版" >人教版</RadioButton>
                          <RadioButton value="苏教版" >苏教版</RadioButton>
                        </RadioGroup>
                        <Button size="small" type='primary'>确定</Button>
                      </Col>
                      <Col span={2} >
                        <Link to="/App/AddTopicMap"><Button style={buttoncolor} size="large">新建主题图</Button></Link>
                      </Col>
                      <Col span={2}>
                        {/* <Link to="/App/EditMap"><Button style={buttoncolor} size="large" >修改知识地图</Button></Link> */}
                        <Button style={buttoncolor} size="large" onClick={this.editConfirm.bind(this)}>修改主题图</Button>
                      </Col>
                      <Col span={2}>
                        <Button style={buttoncolor} size="large" onClick={this.deleteConfirm.bind(this)}>删除主题图</Button>
                      </Col>
                      {/* <Col span={2}>
                        <Button style={buttoncolor} size="large" onClick={this.showModal}>另存为个人地图</Button>
                      </Col> */}
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
    else if (mapType.mapType == '我的地图') {
      return (
        <Layout>
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>知识地图</Breadcrumb.Item>
              <Breadcrumb.Item>一年级人教版知识地图</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
              <div >
                <div>
                  <div style={{ paddingBottom: '10px' }}>
                    <Row>
                      <Col span={9}>
                      </Col>
                      <Col span={11}>
                      </Col>
                      <Col span={2}>
                        {/* <Link to="/App/EditMap"><Button style={buttoncolor} size="large" >修改知识地图</Button></Link> */}
                        <Button style={buttoncolor} size="large" onClick={this.editConfirm.bind(this)}>修改我的地图</Button>
                      </Col>
                      <Col span={2}>
                        <Button style={buttoncolor} size="large" onClick={this.deleteConfirm.bind(this)}>删除我的地图</Button>
                      </Col>
                      {/* <Col span={2}>
                        <Button style={buttoncolor} size="large" onClick={this.showModal}>另存为个人地图</Button>
                      </Col> */}
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
}
// export default MapTypes;
function mapStateToProps(state) {
  return {
    selectMapSubject: state.reducer_map_subject.selectMapSubject,
    mapVersion: state.reducer_map_version.mapVersion,
    mapGrage: state.reducer_map_grade.mapGrage,
    mapInfo: state.reducer_map_info.mapInfo,
    knowledgeInfo: state.reducer_map_knowledge.knowledgeInfo,
    mapType: state.reducer_map_type.mapType,
    login_info: state.reducer_login.login_info

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
)(MapTypes);





