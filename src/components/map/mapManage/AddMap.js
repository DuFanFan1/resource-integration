import React, { Component } from 'react';
import $ from 'jquery';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import PropTypes from "prop-types";
import '../../../../style_css/antd.css';  // Add
import { Tabs, Icon, Form, Input, Button, Breadcrumb, Select, Radio, Layout, Card, Modal, Row, Col } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const confirm = Modal.confirm;
const buttoncolor = {
  color: "#fff",
  background: "#2a95de",
  border: "#2a95de",
}
const buttoncolor1 = {
  color: "#fff",
  background: "#FF9900",
  border: "#FF9900",
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
class AddMap extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props, context) {
    super(props, context);
    // this.getPersonalMapList_personal = this.getPersonalMapList_personal.bind(this);
    this.state = {
      map_name: '',
      field: '',
      grade: '',
      subject: '',
      version: '',
    }
  }
  // 弹出框-添加知识地图成功
  success() {
    Modal.success({
      title: '友情提示',
      content: '成功添加知识地图',
    });
  }
  // 弹出框-添加知识地图成功
  failure() {
    Modal.error({
      title: '友情提示',
      content: '添加知识地图失败',
    });
  }
  handleSubmit() {
    const { login_info } = this.props;
    if(this.state.map_name=='' || this.state.field==''  || this.state.grade==''  || this.state.subject==''  || this.state.version=='' ){
      Modal.warning({
        title: '友情提示',
        content: '内容不能为空，请完整填写',
      });
    }
    else{
      let ajaxTimeOut=$.ajax({
        url: "/api_v1.1/knowledge_struct_index/addKnowledgeMaps",//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
          "map_name": this.state.map_name,
          "field": this.state.field,
          "grade": this.state.grade,
          "subject": this.state.subject,
          "version": this.state.version,
          "kmap_type": 2,  //标准
          "is_shared": 2,
          "uid": login_info.userid,
        }
        ),
        timeout:2000,
        success: function (data) {
          console.log('添加知识地图成功');
          console.log(data);
          if (data.errorCode == 0) { console.log('成功添加知识地图'); this.success(); this.context.router.history.push("/App/MapType"); }
          else { console.log('添加知识地图失败'); this.failure() }
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
    // this.props.form.getFieldDecorator();
  }
  change_map_name(e) { this.setState({ map_name: e.target.value }); } //知识点title
  change_field(e) { this.setState({ field: e }); } //知识点title
  change_grade(e) { this.setState({ grade: e }); } //知识点title
  change_subject(e) { this.setState({ subject: e }); } //知识点title
  change_version(e) { this.setState({ version: e }); } //知识点title
  back() {
    this.context.router.history.push("/App/MapType");//主题图
  }
  componentWillMount() {
    const { selectMapSubject } = this.props;
    const { mapGrage } = this.props;
    const { mapVersion } = this.props;
    const grade = mapGrage.grade;
    const version = mapVersion.version;
    this.setState({
      subject: selectMapSubject.subject_name,
      grade: grade,
      version: version,
    })
  }
  render() {
    // const { getFieldDecorator } = this.props.form;
    return (
      <div >
        {/* <div style={{ paddingTop: '30px' }}> */}
        <Card style={{ height: '750px', paddingTop: '20px' }}>
          <Form>
            <FormItem
              label="图谱名称（限20字以内）"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              hasFeedback
            >
            {/* {getFieldDecorator('mapName', {
              rules: [{ required: true, message: '请输入地图名称!' }],
            })(
              <Input  />
              
              )} */}
               <Input value={this.state.map_name} onChange={this.change_map_name.bind(this)} placeholder='必填'/>
             
            </FormItem>
            <FormItem
              label="图谱领域"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              hasFeedback
            >
              <Select  placeholder="必选" onChange={this.change_field.bind(this)} >
                <Option value="1">成人教育</Option>
                <Option value="2">高等教育</Option>
                <Option value="3">基础教育</Option>
              </Select>
            </FormItem>
            <FormItem
              label="图谱学段"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              hasFeedback
            >
              <Select value={this.state.grade} onChange={this.change_grade.bind(this)}>
                <Option value="1">高中</Option>
                <Option value="2">初中</Option>
                <Option value="3">小学</Option>
              </Select>
            </FormItem>
            <FormItem
              label="图谱学科"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              hasFeedback
            >
              <Select value={this.state.subject} onChange={this.change_subject.bind(this)}>
                <Option value="1">数学</Option>
                <Option value="2">物理</Option>
                <Option value="3">化学</Option>
                <Option value="4">生物</Option>
              </Select>
            </FormItem>
            <FormItem
              label="图谱版本"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              hasFeedback
            >
              <Select value={this.state.version} onChange={this.change_version.bind(this)}>
                <Option value="2">苏教版</Option>
                <Option value="4">人教版</Option>
              </Select>
            </FormItem>
            <FormItem {...tailFormItemLayout} >
              <Button style={buttoncolor} onClick={this.handleSubmit.bind(this)} >确定</Button>  <Button style={buttoncolor} onClick={this.back.bind(this)}>返回</Button>

            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}
AddMap = Form.create()(AddMap)
function mapStateToProps(state) {
  return {
    selectMapSubject: state.reducer_map_subject.selectMapSubject,
    mapGrage: state.reducer_map_grade.mapGrage,
    mapVersion: state.reducer_map_version.mapVersion,
    login_info: state.reducer_login.login_info
  };
}
function mapDispatchToProps(dispatch) {
  return {

  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMap);
