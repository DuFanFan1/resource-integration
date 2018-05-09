import React, { Component } from 'react';
import $ from 'jquery';
import base64 from 'base-64';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import '../../../../style_css/antd.css';  // Add
import { Card, Icon, Row, Col, Button, Form, Modal, Tabs, Collapse, Input, Table, Pagination, Alert } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Panel = Collapse.Panel;
const buttoncolor = {
  color: "#fff",
  background: "#FF9900",
  border: "#FF9900",
}
class StructDetail extends React.Component {
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
  constructor(props, context) {
    super(props, context);
    // this.getPersonalMapList_personal = this.getPersonalMapList_personal.bind(this);
    this.state = {
      display_type: null,
      display: "block",
      display_recommendContent: "none",
      display_recommendContent_result: "none",
      display_recommendContent_hasLearn: "none",
      display_recommendContent_relation: "none",
      allpages: -1,
      current: 1,
      total: null,
      knowledgeDetail:
        [
          {
            "knowid": null,
            "title": null,
            "description": null,
            "contribute": null,
            "keywords": null,
            "language": null,
            "applicability": null,
            "importance": null,
            "is_knowledge": null,
            "field": null,
            "subject": null,
            "addtime": null,
            "updatetime": null
          }
        ],
      StructDetail:
        [
          {
            "knowid": null,
            "title": null,
            "description": null,
            "contribute": null,
            "keywords": null,
            "language": null,
            "applicability": null,
            "importance": null,
            "is_knowledge": null,
            "field": null,
            "subject": null,
            "addtime": null,
            "updatetime": null
          }
        ],
      relation_res: [{ "title": null }],
      relatedKnowledge: [],
      recommendContent: [
        { "r_name": '' },
        { "r_name": '' },
        { "r_name": '' },
      ],
      recommendExplanation: [
        {
          "title": " ",
        }
      ],
      recommendExplanation_hasLearn: [
        {
          "title": " ",
        }
      ],
      recommendExplanation_relation: [
        {
          "title": " ",
        }
      ],
      // recommendContent: [{ "kmapid": 1, "kmap_name": "六年级数学下册课程知识地图" }],
    }
  }
  //获取地图节点详情
  getKnowledgeStructDetails = (id) => {
    console.log('knowledgeElement')
    console.log(id)
   let ajaxTimeOut= $.ajax({
      url: "/api_v1.1/knowledge_struct/getKnowledgeStructDetails",//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
      type: "GET",
      dataType: "json",
      data: { "structid": id },
      async: false,
      timeout:2000,
      success: function (data) {
        console.log(id)
        console.log(data)
        if (data.errorCode == 0) {
          console.log('获取地图节点详情-data');
          console.log(data);
          this.setState({ StructDetail: data.msg });
          console.log('获取地图节点详情-this.state.knowledgeDetail');
          console.log(this.state.knowledgeDetail);
          // this.render_content_personalMap(this.state.personalMap);
        }
        else {
          console.log('没有详情信息');
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
  //获取地图关联知识点详情
  getKnowledgeNodeInformations = (id) => {

    console.log('knowledgeElement')
    console.log(id)
    let ajaxTimeOut=$.ajax({
      url: "/api_v1.1/knowledge/getKnowledgeNodeInformations",//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
      type: "GET",
      dataType: "json",
      data: { "knowid": id },
      async: false,
      timeout:2000,
      success: function (data) {
        console.log(id)
        console.log(data)
        if (data.errorCode == 0) {
          console.log('获取地图关联知识点详情-data');
          console.log(data);
          this.setState({ knowledgeDetail: data.msg });
          console.log('获取地图关联知识点详情-this.state.knowledgeDetail');
          console.log(this.state.knowledgeDetail);
          // this.render_content_personalMap(this.state.personalMap);
        }
        else {
          console.log('没有详情信息-私有');
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
    console.log('URL', URL)
    console.log('DATA', DATA)
    let ajaxTimeOut=$.ajax({
      url: URL,
      type: "GET",
      dataType: "json",
      data: DATA,
      async: false,
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
          if (this.state.display_recommendContent == 'block') {
            console.log("data.msg.hasLearn", +data.msg.hasLearn)
            this.setState({
              recommendExplanation: data.msg.relation,
              recommendExplanation_hasLearn: data.msg.hasLearn,
              recommendExplanation_relation: data.msg.result,
            });
          }
          else {
            this.setState({
              recommendExplanation: data.msg
            });
          }
        }
        else {
          this.setState({
            recommendExplanation: [],
            recommendExplanation_hasLearn: [],
            recommendExplanation_relation: [],
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
  // 获取节点关联知识点
  getpresentKnowledgeStructResNodeDetail = (page) => {
    const { mapInfo } = this.props;
    const { knowledgeInfo } = this.props;
    let ajaxTimeOut=$.ajax({
      url: '/api_v1.1/knowledge_struct/presentViewKnowledgeStructResNodeDetail',
      // url: '/api_v1.1/knowledge_struct/presentKnowledgeStructResNodeDetail',
      type: "GET",
      dataType: "json",
      data: { "structid": knowledgeInfo.knowledge_id, "mapid": mapInfo.map_id, "count": 3, "page": page },
      timeout:2000,
      // data: { "structid": 943, "mapid": 11, "level": 1 },
      success: function (data) {
        console.log('获取节点关联知识点111111111111111111')
        if (data.errorCode == 0) {
          if (data.allpages != 0) {
            console.log('成功获取节点关联知识点')
            console.log(data.msg)
            this.setState({
              relatedKnowledge: data.msg.rows,
              allpages: data.allpages,
              total: data.msg.count,
              current: page,
              display: "none"
            });
          }
          else {
            this.setState({
              relatedKnowledge: [],
              display: "block"
            });
          }
        }
        else {
          this.setState({
            relatedKnowledge: [],
            display: "block"
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
    const { displayType } = this.props;
    if (displayType.displayType == '知识地图-列表') {
      this.context.router.history.push("/App/KnowledgeManage_List_Slider/RecommendResourceDetail");
    }
    else {
      this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/RecommendResourceDetail");
    }
  }
  componentWillMount() {
    let URL;
    let DATA;
    let URL_recommendExplanation;
    let DATA_recommendExplanation;
    const { mapVersion } = this.props;
    const { mapType } = this.props;
    const { displayType } = this.props;
    const { mapInfo } = this.props;
    this.setState({ display_type: displayType.displayType })
    const { knowledgeInfo } = this.props;
    this.setState({ is_knowledge: knowledgeInfo.is_knowledge })
    this.setState({ knowledge_id: knowledgeInfo.knowledge_id })
    const knowledge_id = knowledgeInfo.knowledge_id;
    const mapContent = knowledgeInfo.mapContent;
    if (mapContent == true) {
      // if(this.state.knowledge_id == 35)
      if (mapType.mapType == '标准地图' || mapType.mapType == '主题图') {
        this.setState({ display_recommendContent: 'none' })
        var encode = base64.encode(encodeURI(mapInfo.version));
        console.log('encode')
        console.log(encode)
        var decode = base64.decode(encode);
        var decode1 = decodeURI(base64.decode(encode));
        console.log('decode')
        console.log(decode)
        URL = "/api_v1.1/apiPackage/getRecommendByKnowForV";
        DATA = { "KnowId": knowledge_id, "Version": mapInfo.version, "k": 5, "IsKnowId": knowledgeInfo.is_knowledge == '是' ? 1 : 0 };
        URL_recommendExplanation = "/api_v1.1/apiPackage/getRelationK";
        DATA_recommendExplanation = { "KnowId": knowledge_id, "IsKnowId": knowledgeInfo.is_knowledge == '是' ? 1 : 0 };
      }
      else if (mapType.mapType == '我的地图') {
        this.setState({ display_recommendContent: 'block' })
        const { login_info } = this.props;
        URL = "/api_v1.1/apiPackage/getRecommendByKnowForUser";
        DATA = { "UserId": login_info.userid, "KnowId": knowledge_id, "k": 5, "IsKnowId": knowledgeInfo.is_knowledge == '是' ? 1 : 0 };
        URL_recommendExplanation = "/api_v1.1/apiPackage/getRelationKWithUser";
        DATA_recommendExplanation = { "UserId": login_info.userid, "KnowId": knowledge_id, "IsKnowId": knowledgeInfo.is_knowledge == '是' ? 1 : 0 };
      }
      // setTimeout(() => {
      //   this.getRecommendByContent(URL, DATA);
      // }, 100)
      if (knowledgeInfo.is_knowledge == '是') {
        // var Version = base64encode(mapVersion.version);
        // console.log('Version:'+Version)
        this.getKnowledgeNodeInformations(knowledge_id);
        this.getRecommendByContent(URL, DATA);
        this.recommendExplanation(URL_recommendExplanation, DATA_recommendExplanation);
      }
      else {
        let page = 1;
        this.getKnowledgeStructDetails(knowledge_id);
        this.getRecommendByContent(URL, DATA);
        this.recommendExplanation(URL_recommendExplanation, DATA_recommendExplanation);
        this.getpresentKnowledgeStructResNodeDetail(page)
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    let URL;
    let DATA;
    let URL_recommendExplanation;
    let DATA_recommendExplanation;
    const { mapInfo } = this.props;
    const { mapType } = this.props;
    const { displayType } = this.props;
    const { mapVersion } = this.props;
    this.setState({ display_type: displayType.displayType })
    console.log("打印nextProps")
    console.log(nextProps)
    console.log(nextProps.knowledgeInfo.knowledge_id)
    this.setState({ is_knowledge: nextProps.knowledgeInfo.is_knowledge })
    this.setState({ knowledge_id: nextProps.knowledgeInfo.knowledge_id })
    if (nextProps.knowledgeInfo.mapContent == true) {

      // this.getKnowledgeNodeInformations(nextProps.knowledgeInfo.knowledge_id)

      if (mapType.mapType == '标准地图' || mapType.mapType == '主题图') {
        this.setState({ display_recommendContent: 'none' })
        var encode = base64.encode(encodeURI(mapInfo.version));
        console.log('encode')
        console.log(encode)
        var decode = base64.decode(encode);
        var decode1 = decodeURI(base64.decode(encode));
        console.log('decode')
        console.log(decode)
        URL = "/api_v1.1/apiPackage/getRecommendByKnowForV";
        DATA = { "KnowId": nextProps.knowledgeInfo.knowledge_id, "Version": mapInfo.version, "k": 5, "IsKnowId": nextProps.knowledgeInfo.is_knowledge == '是' ? 1 : 0 };
        URL_recommendExplanation = "/api_v1.1/apiPackage/getRelationK";
        DATA_recommendExplanation = { "KnowId": nextProps.knowledgeInfo.knowledge_id, "IsKnowId": nextProps.knowledgeInfo.is_knowledge == '是' ? 1 : 0 };
      }
      else if (mapType.mapType == '我的地图') {
        this.setState({ display_recommendContent: 'block' })
        const { login_info } = this.props;
        URL = "/api_v1.1/apiPackage/getRecommendByKnowForUser";
        DATA = { "UserId": login_info.userid, "KnowId": nextProps.knowledgeInfo.knowledge_id, "k": 5, "IsKnowId": nextProps.knowledgeInfo.is_knowledge == '是' ? 1 : 0 };
        URL_recommendExplanation = "/api_v1.1/apiPackage/getRelationKWithUser";
        DATA_recommendExplanation = { "UserId": login_info.userid, "KnowId": nextProps.knowledgeInfo.knowledge_id, "IsKnowId": nextProps.knowledgeInfo.is_knowledge == '是' ? 1 : 0 };
      }
      // setTimeout(() => {
      //   this.getRecommendByContent(URL, DATA);
      // }, 100)
      if (nextProps.knowledgeInfo.is_knowledge == '是')
      // if(nextProps.knowledgeInfo.knowledge_id == 35)
      {
        // var Version = base64encode(mapVersion.version);
        // console.log('Version:'+Version)
        this.getKnowledgeNodeInformations(nextProps.knowledgeInfo.knowledge_id)
        this.getRecommendByContent(URL, DATA);
        this.recommendExplanation(URL_recommendExplanation, DATA_recommendExplanation);
      }
      else {
        let page = 1;
        this.getKnowledgeStructDetails(nextProps.knowledgeInfo.knowledge_id);
        this.getRecommendByContent(URL, DATA);
        this.recommendExplanation(URL_recommendExplanation, DATA_recommendExplanation);
        this.getpresentKnowledgeStructResNodeDetail(page)
      }
    }

  }

  render() {
    // 推荐资源
    let recommendContentList;
    if (this.state.recommendContent == "no response from server") {
      recommendContentList = (
        <p></p>
      )
    } else {
      recommendContentList = this.state.recommendContent.map((v, i) => {
        return (
          <p key={i}>
            <p>
              {i + 1}、{v.r_name.replace(/^[1-9]/, "").replace(/^、/, "")}
              <Button style={{ background: "#F1C40F", color: "#fff", float: 'right' }} size="small" onClick={this.sendRecommendResourceIdtoResInformation.bind(this, v.r_id)}>详情</Button>
            </p><br />
          </p>
        );
      }
      );
    }
    // 推荐解释-关联知识点
    let recommendExplanationList;
    if (this.state.recommendExplanation.length == 0) {
      recommendExplanationList = (
        <p>暂无内容</p>
      )
    }
    else {
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
      });
    }

    // 推荐解释-已学习知识点
    let recommendExplanationList_hasLearn
    if (this.state.recommendExplanation_hasLearn == 0) {
      recommendExplanationList_hasLearn = (
        <p>暂无内容</p>
      )
    }
    else {
      recommendExplanationList_hasLearn = this.state.recommendExplanation_hasLearn.map((v, i) => {
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
    // 推荐解释-推荐知识点
    let recommendExplanationList_relation
    if (this.state.recommendExplanation_relation.length == 0) {
      recommendExplanationList_relation = (
        <p>暂无内容</p>
      )
    }
    else {
      recommendExplanationList_relation = this.state.recommendExplanation_relation.map((v, i) => {
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
      });

    }
    //关联知识点
    const relatedKnowledgeList = this.state.relatedKnowledge.map((v, i) => {
      return (
        <p key={i}>
          <p>
            {i + 1}、{v.title}
            {/* {i + 1}、{v.knowledge[0].title} */}
          </p><br />
        </p>
      );
    }
    );
    if (this.state.display_type == '知识地图-列表') {
      if (this.state.is_knowledge == '是') {
        return (
          <div>
            <div >
              <div >
                <Card style={{ height: '1750px', paddingTop: '20px' }} >
                  <Row>
                    <Col span={13}>
                      <div style={{ height: '700px', paddingTop: '30px' }}>
                        <Form >
                          {/* <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>是否为知识点</span>}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 8 }}
                            hasFeedback
                          >
                            <span >{this.state.knowledgeDetail.is_knowledge}</span>
                          </FormItem> */}
                          <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>知识点名称</span>}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 15 }}
                            hasFeedback
                            style={{ marginBottom: '5px' }}
                          >
                            <span >{this.state.knowledgeDetail.title}</span>
                          </FormItem>
                          <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>知识点描述</span>}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 15 }}
                            hasFeedback
                            style={{ marginBottom: '5px' }}
                          >
                            <span >{this.state.knowledgeDetail.description}</span>
                          </FormItem>
                          <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>关键字</span>}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 10 }}
                            hasFeedback
                            style={{ marginBottom: '5px' }}
                          >
                            <span >{this.state.knowledgeDetail.keywords}</span>
                          </FormItem>
                          {/* <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>适用对象</span>}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 8 }}
                            hasFeedback
                          >
                            <span >{this.state.knowledgeDetail.applicability}</span>
                          </FormItem> */}
                          <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>重要程度</span>}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 10 }}
                            hasFeedback
                            style={{ marginBottom: '5px' }}
                          >
                            <span >{this.state.knowledgeDetail.importance}</span>
                          </FormItem>
                          <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>语言</span>}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 10 }}
                            hasFeedback
                            style={{ marginBottom: '5px' }}
                          >
                            <span >{this.state.knowledgeDetail.language}</span>
                          </FormItem>
                          <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>领域</span>}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 10 }}
                            hasFeedback
                            style={{ marginBottom: '5px' }}
                          >
                            <span >{this.state.knowledgeDetail.field}</span>
                          </FormItem>
                          <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>学科</span>}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 10 }}
                            hasFeedback
                            style={{ marginBottom: '5px' }}
                          >
                            <span >{this.state.knowledgeDetail.subject}</span>
                          </FormItem>
                          <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>添加者</span>}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 10 }}
                            hasFeedback
                            style={{ marginBottom: '5px' }}
                          >
                            <p>{this.state.knowledgeDetail.contribute}</p>
                          </FormItem>
                          <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>添加时间</span>}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 15 }}
                            hasFeedback
                            style={{ marginBottom: '500px' }}
                          >
                            <p>{this.state.knowledgeDetail.addtime}</p>
                          </FormItem>
                        </Form>
                      </div>
                    </Col>
                    <Col span={11}>
                      <div style={{ paddingTop: '30px' }}>
                        <Card title={<p style={{ paddingBottom: '10px' }}><Button style={buttoncolor} size="large">资源推荐</Button>
                          <span style={{ paddingLeft: 10 }}><Button style={buttoncolor} size="large" onClick={this.showModal}>推荐解释</Button></span>
                        </p>}
                          bordered={true} >
                          {recommendContentList}
                        </Card>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </div>
              <Modal
               style={{top:100}}
                title={<p>
                  <Button style={buttoncolor}>当前知识点:</Button>
                  <span style={{ paddingLeft: 10 }}>{this.state.knowledgeDetail.title}</span>
                </p>}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>关联知识点</Button></p>
                {recommendExplanationList}
                <div style={{ display: this.state.display_recommendContent }}>
                  <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>学习者已学习的知识点</Button></p>
                  {recommendExplanationList_hasLearn}
                  <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>学习者推荐的知识点</Button></p>
                  {recommendExplanationList_relation}
                </div>
              </Modal>
            </div>
          </div >
        );
      }
      else {
        return (
          <div>
            <div >
              {/* <div style={{ paddingTop: '30px' }}> */}
              <div >
                <Card style={{ height: '1750px', paddingTop: '20px' }} >
                  <Row>
                    <Col span={13}>
                      <div style={{ height: '700px', paddingTop: '30px' }}>
                        <Form >
                          {/* <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>是否为知识点</span>}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 8 }}
                            hasFeedback
                          >
                            <span >{this.state.StructDetail[0].is_knowledge}</span>
                          </FormItem> */}
                          <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>节点名称</span>}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 15 }}
                            hasFeedback
                            style={{ marginBottom: '5px' }}
                          >
                            <span >{this.state.StructDetail[0].title}</span>
                          </FormItem>
                          <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>节点描述</span>}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 15 }}
                            hasFeedback
                            style={{ marginBottom: '5px' }}
                          >
                            <span >{this.state.StructDetail[0].description}</span>
                          </FormItem>
                          <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>关键字</span>}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 8 }}
                            hasFeedback
                            style={{ marginBottom: '5px' }}
                          >
                            <span >{this.state.StructDetail[0].keywords}</span>
                          </FormItem>
                          {/* <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>添加者</span>}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 8 }}
                            hasFeedback
                          >
                            <p>{this.state.knowledgeDetail.contribute}</p>
                          </FormItem> */}
                          <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>添加时间</span>}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                            hasFeedback
                            style={{ marginBottom: '5px' }}
                          >
                            <p>{this.state.StructDetail[0].addtime}</p>
                          </FormItem>
                        </Form>
                      </div>
                    </Col>
                    <Col span={11}>
                      <div style={{ paddingTop: '30px' }}>
                        <Card title={<p style={{ paddingBottom: '10px' }}><Button style={buttoncolor} size="large">关联知识点</Button></p>} bordered={true} >
                          {/* <Scrollbars style={{ height: 100 }}> */}
                          <div style={{ height: 120 }}>
                            <div style={{ display: this.state.display }}>
                              <Alert
                                message="友情提示："
                                description="暂无关联知识点."
                                type="warning"
                                showIcon
                              />
                            </div>
                            {relatedKnowledgeList}
                            <Pagination current={this.state.current} onChange={this.getpresentKnowledgeStructResNodeDetail} total={this.state.allpages * 10} />
                            {/* <Pagination current={this.state.current} onChange={this.onChange} total={this.state.total} /> */}
                          </div>
                          {/* </Scrollbars> */}
                        </Card>
                        <Card title={<p style={{ paddingBottom: '10px' }}><Button style={buttoncolor} size="large">资源推荐</Button>
                          <span style={{ paddingLeft: 10 }}><Button style={buttoncolor} size="large" onClick={this.showModal}>推荐解释</Button></span>
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
                <Button style={buttoncolor}>当前知识点:</Button>
                <span style={{ paddingLeft: 10 }}>{this.state.StructDetail[0].title}</span>
              </p>}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>关联知识点</Button></p>
              {recommendExplanationList}
              <div style={{ display: this.state.display_recommendContent }}>
                <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>学习者已学习的知识点</Button></p>
                {recommendExplanationList_hasLearn}
                <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>学习者推荐的知识点</Button></p>
                {recommendExplanationList_relation}
              </div>
            </Modal>
          </div >
        );
      }
    }
    else {
      if (this.state.is_knowledge == '是') {
        return (
          <div>
            <Card style={{ height: '1000px' }}>
              <Collapse defaultActiveKey="1">
                <Panel header={<Button style={buttoncolor} size="large">知识点详情</Button>} key="1" style={{ background: "#fff" }}>
                  <Form >
                    {/* <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>是否为知识点</span>}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 8 }}
                            hasFeedback
                          >
                            <span >{this.state.knowledgeDetail.is_knowledge}</span>
                          </FormItem> */}
                    <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>知识点名称</span>}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 15 }}
                      hasFeedback
                      style={{ marginBottom: '5px' }}
                    >
                      <span >{this.state.knowledgeDetail.title}</span>
                    </FormItem>
                    <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>知识点描述</span>}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 15 }}
                      hasFeedback
                      style={{ marginBottom: '5px' }}
                    >
                      <span >{this.state.knowledgeDetail.description}</span>
                    </FormItem>
                    <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>关键字</span>}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 10 }}
                      hasFeedback
                      style={{ marginBottom: '5px' }}
                    >
                      <span >{this.state.knowledgeDetail.keywords}</span>
                    </FormItem>
                    {/* <FormItem
                            label={<span style={{ fontWeight: 'bold' }}>适用对象</span>}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 8 }}
                            hasFeedback
                          >
                            <span >{this.state.knowledgeDetail.applicability}</span>
                          </FormItem> */}
                    <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>重要程度</span>}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 10 }}
                      hasFeedback
                      style={{ marginBottom: '5px' }}
                    >
                      <span >{this.state.knowledgeDetail.importance}</span>
                    </FormItem>
                    <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>语言</span>}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 10 }}
                      hasFeedback
                      style={{ marginBottom: '5px' }}
                    >
                      <span >{this.state.knowledgeDetail.language}</span>
                    </FormItem>
                    <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>领域</span>}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 10 }}
                      hasFeedback
                      style={{ marginBottom: '5px' }}
                    >
                      <span >{this.state.knowledgeDetail.field}</span>
                    </FormItem>
                    <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>学科</span>}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 10 }}
                      hasFeedback
                      style={{ marginBottom: '5px' }}
                    >
                      <span >{this.state.knowledgeDetail.subject}</span>
                    </FormItem>
                    <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>添加者</span>}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 10 }}
                      hasFeedback
                      style={{ marginBottom: '5px' }}
                    >
                      <p>{this.state.knowledgeDetail.contribute}</p>
                    </FormItem>
                    <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>添加时间</span>}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 15 }}
                      hasFeedback
                      style={{ marginBottom: '5px' }}
                    >
                      <p>{this.state.knowledgeDetail.addtime}</p>
                    </FormItem>
                  </Form>
                </Panel>
              </Collapse>
              {/* <Collapse defaultActiveKey="1">
                <Panel header={<p><Button style={buttoncolor} size="large">资源推荐</Button>
                  <span style={{ paddingLeft: 10 }}><Button style={buttoncolor} size="large" onClick={this.showModal}>推荐解释</Button></span></p>
                }
                  key="1" style={{ background: "#fff" }}>
                  {recommendContentList}
                </Panel>
              </Collapse> */}
              <div>
                <Card title={<p style={{ paddingBottom: '10px' }}><Button style={buttoncolor} size="large">资源推荐</Button>
                  <span style={{ paddingLeft: 10 }}><Button style={buttoncolor} size="large" onClick={this.showModal}>推荐解释</Button></span>
                </p>}
                  bordered={true} >
                  {recommendContentList}
                </Card>
              </div>
            </Card>
            <Modal
             style={{top:100}}
              title={<p>
                <Button style={buttoncolor}>当前知识点:</Button>
                <span style={{ paddingLeft: 10 }}>{this.state.knowledgeDetail.title}</span>
              </p>}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>关联知识点</Button></p>
              {recommendExplanationList}
              <div style={{ display: this.state.display_recommendContent }}>
                <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>学习者已学习的知识点</Button></p>
                {recommendExplanationList_hasLearn}
                <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>学习者推荐的知识点</Button></p>
                {recommendExplanationList_relation}
              </div>
            </Modal>
          </div>
        );
      }
      else {
        return (
          <div>
            <Card style={{ height: '1000px' }}>
              <Collapse defaultActiveKey="1">
                <Panel header={<Button style={buttoncolor} size="large">知识点详情</Button>} key="1" style={{ background: "#fff" }}>
                  <Form >
                    {/* <FormItem
                label={<span style={{ fontWeight: 'bold' }}>是否为知识点</span>}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
                hasFeedback
              >
                <span >{this.state.StructDetail[0].is_knowledge}</span>
              </FormItem> */}
                    <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>节点名称</span>}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 15 }}
                      hasFeedback
                      style={{ marginBottom: '5px' }}
                    >
                      <span >{this.state.StructDetail[0].title}</span>
                    </FormItem>
                    <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>节点描述</span>}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 15 }}
                      hasFeedback
                      style={{ marginBottom: '5px' }}
                    >
                      <span >{this.state.StructDetail[0].description}</span>
                    </FormItem>
                    <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>关键字</span>}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 8 }}
                      hasFeedback
                      style={{ marginBottom: '5px' }}
                    >
                      <span >{this.state.StructDetail[0].keywords}</span>
                    </FormItem>
                    {/* <FormItem
                label={<span style={{ fontWeight: 'bold' }}>添加者</span>}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
                hasFeedback
              >
                <p>{this.state.knowledgeDetail.contribute}</p>
              </FormItem> */}
                    <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>添加时间</span>}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 18 }}
                      hasFeedback
                      style={{ marginBottom: '5px' }}
                    >
                      <p>{this.state.StructDetail[0].addtime}</p>
                    </FormItem>
                  </Form>
                </Panel>
              </Collapse>

              <Collapse defaultActiveKey="1">
                <Panel header={<Button style={buttoncolor} size="large">关联知识点</Button>} key="1" style={{ background: "#fff" }}>
                  {/* <Scrollbars style={{ height: 100 }}> */}
                  <div style={{ height: 120 }}>
                    <div style={{ display: this.state.display }}>
                      <Alert
                        message="友情提示："
                        description="暂无关联知识点."
                        type="warning"
                        showIcon
                      />
                    </div>
                    {relatedKnowledgeList}
                    {/* <Pagination current={this.state.currentPage} onChange={this.getpresentKnowledgeStructResNodeDetail} total={999} /> */}
                    <Pagination current={this.state.current} onChange={this.getpresentKnowledgeStructResNodeDetail} total={this.state.allpages * 10} />
                  </div>
                  {/* </Scrollbars> */}
                </Panel>
              </Collapse>
              {/* <Collapse defaultActiveKey="1">
                <Panel header={<p><Button style={buttoncolor} size="large">资源推荐</Button>
                  <span style={{ paddingLeft: 10 }}><Button style={buttoncolor} size="large" onClick={this.showModal}>推荐解释</Button></span></p>
                } key="1" style={{ background: "#fff" }}>
                  {recommendContentList}
                </Panel>
              </Collapse> */}
              <div style={{ paddingTop: '30px' }}>
                <Card title={<p style={{ paddingBottom: '10px' }}><Button style={buttoncolor} size="large">资源推荐</Button>
                  <span style={{ paddingLeft: 10 }}><Button style={buttoncolor} size="large" onClick={this.showModal}>推荐解释</Button></span>
                </p>}
                  bordered={true} >
                  {recommendContentList}
                </Card>
              </div>
            </Card>
            <Modal
             style={{top:100}}
              title={<p>
                <Button style={buttoncolor}>当前知识点:</Button>
                <span style={{ paddingLeft: 10 }}>{this.state.StructDetail[0].title}</span>
              </p>}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>关联知识点</Button></p>
              {recommendExplanationList}
              <div style={{ display: this.state.display_recommendContent }}>
                <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>学习者已学习的知识点</Button></p>
                {recommendExplanationList_hasLearn}
                <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>学习者推荐的知识点</Button></p>
                {recommendExplanationList_relation}
              </div>
            </Modal>
          </div>
        );

      }


    }

  }
}
function mapStateToProps(state) {
  return {
    knowledgeInfo: state.reducer_map_knowledge.knowledgeInfo,
    mapType: state.reducer_map_type.mapType,
    displayType: state.reducer_diaplay_type.displayType,
    mapVersion: state.reducer_map_version.mapVersion,
    login_info: state.reducer_login.login_info,
    mapInfo: state.reducer_map_info.mapInfo,



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
)(StructDetail);
