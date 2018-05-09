import React, { Component } from 'react';
import $ from 'jquery';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import PropTypes from "prop-types";
import { Scrollbars } from 'react-custom-scrollbars';
// import './MapList.css';
import '../../../style_css/antd.css';  // Add
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Input, Card, Select, Button, Form, Tabs, Modal } from 'antd';
import MapDisplay from '../echarts/MapDisplay.js';
const Search = Input.Search;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const buttoncolor = {
  color: "#fff",
  background: "#2a95de",
  border: "#2a95de",
}
class KnowledgeRepository_Echarts_Slider extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  constructor() {
    super()
    this.state = {
      display_name: 'none',
      Icon_name: 'menu-fold',
      display: 'none',
      span_left: 24,
      span_right: 0,
      echartsoption: {
        ifDelete: false,
        selectName: '',
        selectIndex: -1,
        ifAdd: false,
        selectcategory: -1,
        newcategory: -1,
        newname: '',
        knowledge_id: '',
        is_knowledge: '',
        pre_knowid: '',
        mapContent: true,
        reletedResCount: null,
        is_knowledge_Repository: false,
      },
      visible: false,
      visible_delete: false,
      newcategory: -1,
      newname: '',
    }
  }
  addKnowledge(sindex, sname, name) {
    this.setState({
      echartsoption: {
        ifAdd: true,
        ifDelete: false,
        selectIndex: sindex,
        selectName: sname,
        // selectcategory: scategory,
        // newcategory:category,
        newname: name
      },
      visible_delete: false
    })
  }
  // 删除确定弹出框
  deleteConfirm = () => {
    const { knowledgeInfo } = this.props;
    if (knowledgeInfo.mapContent == true) {
      this.showConfirm();
    }
    else {
      confirm({
        title: '无权删除根节点',
        onOk() {
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
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
    const { knowledgeInfo } = this.props;
    this.setState({
      echartsoption: {
        ifDelete: true,
        ifAdd: false,
        ifEdit: false,
        selectIndex: knowledgeInfo.index,
        selectName: knowledgeInfo.knowledge_name,
        selectcategory: knowledgeInfo.category,
      },
      visible_delete: false,
    });

    // 数据库删除
    console.log('进入Delete ajax');
    let ajaxTimeOut = $.ajax({
      url: "/api_v1.1/knowledge/deleteknowid",
      type: "GET",
      dataType: "json",
      data: { "knowid": knowledgeInfo.knowledge_id },
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
  addKnowledge() {
    const { displayType } = this.props
    displayType({
      type: 'displayType',
      payload: {
        displayType: '知识库-地图',
      }
    });
    this.context.router.history.push("/App/KnowledgeRepository_Echarts_Slider/Addknowledge");
  }
  // 按钮的单击事件（详情，添加知识点，编辑知识点，关联知识点）
  onclick_button(button_name) {
    if (button_name == '知识点详情') {
      this.context.router.history.push("/App/KnowledgeRepository_Echarts_Slider/KnowledgeDetail");
    }
    else if (button_name == '添加知识点') {
      this.context.router.history.push("/App/KnowledgeRepository_Echarts_Slider/Addknowledge");
    }
    else if (button_name == '修改知识点') {
      this.context.router.history.push("/App/KnowledgeRepository_Echarts_Slider/EditKnowledge");
    }
    else if (button_name == '关联资源') {
      this.context.router.history.push("/App/KnowledgeRepository_Echarts_Slider/ResList_Repository");
    }
    this.setState({
      display: 'block',
      span_left: 15,
      span_right: 9,
      Icon_name: 'menu-unfold',
    })
  }
  changIcon() {
    if (this.state.Icon_name == 'menu-fold') {
      this.setState({
        Icon_name: 'menu-unfold',
        display: 'block',
        span_left: 15,
        span_right: 9,
      })
    }
    else if (this.state.Icon_name == 'menu-unfold') {
      this.setState({
        Icon_name: 'menu-fold',
        display: 'none',
        span_left: 24,
        span_right: 0,
      })

    }
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
    const { displayType } = this.props
    displayType({
      type: 'displayType',
      payload: {
        displayType: '知识库-地图',
      }
    });
  }
  componentDidMount() {
    this.pubsub_addKnowledgeSuccess_Echarts = PubSub.subscribe('addKnowledgeSuccess_Echarts', function (topic, message) {
      console.log('eaddKnowledgeSuccess_Echarts------messag')
      console.log(message)
      this.setState({
        echartsoption: {
          ifAdd: true,
          ifDelete: false,
          selectIndex: message.sindex,
          selectName: message.sname,
          newname: message.name,
          // 新添加字段
          knowledge_id: message.knowledge_id,
          is_knowledge: message.is_knowledge,
          pre_knowid: message.pre_knowid,
          mapContent: true,
        },
        visible_delete: false
      })
    }.bind(this));
    this.pubsub_editKnowledgeSuccess_Echarts = PubSub.subscribe('editKnowledgeSuccess_Echarts', function (topic, message) {
      console.log('message')
      console.log(message)
      this.setState({
        echartsoption: {
          ifEdit: true,
          ifAdd: false,
          ifDelete: false,
          selectIndex: message.sindex,
          selectName: message.sname,
          newname: message.name,
          knowledge_id: message.knowledge_id,
          reletedResCount: message.reletedResCount,
          is_knowledge_Repository: true  //判断是否为知识库
        },
      })
    }.bind(this));
  }
  componentWillUnmount() {
    PubSub.unsubscribe(this.pubsub_addKnowledgeSuccess_Echarts);
    PubSub.unsubscribe(this.pubsub_editKnowledgeSuccess_Echarts);
  }
  render() {
    return (
      <div>
        {/* <Layout> */}
        <div style={{ background: '#fff', paddingTop: '10px' }}>
          <Row>
            <Col span={22}>
              <div style={{ float: 'right',display: this.state.display_name }}>
                <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.onclick_button.bind(this, '知识点详情')}>知识点详情</Button> </span>
                <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.onclick_button.bind(this, '添加知识点')}>添加知识点</Button></span>
                <span style={{ paddingLeft: '5px' }}> <Button style={buttoncolor} size="large" onClick={this.onclick_button.bind(this, '修改知识点')}>修改知识点</Button> </span>
                <span style={{ paddingLeft: '5px' }}> <Button style={buttoncolor} size="large" onClick={this.deleteConfirm.bind(this)}>删除知识点</Button></span>
                <span style={{ paddingLeft: '5px', paddingRight: '10px' }}> <Button style={buttoncolor} size="large" onClick={this.onclick_button.bind(this, '关联资源')} >查看关联资源</Button></span>
              </div>
            </Col>
            <Col span={1} onClick={this.display_name.bind(this)}>
              <Icon type='edit' style={{ fontSize: '30px' }} />
            </Col>
            <Col span={1} onClick={this.changIcon.bind(this)}>
              <Icon type={this.state.Icon_name} style={{ fontSize: '30px' }} />
            </Col>
          </Row>
        </div>
        {/* <Layout style={{ padding: '10px 0', background: '#fff' }}>
          <Sider width={1000} style={{ background: '#fff', paddingLeft: '15px', paddingTop: '30px' }}>
            <Card>
              <Link to="/App/KnowledgeRepository_List_Slider/KnowledgeDetail"><Button type="default"  >切换列表模式</Button></Link>
              <MapDisplay eventsOption={this.state.echartsoption}></MapDisplay >
            </Card>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            {this.props.children}
          </Content>
          <Modal
            visible={this.state.visible_delete}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel_delete.bind(this)}
          >
            <span><Icon type="close" style={{ color: "#F00", fontSize: 15 }} />确定要删除该知识点吗？
          </span>
          </Modal>
        </Layout> */}
        <div style={{ background: '#fff', paddingTop: '20px' }}>
          {/* <div style={{ background: '#fff', paddingTop: '20px' }}> */}
          <Row gutter={5}>
            <Col span={this.state.span_left}>
              <Card>
                <Link to="/App/KnowledgeRepository_List_Slider/KnowledgeDetail"><Button type="default"  >切换列表模式</Button></Link>
                <MapDisplay eventsOption={this.state.echartsoption}></MapDisplay >
              </Card>
            </Col>
            <Col span={this.state.span_right}>
              <Scrollbars style={{ height: 800 }}>
                <div style={{ display: this.state.display }}>
                  {this.props.children}
                </div>
              </Scrollbars>
            </Col>
          </Row>
        </div>
        <Modal
          visible={this.state.visible_delete}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel_delete.bind(this)}
        >
          <span><Icon type="close" style={{ color: "#F00", fontSize: 15 }} />确定要删除该知识点吗？
          </span>
        </Modal>
        {/* </Layout> */}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    knowledgeInfo: state.reducer_map_knowledge.knowledgeInfo,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    displayType: (state) => dispatch(state), //左侧导航栏，知识地图及知识点（元）信息
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KnowledgeRepository_Echarts_Slider);
