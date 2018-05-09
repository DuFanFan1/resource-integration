import React, { Component } from 'react';
import $ from 'jquery';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import PropTypes from "prop-types";
import { Scrollbars } from 'react-custom-scrollbars';
import '../../../style_css/antd.css';  // Add
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Input, Card, Select, Button, Form, Tabs, Modal, Radio } from 'antd';
import Map_Display from '../echarts/MapDisplay.js';
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
class KnowledgeManage_Echarts_Slider extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  constructor() {
    super()
    this.state = {
      diaplay_name: 'none',
      display_changMap: 'none',
      diaplay_span_icon: 'none',
      Icon_name: 'menu-fold',
      display: 'none',
      span_left: 24,
      span_right: 0,
      grade: '', //学段
      version: '', //版本
      echartsoption: {
        ifDelete: false,
        selectName: '',
        selectIndex: -1,
        ifAdd: false,
        ifBatchAdd: false,
        selectcategory: -1,
        newcategory: -1,
        newname: '',
        chang_Map: false,
        mapId: null,
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
        ifBatchAdd: false,
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
    let URL
    let DATA
    const { knowledgeInfo } = this.props;
    this.setState({
      echartsoption: {
        ifDelete: true,
        ifAdd: false,
        ifBatchAdd: false,
        ifEdit: false,
        chang_Map: false,
        selectIndex: knowledgeInfo.index,
        selectName: knowledgeInfo.knowledge_name,
        selectcategory: knowledgeInfo.category,
      },
      visible_delete: false,
    });
    if (knowledgeInfo.is_knowledge == '否') {
      URL = "/api_v1.1/knowledge_struct/deleteStructNode"
      DATA = { "structid": knowledgeInfo.knowledge_id, 'pre_structid': knowledgeInfo.pre_knowid }
      console.log('删除DATA11111')
      console.log(DATA)
    }
    else {
      URL = "/api_v1.1/knowledge_struct_rela_know/deleteRelationKnowid"
      DATA = { "knowid": knowledgeInfo.knowledge_id, }
    }
    this.deleteKnowledge(URL, DATA);
  }
  //删除网络请求
  deleteKnowledge = (URL, DATA) => {
    let ajaxTimeOut = $.ajax({
      // url:"/api_v1.1/knowledge_struct/deleteStructNode" ,//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
      url: URL,//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
      type: "GET",
      dataType: "json",
      // data: { "structid": this.state.knowid,'pre_structid':this.state.pre_structid },
      data: DATA,
      timeout: 2000,
      success: function (data) {
        console.log('data');
        console.log(data);
        if (data.errorCode == 0) {
          // const { mapInfo } = this.props;
          // console.log(mapInfo)
          // const map_id = mapInfo.map_id;
          // this.getKnowledgeRelationStruct(map_id);
          Modal.success({
            title: '友情提示',
            content: '操作成功',
          });
        }
        else {
          Modal.error({
            title: '友情提示',
            content: '操作失败',
          });
        }

      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this),
      complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
        if (status == 'timeout') {//超时,status还有success,error等值的情况
          ajaxTimeOut.abort(); //取消请求
          Modal.warning({
            title: '友情提示',
            content: '网络不稳定',
          });
        }
      }
    });
  }
  handleCancel_delete() {
    this.setState({
      visible_delete: false,
    });
  }
  // 添加知识点按钮单击事件
  addStruct() {
    const { knowledgeInfo } = this.props;
    if (knowledgeInfo.is_knowledge == '否' || knowledgeInfo.mapContent == false) { this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/AddStruct"); }
    else { this.confirm_alert() }
  }
  // 添加知识点按钮单击事件
  editStruct() {
    const { knowledgeInfo } = this.props;
    if (knowledgeInfo.is_knowledge == '否') { this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/EditStruct"); }
    else { this.confirm_alert() }
  }
  // 关联知识点按钮单击事件
  relatedknowledge() {
    const { knowledgeInfo } = this.props;
    if (knowledgeInfo.is_knowledge == '否') { this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/Relatedknowledge"); }
    else { this.confirm_alert() }
  }
  // 关联资源
  relatedResourse() {
    // const { knowledgeInfo } = this.props;
    // if (knowledgeInfo.is_knowledge == '是') {
    this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/ResList");
    // }
    // else { this.confirm_alert() }
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
  //无权操作提示语
  confirm_alert() {
    Modal.warning({
      title: '友情提示：',
      content: '此节点无权进行此操作',
    });
  }
  // 按钮的单击事件（详情，添加知识点，编辑知识点，关联知识点）
  onclick_button(button_name) {
    if (button_name == '查看详情') {
      this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/StructDetail");
    }
    else if (button_name == '添加节点') {
      const { mapType } = this.props;
      if (mapType.mapType == '主题图') {
        this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/AddTopMapStruct");
      }
      else {
        this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/AddStruct");
      }

    }
    else if (button_name == '关联知识点') {
      const { mapType } = this.props;
      if (mapType.mapType == '标准地图') {
        this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/Relatedknowledge_Auto");
      }
      else {
        this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/Relatedknowledge");
      }
    }
    else if (button_name == '修改节点') {
      this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/EditStruct");
    }
    else if (button_name == '关联资源') {
      this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/ResList");
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
  // 学段
  change_grade(e) {
    console.log("学段:" + e.target.value);
    this.setState({
      grade: e.target.value, //学段
      version: this.state.version, //版本
    })
  }
  // 版本
  change_version(e) {
    console.log("版本:" + e.target.value);
    this.setState({
      grade: this.state.grade, //学段
      version: e.target.value, //版本
    })
  }
  changMap() {
    console.log('this.state.grade');
    console.log(this.state.grade);
    console.log('this.state.version');
    console.log(this.state.version);
    const { selectMapSubject } = this.props;
    console.log('selectMapSubject.subject_name');
    console.log(selectMapSubject.subject_name);
    let ajaxTimeOut = $.ajax({
      // url: URL,
      url: "/api_v1.1/knowledge_struct_index/queryKnowledgeMapbySFVT",
      type: "GET",
      dataType: "json",
      async: false,
      data: { "subject": selectMapSubject.subject_name, "grade": this.state.grade, "version": this.state.version, "kmap_type": '标准地图' },
      timeout: 2000,
      success: function (data) {
        console.log('data');
        console.log(data);
        if (data.errorCode == 1) {
          console.log('暂无数据')
          Modal.warning({
            title: '友情提示：',
            content: '暂无数据',
          });
        }
        else {
          console.log('data.msg[0].mapid');
          console.log(data.msg[0].mapid);
          const { mapInfo } = this.props
          mapInfo({
            type: 'mapInfo',
            payload: {
              mapContent: true,
              map_id: data.msg[0].mapid,
              map_name: data.msg[0].name,
              version: data.msg[0].version,
            }
          });
          // this.setState({diaplay_name:'Map_Display3'})
          // this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/StructDetail");
          this.setState({
            echartsoption: {
              ifEdit: false,
              ifAdd: false,
              ifBatchAdd: false,
              ifDelete: false,
              chang_Map: true,
              mapId: data.msg[0].mapid,
              is_chang_Map: true,

            },
          })

          // console.log('this.state.echartsoption', this.state.echartsoption);
        }
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this),
      complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
        if (status == 'timeout') {//超时,status还有success,error等值的情况
          ajaxTimeOut.abort(); //取消请求
          Modal.warning({
            title: '友情提示',
            content: '网络不稳定',
          });
        }
      }
    });

  }
  display_name() {
    if (this.state.diaplay_span_icon == 'none') {
      this.setState({
        diaplay_span_icon: 'block',
      })
    }
    else if (this.state.diaplay_span_icon == 'block') {
      this.setState({
        diaplay_span_icon: 'none',
      })

    }
  }
  componentWillMount() {
    const { mapGrage } = this.props;
    const { mapVersion } = this.props;
    const { mapType } = this.props;
    if (mapType.mapType == '标准地图') {
      this.setState({ display_changMap: 'block' })
      this.setState({
        grade: mapGrage.grade, //学段
        version: mapVersion.version, //版本
      })
    }
    else { this.setState({ display_changMap: 'none' }) }

    const { displayType } = this.props
    displayType({
      type: 'displayType',
      payload: {
        displayType: '知识地图-地图',
      }
    });
  }
  componentDidMount() {
    this.pubsub_addStructSuccess_Echarts = PubSub.subscribe('addStructSuccess_Echarts', function (topic, message) {
      console.log('message')
      console.log(message)
      this.setState({
        echartsoption: {
          ifAdd: true,
          ifBatchAdd: false,
          ifDelete: false,
          chang_Map: false,
          selectIndex: message.sindex,
          selectName: message.sname,
          newname: message.name,
          // 新添加字段
          knowledge_id: message.knowledge_id,
          is_knowledge: message.is_knowledge,
          pre_knowid: message.pre_knowid,
          mapContent: true,
        },
        // visible_delete: false
      })
    }.bind(this));
    this.pubsub_batchAddStructSuccess_Echarts = PubSub.subscribe('batchAddStructSuccess_Echarts', function (topic, message) {
      console.log('message')
      console.log(message)
      this.setState({
        echartsoption: {
          ifAdd: false,
          ifBatchAdd: true,
          ifDelete: false,
          chang_Map: false,
          selectIndex: message.sindex,
          selectName: message.sname,
          newname: message.names,

        },
        // visible_delete: false
      })
    }.bind(this));
    this.pubsub_editStructSuccess_Echarts = PubSub.subscribe('editStructSuccess_Echarts', function (topic, message) {
      console.log('message')
      console.log(message)
      this.setState({
        echartsoption: {
          ifEdit: true,
          ifAdd: false,
          ifBatchAdd: false,
          ifDelete: false,
          chang_Map: false,
          selectIndex: message.sindex,
          selectName: message.sname,
          newname: message.name,
          reletedResCount: message.reletedResCount,
          is_knowledge_Repository: false //判断是否为知识库
          // ifEdit: false,
          // ifAdd: false,
          // ifBatchAdd: false,
          // ifDelete: false,
          // chang_Map: true,
          // mapId:7
        },
      })
    }.bind(this));
    this.pubsub_BatchAddTopMapStructSuccess = PubSub.subscribe('BatchAddTopMapStructSuccess', function (topic, message) {
      console.log('批量导入主题图结构成功-监听传递-message---0305')
      const { isBatchAddTopMapStruct } = this.props;
      isBatchAddTopMapStruct({
        type: 'isBatchAddTopMapStruct',
        payload: {
          isBatchAddTopMapStruct: false,
        },
      });
      console.log(message)
      const { mapInfo } = this.props;
      this.setState({
        echartsoption: {
          chang_Map: true,
          mapId: message
        },
      })
    }.bind(this));
  }
  componentWillUnmount() {
    PubSub.unsubscribe(this.pubsub_addStructSuccess_Echarts);
    PubSub.unsubscribe(this.pubsub_batchAddStructSuccess_Echarts);
    PubSub.unsubscribe(this.pubsub_editStructSuccess_Echarts);
    PubSub.unsubscribe(this.pubsub_BatchAddTopMapStructSuccess);
  }
  render() {
    return (
      <div>
        {/* <Layout> */}
        <div style={{ background: '#fff', paddingTop: '20px' }}>
          <Row >
            <Col span={1}>
            </Col>
            <Col span={11}>
              <div style={{ display: this.state.display_changMap }}>
                学段：
              <RadioGroup value={this.state.grade} onChange={this.change_grade.bind(this)} >
                  <RadioButton value="小学" >小学</RadioButton>
                  <RadioButton value="初中" >初中</RadioButton>
                  <RadioButton value="高中" >高中</RadioButton>
                </RadioGroup>
                <span style={{ marginLeft: '10px' }}>版本：</span>

                <RadioGroup value={this.state.version} onChange={this.change_version.bind(this)}>
                  <RadioButton value="人教版" >人教版</RadioButton>
                  <RadioButton value="苏教版" >苏教版</RadioButton>
                </RadioGroup>
                <Button size="small" type='primary' onClick={this.changMap.bind(this)}>确定</Button>
              </div>
            </Col>
            <Col span={22}>
            </Col>
          </Row>
        </div>
        <div style={{ background: '#fff', paddingTop: '10px' }}>
          <Row>
            <Col span={22}>
              <div style={{ float: 'right', display: this.state.diaplay_span_icon }}>
                <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.onclick_button.bind(this, '查看详情')}>查看详情</Button> </span>
                <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.onclick_button.bind(this, '添加节点')}>添加节点</Button></span>
                <span style={{ paddingLeft: '5px' }}> <Button style={buttoncolor} size="large" onClick={this.onclick_button.bind(this, '关联知识点')}>关联知识点</Button> </span>
                <span style={{ paddingLeft: '5px' }}>  <Button style={buttoncolor} size="large" onClick={this.onclick_button.bind(this, '修改节点')}>修改节点</Button></span>
                <span style={{ paddingLeft: '5px' }}>  <Button style={buttoncolor} size="large" onClick={this.deleteConfirm.bind(this)}>删除节点</Button></span>
                <span style={{ paddingLeft: '5px', paddingRight: '10px' }}>  <Button style={buttoncolor} size="large" onClick={this.onclick_button.bind(this, '关联资源')}>查看关联资源</Button></span>
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
              <Link to="/App/KnowledgeManage_List_Slider/StructDetail"><Button type="default" >切换列表模式</Button></Link>
              <Map_Display eventsOption={this.state.echartsoption}></Map_Display >
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
              <Card style={{ paddingTop: '5px' }}>
                {/* <Card style={{paddingTop: '50px' }}> */}
                <Button type="primary" style={{ marginRight: '5px' }}>版本：{this.state.version}</Button>
                <Link to="/App/KnowledgeManage_List_Slider/StructDetail"><Button type="default" >切换列表模式</Button></Link>
                {/* <this.state.diaplay_name eventsOption={this.state.echartsoption}></this.state.diaplay_name > */}
                <Map_Display eventsOption={this.state.echartsoption}></Map_Display >
              </Card>
            </Col>
            <Col span={this.state.span_right}>
              <Scrollbars style={{ height: 800 }}>
                <div >
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
    mapVersion: state.reducer_map_version.mapVersion,
    mapGrage: state.reducer_map_grade.mapGrage,
    selectMapSubject: state.reducer_map_subject.selectMapSubject,
    mapType: state.reducer_map_type.mapType,
    mapInfo: state.reducer_map_info.mapInfo,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    displayType: (state) => dispatch(state), //左侧导航栏，知识地图及知识点（元）信息
    mapInfo: (state) => dispatch(state), //左侧导航栏，知识地图及知识点（元）信息
    isBatchAddTopMapStruct: (state) => dispatch(state),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KnowledgeManage_Echarts_Slider);
