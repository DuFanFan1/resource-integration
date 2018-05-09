import React, { Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, message, Radio, DatePicker } from 'antd';
import $ from "jquery";
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const RadioGroup = Radio.Group;

const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
var datevalue="";
class ValidateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile_phone: "",
      email: "",
      birthday:"",
      sex: "",
      scope: "",
      grade: "",
      course: ""
    }
  } 

  getdata() {
    const { login_info } = this.props;
    $.ajax({
      url:"/api_v1.1/user/getUserInfo_v1_1",
      type: "GET",
      dataType: "json",
      async:false,
      data:{"username":login_info.username},
      success: function (data) {
        if (data.errorcode == "0") {
          datevalue=data.msg.birthday,
          this.setState({ 
            mobile_phone: data.msg.mobile_phone,
            email:data.msg.email,
            birthday:data.msg.birthday,
            sex: data.msg.sex,
            scope: data.msg.scope,
            grade: data.msg.grade,
            course: data.msg.course,
          });
        }
        else {     
          console.log('用户名不存在');
          console.log(data.msg);
        }
  
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
  }
  InputUmobilephoneChange(e){this.setState({mobile_phone:e.target.value}); }
  InputUemailChange(e){this.setState({email:e.target.value});}  
  DatePickerUbirthdayChange(value, dateString){console.log('dateString',dateString);this.setState({ birthday:dateString});datevalue=dateString;console.log('datevalue',datevalue)}  
  SelectUsexChange(e){this.setState({sex:e.target.value}); }  
  SelectUscopeChange(e){this.setState({scope:e});}  
  SelectUgradeChange(e){this.setState({grade:e});}  
  SelectUcourseChange(e){this.setState({course:e});}
  putdata() {
    const {login_info } = this.props;
    $.ajax({
      url: "/api_v1.1/user/updateUserInfo_v1_1",
      type: "PUT",
      dataType: "json",
      data: {
        "username": login_info.username,
        "mobile_phone": this.state.mobile_phone,
        "email": this.state.email,
        "birthday": this.state.birthday,
        "sex": this.state.sex,
        "scope": this.state.scope,
        "grade": this.state.grade,
        "course": this.state.course
      },
      success: function (data) {
        if (data.errorcode == 0) {
          message.success("您的信息已修改成功，请点击个人信息进行查看！");
        }
        else {
          message.error("您的信息暂未修改成功，请重新填写并提交！");
          console.log(data);
        }
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
  } 
  componentWillMount() {
    this.getdata();
  }

  render() {
    const { login_info } = this.props
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
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
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="用户名"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          hasFeedback
        >{login_info.username}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="手机号"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        >
          <Input style={{ width: '100%' }}  value={this.state.mobile_phone} onChange={this.InputUmobilephoneChange.bind(this)}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="邮箱"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          hasFeedback
        >
        <Input value={this.state.email} onChange={this.InputUemailChange.bind(this)}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="生日"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          hasFeedback
        >
          {/* <DatePicker defaultValue={moment('2015-01-01', dateFormat)} onChange={this.DatePickerUbirthdayChange.bind(this)}/> */}
          <DatePicker defaultValue={moment(datevalue, dateFormat)} format={dateFormat} onChange={this.DatePickerUbirthdayChange.bind(this)}/>
        </FormItem>

        <FormItem
          label="性别"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        >
          <RadioGroup value={this.state.sex}  onChange={this.SelectUsexChange.bind(this)}>
            <Radio value={0}>男</Radio>
            <Radio value={1}>女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="领域"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}>
          {/* <Input {...getFieldProps('scope') } /> */}
          <Select style={{ width: 200 }} value={this.state.scope} onChange={this.SelectUscopeChange.bind(this)}>
            <Option value="学前教育">学前教育</Option>
            <Option value="基础教育">基础教育</Option>
            <Option value="职业教育">职业教育</Option>
            <Option value="高等教育">高等教育</Option>
          </Select>
        </FormItem>
        <FormItem label="学段"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}>
          {/*  <Input {...getFieldProps('grade') } /> */}
          <Select style={{ width: 200 }}  value={this.state.grade} onChange={this.SelectUgradeChange.bind(this)}>
            <Option value="小学">小学</Option>
            <Option value="初中">初中</Option>
            <Option value="高中">高中</Option>
          </Select>
        </FormItem>
        <FormItem label="学科"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}>
          <Select style={{ width: 200 }}  value={this.state.course} onChange={this.SelectUcourseChange.bind(this)}>
            <Option value="数学">数学</Option>
            <Option value="语文">语文</Option>
            <Option value="英语">英语</Option>
            <Option value="地理">地理</Option>
            <Option value="生物">生物</Option>
            <Option value="科学">科学</Option>
            <Option value="政治">政治</Option>
            <Option value="历史">历史</Option>
            <Option value="物理">物理</Option>
            <Option value="化学">化学</Option>
            <Option value="体育">体育</Option>
            <Option value="美术">美术</Option>
            <Option value="音乐">音乐</Option>
          </Select>
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" onClick={this.putdata.bind(this)} >提交</Button>
        </FormItem>
      </Form>
    );
  }
}

const Revise_Information = Form.create()(ValidateForm);
function mapStateToProps(state) {
  return {
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
)(Revise_Information);