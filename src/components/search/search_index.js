import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Tabs, Row, Col, Layout, Checkbox, Breadcrumb, Input, Button, Card, Icon, Radio, DatePicker, Form, message, Select, Tag, Modal, } from 'antd';
import 'antd/dist/antd.css';
import $ from 'jquery';
import PropTypes from "prop-types";
import moment from 'moment';
import { connect } from 'react-redux';
const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const confirm = Modal.confirm;

class Search_Index extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      arrSize: 0,
      // scope: null,
      field: null,
      subject: null,
      r_grade: null,
      keyWord: [],
      name: [],
      description: []
    }
    this.arr = [this.generateROW()]
  }

  handlePlus() {
    if (this.state.arrSize < 2) {
      this.arr.push(this.generateROW())
      this.setState({ arrSize: this.state.arrSize + 1 })
    } else {
      Modal.warning({
        title: '注意：',
        content: '请选择输入1-3个多条件！',
      });
    }
  }

  handleMinus() {
    if (this.state.arrSize > 0) {
      this.arr.pop()
      this.setState({ arrSize: this.state.arrSize - 1 })
    } else {
      Modal.warning({
        title: '注意：',
        content: '请选择输入1-3个多条件！',
      });
    }
  }
  handleClick() {  
    const { setSearchValue } = this.props;
 
       setSearchValue({
      type: 'SearchSuccess',
      payload: {
        field: this.state.field,
        subject: this.state.subject,
        r_grade: this.state.r_grade,
        keyWord: this.state.keyWord,
        name: this.state.name,
        description: this.state.description,
      }
    });
    this.context.router.history.push("/App/Search_Index/searchContent");
  }
  generateROW() {
    return (
      <Row >
        <Col span={5}></Col>
        <Col>
          <FormItem label="知识点关键字" >
            <Input style={{ width: 100, height: 28 }} onChange={(e) => { this.state.keyWord[i] = e.target.value }} />
          </FormItem>
          {/* </Col> */}
          {/* <Col span={5}> */}
          <FormItem label="资源关键字" >
            <Input style={{ width: 100, height: 28 }} onChange={(e) => { this.state.name[i] = e.target.value }} />
          </FormItem>
          {/* </Col> */}
          {/* <Col span={9}> */}
          <FormItem label="资源描述" >
            <TextArea style={{ width: 250, height: 28 }} onChange={(e) => { this.state.description[i] = e.target.value }} autosize={{ minRows: 1, maxRows: 6 }} />
            {/* <Input style={{ width: 100, height: 28 }} onChange={(e)=>{this.state.description[i]=e.target.value}}/> */}
          </FormItem>
        </Col>
      </Row>
    )
  }
  // scopeChange(e) { console.log(e); this.setState({ scope: e }); }
  fieldChange(e) { console.log(e); this.setState({ field: e }); }
  subjectChange(e) { console.log(e); this.setState({ subject: e }); }
  r_gradeChange(e) { console.log(e); this.setState({ r_grade: e }); }

  render() {
    return (
      <Layout>
        <Content style={{ minHeight: 800 }}>
          <Row>
            <Form layout="inline">
              <Row>
                <Col span={22}>

                  {/* <Tag style={{ height: 28 }}>检索条件</Tag> */}
                  <Row>
                    <Col span={4}>
                      <FormItem
                        label="领域"
                        labelCol={{ span: 7, offset: 10 }}
                        wrapperCol={{ span: 7 }}
                      >
                        <Select style={{ width: 100 }} size='default' onChange={this.fieldChange.bind(this)}>
                          <Option value="基础教育">基础教育</Option>
                          <Option value="学前教育">学前教育</Option>
                          <Option value="职业教育">职业教育</Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={3}>
                      <FormItem
                        label="学科"
                        labelCol={{ span: 7, offset: 1 }}
                        wrapperCol={{ span: 7 }}
                      >
                        <Select style={{ width: 100 }} size='default' onChange={this.subjectChange.bind(this)}>
                          <Option value="数学">数学</Option>
                          <Option value="语文">语文</Option>
                          <Option value="英语">英语</Option>
                          <Option value="地理">地理</Option>
                          <Option value="政治">政治</Option>
                          <Option value="历史">历史</Option>
                          <Option value="物理">物理</Option>
                          <Option value="化学">化学</Option>
                          <Option value="生物">生物</Option>
                          <Option value="美术">美术</Option>
                          <Option value="体育">体育</Option>
                          <Option value="音乐">音乐</Option>
                          <Option value="历史与社会">历史与社会</Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem
                        label="年级"
                        labelCol={{ span: 7, offset: 1 }}
                        wrapperCol={{ span: 6 }}
                      >
                        <Select style={{ width: 100 }} size='default' onChange={this.r_gradeChange.bind(this)}>
                          <Option value="小学">小学</Option>
                          <Option value="初中">初中</Option>
                          <Option value="高中">高中</Option>
                        </Select>
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row key={this.state.arrSize}>
                <Col span={22}>
                  {
                    this.arr.map((v, i) => {
                      /* console.log("111111111"+i); */
                      return (
                        <Row key={i}>
                          {/* <Col span={5}></Col> */}
                          {/* <Col span={5}> */}
                          <FormItem label="知识点关键字">
                            <Input style={{ width: 100, height: 28 }} onChange={(e) => { this.state.keyWord[i] = e.target.value }} />
                          </FormItem>
                          {/* </Col> */}
                          {/* <Col span={5}> */}
                          <FormItem label="资源关键字" >
                            <Input style={{ width: 100, height: 28 }} onChange={(e) => { this.state.name[i] = e.target.value }} />
                          </FormItem>
                          {/* </Col> */}
                          {/* <Col span={9}> */}
                          <FormItem label="资源描述">
                            <TextArea style={{ width: 300, height: 28 }} onChange={(e) => { this.state.description[i] = e.target.value }} autosize={{ minRows: 1, maxRows: 6 }} />
                            {/* <Input style={{ width: 100, height: 28 }} onChange={(e)=>{this.state.description[i]=e.target.value}}/> */}
                          </FormItem>

                        </Row>
                      )
                    })
                  }
                </Col>
                <Col span={2} style={{ textAlign: 'right' }}>
                  <Button icon="plus" size="small" type="primary" ghost onClick={this.handlePlus.bind(this)} style={{ textAlign: 'right' }} />
                  <Button icon="minus" size="small" type="primary" ghost onClick={this.handleMinus.bind(this)} style={{ textAlign: 'right' }} />
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={this.handleClick.bind(this)}>检索</Button>
                </Col>
              </Row>
            </Form>
          </Row>
          <Row>

            {this.props.children}

          </Row>
        </Content>
      </Layout >

    );
  }
}

function mapStateToProps(state) {
  return {

  };
}


function mapDispatchToProps(dispatch) {
  return {
    setSearchValue: (state) => dispatch(state)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search_Index);

