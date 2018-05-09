import React, { Component } from 'react';
import { Input, Button, Icon, Row, Col, Card, Pagination, Select, Modal, Form, Radio, Alert } from 'antd';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import { Player } from 'video-react';
import COURSE from './images/course.png';
import DOC from './images/doc.png';
import SOURCE from './images/source.png';
import VIDEO from './images/video.png';
const FormItem = Form.Item;
//相关度、难度、时间按钮样式组合
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const buttoncolor = {
    color: "#fff",
    background: "#2a95de",
    border: "#2a95de",
}
const defaultbuttoncolor = {
    color: "#2a95de",
    background: "#fff",
    border: "#2a95de",
}

class ResourceList extends Component {

    static contextTypes = {
        router: PropTypes.object
    }
    // 状态机
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false,
            posts: [],
            allPages: -1,
            allPages1: -1,
            current: 1,
            current1: 1,
            RadioButtons: ["课程"],
            // VersionButtons: ["人教版"],
            resource: ["不存在该知识点的关联资源"],
        }
    }
    componentDidMount() {
        const { knowledgeInfo } = this.props;
        const knowledge_id = knowledgeInfo.knowledge_id;
        const mapContent = knowledgeInfo.mapContent;
        if (mapContent == true) {
            this.getdata(knowledge_id);
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log("打印nextProps")
        console.log(nextProps)
        console.log(nextProps.knowledgeInfo.knowledge_id)
        if (nextProps.knowledgeInfo.mapContent == true) {
            this.getdata(nextProps.knowledgeInfo.knowledge_id);
        }
    }

    //资源列表分页
    onChange = (page) => {
        const { knowledgeInfo } = this.props;
        const knowledge_id = knowledgeInfo.knowledge_id;
        let ajaxTimeOut = $.ajax({
            url: "/api_v1.1/knowledge_resource/knowidResource_v1_1",
            type: "GET",
            dataType: "json",
            timeout:2000,
            data: { "knowid": knowledge_id, "count": 5, "page": page },
            success: function (data) {
                if (data.errorCode == '0') {
                    console.log('成功获取该知识点的关联资源');
                    console.log(data);
                    this.setState({
                        resource: data.msg,
                        current: page
                    });
                    console.log(this.state.resource);
                }
                else {
                    console.log('不存在该知识点的关联资源');
                    this.setState({ resource: data.msg });
                    console.log(this.state.resource);
                }
            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this),
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    ajaxTimeOut.abort(); //取消请求
                    Modal.warning({
                        title: '友情提示',
                        content: '网络不稳定',
                    });
                }
            }
        });
    }
    //根据知识点id查看关联资源列表
    getdata = (knowledge_id) => {
        let ajaxTimeOut = $.ajax({
            url: "/api_v1.1/knowledge_resource/knowidResource_v1_1",
            type: "GET",
            dataType: "json",
            timeout:2000,
            data: { "knowid": knowledge_id, "count": 5, "page": 1 },
            success: function (data) {
                if (data.errorCode == '0') {
                    console.log('成功获取该知识点的关联资源');
                    console.log(data);
                    this.setState({
                        resource: data.msg,
                        allPages: data.allpages,
                    });
                    console.log(this.state.resource);
                }
                else {
                    console.log('不存在该知识点的关联资源');
                    this.setState({ resource: data.msg });
                    console.log(this.state.resource);
                }
            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this),
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    ajaxTimeOut.abort(); //取消请求
                    Modal.warning({
                        title: '友情提示',
                        content: '网络不稳定',
                    });
                }
            }
        });
    }

    //资源类型多条件选择
    rtypeonChange(e) {
        const RadioButtons1 = this.state.RadioButtons;
        console.log(`radio checked:${e.target.value}`);
        RadioButtons1.push(e.target.value);
        var res = [];
        for (var i = 0; i < RadioButtons1.length; i++) {
            var item = RadioButtons1[i]
            res.indexOf(item) === -1 && res.push(item)
        }
        console.log(res);
        console.log("去重");
        console.log(RadioButtons1);
        this.setState({
            RadioButtons: res
        })
        console.log(this.state.RadioButtons);
        console.log(this.state.RadioButtons.length);
        console.log("this.state.RadioButtons.length");
        console.log("Button组选中的值");
    }
    //资源版本多条件选择
    // versiononChange(e) {
    //     const VersionButtons1 = this.state.VersionButtons;
    //     console.log(`radio checked:${e.target.value}`);
    //     VersionButtons1.push(e.target.value);
    //     var res1 = [];
    //     for (var i = 0; i < VersionButtons1.length; i++) {
    //         var item = VersionButtons1[i]
    //         res1.indexOf(item) === -1 && res1.push(item)
    //     }
    //     console.log(res1);
    //     console.log("去重");
    //     console.log(VersionButtons1);
    //     this.setState({
    //         VersionButtons: res1
    //     })
    //     console.log(this.state.VersionButtons);
    //     console.log(this.state.VersionButtons.length);
    //     console.log("this.state.VersionButtons.length");
    //     console.log("Version组选中的值");
    // }

    //资源版本多条件选择
    //  tagonChange(e) {
    //     console.log(`radio checked:${e.target.value}`);
    //     this.setState({
    //         TagButtons:e.target.value
    //     }) 
    //     console.log(this.state.TagButtons);
    //     console.log("Tag组选中的值");
    //   }

    //资源筛选分页
    onChangeSelect = (page) => {
        const { knowledgeInfo } = this.props;
        const knowledge_id = knowledgeInfo.knowledge_id;
        let ajaxTimeOut = $.ajax({
            url: "/api_v1.1/knowledge_resource/resourceSelect_v1_1",
            type: "GET",
            dataType: "json",
            timeout:2000,
            data: {
                "knowid": knowledge_id,
                "rtype": "\[" + this.state.RadioButtons.join(',') + "\]",
                // "version": "\[" + this.state.VersionButtons.join(',') + "\]",
                "tag": this.props.form.getFieldValue('tag'),
                "count": 5,
                "page": page
            },
            success: function (data) {
                if (data.errorCode == '1') {
                    console.log('资源不存在');
                }
                else {
                    console.log('根据类型、版本、tag成功获取搜索资源');
                    this.setState({
                        resource: data.msg,
                        current1: page
                    });
                    console.log(this.state.resource);
                }
            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this),
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    ajaxTimeOut.abort(); //取消请求
                    Modal.warning({
                        title: '友情提示',
                        content: '网络不稳定',
                    });
                }
            }
        });
    }
    //筛选资源
    resourceSelect = () => {
        const { knowledgeInfo } = this.props;
        const knowledge_id = knowledgeInfo.knowledge_id;
        let ajaxTimeOut = $.ajax({
            url: "/api_v1.1/knowledge_resource/resourceSelect_v1_1",
            type: "GET",
            dataType: "json",
            timeout:2000,
            data: {
                "knowid": knowledge_id,
                "rtype": "\[" + this.state.RadioButtons.join(',') + "\]",
                // "version": "\[" + this.state.VersionButtons.join(',') + "\]",
                "tag": this.props.form.getFieldValue('tag'),
                "count": 5,
                "page": 1
                // "tag":this.state.TagButtons
            },
            success: function (data) {
                if (data.errorCode == '1') {
                    console.log('资源不存在');
                }
                else {
                    console.log('根据类型、版本、tag成功获取搜索资源');
                    this.setState({
                        resource: data.msg,
                        allPages1: data.allpages
                    });
                    console.log(this.state.resource);
                }
            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this),
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    ajaxTimeOut.abort(); //取消请求
                    Modal.warning({
                        title: '友情提示',
                        content: '网络不稳定',
                    });
                }
            }
        });
    }

    //发送资源id到查看资源详情页面
    sendResourceIdtoResInformation(id) {
        const { displayType } = this.props;
        console.log('进入reducer中发送资源id');
        console.log(id);
        const { setResourceState } = this.props;
        setResourceState({
            type: 'GetResourceIDSuccess',
            payload: id
        });
        if (displayType.displayType == '知识库-地图') {
            this.context.router.history.push("/App/KnowledgeRepository_Echarts_Slider/ResInformation_Repository");
        } else if (displayType.displayType == '知识地图-地图') {
            this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/ResInformation");
        } else if (displayType.displayType == '知识库-列表') {
            this.context.router.history.push("/App/KnowledgeRepository_List_Slider/ResInformation_Repository");
        } else if (displayType.displayType == '知识地图-列表') {
            this.context.router.history.push("/App/KnowledgeManage_List_Slider/ResInformation");
        }
    }

    //发送资源id到编辑资源页面
    sendResourceIdtoEditRes(id) {
        const { displayType } = this.props;
        console.log('进入reducer中发送资源id');
        console.log(id);
        const { setResourceState } = this.props;
        setResourceState({
            type: 'GetResourceIDSuccess',
            payload: id
        });
        if (displayType.displayType == '知识库-地图') {
            this.context.router.history.push("/App/KnowledgeRepository_Echarts_Slider/EditResource_Repository");
        } else if (displayType.displayType == '知识地图-地图') {
            this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/EditResource");
        } else if (displayType.displayType == '知识库-列表') {
            this.context.router.history.push("/App/KnowledgeRepository_List_Slider/EditResource_Repository");
        } else if (displayType.displayType == '知识地图-列表') {
            this.context.router.history.push("/App/KnowledgeManage_List_Slider/EditResource");
        }
    }
    //添加资源按钮跳转路由
    go(){
        const { displayType } = this.props;
        if(displayType.displayType=='知识库-列表'){this.context.router.history.push("/App/KnowledgeRepository_List_Slider/AddResourceList");}
        // else if(displayType.displayType=='知识库-地图'){this.context.router.history.push("/App/KnowledgeRepository_Echarts_Slider/AddResourceList");}
        else if(displayType.displayType=='知识地图-列表'){this.context.router.history.push("/App/KnowledgeManage_List_Slider/AddResourceList");}
        // else if(displayType.displayType=='知识地图-地图'){this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/AddResourceList");}
      }
    render() {
        //知识库中资源列表
        let resourceList;
        if (this.state.resource == "不存在该知识点的关联资源") {
            resourceList = (
                <p>
                    <Alert
                        message="没有关联的资源哦~"
                        type="info"
                        showIcon
                    />
                </p>
            )
        } else {
            resourceList = this.state.resource.map((v, i) => {
                let showStyle;
                if (v.rtype == "网络课程") {
                    showStyle = (
                         <Col span={3}>
                            <img src={VIDEO} style={{ width: 70, height: 80 }} />
                         </Col>
                    )
                } else if ( v.rtype == "文献" || v.rtype == "试卷" || v.rtype == "案例") {
                    showStyle = (
                        <Col span={3}>
                            <img src={DOC} style={{ width:70, height: 80 }} />
                        </Col>
                    )
                } else if ( v.rtype == "试题") {
                    showStyle = (
                        <Col span={1}/>
                    )
                } else if (v.rtype == "课件") {
                    showStyle = (
                        <Col span={3}>
                            <img src={COURSE} style={{ width: 70, height: 80 }} />
                         </Col>
                    )
                } else if (v.rtype == "素材") {
                    showStyle = (
                        <Col span={3}>
                            <img src={SOURCE} style={{ width: 70, height: 80 }} />
                        </Col>
                    )
                }
                let isABCD;
                var regString = /[A-D]+/;
                var regString1 = /span/;
                if (regString1.test(v.r_desc) || regString.test(v.r_desc) || v.r_desc) {
                    isABCD = (
                            <Form>
                                <FormItem
                                    label=""
                                    labelCol={{ span: 0 }}
                                    wrapperCol={{ span: 24 }}
                                    hasFeedback
                                    style={{ marginBottom: '5px' }}
                                >
                                    <p dangerouslySetInnerHTML={{ __html: v.r_name.replace(/^[1-9]/,"").replace(/^、/,"")}}></p>
                                    <p dangerouslySetInnerHTML={{ __html: v.r_desc}}></p>
                                </FormItem>
                            </Form>
                    )
                }

                const { displayType } = this.props;
                const display_type = displayType.displayType;
                if (display_type == '知识库-地图' || display_type == '知识地图-地图') {
                    return (
                        <div>
                            <Card key={i} bordered={true} title={<p>
                                <Row>
                                     <Col span={5}><Icon type="file-text" style={{ fontSize: 15,color: '#707070'}}/>&nbsp;{v.rtype}</Col>
                                     <Col span={4}>{v.difficulty}</Col>
                                     <Col span={6}>关联权重：{v.weight}</Col>
                                </Row>
                            </p>}>
                                <Row>
                                    <Col>
                                        <Row>
                                            {showStyle}
                                            <Col span={18}>
                                                <p>{isABCD}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            {/* <Col span={2} /> */}
                                            {/* <Col span={4}><Icon type="file-text" style={{ fontSize: 15,color: '#707070'}}/>&nbsp;{v.rtype}</Col> */}
                                            <Col span={8}><Icon type="clock-circle-o" style={{ fontSize: 15,color: '#707070'}}/>&nbsp;2017-12-12</Col>
                                            <Col span={8}><Icon type="user" style={{ fontSize: 15,color: '#707070'}}/>&nbsp;作者：Admin</Col>
                                            <Col span={8}><Icon type="save" style={{ fontSize: 15,color: '#707070'}}/>&nbsp;{v.file_size}</Col>
                                        </Row><br />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={25}>
                                        <Row>
                                            <Col span={7}><Button style={buttoncolor} onClick={this.sendResourceIdtoResInformation.bind(this, v.r_id)}>查看详情</Button></Col>
                                            <Col span={5}><Button style={buttoncolor} onClick={this.sendResourceIdtoEditRes.bind(this, v.r_id)}>编辑资源</Button></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    );
                }
                else {
                    return (
                        <div>
                            <Card key={i} bordered={true} title={<p>
                                <Row>
                                     <Col span={5}>资源类型：{v.rtype}</Col> 
                                     <Col span={4}>难易：{v.difficulty}</Col>
                                     <Col span={8}>知识点：{v.title}</Col>
                                     <Col span={4}>关联权重：{v.weight}</Col> 
                                </Row>
                            </p>} key="1">
                                <Row>
                                    <Col>
                                        <Row>
                                            {showStyle}
                                            <Col span={20}>
                                                <p>{isABCD}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={2} />
                                            <Col span={4}><Icon type="file-text" style={{ fontSize: 15,color: '#707070'}}/>&nbsp;{v.rtype}</Col>
                                            <Col span={5}><Icon type="clock-circle-o" style={{ fontSize: 15,color: '#707070'}}/>&nbsp;2017-12-12</Col>
                                            <Col span={4}><Icon type="user" style={{ fontSize: 15,color: '#707070'}}/>&nbsp;作者：Admin</Col>
                                            <Col span={4}><Icon type="save" style={{ fontSize: 15,color: '#707070'}}/>&nbsp;{v.file_size}</Col>
                                        </Row><br />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Row>
                                            <Col span={4}><Button style={buttoncolor} onClick={this.sendResourceIdtoResInformation.bind(this, v.r_id)}>查看详情</Button></Col>
                                            <Col span={5}><Button style={buttoncolor} onClick={this.sendResourceIdtoEditRes.bind(this, v.r_id)}>编辑资源</Button></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    );
                }

            }
            );
        }
        const { getFieldProps } = this.props.form;
        let myPage;
        // if (this.state.RadioButtons.length == 1 || this.state.VersionButtons.length == 1) {
        if (this.state.RadioButtons.length == 1) {
            myPage = (
                <Pagination current={this.state.current} onChange={this.onChange} total={this.state.allPages * 10} />
            )
        } else {
            myPage = (
                <Pagination current={this.state.current} onChange={this.onChange} total={this.state.allPages * 10} />
            )
        }

        let isAddResource;
        const { displayType } = this.props;
        console.log('我的我的displayType.displayType')
        console.log(displayType.displayType)
        if(displayType.displayType=='知识地图-列表' || displayType.displayType=='知识库-列表'){
            isAddResource = (
                 <Button style={buttoncolor} onClick={this.go.bind(this)}>添加资源</Button>
            )
        }else if(displayType.displayType=='知识地图-地图' || displayType.displayType=='知识库-地图'){
            isAddResource = (
                <div></div>
            )
        }
        return (
            <Card>
                <Row>
                    <Col span={24}>
                        <Form>
                            <FormItem
                                label=""
                                labelCol={{ span: 1 }}
                                wrapperCol={{ span: 23 }}
                                hasFeedback>
                                <p>
                                    <RadioGroup onChange={this.rtypeonChange.bind(this)}>
                                        <RadioButton value="试题">试题</RadioButton>
                                        <RadioButton value="试卷">试卷</RadioButton>
                                        <RadioButton value="网络课程">网络课程</RadioButton>
                                        <RadioButton value="素材">素材</RadioButton>
                                        <RadioButton value="课件">课件</RadioButton>
                                        <RadioButton value="文献">文献</RadioButton>
                                        <RadioButton value="案例">案例</RadioButton>
                                    </RadioGroup>
                                </p>
                            </FormItem>
                            {/* <FormItem
                                label="资源版本"
                                labelCol={{ span: 2 }}
                                wrapperCol={{ span: 22 }}
                                hasFeedback
                            >
                                <RadioGroup onChange={this.versiononChange.bind(this)}>
                                    <RadioButton value="人教版">人教版</RadioButton>
                                    <RadioButton value="苏教版">苏教版</RadioButton>
                                </RadioGroup>
                            </FormItem> */}
                            <FormItem
                                label=""
                                labelCol={{ span: 1 }}
                                wrapperCol={{ span: 23 }}
                                hasFeedback>
                                <Col span={22}>
                                    <RadioGroup  {...getFieldProps('tag') } >
                                        <RadioButton value="1" onClick={this.resourceSelect}>相关度</RadioButton>
                                        <RadioButton value="2" onClick={this.resourceSelect}>难度</RadioButton>
                                        <RadioButton value="3" onClick={this.resourceSelect}>时间</RadioButton>
                                    </RadioGroup>
                                    <Button type="primary" onClick={this.resourceSelect}>搜索</Button>
                                </Col>
                                <Col span={2}>
                                    {isAddResource}
                               </Col>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                            {resourceList}
                            {myPage}
                    </Col>
                </Row>
            </Card>
        );
    }
}
const ResList = Form.create()(ResourceList)

function mapStateToProps(state) {
    return {
        knowledgeInfo: state.reducer_map_knowledge.knowledgeInfo,
        displayType: state.reducer_diaplay_type.displayType,
    };
}


function mapDispatchToProps(dispatch) {
    return {
        setResourceState: (state) => dispatch(state),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResList);