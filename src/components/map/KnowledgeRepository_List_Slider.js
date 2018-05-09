import React, { Component } from 'react';
import $ from 'jquery';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import PropTypes from "prop-types";
import '../../../style_css/antd.css';
import { Layout, Menu, Breadcrumb, Icon, Tree, Input, Button, Radio, Row, Col, Modal, Popover } from 'antd';
const Search = Input.Search;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const TreeNode = Tree.TreeNode;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const buttoncolor = {
    color: "#fff",
    background: "#2a95de",
    border: "#2a95de",
}
let keyArray = [];
const content = (
    <div>
        <p>Content</p>
        <p>Content</p>
    </div>
);
class KnowledgeRepository_List_Slider extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    // 状态机
    constructor(props, context) {
        super(props, context);
        this.state = {
            display_name: 'none',
            knowid: null,
            pre_knowid: null,
            isLeaf: null,
            knowledgeChange: false,
            mapName: null,
            mapContent: null,
            // treeData: [],
            treeData: [],
            TreeNodeData: [],
            treeNode_props: null,
            visible_delete: false,
            is_knowledge: '否',
            subject_name: null,
            visible_delete: false,
        }
    }
    confirm_alert_nodata() {
        Modal.warning({
            title: '友情提示：',
            content: '暂无数据',
        });
    }
    time_out() {
        Modal.warning({
            title: '友情提示：',
            content: '网络不稳定',
        });
    }
    // 通过知识地图id获取第一层层级关系
    getKnowledgeStorageFirstLayer(grade, subject_name) {
        let ajaxTimeOut = $.ajax({
            url: "/api_v1.1/knowledge/getKnowledgeStorageFirstLayer",
            type: "GET",
            dataType: "json",
            // async:false,  
            data: { "grade": grade, "subject": subject_name },
            timeout: 2000,
            success: function (data) {
                if (data.errorCode == 0) {
                    console.log('成功获取该知识库的第一层层级关系');
                    console.log(data);
                    this.setState({ treeData: data.msg });
                    this.setState({ knowid: data.msg[0].knowid, pre_knowid: data.msg[0].pre_knowid, });
                    this.setState({ isLeaf: data.msg[0].isLeaf, });
                    this.setState({ mapContent: true, });
                    console.log('isLeaf:' + this.state.isLeaf)
                    const { knowledgeInfo } = this.props;
                    knowledgeInfo({
                        type: 'knowledgeInfo',
                        payload: { mapContent: true, knowledge_id: data.msg[0].knowid, knowledge_name: data.msg[0].title, is_knowledge: data.msg[0].is_knowledge, pre_knowid: data.msg[0].pre_knowid, pre_name: data.msg[0].title },
                    });
                }
                else {
                    console.log('该知识库没有层级关系');
                    this.confirm_alert_nodata();
                    this.setState({ knowid: null, });
                    const { knowledgeInfo } = this.props;
                    knowledgeInfo({
                        type: 'knowledgeInfo',
                        payload: { mapContent: false, knowledge_id: 0 },
                    });
                }
            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this),
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    ajaxTimeOut.abort(); //取消请求
                    this.time_out()
                }
            }
        });
    }
    // 通过知识点id获取知识地图下一层层级关系
    getKnowledgeStorageNextLayer(knowid) {
        return new Promise((resolve) => {
            let ajaxTimeOut = $.ajax({
                url: "/api_v1.1/knowledge/getKnowledgeStorageNextLayer",
                type: "GET",
                dataType: "json",
                data: { "knowid": knowid },
                timeout: 2000,
                success: function (data) {
                    if (data.errorCode == 1) {
                        console.log('该知识点没有下一层结构');
                    }
                    else {
                        console.log('成功获取该知识点的下一层极结构');
                        console.log(data);
                        this.setState({ TreeNodeData: data.msg });
                    }
                }.bind(this),
                error: function (xhr, status, err) {
                }.bind(this),
                complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        ajaxTimeOut.abort(); //取消请求
                        this.time_out()
                    }
                }
            });
        })

    }
    // 删除确定弹出框
    delete_confirm() {
        if (this.state.mapContent == true) {
            this.showConfirm()
        }
        else {
            Modal.warning({
                title: '友情提示：',
                content: '无权删除根节点',
            });
        }
    }
    showConfirm() {
        this.setState({
            visible_delete: true,
        });
    }
    handleOk() {
        // 数据库删除
        this.setState({ visible_delete: false });
        console.log('进入Delete ajax1111111');
        console.log('this.state.knowid:' + this.state.knowid);
        console.log('this.state.pre_knowid:' + this.state.pre_knowid);
        let ajaxTimeOut = $.ajax({
            url: "/api_v1.1/knowledge/deleteknowid",//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
            // url:URL ,//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
            type: "GET",
            dataType: "json",
            data: { "knowid": this.state.knowid, "pre_knowid": this.state.pre_knowid },
            timeout: 2000,
            // data: DATA,
            success: function (data) {
                console.log('删除知识库-data');
                console.log(data);
                if (data.errorCode == 0) {
                    const { mapInfo } = this.props;
                    console.log(mapInfo)
                    const { selectMapSubject } = this.props;
                    const { mapGrage } = this.props;
                    this.getKnowledgeStorageFirstLayer(mapGrage.grade, selectMapSubject.subject_name);
                    Modal.success({
                        title: '友情提示',
                        content: '删除成功',
                    });
                }
                else {
                    Modal.error({
                        title: '友情提示',
                        content: '删除失败',
                    });
                }

            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this),
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    ajaxTimeOut.abort(); //取消请求
                    this.time_out()
                }
            }
        });
    }
    handleCancel_delete() {
        this.setState({
            visible_delete: false,
        });
    }
    onLoadData = (treeNode) => {
        console.log('treeNode11')
        console.log(treeNode)
        console.log('treeNode.props')
        console.log(treeNode.props)
        console.log('treeNode.props.pos')
        console.log(treeNode.props.pos)
        keyArray = treeNode.props.pos.split('-');
        console.log('treeNode.props.pos-keyArray')
        console.log(keyArray)
        console.log('treeNode.props.dataRef.children')
        console.log(treeNode.props.dataRef.children)
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            this.getKnowledgeStorageNextLayer(treeNode.props.knowid);
            setTimeout(() => {
                treeNode.props.dataRef.children = this.state.TreeNodeData;
                this.setState({
                    treeData: [...this.state.treeData],
                });
                resolve();
            }, 1000);
        });
    }
    renderTreeNodes(data) {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={<p onClick={this.handleClick.bind(this, item)}> {item.title} </p>} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} title={<p onClick={this.handleClick.bind(this, item)}>{item.title}</p>} dataRef={item} />;
        });
    }
    // renderTreeNodes(data) {
    //     return data.map((item) => {
    //         if (item.children) {
    //             return (
    //                 <TreeNode title={<p onClick={this.handleClick.bind(this, item)}> {item.is_knowledge=='否'?<Icon type="down" />:<Icon type="link" />} {item.title} </p>} key={item.key} dataRef={item}>
    //                     {this.renderTreeNodes(item.children)}
    //                 </TreeNode>
    //             );
    //         }
    //         return <TreeNode {...item} title={<p onClick={this.handleClick.bind(this, item)}>{item.is_knowledge=='否'?<Icon type="down" />:<Icon type="link" />}{item.title}</p>} dataRef={item} />;
    //     });
    // }
    // 左侧导航栏单击事件
    handleClick(item) {
        console.log('左侧导航栏-单击事件')
        // console.log('dataRef')
        // console.log(dataRef)
        console.log('this.state.treeData')
        console.log(this.state.treeData)
        console.log('item')
        console.log(item)
        const { knowledgeInfo } = this.props;
        knowledgeInfo({
            type: 'knowledgeInfo',
            payload: { mapContent: true, knowledge_id: item.knowid, is_knowledge: item.is_knowledge, knowledge_name: item.title, pre_knowid: item.pre_knowid, pre_name: item.title },
        });
        this.setState({ knowid: item.knowid, pre_knowid: item.pre_knowid });
        this.setState({ isLeaf: item.isLeaf, });
        this.setState({ mapContent: true, });
    }
    // 左侧导航栏学科按钮单击事件
    handleClick_subjectName() {
        console.log('左侧导航栏-知识地图name按钮-单击事件')
        const { knowledgeInfo } = this.props;
        knowledgeInfo({
            type: 'knowledgeInfo',
            payload: { mapContent: false, knowledge_id: 0, knowledge_name: this.state.subject_name, pre_name: item.title },
        });
        this.setState({ mapContent: false, });
        // this.setState({ isLeaf: item.isLeaf, });

    }
    addKnowledge() {
        const { displayType } = this.props
        displayType({
            type: 'displayType',
            payload: {
                displayType: '知识库-列表',
            }
        });
        this.context.router.history.push("/App/KnowledgeRepository_List_Slider/Addknowledge");
    }
    display_name() {
        if (this.state.display_name == 'none') {
            this.setState({
                display_name: 'block',
            })
        }
        else if (this.state.display_name == 'block') {
            this.setState({
                display_name: 'none',
            })

        }
    }
    componentWillMount() {
        const { knowledgeInfo } = this.props;
        const { selectMapSubject } = this.props;
        const { mapGrage } = this.props;
        this.setState({ subject_name: selectMapSubject.subject_name, });
        const subject_name = selectMapSubject.subject_name;
        const grade = mapGrage.grade;//学段
        knowledgeInfo({
            type: 'knowledgeInfo',
            payload: { knowledge_id: 1 },
        });
        const { displayType } = this.props
        displayType({
            type: 'displayType',
            payload: {
                displayType: '知识库-列表',
            }
        });
        this.getKnowledgeStorageFirstLayer(grade, subject_name);
    }
    componentDidMount() {
        this.pubsub_token = PubSub.subscribe('addKnowledgeSuccess', function (topic, message) {
            console.log('message')
            console.log(message)
            const { selectMapSubject } = this.props;
            const { mapGrage } = this.props;
            const grade = mapGrage.grade;//学段
            this.getKnowledgeStorageFirstLayer(mapGrage.grade, selectMapSubject.subject_name);

            // // 实时刷新
            // let content = null;
            // let count = 0;
            // for (let i = 1; i < keyArray.length; i++) {
            //     if (i == 1) {
            //         content = this.state.treeData[keyArray[i]]
            //         count++
            //     }
            //     else {
            //         content = content.children[keyArray[i]]
            //         count++
            //     }
            // }
            // console.log('content')
            // console.log(content)
            // content.children.push({ title: message, isLeaf: true })
            // console.log("this.state.treeData")
            // console.log(this.state.treeData)
            // this.renderTreeNodes(this.state.treeData)
        }.bind(this));
    }
    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsub_token);
    }
    render() {
        return (
            <Layout>
                <div style={{ background: '#fff', paddingTop: '10px' }}>
                    <Row>
                        <Col span={23}>
                            <div style={{ float: 'right' ,display: this.state.display_name}}>
                                <Link to="/App/KnowledgeRepository_List_Slider/KnowledgeDetail"> <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large">知识点详情</Button> </span></Link>
                                <Link to="/App/KnowledgeRepository_List_Slider/Addknowledge"> <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large">添加知识点</Button></span></Link>
                                <Link to="/App/KnowledgeRepository_List_Slider/Editknowledge"> <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large">修改知识点</Button></span></Link>
                                <span style={{ paddingLeft: '5px' }}><Button style={buttoncolor} size="large" onClick={this.delete_confirm.bind(this)}>删除知识点</Button></span>
                                <Link to="/App/KnowledgeRepository_List_Slider/ResList_Repository"> <span style={{ paddingLeft: '5px', paddingRight: '10px' }}><Button style={buttoncolor} size="large">查看关联资源</Button></span></Link>
                            </div>
                        </Col>
                        {/* <Col span={1} > */}
                        <Col span={1} onClick={this.display_name.bind(this)}>
                            <Icon type='edit' style={{ fontSize: '30px' }} />
                        </Col>
                    </Row>
                </div>
                <Layout style={{ padding: '10px 0', background: '#fff' }}>
                    <Sider width={300} style={{ background: '#fff', paddingLeft: '15px' }}>
                        {/* <Sider width={300} style={{ background: '#fff', paddingLeft: '15px', paddingTop: '30px', }}> */}
                        {/* <Button type="default" style={{ width: 300 }} onClick={this.displayType.bind(this)}>切换地图模式</Button> */}
                        <Link to="/App/KnowledgeRepository_Echarts_Slider/KnowledgeDetail"><Button type="default" style={{ width: 300 }}>切换地图模式</Button></Link>
                        <Button size="large" style={{ width: '300px', color: "#fff", background: "#2a95de", border: "#2a95de", }} onClick={this.handleClick_subjectName.bind(this)}>{this.state.subject_name}</Button>
                        {/* <Tree loadData={this.onLoadData} defaultSelectedKeys='0' >
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree> */}
                        <Tree loadData={this.onLoadData} defaultSelectedKeys='0' >
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree>
                    </Sider>
                    <Content style={{ padding: '0 24px', minHeight: 280 }}>
                        {this.props.children}
                    </Content>
                    <Modal
                        visible={this.state.visible_delete}
                        onOk={this.handleOk.bind(this)}
                        onCancel={this.handleCancel_delete.bind(this)}
                    >
                        <span><Icon type="close" style={{ color: "#F00", fontSize: 15 }} />确定要删除该知识点吗？
                     </span>
                    </Modal>
                </Layout>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectMapSubject: state.reducer_map_subject.selectMapSubject,
        mapGrage: state.reducer_map_grade.mapGrage,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        knowledgeInfo: (state) => dispatch(state), //左侧导航栏，知识地图及知识点（元）信息
        mapType: (state) => dispatch(state), //左侧导航栏，知识地图及知识点（元）信息
        displayType: (state) => dispatch(state), //左侧导航栏，知识地图及知识点（元）信息
        backType: (state) => dispatch(state), //左侧导航栏，知识地图及知识点（元）信息
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(KnowledgeRepository_List_Slider);

