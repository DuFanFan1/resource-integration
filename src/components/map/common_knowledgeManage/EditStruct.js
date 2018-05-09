import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import '../../../../style_css/antd.css';  // Add
import { Tabs, Icon, Form, Input, Row, Col, Button, Select, InputNumber, Card, Layout, Breadcrumb, Modal, message, notification,Alert } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const confirm = Modal.confirm;
const warning = () => {
  message.warning('This is message of warning');
};
const buttoncolor = {
  color: "#fff",
  background: "#2a95de",
  border: "#2a95de",
}
let title = '111115565656'
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
class EditStruct extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }
  // 状态机
  constructor(props) {
    super(props);
    // this.getPersonalMapList_personal = this.getPersonalMapList_personal.bind(this);
    this.state = {
      display:'none',
      spanwidth: 10,
      knowledge_id: null,
      id: null,
      title: '',
      knowcontent: null,
      contribute: null,
      keywords: '',
      description: '',
      language: null,
      importance: null,
      addtime: null,
      field: null,
      subject: null,
    }
  }
  // 弹出框-添加知识点成功
  success() {
    Modal.success({
      title: '友情提示',
      content: '编辑成功',
    });
  }
  // 弹出框-添加知识点失败
  failure() {
    Modal.error({
      title: '友情提示',
      content: '编辑失败',
    });
  }
  confirm_alert() {
    Modal.warning({
      title: '友情提示：',
      content: '此节点无权进行此操作',
    });
  }
  confirm_alert1 = () => {
    message.info("此节点无权进行此操")
  }
  //获取地图节点详情
  getKnowledgeStructDetails = (id) => {
    console.log('knowledgeElement')
    console.log(id)
    let ajaxTimeOut = $.ajax({
      url: "/api_v1.1/knowledge_struct/getKnowledgeStructDetails",//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
      type: "GET",
      dataType: "json",
      data: { "structid": id },
      timeout:2000,
      success: function (data) {
        if (data.errorCode == 0) {
          console.log('获取地图节点详情-data');
          console.log(data);
          // this.setState({ StructDetail: data.msg });
          this.setState({
            id: data.msg[0].structid,
            is_knowledge: data.msg[0].is_knowledge,
            title: data.msg[0].title,
            description: data.msg[0].description,
            keywords: data.msg[0].keywords,
          });
          console.log('获取地图节点详情-this.state.knowledgeDetail');
          console.log(this.state.knowledgeDetail);
          // this.render_content_personalMap(this.state.personalMap);
        }
        else {
          console.log('该用户没有个人知识地图-私有');
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
  // 编辑节点详情
  edit_struct() {
    const { knowledgeInfo } = this.props;
    const knowledge_id = knowledgeInfo.knowledge_id;
    const { displayType } = this.props;
    const display_type = displayType.displayType;
    if (knowledgeInfo.is_knowledge == '否') {
      if(this.state.title=='' || this.state.description==''  || this.state.keywords=='' ){
        Modal.warning({
          title: '友情提示',
          content: '内容不能为空，请完整填写',
        });
      }
      else{
        let ajaxTimeOut = $.ajax({
        url: "/api_v1.1/knowledge_struct/updateKnowledgeNodeInfoDetails",//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
        type: "PUT",
        dataType: "json",
        timeout:2000,
        data: {
          "structid": this.state.id,
          "title": this.state.title,
          "description": this.state.description,
          "keywords": this.state.keywords,
        },
        success: function (data) {
          console.log(data);
          // this.setState({ addResult: data });
          if (display_type == '知识地图-列表') {
            if (data.errorCode == 0) { console.log('成功编辑地图节点'); PubSub.publish('addKnowledgeSuccess'); this.success() }
            else { console.log('编辑地图节点失败'); this.failure() }
          }
          else {
            const addknowledgeInfo = { 'sindex': knowledgeInfo.index, 'sname': knowledgeInfo.knowledge_name, 'name': this.state.title,"reletedResCount":knowledgeInfo.reletedResCount }
            if (data.errorCode == 0) { console.log('成功编辑知识元'); PubSub.publish('editStructSuccess_Echarts', addknowledgeInfo); this.success() }
            else { console.log('编辑知识元失败'); this.failure() }
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
      });}
    }
    else {
      this.confirm_alert()
    }

    this.props.form.resetFields();
  }
  changetitle(e) { this.setState({ title: e.target.value }); } //知识点title
  changedescription(e) { this.setState({ description: e.target.value }); } //知识点title
  changecontribute(e) { this.setState({ contribute: e.target.value }); } //知识点title
  changekeywords(e) { this.setState({ keywords: e.target.value }); } //知识点title
  changelanguage(e) { this.setState({ language: e.target.value }); } //知识点title
  changeapplicability(e) { this.setState({ applicability: e.target.value }); } //知识点title
  changeimportance(e) { this.setState({ importance: e }); } //知识点title
  changefield(e) { this.setState({ field: e }); } //知识点title
  changesubject(e) { this.setState({ subject: e }); } //知识点title
  componentDidMount() {
    const { displayType } = this.props;
    const display_type = displayType.displayType;
    if (display_type == '知识地图-列表') {
      this.setState({ spanwidth: 10 })
    }
    else { this.setState({ spanwidth: 18 }) }
    const { knowledgeInfo } = this.props;
    // this.setState({ knowledge_id: knowledgeInfo.knowledge_id })
    // this.setState({ is_knowledge: knowledgeInfo.is_knowledge })
    const knowledge_id = knowledgeInfo.knowledge_id;
    // const mapContent = knowledgeInfo.mapContent;
    if (knowledgeInfo.is_knowledge == '否') {
      this.getKnowledgeStructDetails(knowledge_id);
    }
    else {
      this.confirm_alert()
      // message.info("此节点无权进行此操")
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log("打印nextProps")
    console.log(nextProps)
    console.log(nextProps.knowledgeInfo.knowledge_id)
    const { displayType } = this.props;
    const display_type = displayType.displayType;
    if (display_type == '知识地图-列表') {
      this.setState({ spanwidth: 10 })
    }
    else { this.setState({ spanwidth: 18 }) }
    // this.setState({ knowledge_id: nextProps.knowledgeInfo.knowledge_id })
    if (nextProps.knowledgeInfo.is_knowledge == '否') {
      this.getKnowledgeStructDetails(nextProps.knowledgeInfo.knowledge_id);
      this.setState({ display: 'none' })
    }
    else {
      this.setState({
        display: 'block',
        title: null,
        description: null,
        keywords: null,
      })

    }
  }
  render() {
    return (
      <div>
        <div >
          {/* <div style={{ paddingTop: '30px' }}> */}
          <div >
            <div style={{ display: this.state.display }}>
              <Alert
                message="友情提示："
                description="此节点无权进行此操作."
                type="warning"
                showIcon
              />
              {/* <Alert message="此节点无权进行此操作" type="warning" showIcon /> */}
            </div>
            <Card style={{ height: '1000px' }}>
              <Form >
                {/* <FormItem
                  label={<span style={{ fontWeight: 'bold' }}>是否为知识点</span>}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 8 }}
                  hasFeedback
                >
                  <span >{this.state.is_knowledge}</span>
                </FormItem> */}
                <FormItem
                  label={<span >节点名称</span>}
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: this.state.spanwidth }}
                  hasFeedback
                >
                  <Input onChange={this.changetitle.bind(this)} value={this.state.title} placeholder='必填'/>
                </FormItem>
                <FormItem
                  label="描述"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: this.state.spanwidth }}
                  hasFeedback
                >
                  <TextArea onChange={this.changedescription.bind(this)} value={this.state.description} rows={4} placeholder='必填'/>
                </FormItem>
                <FormItem
                  label="关键字"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: this.state.spanwidth }}
                  hasFeedback
                >
                  <Input onChange={this.changekeywords.bind(this)} value={this.state.keywords} placeholder='必填'/>
                </FormItem>
                <FormItem {...tailFormItemLayout} >
                  <Button style={buttoncolor} onClick={this.edit_struct.bind(this)}>编辑</Button>
                </FormItem>
              </Form>
            </Card>
          </div>
        </div>
      </div >

    );
  }
}
EditStruct = Form.create()(EditStruct);
function mapStateToProps(state) {
  return {
    knowledgeInfo: state.reducer_map_knowledge.knowledgeInfo,
    displayType: state.reducer_diaplay_type.displayType,

  };
}
function mapDispatchToProps(dispatch) {
  return {

  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditStruct);

