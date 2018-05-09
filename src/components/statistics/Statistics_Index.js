import React, { Component } from 'react';
import '../../../style_css/antd.css';  // Add
import { Tabs, Icon, Form, Input, Button, Row, Col, Card } from 'antd';
import BarGraph from '../echarts/statistics/barGraph.js';
import PieChart from '../echarts/statistics/pieChart.js';
import Pie from '../echarts/statistics/pie.js';
import $ from 'jquery';
const TabPane = Tabs.TabPane;
class Statistics_Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: -1,
      subject: null,
      grade: null,
      rtype: null,
    }
  }
  getResourceAllCount() {
    $.ajax({
      url: "/api_v1.1/statisticalAnalysis/allCount",
      type: "GET",
      dataType: "json",
      data: { "tag": 1 },
      success: function (data) {
        if (data.erroCode == 0) {
          this.setState({
            count: data.msg
          });
        }
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
  }
  getResourceSubject() {
    $.ajax({
      url: "/api_v1.1/statisticalAnalysis/selectCount",
      type: "GET",
      async: false,
      dataType: "json",
      data: {
        "tag": 1,
        "type": "subject"
      },
      success: function (data) {
        console.log(data);
        if (data.erroCode == 0) {
          this.setState({
            subject: data.msg
          });
          console.log("this.state.subject");
          console.log(this.state.subject)
        }
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
  }
  getResourceGrade() {
    $.ajax({
      url: "/api_v1.1/statisticalAnalysis/selectCount",
      type: "GET",
      async: false,
      dataType: "json",
      data: {
        "tag": 1,
        "type": "grade"
      },
      success: function (data) {
        console.log(data);
        if (data.erroCode == 0) {
          this.setState({
            grade: data.msg
          });
          console.log("this.state.grade");
          console.log(this.state.grade)
        }
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
  }
  getResourceType() {
    $.ajax({
      url: "/api_v1.1/statisticalAnalysis/selectCount",
      type: "GET",
      async: false,
      dataType: "json",
      data: {
        "tag": 1,
        "type": "rtype"
      },
      success: function (data) {
        console.log(data);
        if (data.erroCode == 0) {
          this.setState({
            rtype: data.msg
          });
          console.log("this.state.rtype");
          console.log(this.state.rtype)
        }
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
  }
  componentWillMount() {
    this.getResourceAllCount();
    this.getResourceSubject();
    this.getResourceGrade();
    this.getResourceType();
  }
  render() {
    return (
      <div >
      <Row gutter={16}>
        <Col className="gutter-row" md={24}>
          <div className="gutter-box">
            <Card bordered={false}>
              <h3>总试题数：{this.state.count} </h3>
            </Card>
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" md={24}>
          <div className="gutter-box">
            <Card bordered={false}>
              <h3>各学科数量及占比 </h3>
              {/* <BarGraph optionData={this.state.subject} /> */}
              {/* <PieChart optionData={this.state.subject} /> */}
              <Pie optionData={this.state.subject} />
            </Card>
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" md={24}>
          <div className="gutter-box">
            <Card bordered={false}>
              <h3>各学段数量及占比 </h3>
              {/* <BarGraph optionData={this.state.grade} /> */}
              {/* <PieChart optionData={this.state.grade} /> */}
              <Pie optionData={this.state.grade} />
            </Card>
          </div>
        </Col>
      </Row>
      {/* <Row gutter={16}>
        <Col className="gutter-row" md={24}>
          <div className="gutter-box">
            <Card bordered={false}>
              <h3>各资源类型数量 </h3> */}
              {/* <BarGraph optionData={this.state.rtype} /> */}
              {/* <PieChart optionData={this.state.rtype} /> */}
              {/* <Pie optionData={this.state.rtype} /> */}
            {/* </Card>
          </div>
        </Col> 
      </Row>*/}
    </div>
    );
  }
}
export default Statistics_Index;
