import React, { Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, message } from 'antd';
import $ from "jquery";
import { connect } from 'react-redux';
const FormItem = Form.Item;
const Option = Select.Option;
const buttoncolor = {
  color: "#fff",
  background: "#2a95de",
  border: "#2a95de",
}
class PswForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldpassword: "",
      newpassword: "",
      checknewpassword: ""
    }
  }
  putdata() {
    const { login_info } = this.props;
    if (this.state.newpassword == null || this.state.newpassword == "") {
      message.error("新密码不能为空！");
    } else if (this.state.oldpassword == this.state.newpassword) {
      message.error("旧密码与新密码相同，请重新输入！");
    } else if (this.state.newpassword != this.state.checknewpassword) {
      message.error("新密码两次输入不同，请重新输入！");
    } else {
      $.ajax({
        url: "/api_v1.1/user/updateUserPassword_v1_1",
        type: "PUT",

        dataType: "json",
        data: { "username": login_info.username, "password": this.state.oldpassword, "newpassword": this.state.newpassword },
        success: function (data) {
          if (data.errorcode == 0) {
            this.setState({
              flag: true
            })
            message.success("密码修改成功，3秒后跳转至登录页面");
            setTimeout(() => {
              location.href = '/login'
            }, 3000);
          }
          else {
            message.error("密码修改失败");
          }
        }.bind(this),
        error: function (xhr, status, err) {
        }.bind(this)
      });
    }
  }
  InputOldPassword(e) {
    this.setState({
      oldpassword: e.target.value,
    });
  }
  InputNewPassword(e) {
    this.setState({
      newpassword: e.target.value,
    });
  }
  InputCheckNewPassword(e) {
    this.setState({
      checknewpassword: e.target.value,
    });
  }
  render() {
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
      <Form>{/* onSubmit={this.Submit} */}
        <FormItem
          {...formItemLayout}
          label="当前密码"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          hasFeedback
        >
          <Input type="password" value={this.state.oldpassword} onChange={this.InputOldPassword.bind(this)} />{/*  {...getFieldProps('oldpassword') } */}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="重设密码"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          hasFeedback
        >

          <Input type="password" value={this.state.newpassword} onChange={this.InputNewPassword.bind(this)} />

        </FormItem>
        <FormItem
          {...formItemLayout}
          label="核对密码"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          hasFeedback
        >
          <Input type="password" value={this.state.checknewpassword} onChange={this.InputCheckNewPassword.bind(this)} />
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" onClick={this.putdata.bind(this)}>提交</Button>
        </FormItem>
      </Form>
    );
  }
}

const Revise_Password = Form.create()(PswForm);
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
)(Revise_Password);
