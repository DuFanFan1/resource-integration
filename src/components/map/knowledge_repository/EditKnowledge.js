import React, { Component } from 'react';
import $ from 'jquery';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import '../../../../style_css/antd.css';  // Add
import { Tabs, Icon, Form, Input, Row, Col, Button, Select, InputNumber, Card, Layout, Breadcrumb, Modal } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const confirm = Modal.confirm;
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
class EditKnowledge extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }
  // 状态机
  constructor(props) {
    super(props);
    // this.getPersonalMapList_personal = this.getPersonalMapList_personal.bind(this);
    this.state = {
      spanwidth:null,
      id: null,
      title: '',
      knowcontent: null,
      contribute: null,
      keywords: '',
      description: '',
      language: null,
      applicability: null,
      importance: null,
      addtime: null,
      field: null,
      grade: null,
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
  //获取知识点详情
  getknowledgeNodeDetail = (knowledge_id) => {
    // const { knowledgeInfo } = this.props;
    // const knowledge_id = knowledgeInfo.knowledge_id;
    let ajaxTimeOut=$.ajax({
      url: "/api_v1.1/knowledge/getKnowledgeNodeInformations",//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
      type: "GET",
      dataType: "json",
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
  // 编辑详情
  handleSubmit_add() {
    const { knowledgeInfo } = this.props;
    const { selectMapSubject } = this.props;
    const subject_id = selectMapSubject.subject_id;
    const { displayType } = this.props;
    const display_type = displayType.displayType;
    if(this.state.title=='' || this.state.description==''  || this.state.keywords=='' || this.state.contribute=='' ){
      Modal.warning({
        title: '友情提示',
        content: '内容不能为空，请完整填写',
      });
    }
    else{
      let ajaxTimeOut=$.ajax({
      url: "/api_v1.1/knowledge/editKnowledgeNodeInformations",//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
      type: "PUT",
      dataType: "json",
      timeout:2000,
      data: {
        "knowid": this.state.id,
        "title": this.state.title,
        "description": this.state.description,
        "contribute": this.state.contribute,
        "keywords": this.state.keywords,
        "language": this.state.language,
        "importance": this.state.importance,
        "field": this.state.field,
        "grade": this.state.grade,
        "subject": subject_id,
      },
      success: function (data) {
        console.log(data);
        // this.setState({ addResult: data });
        if(display_type=='知识库-列表'){
          if (data.errorCode == 0) { console.log('成功编辑知识元'); PubSub.publish('addKnowledgeSuccess'); this.success() }
          else { console.log('编辑知识元失败'); this.failure() }
        }
        else{
          const addknowledgeInfo ={'sindex':knowledgeInfo.index,'sname':knowledgeInfo.knowledge_name,'name':this.state.title,"knowledge_id":this.state.id,"reletedResCount":knowledgeInfo.reletedResCount,}
          if (data.errorCode == 0) { console.log('成功编辑知识元'); PubSub.publish('editKnowledgeSuccess_Echarts',addknowledgeInfo); this.success() }
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
    });
    this.props.form.resetFields();
  }

  }
  changetitle(e) { this.setState({ title: e.target.value }); } //知识点title
  changedescription(e) { this.setState({ description: e.target.value }); } //知识点title
  changecontribute(e) { this.setState({ contribute: e.target.value }); } //知识点title
  changekeywords(e) { this.setState({ keywords: e.target.value }); } //知识点title
  changelanguage(e) { this.setState({ language: e.target.value }); } //知识点title
  changeimportance(e) { this.setState({ importance: e }); } //知识点title
  changefield(e) { this.setState({ field: e }); } //知识点title
  changegrade(e) { this.setState({ grade: e }); } //知识点title
  componentDidMount() {
    const { knowledgeInfo } = this.props;
    const knowledge_id = knowledgeInfo.knowledge_id;
    const mapContent = knowledgeInfo.mapContent;
    const { displayType } = this.props;
    const display_type = displayType.displayType;
    this.setState({id:knowledge_id})
    if(display_type=='知识库-列表'){
      this.setState({spanwidth:10})
    }
    else {this.setState({ spanwidth: 18})}
    if (mapContent == true) {
      this.getknowledgeNodeDetail(knowledge_id);
    }

  }
  componentWillReceiveProps(nextProps) {
    console.log("打印nextProps")
    console.log(nextProps)
    console.log(nextProps.knowledgeInfo.knowledge_id)
    const { displayType } = this.props;
    const display_type = displayType.displayType;
    this.setState({id:nextProps.knowledgeInfo.knowledge_id})
    if(display_type=='知识库-列表'){
      this.setState({spanwidth:10})
    }
    else {this.setState({ spanwidth: 18 })}
    if (nextProps.knowledgeInfo.mapContent == true) {
      this.getknowledgeNodeDetail(nextProps.knowledgeInfo.knowledge_id);
    }

    // this.getrelation_res(nextProps.knowledgeInfo.knowledge_id);
    // this.getRecommendByContent();
    // return true;
  }
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <div >
        {/* <div style={{ paddingTop: '30px' }}> */}
          <div >
            <Card style={{ height: '1000px' }}>
              <Form >
                <FormItem
                  label={<span >知识点名称</span>}
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: this.state.spanwidth }}
                  hasFeedback
                >
                  <Input onChange={this.changetitle.bind(this)} value={this.state.title} placeholder='必填'/>
                </FormItem>
                <FormItem
                  label="知识点描述"
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
                <FormItem
                  label="重要程度"
                  labelCol={{ span: 5}}
                  wrapperCol={{ span: this.state.spanwidth }}
                  hasFeedback
                >
                  <Select value={this.state.importance}  onChange={this.changeimportance.bind(this)}>
                  {/* <Select value={this.state.importance} style={{ width: 200 }} onChange={this.changeimportance.bind(this)}> */}
                    <Option value="5">非常重要</Option>
                    <Option value="4">高等重要</Option>
                    <Option value="3">中等重要</Option>
                    <Option value="2">低等重要</Option>
                    <Option value="1">不重要</Option>
                  </Select>
                </FormItem>
                <FormItem
                  label="领域"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: this.state.spanwidth }}
                  hasFeedback
                >
                  <Select value={this.state.field}  onChange={this.changefield.bind(this)} >
                  {/* <Select value={this.state.field} style={{ width: 200 }} onChange={this.changefield.bind(this)} > */}
                    <Option value="1">基础教育</Option>
                    <Option value="2">高等教育</Option>
                    <Option value="3">成人教育</Option>
                  </Select>
                </FormItem>
                <FormItem
                  label="添加者"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span:this.state.spanwidth }}
                  hasFeedback
                >
                  <Input value={this.state.contribute} onChange={this.changecontribute.bind(this)} />
                  {/* <p {...getFieldProps('contribute') }>储一凡</p> */}
                </FormItem>
                <FormItem
                  label="添加时间"
                  labelCol={{ span:5}}
                  wrapperCol={{ span: this.state.spanwidth }}
                  hasFeedback
                >
                  <p>{this.state.addtime}</p>
                </FormItem>
                <FormItem {...tailFormItemLayout} >
                  <Button style={buttoncolor} onClick={this.handleSubmit_add.bind(this)}>编辑</Button>
                </FormItem>
              </Form>
            </Card>
          </div>
        </div>
      </div >
    );
  }
}
EditKnowledge = Form.create()(EditKnowledge);
function mapStateToProps(state) {
  return {
    knowledgeInfo: state.reducer_map_knowledge.knowledgeInfo,
    selectMapSubject: state.reducer_map_subject.selectMapSubject,
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
)(EditKnowledge);

