import { Card, Form, Rate } from 'antd';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import '../../../style_css/antd.css';  // Add
import { connect } from 'react-redux';
import PropTypes from "prop-types";
const FormItem = Form.Item;

class MyInformation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mobile_phone: "",
      email: "",
      sex: "",
      role: "",
      scope: "",
      grade: "",
      course: "",
      created_at: "",
      updated_at:"",
      user_experience: "",
      user_credit: "",
    }
  }
  //获取个人信息
  getdata() {
    const { login_info } = this.props;
    $.ajax({
      url: "/api_v1.1/user/getUserInfo_v1_1",
      type: "GET",
      dataType: "json",
      data: { "username":login_info.username},
      success: function (data) {
        console.log(data);
        if (data.errorcode == 0) {
          console.log('get获取成功');
          console.log(data);
          this.setState({
            mobile_phone:data.msg.mobile_phone,
            email:data.msg.email,
            birthday: data.msg.birthday,
            sex:data.msg.sex,
            role:data.msg.user_identity,
            scope:data.msg.scope,
            grade:data.msg.grade,
            course:data.msg.course,
            created_at: data.msg.created_at,
            updated_at: data.msg.updated_at,
            user_experience: data.msg.user_experience,
            user_credit: data.msg.user_credit,
          });
          console.log("用户经验值");
          console.log(this.state.user_experience);
          if (this.state.user_experience > 0 && this.state.user_experience <= 50) {
            this.setState({ 
              myRate: 1,
              myGrade: 50 - this.state.user_experience 
            })
          } else if (this.state.user_experience <= 200) {
            this.setState({ 
              myRate: 2,
              myGrade: 200 - this.state.user_experience 
             })
          } else if (this.state.user_experience <= 500) {
            this.setState({ 
              myRate: 3,
              myGrade: 500 - this.state.user_experience 
             })
          } else if (this.state.user_experience <= 1000) {
            this.setState({ 
              myRate: 4,
              myGrade: 1000 - this.state.user_experience 
             })
          } else if (this.state.user_experience <= 2000) {
            this.setState({ 
              myRate: 5,
              myGrade: 2000 - this.state.user_experience 
            })
          } else if (this.state.user_experience <= 5000) {
            this.setState({ 
              myRate: 6,
              myGrade: 5000 - this.state.user_experience 
            })
          }else if (this.state.user_experience <= 8000) {
            this.setState({ 
              myRate: 7,
              myGrade: 8000 - this.state.user_experience 
             })
          }else if (this.state.user_experience <= 12000) {
            this.setState({ 
              myRate: 8,
              myGrade: 12000 - this.state.user_experience 
             })
          }else if (this.state.user_experience <= 16000) {
            this.setState({ 
              myRate: 9,
              myGrade: 16000 - this.state.user_experience 
             })
          }else if (this.state.user_experience <= 20000) {
            this.setState({ 
              myRate: 10,
              myGrade: 20000 - this.state.user_experience 
             })
          }
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
  componentWillMount() {
    this.getdata();
  }

  render() {

    //用户等级
    let myStar = this.state.myRate;
    if(myStar != null){
      myStar = (
        <Rate allowHalf defaultValue={this.state.myRate} count='10' disabled/>
      )
    }
    console.log(this.state.myRate)
    console.log('this.state.myGrade多久升级')
    console.log(this.state.myGrade)
    const { login_info } = this.props;
    return (
      <Card bordered={true}>
        <Form>
          <FormItem
            label={<span style={{ fontWeight: 'bold' }}>用户名</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>{login_info.username}</span>
          </FormItem>

          <FormItem
            label={<span style={{ fontWeight: 'bold' }}>角色</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>{this.state.role}</span>
          </FormItem>
          {/* <FormItem
            label={<span style={{ fontWeight: 'bold' }}>用户经验值</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>
               {this.state.user_experience}
            </span>
          </FormItem>
          <FormItem
            label={<span style={{ fontWeight: 'bold' }}>用户等级</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>
              {myStar}<br/><span style={{ paddingLeft: "30px" }}>剩余升级经验值：{this.state.myGrade}</span>
            </span>
          </FormItem> */}
          <FormItem
            label={<span style={{ fontWeight: 'bold' }}>用户信用</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>{this.state.user_credit}</span>
          </FormItem>

          <FormItem
            label={<span style={{ fontWeight: 'bold' }}>绑定手机号</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>{this.state.mobile_phone}</span>
          </FormItem>
          
          <FormItem
            label={<span style={{ fontWeight: 'bold' }}>邮箱</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>{this.state.email}</span>
          </FormItem>
          
          <FormItem
            label={<span style={{ fontWeight: 'bold' }}>生日</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>{this.state.birthday}</span>
          </FormItem>

          <FormItem
            label={<span style={{ fontWeight: 'bold' }}>性别</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>{this.state.sex==0?"男":"女"}</span>
          </FormItem>
          <FormItem
            label={<span style={{ fontWeight: 'bold' }}>领域</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>{this.state.scope}</span>
          </FormItem>
          <FormItem
            label={<span style={{ fontWeight: 'bold' }}>学段</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>{this.state.grade}</span>
          </FormItem>
          <FormItem
            label={<span style={{ fontWeight: 'bold' }}>学科</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>{this.state.course}</span>
          </FormItem>
            <FormItem
            label={<span style={{ fontWeight: 'bold' }}>账号创建时间</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>{this.state.created_at}</span>
          </FormItem>
          <FormItem
            label={<span style={{ fontWeight: 'bold' }}>最近更新时间</span>}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            hasFeedback
            style={{ marginBottom: '5px' }}
          >
            <span style={{ paddingLeft: "30px" }}>{this.state.updated_at}</span>
          </FormItem>
         
        </Form>
      </Card>
    ); 
  }
}

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
  )(MyInformation);