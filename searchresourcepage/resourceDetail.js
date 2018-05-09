import React, { Component } from 'react';
// import './../../style_css/antd.css';
import $ from 'jquery';
import { Row, Col, Card, Button, Form, Layout } from 'antd';
import { Link } from "react-router-dom"
import { connect } from 'react-redux';
const FormItem = Form.Item;
const buttoncolor = {
  color: "#fff",
  background: "#2a95de",
  border: "#2a95de",
}
class ResourceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      r_name: "",
      r_desc: "",
      r_key: "",
      rtype: "",
      grade: "",
      field: "",
      subject: "",
      difficulty: "",
      answer: "",
      create_time: "",
      file_url: null,
      resource: [],
      rid: "",
      rid1: "",
    }
  }

  //获取资源详情
  getdataDetail() {
    const { resourceid } = this.props;
    //延时函数
    setTimeout(() => {
      this.setState({
        rid: resourceid
      });
      this.setState({
        rid1: this.state.rid.slice(0, 1)
      });
    }, 50);

    setTimeout(() => {
      if (this.state.rid1 != 'z') {
        $.ajax({
          url: "/api_v1.1/knowledge_resource/resourceDetail_v1_1",
          type: "GET",
          dataType: "json",
          data: { "r_id": this.state.rid },
          success: function (data) {
            if (data.errorCode == "0") {
              this.setState({
                r_name: data.msg[0].r_name,
                r_desc: data.msg[0].r_desc,
                r_key: data.msg[0].r_key,
                rtype: data.msg[0].rtype,
                grade: data.msg[0].grade,
                field: data.msg[0].field,
                difficulty: data.msg[0].difficulty,
                answer: data.msg[0].answer,
                create_time: data.msg[0].create_time,
                subject: data.msg[0].subject,
                file_url: data.msg[0].file_url,
              });
            }
            else {
              console.log('资源不存在');
              this.setState({ resource: data.msg });
              console.log(this.state.resource);
            }

          }.bind(this),
          error: function (xhr, status, err) {
          }.bind(this)
        });
      }
      else{
  
        $.ajax({
          url: "/api_v1.1/knowledge_resource/resource2Detail_v1_1",
          type: "GET",
          dataType: "json",
          data: { "r_id":  this.state.rid.slice(3)},
          success: function (data) {
            if (data.errorCode == "0") {
              this.setState({
                r_name: data.msg[0].r_name,
                r_desc: data.msg[0].r_desc,
                r_key: data.msg[0].r_key,
                rtype: data.msg[0].rtype,
                grade: data.msg[0].grade,
                field: data.msg[0].field,
                difficulty: data.msg[0].difficulty,
                answer: data.msg[0].answer,
                create_time: data.msg[0].create_time,
                subject: data.msg[0].subject,
                file_url: data.msg[0].file_url,
              });
            }
            else {
              console.log('资源不存在');
              this.setState({ resource: data.msg });
              console.log(this.state.resource);
            }

          }.bind(this),
          error: function (xhr, status, err) {
          }.bind(this)
        });
      }
     
    }, 50);
  }

  render() {
    return (
      <Card style={{ height: '800px' }}>
        <Row gutter={18}>
          <Col span={8}>
          </Col>
          <Col span={18}>
            <Card title="资源详情" style={{ marginLeft: '200px' }}>
              <h3 style={{ paddingBottom: "15px" }}>资源名称：{this.state.r_name}</h3>
              <Form><FormItem label="资源描述"> <h3 style={{ paddingBottom: "15px" }} dangerouslySetInnerHTML={{ __html: this.state.r_desc }}></h3></FormItem ></Form>
              <h3 style={{ paddingBottom: "15px" }}>关键字：{this.state.r_key}</h3>
              <h3 style={{ paddingBottom: "15px" }}>资源类型：{this.state.rtype}</h3>
              <h3 style={{ paddingBottom: "15px" }}>适用对象：{this.state.grade}</h3>
              <h3 style={{ paddingBottom: "15px" }}>适用领域：{this.state.field}</h3>
              <h3 style={{ paddingBottom: "15px" }}>学科：{this.state.subject}</h3>
              <h3 style={{ paddingBottom: "15px" }}>难度：{this.state.difficulty}</h3>
              <h3 style={{ paddingBottom: "15px" }}>答案：{this.state.answer}</h3>
              <h3 style={{ paddingBottom: "15px" }}>创建时间：{this.state.create_time}</h3>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: "50px" }}>
          <Col span={7}></Col>
          <Col span={3}>
            <Link to="/Allresource"><Button type="primary" size="large" style={buttoncolor}>返回</Button></Link>
          </Col>
        </Row>
      </Card>
    );
  }
  componentDidMount() {
    this.getdataDetail();
  }
}

function mapStateToProps(state) {
  return {
    resourceid: state.search_module2.resourceid,
  };
}


function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceDetail);