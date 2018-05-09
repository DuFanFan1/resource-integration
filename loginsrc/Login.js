import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './style_css/antd.css';  // Add
import {cors_setting} from '../configure'
import { Row, Col, Form, Icon, Input, Button, Checkbox, Card,message,Modal } from 'antd';
import 'babel-polyfill'
const FormItem = Form.Item;

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:''
        }
    }
    async  backendLogin()
    {

        console.log(this.state);
        var formData = new FormData();
        formData.append('username', this.state.username);
        formData.append('password', this.state.password )
        var response = await fetch(cors_setting.extra_login_path,{
            method: 'POST',
            mode:'cors',
            credentials:'include',
            body:formData,
        })
    }
    render() {        
        return (
            <div>
            <Row type="flex" align="middle" justify="end">
                <Col span={10}>
                </Col>
                <Col span={4}>
                    <div style={{ paddingTop: '300px' }} >
                            <form action="/login" method="post" onSubmit={(e)=>{
                                {/* e.preventDefault(); */}
                                {/* console.log(e.target); */}
                                {/* console.log(this.refs); */}
                                {/* console.log(this.refs.password.refs.input.getValue()); */}
                                {/* console.log(this.refs.username.refs.input.getValue()); */}
                                {/* this.backendLogin(); */}
                                {/* console.log('clicked'); */}
                            }}>
                                <FormItem
                                    label="用户名"
                                    hasFeedback>
                                    <Input type="text" name="username" prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" width="300px" onChange={(event)=>{this.setState({username:event.target.value})}}/>
                                </FormItem>
                                <FormItem
                                    label="密码"
                                    hasFeedback>
                                    <Input name="password" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="请输入密码" width="300px" onChange={(event)=>{this.setState({password:event.target.value});}} />
                                </FormItem>
                                <FormItem >
                                    <Input type="submit" value="登录" style={{ color:"#fff",background:"#2a95de", border:"#2a95de",width: '100%',} } />
                                </FormItem>
                            </form>
                    </div>
                </Col>
                <Col span={10}>
                </Col>
            </Row>
        </div>
        );
    }
}
// ReactDOM.render(
//     <Login />,
//     document.getElementById("react-container")
// );