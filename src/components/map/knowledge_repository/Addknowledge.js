import React, { Component } from 'react';
import $ from 'jquery';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import PropTypes from "prop-types";
import '../../../../style_css/antd.css';  // Add
import { Tabs, Icon, Form, Input, Button, Select, Layout, Breadcrumb, Card, Modal, Upload, Row, Col } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
let id = 2;
const buttoncolor = {
  color: "#fff",
  background: "#2a95de",
  border: "#2a95de",
}
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
// 上传文件组件
const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
class Addknowledge extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props) {
    super(props);
    // this.getPersonalMapList_personal = this.getPersonalMapList_personal.bind(this);
    this.state = {
      parent_know:null,
      spanwidth:10,
      title: '' ,
      keywords: '' ,
      knowcontent: null,
      description: '' ,
      grade: null,
    }
  }
  // 弹出框-添加知识点成功
  success() {
    Modal.success({
      title: '友情提示',
      content: '添加成功',
    });
  }
  // 弹出框-添加知识点失败
  failure() {
    Modal.error({
      title: '友情提示',
      content: '添加失败',
    });
  }
  handleSubmit_add() {
    const { knowledgeInfo } = this.props;
    if (knowledgeInfo.mapContent == true) {
      this.handleSubmit_add()
    }
  }
  handleSubmit_add() {
    const { login_info } = this.props;
    const { knowledgeInfo } = this.props;
    const { selectMapSubject } = this.props;
    const { mapGrage } = this.props;
    const { displayType } = this.props;
    const display_type = displayType.displayType;
    console.log('display_type'+display_type);
    const subject_id = selectMapSubject.subject_id;
    const knowledge_id = knowledgeInfo.knowledge_id;
    console.log('领域：'+this.props.form.getFieldValue('field'))
    // alert(this.props.form.getFieldValue('kmap_name') + "-" + this.props.form.getFieldValue('kcid3') + "-" + this.props.form.getFieldValue('kcid2'));
    if(this.state.title=='' || this.state.description==''  || this.state.keywords=='' || this.state.language=='' || this.props.form.getFieldValue('importance')==undefined || this.props.form.getFieldValue('field')==undefined){
      Modal.warning({
        title: '友情提示',
        content: '内容不能为空，请完整填写',
      });
    }
    else{    
      let ajaxTimeOut=$.ajax({
      url: "/api_v1.1/knowledge/addKnowledgeNode",
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      // data:"gjswjoiw",
      data: JSON.stringify({
        "pre_knowid": knowledge_id,
        "contribute": login_info.username,
        "title": this.state.title,
        "description": this.state.description,
        "keywords": this.state.keywords,
        "language": this.state.language,
        // "language": this.props.form.getFieldValue('language'),
        "importance": this.props.form.getFieldValue('importance'),
        "field": this.props.form.getFieldValue('field'),
        "grade": mapGrage.grade,
        "subject": subject_id,
      }
      ),
      timeout:2000,
      success: function (data) {
        console.log('添加知识元成功');
        console.log(data);
        if(display_type=='知识库-列表'){
          if (data.errorCode == 0) { console.log('成功添加知识元'); PubSub.publish('addKnowledgeSuccess', this.state.title); this.success() }
          else { console.log('添加知识元失败'); this.failure() }
        }
        else{
          if (data.errorCode == 0) { 
            console.log('成功添加知识元');
            const addknowledgeInfo ={'sindex':knowledgeInfo.index,'sname':knowledgeInfo.knowledge_name,'name':this.state.title,"knowledge_id":data.msg[0].knowid,"pre_knowid":data.msg[0].pre_knowid,"mapContent":true,"is_knowledge":data.msg[0].is_knowledge} 
            PubSub.publish('addKnowledgeSuccess_Echarts', addknowledgeInfo); this.success() }
          else { console.log('添加知识元失败'); this.failure() }
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
    // this.props.form.resetFields();
  }
  }
  
  //通过知识点内容自动获取关键字
  changelanguage(e) {
    console.log('this.state.title+this.state.description:'+this.state.title+this.state.description);
    let ajaxTimeOut=$.ajax({
      url: "/api_v1.1/apiPackage/knowKeyWord",
      type: "GET",
      dataType: "json",
      data: {
        "knowcontent": this.state.title+this.state.description,
      },
      timeout:2000,
      success: function (data) {
        if(data.erroCode=="0" && data.msg!="sql erro"){
          console.log(data);
          this.setState({ keywords: data.msg });
        }
        else{
          this.setState({ keywords: this.state.title });
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
    this.setState({ language: e});
  }
  changekeywords(e) { this.setState({ keywords: e.target.value }); }
  changetitle(e) { this.setState({ title: e.target.value }); } //知识点title
  changedescription(e) { this.setState({ description: e.target.value }); } //知识点title
  //使用ajax方式添加带文件资源
  batchAddKnowledge = () => {
    var formData = new FormData($("#uploadForm")[0]);  // 要求使用的html对象
    let ajaxTimeOut=$.ajax({
      url: '/api_v1.1/upload/batchImportKnowledge_v1_1',
      type: 'POST',
      data: formData,
      async: true,
      timeout:2000,
      // 下面三个参数要指定，如果不指定，会报一个JQuery的错误 
      cache: false,
      contentType: false,
      processData: false,
      success: function (data) {
        if (data.errorcode == '0') {
          console.log('批量添加知识点成功'); this.success()
        }
        else {
          console.log('批量添加知识点失败'); this.failure()
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
  componentWillMount(){
    const { displayType } = this.props;
    const display_type = displayType.displayType;
    const { knowledgeInfo } = this.props;
    this.setState({parent_know:knowledgeInfo.pre_name})
    if(display_type=='知识库-列表'){
      this.setState({spanwidth:10})
    }
    else {this.setState({ spanwidth: 18 })}
  }
  componentWillReceiveProps(nextProps) {
    this.setState({parent_know:nextProps.knowledgeInfo.pre_name})
  }
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <div>
        {/* <div style={{ paddingTop: '30px' }}> */}
          <div >
            <Card style={{ height: '800px' }}>
              <Tabs defaultActiveKey="1">
                <TabPane tab={<span><Icon type="plus-circle-o" />单个添加</span>} key="1">
                  <div style={{ paddingTop: '10px' }}>
                    <Form >
                      <FormItem
                        label="父知识点"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: this.state.spanwidth }}
                        hasFeedback
                      >
                        <span>{this.state.parent_know}</span>
                      </FormItem>
                      <FormItem
                        label="知识点名称"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: this.state.spanwidth }}
                        hasFeedback
                      >
                        <Input onChange={this.changetitle.bind(this)} placeholder='必填'/>
                      </FormItem>
                      <FormItem
                        label="知识点描述"
                        labelCol={{ span:5}}
                        wrapperCol={{ span: this.state.spanwidth}}
                        hasFeedback
                      >
                        <Input onChange={this.changedescription.bind(this)} placeholder='必填'/>
                      </FormItem>
                      <FormItem
                        label="语言"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: this.state.spanwidth }}
                        hasFeedback
                      >
                        <Select placeholder='必选' onChange={this.changelanguage.bind(this)}  >
                          <Option value="中文">中文</Option>
                          <Option value="英文">英文</Option>
                        </Select>
                      </FormItem>
                      <FormItem
                        label="关键字"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: this.state.spanwidth}}
                        hasFeedback
                      >
                        <Input {...getFieldProps('keywords') } value={this.state.keywords} onChange={this.changekeywords.bind(this)} placeholder='必填'/>
                      </FormItem>
                      <FormItem
                        label="重要程度"
                        labelCol={{ span:5}}
                        wrapperCol={{ span: this.state.spanwidth }}
                        hasFeedback
                      >
                        <Select placeholder='必选' {...getFieldProps('importance') }   >
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
                        <Select  placeholder='必选' {...getFieldProps('field') }  >
                          <Option value="1">基础教育</Option>
                          <Option value="2">高等教育</Option>
                          <Option value="3">成人教育</Option>
                        </Select>
                      </FormItem>
                      <FormItem {...tailFormItemLayout} >
                        <Button style={buttoncolor} onClick={this.handleSubmit_add.bind(this)}>确定</Button>
                      </FormItem>
                    </Form>
                  </div>
                </TabPane>
                <TabPane tab={<span><Icon type="search" />批量导入</span>} key="2">
                  <div style={{ paddingTop: '50px' }}>
                    <Form id="uploadForm">
                      <FormItem
                        label="下载Excel模板"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 15 }}
                        hasFeedback
                      >
                        <a href="http://192.168.71.201:8080/template/knowledge_v1.2.xlsx">
                          <Button>
                            <Icon type="download" /> 单击下载
                    </Button>
                        </a>
                      </FormItem>
                      <FormItem
                        label="上传Excel文件"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span:this.state.spanwidth }}
                        hasFeedback
                      >
                        <Input type="file" name="file" />
                      </FormItem>
                      <FormItem {...tailFormItemLayout} >
                        <Button style={buttoncolor} onClick={this.batchAddKnowledge.bind(this)}>确定</Button>
                      </FormItem>
                    </Form>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </div>
      </div >
    );
  }
}
Addknowledge = Form.create()(Addknowledge);
// export default AddknowledgeElement;
function mapStateToProps(state) {
  return {
    login_info: state.reducer_login.login_info,
    selectMapSubject: state.reducer_map_subject.selectMapSubject,
    knowledgeInfo: state.reducer_map_knowledge.knowledgeInfo,
    mapGrage: state.reducer_map_grade.mapGrage,
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
)(Addknowledge);

