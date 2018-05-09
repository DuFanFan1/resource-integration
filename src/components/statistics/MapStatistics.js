import React, { Component } from 'react';
import '../../../style_css/antd.css';  // Add
import $ from 'jquery';
import { Tabs, Icon, Form, Input, Button, Row, Col, Card } from 'antd';
import BarGraph from '../echarts/statistics/barGraph.js';
import Pie from '../echarts/statistics/pie.js';
import PieChart from '../echarts/statistics/pieChart.js';

const TabPane = Tabs.TabPane;
class MapStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: -1,
      subject: null,
      grade: null,
      version: null,

    }
  }
  getMapAllCount() {
    $.ajax({
      url: "/api_v1.1/statisticalAnalysis/allCount",
      type: "GET",
      dataType: "json",
      data: { "tag": 3 },
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
  getMapSubject() {
    $.ajax({
      url: "/api_v1.1/statisticalAnalysis/selectCount",
      type: "GET",
      async: false,
      dataType: "json",
      data: {
        "tag": 3,
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
  getMapGrade() {
    $.ajax({
      url: "/api_v1.1/statisticalAnalysis/selectCount",
      type: "GET",
      async: false,
      dataType: "json",
      data: {
        "tag": 3,
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
  getMapVersion() {
    $.ajax({
      url: "/api_v1.1/statisticalAnalysis/selectCount",
      type: "GET",
      async: false,
      dataType: "json",
      data: {
        "tag": 3,
        "type": "version"
      },
      success: function (data) {
        console.log(data);
        if (data.erroCode == 0) {
          this.setState({
            version: data.msg
          });
          console.log("this.state.version");
          console.log(this.state.version)
        }
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
  }
  componentWillMount() {
    this.getMapAllCount();
    this.getMapSubject();
    this.getMapGrade();
    this.getMapVersion();
  }
  render() {
    return (
      <div >
        <Row gutter={16}>
          <Col className="gutter-row" md={24}>
            <div className="gutter-box">
              <Card bordered={false}>
                <h3>总知识地图数：{this.state.count} </h3>
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
        <Row gutter={16}>
          <Col className="gutter-row" md={24}>
            <div className="gutter-box">
              <Card bordered={false}>
                <h3>各版本数量 </h3>
                <BarGraph optionData={this.state.version} />
                {/* <PieChart optionData={this.state.version} /> */}
                {/* <Pie optionData={this.state.version} /> */}
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default MapStatistics;
