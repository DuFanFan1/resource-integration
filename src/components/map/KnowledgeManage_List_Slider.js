import React, { Component } from 'react';
import $ from 'jquery';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import PropTypes from "prop-types";
import '../../../style_css/antd.css';  // Add
import { Layout, Menu, Breadcrumb, Icon, Tree, Input, Button, Radio, Row, Col, Modal, Checkbox } from 'antd';
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
class KnowledgeManage_List_Slider extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    // 状态机
    constructor(props, context) {
        super(props, context);
        this.state = {
            display_name: 'none',
            knowid: null,
            pre_structid: null,
            structid: null,
            isLeaf: null,
            knowledgeChange: false,
            mapName: null,
            treeData: [],
            TreeNodeData: [],
            treeNode_props: null,
            visible_delete: false,
            is_knowledge: '否'
        }
    }
    confirm_alert_nodata() {
        Modal.warning({
            title: '友情提示：',
            content: '暂无数据',
        });
    }
    // 通过知识地图id获取第一层层级关系
    getKnowledgeRelationStruct(map_id) {
        //根据知识点id查看关联资源列表
        let ajaxTimeOut = $.ajax({
            url: "/api_v1.1/knowledge_struct/getKnowledgeRelationStruct1",
            type: "GET",
            dataType: "json",
            data: { "mapid": map_id },
            timeout: 2000,
            success: function (data) {
                if (data.errorCode == 0) {
                    console.log('成功获取该知识地图的第一层层级关系');
                    console.log(data);
                    this.setState({ treeData: data.msg });
                    this.setState({ knowid: data.msg[0].structid, pre_structid: data.msg[0].pre_structid });
                    this.setState({ is_knowledge: data.msg[0].is_knowledge, });
                    this.setState({ mapContent: true, });
                    console.log('isLeaf:' + this.state.isLeaf)
                    const { knowledgeInfo } = this.props;
                    knowledgeInfo({
                        type: 'knowledgeInfo',
                        payload: { mapContent: true, knowledge_id: data.msg[0].structid, is_knowledge: data.msg[0].is_knowledge, knowledge_name: data.msg[0].title, pre_structid: data.msg[0].pre_structid, pre_name: data.msg[0].title },
                    });
                }
                else {
                    console.log('该知识地图没有层级关系');
                    this.confirm_alert_nodata()
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
    getKnowledgeRelationStructNextbyStructid(pre_structid) {
        const { mapInfo } = this.props;
        console.log(mapInfo)
        const map_id = mapInfo.map_id;
        //通过structid查询知识地图的结构-by bing
        return new Promise((resolve) => {
            let ajaxTimeOut = $.ajax({
                url: "/api_v1.1/knowledge_struct/getKnowledgeRelationStructNextbyStructid",
                type: "GET",
                dataType: "json",
                data: { "structid": pre_structid, "mapid": map_id },
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
    getKnowledgeRelationStructNextbyKnowid(pre_knowid) {
        //通过structid查询知识地图的结构-by bing
        const { mapInfo } = this.props;
        console.log(mapInfo)
        const map_id = mapInfo.map_id;
        return new Promise((resolve) => {
            let ajaxTimeOut = $.ajax({
                url: "/api_v1.1/knowledge/getKnowledgeRelationStructNextbyKnowid",
                type: "GET",
                dataType: "json",
                data: { "pre_knowid": pre_knowid },
                ajaxTimeOut: 2000,
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
                }.bind(this), complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
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
                content: '无权删除地图根节点',
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
        let URL
        let DATA
        if (this.state.is_knowledge == '否') {
            URL = "/api_v1.1/knowledge_struct/deleteStructNode"
            DATA = { "structid": this.state.knowid, 'pre_structid': this.state.pre_structid }
        }
        else {
            URL = "/api_v1.1/knowledge_struct_rela_know/deleteRelationKnowid"
            DATA = { "knowid": this.state.knowid, }
        }
        console.log('进入Delete ajax');
        this.deleteKnowledge(URL, DATA);
    }
    handleCancel_delete() {
        this.setState({
            visible_delete: false,
        });
    }
    //删除网络请求
    deleteKnowledge = (URL, DATA) => {
        let ajaxTimeOut = $.ajax({
            // url:"/api_v1.1/knowledge_struct/deleteStructNode" ,//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
            url: URL,//看放置的服务器端口号 http://localhost:8999/dmws/mooc/danmu/getdata ；http://localhost:8080/wsRESTfulService/mooc/lesson/getAllTermCodes；../test.json
            type: "GET",
            dataType: "json",
            // data: { "structid": this.state.knowid,'pre_structid':this.state.pre_structid },
            data: DATA,
            timeout: 2000,
            success: function (data) {
                console.log('data');
                console.log(data);
                if (data.errorCode == 0) {
                    const { mapInfo } = this.props;
                    console.log(mapInfo)
                    const map_id = mapInfo.map_id;
                    this.getKnowledgeRelationStruct(map_id);
                    Modal.success({
                        title: '友情提示',
                        content: '操作成功',
                    });
                }
                else {
                    Modal.error({
                        title: '友情提示',
                        content: '操作失败',
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
    onLoadData = (treeNode) => {
        console.log('treeNode11')
        console.log(treeNode)
        console.log('treeNode.props')
        console.log(treeNode.props)
        console.log('treeNode.props.pos')
        console.log(treeNode.props.pos)
        this.setState({ newkey: treeNode.props.pos, });
        console.log('treeNode.props.dataRef.children')
        console.log(treeNode.props.dataRef.children)
        this.setState({ treeNode_props: treeNode.props, });
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            // this.getKnowledgeRelationStructNext();
            if (treeNode.props.is_knowledge == '否') { this.getKnowledgeRelationStructNextbyStructid(treeNode.props.structid); }
            else { this.getKnowledgeRelationStructNextbyKnowid(treeNode.props.knowid); }
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
                    // <TreeNode title={<p onClick={this.handleClick.bind(this, item)}>   <Checkbox onChange={this.onChange.bind(this)}>{item.title}</Checkbox> </p>} key={item.key} dataRef={item}>
                    <TreeNode title={<p onClick={this.handleClick.bind(this, item)}> {item.is_knowledge == '否' ? <Icon type="copy" /> : <Icon type="file" />} {item.title} </p>} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            // return <TreeNode {...item} title={<p onClick={this.handleClick.bind(this, item)}><Checkbox onChange={this.onChange.bind(this)}>{item.title}</Checkbox> </p>} dataRef={item} />;
            return <TreeNode {...item} title={<p onClick={this.handleClick.bind(this, item)}>{item.is_knowledge == '否' ? <Icon type="copy" /> : <Icon type="file" />}{item.title}</p>} dataRef={item} />;
        });
    }
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
        // if(item.title=='概率初步')
        if (item.is_knowledge == '否') {
            knowledgeInfo({
                type: 'knowledgeInfo',
                payload: { mapContent: true, knowledge_id: item.structid, is_knowledge: item.is_knowledge, knowledge_name: item.title, pre_structid: item.pre_structid }, pre_name: item.title
            });
            this.setState({ knowid: item.structid, pre_structid: item.pre_structid });
            this.setState({ is_knowledge: item.is_knowledge, });   //删除操作
            this.setState({ isLeaf: item.isLeaf, });
            this.setState({ mapContent: true, });
            // this.context.router.history.push("/App/KnowledgeManage_List_Slider/StructDetail");
        }
        else {
            knowledgeInfo({
                type: 'knowledgeInfo',
                payload: { mapContent: true, knowledge_id: item.knowid, is_knowledge: item.is_knowledge, knowledge_name: item.title, pre_name: item.title },  //后面structid换成knowid
            });
            this.setState({ knowid: item.knowid, });
            this.setState({ is_knowledge: item.is_knowledge, });
            this.setState({ isLeaf: item.isLeaf, });
            this.setState({ mapContent: true, });
            // this.context.router.history.push("/App/KnowledgeManage_List_Slider/KnowledgeDetail");
        }
    }
    handleClick_mapName() {
        console.log('左侧导航栏-知识地图name按钮-单击事件')
        const { knowledgeInfo } = this.props;
        knowledgeInfo({
            type: 'knowledgeInfo',
            payload: { mapContent: false, knowledge_id: 0, knowledge_name: this.state.mapName },
        });
        this.setState({ mapContent: false, });
    }
    // 添加知识点按钮单击事件
    addStruct() {
        const { mapType } = this.props;
        if (this.state.is_knowledge == '否') {
            if (mapType.mapType == '主题图') {
                this.context.router.history.push("/App/KnowledgeManage_List_Slider/AddTopMapStruct");
            }
            else {
                this.context.router.history.push("/App/KnowledgeManage_List_Slider/AddStruct");
            }

        }
        else { this.confirm_alert() }
    }
    // 添加知识点按钮单击事件
    editStruct() {
        if (this.state.is_knowledge == '否') { this.context.router.history.push("/App/KnowledgeManage_List_Slider/EditStruct"); }
        else { this.confirm_alert() }
    }
    // 关联知识点按钮单击事件
    relatedknowledge() {
        const { mapType } = this.props;
        if (mapType.mapType == '标准地图') {
            if (this.state.is_knowledge == '否') { this.context.router.history.push("/App/KnowledgeManage_List_Slider/Relatedknowledge_Auto"); }
            else { this.confirm_alert() }
        }
        else {
            if (this.state.is_knowledge == '否') { this.context.router.history.push("/App/KnowledgeManage_List_Slider/Relatedknowledge"); }
            else { this.confirm_alert() }
        }
       
    }
    // 关联资源
    relatedResourse() {
        // if (this.state.is_knowledge == '是') { 
        this.context.router.history.push("/App/KnowledgeManage_List_Slider/ResList");
        //  }
        // else { this.confirm_alert() }
    }

    //无权操作提示语
    confirm_alert() {
        Modal.warning({
            title: '友情提示',
            content: '此节点无权进行此操作',
        });
    }
    time_out() {
        Modal.warning({
            title: '友情提示',
            content: '网络不稳定',
        });
    }
    onChange(e) {
        console.log(`checked = ${e.target.checked}`);
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
        const { displayType } = this.props
        displayType({
            type: 'displayType',
            payload: {
                displayType: '知识地图-列表',
            }
        });
        const { knowledgeInfo } = this.props;
        knowledgeInfo({
            type: 'knowledgeInfo',
            payload: { knowledge_id: 1 },
        });
        this.setState({ knowid: 1 });
        // 实时获取真实数据redux
        const { mapInfo } = this.props;
        console.log('左侧导航栏mapInfocomponentwillMount444')
        console.log(mapInfo)
        const map_id = mapInfo.map_id;
        const map_name = mapInfo.map_name;
        this.setState({ mapName: map_name, });
        this.getKnowledgeRelationStruct(map_id);
    }
    componentDidMount() {
        this.pubsub_token = PubSub.subscribe('addKnowledgeSuccess', function (topic, message) {
            console.log('message')
            console.log(message)
            const { mapInfo } = this.props;
            console.log(mapInfo)
            const map_id = mapInfo.map_id;
            this.getKnowledgeRelationStruct(map_id);
            // this.state.treeData[0].children[0].push(
            //     {
            //         title: '0-0-2',
            //       }
            // ) 
            // console.log("this.state.treeData")
            // console.log(this.state.treeData)
            // this.renderTreeNodes(this.state.treeData)
        }.bind(this));
        this.pubsub_BatchAddTopMapStructSuccess = PubSub.subscribe('BatchAddTopMapStructSuccess', function (topic, message) {
            console.log('message')
            console.log(message)
            const { mapInfo } = this.props;
            console.log(mapInfo)
            const map_id = mapInfo.map_id;
            this.getKnowledgeRelationStruct(map_id);
        }.bind(this));
    }
    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsub_token);
        PubSub.unsubscribe(this.pubsub_BatchAddTopMapStructSuccess);
    }
    render() {
        return (
            <Layout>
                {/* <div style={{ background: '#fff', paddingTop: '20px', display: this.state.display_name }}>
                    <Row>
                        <Col span={12}>
                        </Col>
                        <Col span={12}>
                            <div style={{ float: 'right' }}>
                                <span style={{ paddingLeft: '5px' }}><Link to="/App/KnowledgeManage_List_Slider/StructDetail"><Button style={buttoncolor} size="large">查看详情</Button></Link> </span>
                                <span style={{ paddingLeft: '5px' }}> <Button style={buttoncolor} size="large" onClick={this.addStruct.bind(this)}>添加节点</Button></span>
                                <span style={{ paddingLeft: '5px' }}> <Button style={buttoncolor} size="large" onClick={this.relatedknowledge.bind(this)}>关联知识点</Button> </span>
                                <span style={{ paddingLeft: '5px' }}>   <Button style={buttoncolor} size="large" onClick={this.editStruct.bind(this)}>修改节点</Button></span>
                                <span style={{ paddingLeft: '5px' }}>   <Button style={buttoncolor} size="large" onClick={this.delete_confirm.bind(this)}>删除节点</Button></span>
                                <span style={{ paddingLeft: '5px', paddingRight: '10px' }}>   <Button style={buttoncolor} size="large" onClick={this.relatedResourse.bind(this)}>查看关联资源</Button></span>
                            </div>
                        </Col>
                    </Row>
                </div> */}
                <div style={{ background: '#fff', paddingTop: '10px' }}>
                    <Row>
                        <Col span={23}>
                            <div style={{ float: 'right',display: this.state.display_name  }}>
                                <span style={{ paddingLeft: '5px' }}><Link to="/App/KnowledgeManage_List_Slider/StructDetail"><Button style={buttoncolor} size="large">查看详情</Button></Link> </span>
                                <span style={{ paddingLeft: '5px' }}> <Button style={buttoncolor} size="large" onClick={this.addStruct.bind(this)}>添加节点</Button></span>
                                <span style={{ paddingLeft: '5px' }}> <Button style={buttoncolor} size="large" onClick={this.relatedknowledge.bind(this)}>关联知识点</Button> </span>
                                <span style={{ paddingLeft: '5px' }}>   <Button style={buttoncolor} size="large" onClick={this.editStruct.bind(this)}>修改节点</Button></span>
                                <span style={{ paddingLeft: '5px' }}>   <Button style={buttoncolor} size="large" onClick={this.delete_confirm.bind(this)}>删除节点</Button></span>
                                <span style={{ paddingLeft: '5px', paddingRight: '10px' }}>   <Button style={buttoncolor} size="large" onClick={this.relatedResourse.bind(this)}>查看关联资源</Button></span>
                            </div>
                        </Col>
                        {/* <Col span={1} > */}
                        <Col span={1} onClick={this.display_name.bind(this)}>
                            <Icon type='edit' style={{ fontSize: '30px' }} />
                        </Col>
                    </Row>
                </div>
                <Layout style={{ padding: '10px 0', background: '#fff' }}>
                    {/* <Sider width={300} style={{ background: '#fff', paddingLeft: '15px', paddingTop: '30px',  }}> */}
                    <Sider width={300} style={{ background: '#fff', paddingLeft: '15px' }}>
                        <Link to="/App/KnowledgeManage_Echarts_Slider/StructDetail"><Button type="default" style={{ width: '300px' }}>切换地图模式</Button></Link>
                        <Button size="large" style={{ width: '300px', color: "#fff", background: "#2a95de", border: "#2a95de", }} onClick={this.handleClick_mapName.bind(this)}>{this.state.mapName}</Button>
                        <Tree loadData={this.onLoadData} defaultSelectedKeys='0-0-1' >
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
        mapInfo: state.reducer_map_info.mapInfo,
        mapType: state.reducer_map_type.mapType,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        knowledgeInfo: (state) => dispatch(state), //左侧导航栏，知识地图及知识点（元）信息
        displayType: (state) => dispatch(state), //左侧导航栏，知识地图及知识点（元）信息
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(KnowledgeManage_List_Slider);

