import React, { Component } from 'react';
import $ from 'jquery';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import '../../../../style_css/antd.css';  // Add
import { Tabs, Icon, Form, Input, Row, Col, Button, Select, InputNumber, Card, Layout, Breadcrumb, Modal, Collapse, Table } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
const { Header, Content, Footer, Sider } = Layout;
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const confirm = Modal.confirm;
const buttoncolor = {
  color: "#fff",
  background: "#FF9900",
  border: "#FF9900",
}
let title = '111115565656'
const formItemLayout = {
  labelCol: {
    xs: { span: 240 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};
class KnowledgeDetail extends React.Component {
  //推荐解释弹出框
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  static contextTypes = {
    router: PropTypes.object
  }
  // 状态机
  constructor(props) {
    super(props);
    // this.getPersonalMapList_personal = this.getPersonalMapList_personal.bind(this);
    this.state = {
      display_type: null,
      id: null,
      title: null,
      knowcontent: null,
      contribute: null,
      keywords: null,
      description: null,
      language: null,
      applicability: null,
      importance: null,
      difficulty: null,
      kcid1: null,
      kcid2: null,
      kcid3: null,
      addtime: null,
      field: null,
      grade: null,
      subject: null,
      recommendContent: [
        { "r_name": '1、概念' },
        { "r_name": '2、认识' },
        { "r_name": '3、入门' },
      ],
      recommendExplanation: [
      ],
    }
  }
  //获取知识点详情
  getknowledgeNodeDetail = (knowledge_id) => {
    // const { knowledgeInfo } = this.props;
    // const knowledge_id = knowledgeInfo.knowledge_id;
    let ajaxTimeOut=$.ajax({
      url: "/api_v1.1/knowledge/getKnowledgeNodeInformations",//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
      type: "GET",
      dataType: "json",
      async: false,
      data: { "knowid": knowledge_id },
      timeout:2000,
      success: function (data) {
        if (data.errorCode == 0) {
          console.log('get获取成功-知识点详情');
          console.log(data);
          this.setState({
            id: data.msg.knowid,
            title: data.msg.title,
            contribute: data.msg.contribute,
            keywords: data.msg.keywords,
            description: data.msg.description,
            language: data.msg.language,
            importance: data.msg.importance,
            field: data.msg.field,
            grade: data.msg.grade,
            addtime: data.msg.addtime
          });
          console.log(this.state.knowledgeDetail);
          // this.render_content_personalMap(this.state.personalMap);
        }
        else {
          console.log('知识点详情获取失败');
          this.setState({ knowledgeDetail: data.msg });
          console.log(this.state.knowledgeDetail);
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
  };
  // 通过用户id，tag，num获取推荐知识地图列表
  getRecommendByContent(URL, DATA) {
    //根据知识点id查看关联资源列表
    console.log('推荐知识地图列表1111111111111111')
    let ajaxTimeOut=$.ajax({
      url: URL,
      type: "GET",
      dataType: "json",
      async: false,
      data: DATA,
      timeout:2000,
      success: function (data) {
        console.log('获取推荐知识地图列表')
        console.log(data.msg)
        if (data.msg.length != 0) {
          this.setState({ recommendContent: data.msg });
        }
        else {
          this.setState({
            recommendContent: [
              // { "r_name": '1、概念' },
              // { "r_name": '2、认识' },
              // { "r_name": '3、入门' },
            ]
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
  // 推荐解释
  recommendExplanation = (URL_recommendExplanation, DATA_recommendExplanation) => {
    const { resourceid_info } = this.props;
    let ajaxTimeOut=$.ajax({
      url: URL_recommendExplanation,
      type: "GET",
      dataType: "json",
      data: DATA_recommendExplanation,
      timeout:2000,
      success: function (data) {
        if (data.erroCode == "0") {
          this.setState({
            recommendExplanation: data.msg
          });
        }
        else {
          this.setState({
            recommendExplanation: [],
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
  //发送推荐资源id到查看资源详情页面
  sendRecommendResourceIdtoResInformation(id) {
    console.log('进入reducer中发送资源id');
    console.log(id);
    const { setRecommendResourceState } = this.props;
    setRecommendResourceState({
      type: 'GetRecommendResourceIDSuccess',
      payload: id
    });
    if (this.state.display_type == '知识库-列表') {
      this.context.router.history.push("/App/KnowledgeRepository_List_Slider/RecommendResourceDetail");
    }
    else {
      this.context.router.history.push("/App/KnowledgeRepository_Echarts_Slider/RecommendResourceDetail");
    }

  }
  componentWillMount() {
    let URL;
    let DATA;
    let URL_recommendExplanation;
    let DATA_recommendExplanation;
    const { displayType } = this.props;
    this.setState({ display_type: displayType.displayType })
    const { knowledgeInfo } = this.props;
    const knowledge_id = knowledgeInfo.knowledge_id;
    const mapContent = knowledgeInfo.mapContent;
    if (mapContent == true) {
      URL = "/api_v1.1/apiPackage/getRecommendByKnow";
      DATA = { "knowId": knowledge_id, "k": 5, "IsKnowId": 1 };
      URL_recommendExplanation = "/api_v1.1/apiPackage/getRelationK";
      DATA_recommendExplanation = { "KnowId": knowledge_id, "IsKnowId": 1 };
      // setTimeout(() => {
      //   this.getRecommendByContent(URL, DATA);
      //   this.getknowledgeNodeDetail(knowledge_id);
      // }, 100);
      this.getknowledgeNodeDetail(knowledge_id);
      this.getRecommendByContent(URL, DATA);
      this.recommendExplanation(URL_recommendExplanation, DATA_recommendExplanation);
    }
  }
  componentWillReceiveProps(nextProps) {
    let URL;
    let DATA;
    let URL_recommendExplanation;
    let DATA_recommendExplanation;
    console.log("打印nextProps")
    console.log(nextProps)
    console.log(nextProps.knowledgeInfo.knowledge_id)
    if (nextProps.knowledgeInfo.mapContent == true) {
      URL = "/api_v1.1/apiPackage/getRecommendByKnow";
      DATA = { "knowId": nextProps.knowledgeInfo.knowledge_id, "k": 5, "IsKnowId": 1 };
      URL_recommendExplanation = "/api_v1.1/apiPackage/getRelationK";
      DATA_recommendExplanation = { "KnowId": nextProps.knowledgeInfo.knowledge_id, "IsKnowId": 1 };
      // setTimeout(() => {
      //   this.getRecommendByContent(URL, DATA);
      //   this.getknowledgeNodeDetail(nextProps.knowledgeInfo.knowledge_id);
      // }, 100);
      this.getknowledgeNodeDetail(nextProps.knowledgeInfo.knowledge_id);
      this.getRecommendByContent(URL, DATA);
      this.recommendExplanation(URL_recommendExplanation, DATA_recommendExplanation);
    }
    const { displayType } = this.props;
    this.setState({ display_type: displayType.displayType })
  }
  render() {
    // 推荐资源
    let   recommendContentList;
    if (this.state.recommendContent.length == 0) {
      recommendContentList = (
        <p>暂无内容</p>
      )
    }
    else{
      recommendContentList = this.state.recommendContent.map((v, i) => {
        return (
          <p style={{ paddingBottom: '10px' }} key={i}>
            <span style={{ paddingRight: '10px' }}>
              {i + 1}、{v.r_name.replace(/^[1-9]/, "").replace(/^、/, "")}
            </span>
            <span><Button style={{ background: "#F1C40F", color: "#fff", float: 'right' }} size="small" onClick={this.sendRecommendResourceIdtoResInformation.bind(this, v.r_id)}>详情</Button></span>
          </p>
        );
      }
      );
    }
    // 推荐解释
    let recommendExplanationList;
    if (this.state.recommendExplanation.length == 0) {
      recommendExplanationList = (
        <p>暂无内容</p>
      )
    }
    else{
      recommendExplanationList = this.state.recommendExplanation.map((v, i) => {
        const columns = [{
          title: '关联资源',
          dataIndex: '关联资源',
          key: '关联资源',
          width: 80,
        }
        ];
        const data = [{
          key: 'i',
          关联资源: <p style={{ width: 200 }}>{i + 1}、{v.title}</p>,
        }
        ];
        return (
          <div>
            <Table columns={columns} dataSource={data} pagination={false} showHeader={false} size="middle" />
          </div>
        );
      }
      );
    }
    if (this.state.display_type == '知识库-列表') {
      return (
        <div>
          {/* <div style={{ paddingTop: '30px' }}> */}
          <div >
            <div >
              <Card style={{ height: '1000px' }}>
                <Row>
                  <Col span={15}>
                    <div style={{ height: '700px', paddingTop: '30px' }}>
                      <Form >
                        <FormItem
                          label={<span style={{ fontWeight: 'bold' }}>知识点名称</span>}
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 15 }}
                          hasFeedback
                          style={{ marginBottom: '5px' }}
                        >
                          <span >{this.state.title}</span>
                        </FormItem>
                        <FormItem
                          label={<span style={{ fontWeight: 'bold' }}>知识点描述</span>}
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 18 }}
                          hasFeedback
                          style={{ marginBottom: '5px' }}
                        >
                          <span style={{ width: '300px' }}>{this.state.description}</span>
                        </FormItem>
                        <FormItem
                          label={<span style={{ fontWeight: 'bold' }}>关键字</span>}
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 10 }}
                          hasFeedback
                          style={{ marginBottom: '5px' }}
                        >
                          <span >{this.state.keywords}</span>
                        </FormItem>
                        <FormItem
                          label={<span style={{ fontWeight: 'bold' }}>重要程度</span>}
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 10 }}
                          hasFeedback
                          style={{ marginBottom: '5px' }}
                        >
                          <span >{this.state.importance}</span>
                        </FormItem>
                        <FormItem
                          label={<span style={{ fontWeight: 'bold' }}>领域</span>}
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 10 }}
                          hasFeedback
                          style={{ marginBottom: '5px' }}
                        >
                          <span >{this.state.field}</span>
                        </FormItem>
                        <FormItem
                          label={<span style={{ fontWeight: 'bold' }}>学段</span>}
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 10 }}
                          hasFeedback
                          style={{ marginBottom: '5px' }}
                        >
                          <span >{this.state.grade}</span>
                        </FormItem>

                        <FormItem
                          label={<span style={{ fontWeight: 'bold' }}>添加者</span>}
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 10 }}
                          hasFeedback
                          style={{ marginBottom: '5px' }}
                        >
                          <span >{this.state.contribute}</span>
                        </FormItem>
                        <FormItem
                          label={<span style={{ fontWeight: 'bold' }}>添加时间</span>}
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 18 }}
                          hasFeedback
                          style={{ marginBottom: '5px' }}
                        >
                          <p>{this.state.addtime}</p>
                        </FormItem>
                      </Form>
                    </div>
                  </Col >
                  <Col span={9}>
                    <div style={{ paddingTop: '30px' }}>
                      <Card title={<p style={{ paddingBottom: '10px' }}><Button style={buttoncolor} size="large">资源推荐</Button>
                        <span style={{ paddingLeft: 10 }}><Button style={buttoncolor} onClick={this.showModal} size="large">推荐解释</Button></span>
                      </p>} bordered={true} >
                        {recommendContentList}
                      </Card>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </div>
          <Modal
          style={{top:100}}
            title={<p>
              <Button style={buttoncolor}>当前知识点：</Button>
              <span style={{ paddingLeft: 10 }}>{this.state.title}</span>
            </p>}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>关联知识点</Button></p>
            {recommendExplanationList}
          </Modal>
        </div >
      );

    }
    else {
      return (
        <div>
          {/* <div style={{ paddingTop: '30px' }}> */}
          <div >
            <div >
              <Card style={{ height: '900px' }}>
                {/* <Card > */}
                <Collapse defaultActiveKey="1">
                  <Panel header={<Button style={buttoncolor} size="large">知识点详情</Button>} key="1" style={{ background: "#fff" }}>
                    <Form >
                      <FormItem
                        label={<span style={{ fontWeight: 'bold', textAlign: 'left' }}>知识点名称</span>}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 15 }}
                        hasFeedback
                        style={{ marginBottom: '5px', textAlign: 'left' }}
                      >
                        <span >{this.state.title}</span>
                      </FormItem>
                      <FormItem
                        label={<span style={{ fontWeight: 'bold', textAlign: 'left' }}>知识点描述</span>}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 18 }}
                        hasFeedback
                        style={{ marginBottom: '5px', textAlign: 'left' }}
                      >
                        <span style={{ width: '300px' }}>{this.state.description}</span>
                      </FormItem>
                      <FormItem
                        label={<span style={{ fontWeight: 'bold', textAlign: 'left' }}>关键字</span>}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 10 }}
                        hasFeedback
                        style={{ marginBottom: '5px', textAlign: 'left' }}
                      >
                        <span >{this.state.keywords}</span>
                      </FormItem>
                      <FormItem
                        label={<span style={{ fontWeight: 'bold', textAlign: 'left' }}>重要程度</span>}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 10 }}
                        hasFeedback
                        style={{ marginBottom: '5px', textAlign: 'left' }}
                      >
                        <span >{this.state.importance}</span>
                      </FormItem>
                      <FormItem
                        label={<span style={{ fontWeight: 'bold', textAlign: 'left' }}>领域</span>}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 10 }}
                        hasFeedback
                        style={{ marginBottom: '5px', textAlign: 'left' }}
                      >
                        <span >{this.state.field}</span>
                      </FormItem>
                      <FormItem
                        label={<span style={{ fontWeight: 'bold', textAlign: 'left' }}>学段</span>}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 10 }}
                        hasFeedback
                        style={{ marginBottom: '5px', textAlign: 'left' }}
                      >
                        <span >{this.state.grade}</span>
                      </FormItem>

                      <FormItem
                        label={<span style={{ fontWeight: 'bold', textAlign: 'left' }}>添加者</span>}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 10 }}
                        hasFeedback
                        style={{ marginBottom: '5px', textAlign: 'left' }}
                      >
                        <span >{this.state.contribute}</span>
                      </FormItem>
                      <FormItem
                        label={<span style={{ fontWeight: 'bold', textAlign: 'left' }}>添加时间</span>}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 18 }}
                        hasFeedback
                        style={{ marginBottom: '5px', textAlign: 'left' }}
                      >
                        <p>{this.state.addtime}</p>
                      </FormItem>
                    </Form>
                  </Panel>
                </Collapse>
                <Collapse defaultActiveKey="1">
                  <Panel header={<p><Button style={buttoncolor} size="large">资源推荐</Button>
                    <span style={{ paddingLeft: 10 }}><Button style={buttoncolor} onClick={this.showModal} size="large">推荐解释</Button></span>
                  </p>} key="1" style={{ background: "#fff" }}>
                    {recommendContentList}
                  </Panel>
                </Collapse>
              </Card>
            </div>
          </div>
          <Modal
           style={{top:100}}
            title={<p>
              <Button style={buttoncolor}>当前知识点：</Button>
              <span style={{ paddingLeft: 10 }}>{this.state.title}</span>
            </p>}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>关联知识点</Button></p>
            {recommendExplanationList}
          </Modal>
        </div >
      );
    }

  }
}
KnowledgeDetail = Form.create()(KnowledgeDetail);
function mapStateToProps(state) {
  return {
    knowledgeInfo: state.reducer_map_knowledge.knowledgeInfo,
    selectMapSubject: state.reducer_map_subject.selectMapSubject,
    displayType: state.reducer_diaplay_type.displayType,

  };
}
function mapDispatchToProps(dispatch) {
  return {
    setRecommendResourceState: (state) => dispatch(state),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KnowledgeDetail);

