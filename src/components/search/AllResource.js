import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Tabs, Row, Col, Layout, Checkbox, Breadcrumb, Pagination, Input, Button, Card, Icon, Radio, DatePicker, Form, message, Select, Tag, Modal, } from 'antd';
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

class AllResource extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor(props, context) {
        super(props, context)
        this.state = {
            ResourceInfo: [{}],
            allpage: -1,
            current: 1,
        }
    }

    getdata() {
        $.ajax({
            url: "/api_v1.1/higherSearch/AllResources",
            type: "GET",
            dataType: "json",
            // async: false,
            data: {
                "count": 10,
                "page": 1,
            },
            success: function (data) {
                if (data.errorCode == 0) {
                    this.setState({
                        ResourceInfo: data.msg,
                        allpage: data.allpages,
                        current: 1,
                    });
                }
                else {
                    console.log('第一步获取失败');
                    this.setState({
                        ResourceInfo: [],
                        allpage: [],
                        current: 1,
                    });
                    Modal.warning({
                        title: '友情提示',
                        content: '暂无内容！',
                    });
                }
            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this)
        });
    }
    //选择页码获取资源
    onChange2 = (page) => {

        this.setState({
            ResourceInfo: [{}],
        });
        $.ajax({
            url: "/api_v1.1/higherSearch/AllResources",
            type: "GET",
            dataType: "json",
            data: {

                "count": 10,
                "page": page
            },
            success: function (data) {
                console.log('data')
                console.log(data)
                if (data.errorCode == 0) {
                    this.setState({
                        ResourceInfo: data.msg,
                        allpage: data.allpages,
                        current: page,
                    });
                    console.log('this.state.allpage', this.state.allpage);
                }
                else {
                    console.log('点击页码第一步获取失败');
                }
            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this)
        });
    }

    getresourceId(r_id) {
        const { setResourceId } = this.props;
        setResourceId({
            type: 'setResourceId',
            payload: r_id
        });
        this.context.router.history.push("/App/resourceDetailSearch");
    }

    componentWillReceiveProps(nextProps) {
        this.getdata();
    }

    componentDidMount() {
        this.getdata();
    }

    render() {

        if (JSON.stringify(this.state.ResourceInfo[0]) == '{}') {
            //  console.log(JSON.stringify(this.state.ResourceInfo[0])=='{}');
            this.state.resourceList = (function () {
                return (
                    <Row><Col span={24} style={{ textAlign: 'center' }}><p><Icon type="loading" />加载中……</p></Col></Row>
                );
            })();
        } else {

            this.state.resourceList = this.state.ResourceInfo.map((v, i) => {
                return (
                    <Row>
                       <Col span={6}></Col>
                        <Col span={18}>
                    <Card key={i} style={{ width: 800 }}>
                        <p >{v.r_id}、{v.r_name}</p><br />
                        <p>
                            <Col span={18}> </Col>
                            <Col span={6}>
                                <Button type="primary" style={{ color: "#fff", background: "#2a95de", border: "#2a95de" }} size="small" onClick={this.getresourceId.bind(this, v.r_id)}>查看详情</Button>
                            </Col>
                        </p>
                    </Card>
                    </Col>
                    </Row>
                );
            });
        }

        return (
            <Layout>

                <Card
                    title="全部试题列表"
                    bordered={true}
                    className="search-scroll">
                    <Row> {this.state.resourceList}</Row>
                    <Row style={{ textAlign: 'bottom' }}> <Col span={24} style={{ textAlign: 'center' }}>
                        <Pagination current={this.state.current} onChange={this.onChange2} total={this.state.allpage * 10} />
                    </Col></Row>
                </Card>

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
        setResourceId: (state) => dispatch(state)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AllResource);

