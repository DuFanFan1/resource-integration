require("babel-polyfill");
var md5= require('md5');
import { Base64 } from 'js-base64';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../style_css/antd.css';  // Add

import { Row, Col, Form, Icon, Input, Button, Checkbox, Card, message, Modal, Layout } from 'antd';
import $ from 'jquery';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import Login_index from './echarts/Login_Index.js';
import {cors_setting} from '../../configure';
const { Header, Content, Footer, Sider } = Layout;
const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;
const FormItem = Form.Item;

class Login_Index extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor(props, context) {
        super(props, context);
    }
    extra_login_url(username)
    {
        return cors_setting.extra_login_path+'?'+'username='+Base64.encode(username)+'&' + 'timestamp=111111'+'&'+'authid='+md5(Base64.encode(username)+'111111'+'huashi');

        
    }
    _extra_login(username)
    {
        if(cors_setting.enable_extra_login)
        {
            // this.extra_login();
            $.ajax({
                // url: cors_setting.extra_login_path,//
                // url:"http://zyk-yun.mypep.com.cn/app/api/login_hs.php?",
                url:"http://zyk-yun.mypep.com.cn/app/api/login_hs.php?username=enlrYWRtaW4=&timestamp=111111&authid=2dc7f6be63d086fdab3ce7af7b70c743",
                //url: this.extra_login_url(username),
                method: "POST",
                crossDomain:true,
                // data: { "username": "enlrYWRtaW4", "timestamp": "111111","authid":"2dc7f6be63d086fdab3ce7af7b70c743" },
                xhrFields:{withCredentials:true},
                beforeSend:function(xhr){
                    xhr.withCredentials=true;
                },
                success: function (data) {
                   
                    console.log(data);
                   
                }.bind(this),
                error: function (xhr, status, err) {
                    console.log(err);
                }.bind(this)
            }); 
        }
    }
    componentWillMount() {
        const { setLoginState, mapType } = this.props;
        $.ajax({
            url: "/me",
            method: "GET",
            success: function (data) {
                data = JSON.parse(data);
                console.log(data);
                setLoginState({
                    type: 'LoginSuccess',
                    payload: {
                        username: data.user.username,
                        userid: data.user.uid,
                    }
                });
                this._extra_login(data.user.username);
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(err);
            }.bind(this)
        });
            // mapType({
            //     type: 'mapType',
            //     payload: {
            //         mapType: '标准地图',
            //     }
            // });
    }
    render() {
        return (
            <Layout>
                <Header className="header">
                    <h1 className="App-logo">资源融合平台</h1>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Card style={{ marginTop: '50px' }}>
                        <Login_index>
                        </Login_index>
                    </Card>

                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    ©2017 Created by 华中师范大学国家数字化工程技术研究中心
          </Footer>
            </Layout>
        );
    }
}
// export default Login_Index;
function mapStateToProps(state) {
    return {

    };
}


function mapDispatchToProps(dispatch) {
    return {
        setLoginState: (state) => dispatch(state),
        mapType: (state) => dispatch(state),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login_Index);

