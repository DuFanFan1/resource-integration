import React, { Component } from 'react';
import $ from 'jquery';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import PropTypes from "prop-types";
import '../../../../style_css/antd.css';  // Add
import { Tabs, Icon, Form, Input, Button, Select, Layout, Breadcrumb, Card, Modal, Upload, Row, Col, Alert } from 'antd';
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
class AddTopMapStruct extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props) {
    super(props);
    // this.getPersonalMapList_personal = this.getPersonalMapList_personal.bind(this);
    this.state = {
      display_batchAddMapStruct:'none',
      display: 'none',
      parent_know: null,
      spanwidth: 10,
      title: '',
      keywords: '',
      knowcontent: null,
      description: '',
    }
  }
  confirm_alert() {
    Modal.warning({
      title: '友情提示：',
      content: '此节点无权进行此操作',
    });
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
    if (knowledgeInfo.is_knowledge == '是') {
      this.confirm_alert()
    }
    else {
      this.handleSubmit_add1()
    }
    // if (knowledgeInfo.mapContent == true) {

    // } 
    // else {
    //   this.handleSubmit_add2()
    // }

  }
  //添加节点
  handleSubmit_add1() {
    const { login_info } = this.props;
    const { knowledgeInfo } = this.props;
    const { mapInfo } = this.props;
    const map_id = mapInfo.map_id;
    const knowledge_id = knowledgeInfo.knowledge_id;
    const { displayType } = this.props;
    const display_type = displayType.displayType;
    // alert(this.props.form.getFieldValue('kmap_name') + "-" + this.props.form.getFieldValue('kcid3') + "-" + this.props.form.getFieldValue('kcid2'));
    if (this.state.title == '' || this.state.description == '' || this.state.keywords == '') {
      Modal.warning({
        title: '友情提示',
        content: '内容不能为空，请完整填写',
      });
    }
    else {
      console.log("map_id", map_id)
      console.log("knowledge_id", knowledge_id)
      let ajaxTimeOut = $.ajax({
        url: "/api_v1.1/knowledge_struct/addKnowledgeNodeInfoDetails",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        // data:"gjswjoiw",
        data: JSON.stringify({
          "mapid": map_id,
          "pre_structid": knowledge_id,
          "uid": login_info.userid,
          "title": this.state.title,
          "description": this.state.description,
          "keywords": this.state.keywords,
        }
        ),
        timeout:2000,
        success: function (data) {
          console.log('添加知识元成功');
          console.log(data);
          if (display_type == '知识地图-列表') {
            if (data.errorCode == 0) { console.log('成功添加地图节点'); PubSub.publish('addKnowledgeSuccess', this.state.title); this.success() }
            else { console.log('添加知识元失败'); this.failure() }
          }
          else {
            if (data.errorCode == 0) {
              console.log('成功添加知识元');
              const addknowledgeInfo = { 'sindex': knowledgeInfo.index, 'sname': knowledgeInfo.knowledge_name, 'name': this.state.title, "knowledge_id": data.msg[0].structid, "pre_knowid": data.msg[0].pre_structid, "mapContent": true, "is_knowledge": data.msg[0].is_knowledge }
              PubSub.publish('addStructSuccess_Echarts', addknowledgeInfo); this.success()
            }

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
      this.props.form.resetFields();
    }
  }
  //通过地图名称按钮添加一级节点
  handleSubmit_add2() {
    const { login_info } = this.props;
    const { knowledgeInfo } = this.props;
    const { mapInfo } = this.props;
    const map_id = mapInfo.map_id;
    const knowledge_id = knowledgeInfo.knowledge_id;
    // alert(this.props.form.getFieldValue('kmap_name') + "-" + this.props.form.getFieldValue('kcid3') + "-" + this.props.form.getFieldValue('kcid2'));
    if (knowledgeInfo.is_knowledge == '是') {
      this.confirm_alert()
    }
    else{
      let ajaxTimeOut = $.ajax({
        url: "/knowledge/addKnowledgeFirstUnits",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        // data:"gjswjoiw",
        data: JSON.stringify({
          "kmap_id": map_id,
          "uid": login_info.userid,
          "title": this.state.title,
          "description": this.state.description,
          "keywords": this.state.keywords,
        }
        ),
        success: function (data) {
          console.log('添加知识元成功');
          console.log(data);
          if (data.errorCode == 0) { console.log('成功添加知识元'); PubSub.publish('addKnowledgeSuccess', this.state.title); this.success() }
          else { 
            console.log('添加知识元失败'); 
            Modal.warning({
              title: '友情提示：',
              content: '模板内容与当前选中主题图图不匹配',
            });
         }
        }.bind(this),
        error: function (xhr, status, err) {
        }.bind(this)
      });
      this.props.form.resetFields();

    }
  }
  //通过知识点内容自动获取关键字
  changedescription(e) {
    this.setState({ description: e.target.value });
    console.log('this.state.title+this.state.description:' + this.state.title + this.state.description);
    let ajaxTimeOut = $.ajax({
      url: "/api_v1.1/apiPackage/knowKeyWord",
      type: "GET",
      dataType: "json",
      async: false,
      data: {
        // "knowcontent": "知道什么是方程",
        "knowcontent": this.state.title + this.state.description,
      },
      timeout:2000,
      success: function (data) {
        console.log("获取关键字成功");
        console.log(data);
        if (data.erroCode == "0" && data.msg != "sql erro") {
          console.log("获取关键字成功");
          console.log(data);
          this.setState({ keywords: data.msg });
        }
        else {
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
  }
  changekeywords(e) { this.setState({ keywords: e.target.value }); }
  changetitle(e) { this.setState({ title: e.target.value }); } //知识点title
  //使用ajax方式添加带文件资源
  batchAddMapStruct = () => {
    if (this.state.display_batchAddMapStruct == 'block') {
      Modal.warning({
        title: '友情提示：',
        content: '已存在结构，此主题图无法批量导入结构信息',
      });
    }
    else{
      var formData = new FormData($("#uploadForm")[0]);  // 要求使用的html对象
      let ajaxTimeOut = $.ajax({
        url: '/api_v1.1/upload/batchImportMapStruct_v1_1',
        type: 'POST',
        data: formData,
        async: true,
        // 下面三个参数要指定，如果不指定，会报一个JQuery的错误 
        cache: false,
        contentType: false,
        processData: false,
        timeout:2000,
        success: function (data) {
          if (data.errorcode == '0') {
            const { mapInfo } = this.props;
            const map_id = mapInfo.map_id;
            PubSub.publish('BatchAddTopMapStructSuccess',map_id); this.success() 
            console.log('批量导入地图结构成功'); 
          }
          else {
            console.log('批量导入地图结构失败');
            Modal.warning({
              title: '友情提示：',
              content: '模板内容与当前选中主题图图不匹配',
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
  }
  componentWillMount() {
    const { mapInfo } = this.props;
    this.setState({ map_id:  mapInfo.map_id });
    const { displayType } = this.props;
    const display_type = displayType.displayType;
    const { knowledgeInfo } = this.props;
    const { isBatchAddTopMapStruct } = this.props;
    const { mapType } = this.props;
    this.setState({ parent_know: knowledgeInfo.pre_name })
    if(isBatchAddTopMapStruct.isBatchAddTopMapStruct==false){
      this.setState({display_batchAddMapStruct:'block'})
    }
    if (display_type == '知识地图-列表') {
      this.setState({ spanwidth: 10 })
    }
    else { this.setState({ spanwidth: 18 }) }
    if (knowledgeInfo.is_knowledge == '是') {
      this.confirm_alert()
    }
  }
  // componentDidMount() {
  //   this.pubsub_topMapNoData = PubSub.subscribe('topMapHadData', function (topic, message) {
  //     console.log('message-批量导入主题图')
  //     console.log(message)
  //     this.setState({display_batchAddMapStruct:'block'})
  //   }.bind(this));
  // }
  componentWillReceiveProps(nextProps) {
    console.log("nextProps------------0305")
    console.log(nextProps)
    const { mapInfo } = this.props;
    this.setState({ map_id:  mapInfo.map_id });
    this.setState({ parent_know: nextProps.knowledgeInfo.pre_name })
    const { isBatchAddTopMapStruct } = this.props;
    if(isBatchAddTopMapStruct.isBatchAddTopMapStruct==false){
      this.setState({display_batchAddMapStruct:'block'})
    }
    if (nextProps.knowledgeInfo.is_knowledge == '是') {
      // this.confirm_alert()
      this.setState({ display: 'block' })
    }
    else { this.setState({ display: 'none' }) }
  }
  // componentWillUnmount() {
  //   PubSub.unsubscribe(this.pubsub_topMapNoData);
  // }
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <div >
          {/* <div style={{ paddingTop: '30px' }}> */}
          <div >
            <Card style={{ height: '800px' }}>
              <Tabs defaultActiveKey="1">
                <TabPane tab={<span><Icon type="plus-circle-o" />单个添加</span>} key="1">
                  <div style={{ display: this.state.display }}>
                    <Alert
                      message="友情提示："
                      description="此节点无权进行此操作."
                      type="warning"
                      showIcon
                    />
                    {/* <Alert message="此节点无权进行此操作" type="warning" showIcon /> */}
                  </div>
                  <div style={{ paddingTop: '10px' }}>
                    <Form >
                      <FormItem
                        label="父节点"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: this.state.spanwidth }}
                        hasFeedback
                      >
                        <span>{this.state.parent_know}</span>
                      </FormItem>
                      <FormItem
                        label="节点名称"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: this.state.spanwidth }}
                        hasFeedback
                      >
                        <Input onChange={this.changetitle.bind(this)} placeholder='必填' />
                      </FormItem>
                      <FormItem
                        label="描述"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: this.state.spanwidth }}
                        hasFeedback
                      >
                        <Input onChange={this.changedescription.bind(this)} placeholder='必填' />
                      </FormItem>
                      <FormItem
                        label="关键字"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: this.state.spanwidth }}
                        hasFeedback
                      >
                        <Input value={this.state.keywords} onChange={this.changekeywords.bind(this)} placeholder='必填' />
                      </FormItem>
                      <FormItem {...tailFormItemLayout} >
                        <Button style={buttoncolor} onClick={this.handleSubmit_add.bind(this)}>确定</Button>
                      </FormItem>
                    </Form>
                  </div>
                </TabPane>
                <TabPane tab={<span><Icon type="search" />批量导入</span>} key="2">
                  <div style={{ display: this.state.display_batchAddMapStruct }}>
                    <Alert
                      message="友情提示："
                      description="已存在结构，此主题图无法批量导入结构信息"
                      type="warning"
                      showIcon
                    />
                  </div>
                  <div style={{ paddingTop: '50px' }}>
                    <Form id="uploadForm">
                      <FormItem
                        label="下载Excel模板"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 15 }}
                        hasFeedback
                      >
                        <a href="http://192.168.71.201:8080/template/topic_Graph.xlsx">
                          <Button>
                            <Icon type="download" /> 单击下载
                    </Button>
                        </a>
                      </FormItem>
                      <FormItem
                        label="上传Excel文件"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: this.state.spanwidth }}
                        hasFeedback
                      >
                        <Input type="file" name="file" />
                      </FormItem>
                      <FormItem
                        label="上传Excel文件"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: this.state.spanwidth }}
                        hasFeedback
                        style={{display:'none'}}
                      >
                        <Input  name="mapid" value={this.state.map_id}/>
                      </FormItem>
                      <FormItem {...tailFormItemLayout} >
                        <Button style={buttoncolor} onClick={this.batchAddMapStruct.bind(this)}>确定</Button>
                      </FormItem>
                    </Form>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
            {/* <div style={{display:'block'}}> */}
          </div>
        </div>
      </div >
    );
  }
}
AddTopMapStruct = Form.create()(AddTopMapStruct);
// export default AddknowledgeElement;
function mapStateToProps(state) {
  return {
    login_info: state.reducer_login.login_info,
    knowledgeInfo: state.reducer_map_knowledge.knowledgeInfo,
    mapInfo: state.reducer_map_info.mapInfo,
    displayType: state.reducer_diaplay_type.displayType,
    isBatchAddTopMapStruct: state.reducer_isBatchAddTopMapStruct.isBatchAddTopMapStruct,
    mapType: state.reducer_map_type.mapType,
  };
}
function mapDispatchToProps(dispatch) {
  return {
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTopMapStruct);

