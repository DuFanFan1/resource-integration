import React, { Component } from 'react';
import $ from 'jquery';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import PubSub from 'pubsub-js';
import '../../../../style_css/antd.css';  // Add
import { Tabs, Icon, Form, Input, Button, Breadcrumb, Select, Radio, Layout, Card, Row, Col, Modal } from 'antd';
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
class EditMap extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }
  // /knowledge_map/editKnowledgeMapDescription
  constructor(props, context) {
    super(props, context);
    // this.getPersonalMapList_personal = this.getPersonalMapList_personal.bind(this);
    this.state = {
      // 知识地图详情字段
      mapid: 2,
      map_name: null,
      field: null,
      grade: null,
      subject: null,
      version: null,
      uid: null,
      // 知识地图详情字段
      MapTypeIndex: '1'
    }
  }
  // 弹出框-添加子知识点成功
  success() {
    Modal.success({
      title: '友情提示',
      content: '修改成功',
    });
  }
  // 弹出框-添加子知识点成功
  failure() {
    Modal.error({
      title: '友情提示',
      content: '修改失败',
    });
  }
  // 通过知识地图id获取知识地图详情
  getKnowledgeMapDetail = (map_id) => {
    let ajaxTimeOut=$.ajax({
      url: "/api_v1.1/knowledge_struct_index/getKnowledgeMap",
      type: "GET",
      dataType: "json",
      data: {
        "mapid": map_id,
      },
      timeout:2000,
      success: function (data) {
        console.log(data);
        if (data.errorCode == 0) {
          this.setState({
            mapid: data.msg.mapid,
            map_name: data.msg.map_name,
            field: data.msg.field,
            grade: data.msg.grade,
            subject: data.msg.subject,
            version: data.msg.version,
            kmap_type: data.msg.kmap_type,
            is_shared: data.msg.is_shared,
            uid: data.msg.uid,
          });

        }
        else { console.log('编辑知识元失败'); }
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
  changemap_name(e) { this.setState({ map_name: e.target.value }); } //知识点titl
  changefield(e) { this.setState({ field: e }); } //知识点title
  changegrade(e) { this.setState({ grade: e }); } //知识点title
  changesubject(e) { this.setState({ subject: e }); } //知识点title
  changeversion(e) { this.setState({ version: e }); } //知识点title
  // 编辑详情
  handleSubmit_add() {
    const { mapType } = this.props;
    // const { mapInfo } = this.props;
    // const map_id = mapInfo.map_id;
    // const mapName ={'sname':mapInfo.map_name,'name':this.state.kmap_name}
    // this.props.editMap(mapInfo.map_name,this.state.kmap_name);
    // console.log("this.state.kmapid"+this.state.kmapid)
    console.log('this.state.map_name:'+this.state.map_name)
    if(this.state.map_name==null || this.state.map_name==''){
      Modal.warning({
        title: '友情提示',
        content: '内容不能为空，请完整填写',
      });
    }
    else{
    let ajaxTimeOut=$.ajax({
      url: "/api_v1.1/knowledge_struct_index/editKnowledgeMapDescriptions",//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
      type: "PUT",
      dataType: "json",
      data: {
        "mapid": this.state.mapid,  //知识地图id
        "map_name": this.state.map_name, //知识地图名称
        "field": this.state.field,//领域
        "grade": this.state.grade,//年级
        "subject": this.state.subject,//学科
        "version": this.state.version,//版本
        "kmap_type": this.state.kmap_type,//版本
        "is_shared": this.state.is_shared,//版本
        "uid": 1//是否公开
      },
      timeout:2000,
      success: function (data) {
        console.log(data);
        // this.setState({ addResult: data });
        if (data.errorCode == 0) {
          console.log('成功编辑知识地图');
          this.success();
          console.log('mapType.mapType' + mapType.mapType);
          if (mapType.mapType == '标准地图') {
            this.context.router.history.push("/App/MapType"); //教材体系
          }
          else {
            this.context.router.history.push("/App/MapType_TopMap");//主题图
          }
        }
        // if (data.errorCode == 0) { console.log('成功编辑知识元');PubSub.publish('editMapSuccess',mapName); this.success() }
        else { console.log('编辑知识地图失败'); this.failure() }
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
  back(){
    const { mapType } = this.props;
    if (mapType.mapType == '标准地图') {
      this.context.router.history.push("/App/MapType"); //教材体系
    }
    else {
      this.context.router.history.push("/App/MapType_TopMap");//主题图
    }
  }
  componentDidMount() {
    // const { mapInfo } = this.props;
    // const map_id = mapInfo.map_id;
    const { mapInfo } = this.props;
    this.getKnowledgeMapDetail(mapInfo.map_id);
  }
  // componentWillReceiveProps(nextProps) {
  //   console.log("打印nextProps")
  //   console.log(nextProps)
  //   console.log(nextProps.mapInfo.map_id)
  //   this.getKnowledgeMapDetail(nextProps.mapInfo.map_id);
  // }

  render() {
    return (
      <div>
      {/* <div style={{ paddingTop: '30px' }}> */}
        <Card style={{ height: '750px', paddingTop: '20px' }}>
          <Form >
            <FormItem
              label="图谱名称（限20字以内）"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              hasFeedback
            >
              <Input value={this.state.map_name} onChange={this.changemap_name.bind(this)} placeholder='必填'/>
            </FormItem>
            <FormItem
              label="图谱领域"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              hasFeedback
            >
              <Select  value={this.state.field} onChange={this.changefield.bind(this)}>
                <Option value="3">成人教育</Option>
                <Option value="2">高等教育</Option>
                <Option value="1">基础教育</Option>
              </Select>
            </FormItem>
            <FormItem
              label="图谱学段"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              hasFeedback
            >
              <Select  value={this.state.grade} onChange={this.changegrade.bind(this)}>
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
              <Select  value={this.state.subject} onChange={this.changesubject.bind(this)}>
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
              <Select  value={this.state.version} onChange={this.changeversion.bind(this)}>
                <Option value="2">苏教版</Option>
                <Option value="4">人教版</Option>
              </Select>
            </FormItem>
            <FormItem {...tailFormItemLayout} >
              <Button style={buttoncolor} onClick={this.handleSubmit_add.bind(this)}>确定</Button> <Button style={buttoncolor} onClick={this.back.bind(this)} >返回</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}
EditMap = Form.create()(EditMap);
function mapStateToProps(state) {
  return {
    mapInfo: state.reducer_map_info.mapInfo,
    mapType: state.reducer_map_type.mapType,


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
)(EditMap);

