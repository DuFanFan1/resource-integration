import React, { Component } from 'react';
import { Breadcrumb, Switch, Icon } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
const breadcrumbNameMap = {
    '/App': '首页',
 
    //检索
    '/App/Search_Index': '检索',
    '/App/Search_Index/searchContent': '检索结果',
    //'/App/page1': 'bar页面',
    '/App/resourceDetailSearch': '资源详细信息',
    '/App/reviseResourceSearch': '修改资源',
    // 统计分析 
    '/App/Statistics_Index': '统计分析',
    '/App/Statistics_Index/MapStatistics': '知识地图',
    '/App/Statistics_Index/ResourceStatistic': '资源',
    '/App/Statistics_Index/KnowledgeStatistic': '知识点',
    //个人中心
    '/App/User_Index': '个人中心',
    '/App/User_Index/MyInformation': '个人信息',
    '/App/User_Index/ReviseInformation': '修改个人信息',
    '/App/User_Index/RevisePassword': '修改密码',
    //知识地图
    //KnowledgeManage_List_Slider
    '/App/KnowledgeManage_List_Slider': '知识地图列表',

    '/App/KnowledgeManage_List_Slider/StructDetail': '结构详细信息',
    '/App/KnowledgeManage_List_Slider/EditStruct': '结构详细编辑',
    '/App/KnowledgeManage_List_Slider/Relatedknowledge': '关联知识点',
    '/App/KnowledgeManage_List_Slider/AddStruct': '添加节点',
    '/App/KnowledgeManage_List_Slider/ResList': '资源列表',
    '/App/KnowledgeManage_List_Slider/EditResource': '编辑资源',
    '/App/KnowledgeManage_List_Slider/ResInformation': '资源信息',
    '/App/KnowledgeManage_List_Slider/AddResource': '添加资源',

    //KnowledgeManage_Echarts_Slider
    '/App/KnowledgeManage_Echarts_Slider': '知识地图',

    '/App/KnowledgeManage_Echarts_Slider/StructDetail': '结构详细信息',
    '/App/KnowledgeManage_Echarts_Slider/EditStruct': '结构详细编辑',
    '/App/KnowledgeManage_Echarts_Slider/AddStruct': '添加节点',
    '/App/KnowledgeManage_Echarts_Slider/Relatedknowledge': '关联知识点',
    '/App/KnowledgeManage_Echarts_Slider/ResList': '资源列表',
    '/App/KnowledgeManage_Echarts_Slider/EditResource': '编辑资源',
    '/App/KnowledgeManage_Echarts_Slider/ResInformation': '资源信息',
    '/App/KnowledgeManage_Echarts_Slider/AddResource': '添加资源',

    '/App/SelectSubject_Index': '选择学科',
    '/App/MapType': '地图类型',
    '/App/AddMap': '添加地图',
    '/App/AddTopicMap': '添加主题图',
    '/App/EditMap': '编辑地图',
    //知识库
    '/App/KnowledgeRepository_List_Slider': '知识库列表',
    '/App/KnowledgeRepository_List_Slider/Addknowledge': '添加知识点',
    '/App/KnowledgeRepository_List_Slider/EditKnowledge': '编辑知识点',
    '/App/KnowledgeRepository_List_Slider/KnowledgeDetail': '知识点详情',
    '/App/KnowledgeRepository_List_Slider/ResList_Repository': '资源关联',
    '/App/KnowledgeRepository_List_Slider/EditResource': '编辑资源',
    '/App/KnowledgeRepository_List_Slider/ResInformation_Repository': '资源详情',

    '/App/KnowledgeRepository_Echarts_Slider': '知识库',
    '/App/KnowledgeRepository_Echarts_Slider/KnowledgeDetail': '知识点详情',
    '/App/KnowledgeRepository_Echarts_Slider/EditKnowledge': '编辑知识点',
    '/App/KnowledgeRepository_Echarts_Slider/Addknowledge': '添加知识点',
    '/App/KnowledgeRepository_Echarts_Slider/ResList': '资源关联',
    '/App/KnowledgeRepository_Echarts_Slider/EditResource': '编辑资源',
    '/App/KnowledgeRepository_Echarts_Slider/ResInformation': '资源详情',
    '/App/KnowledgeRepository_Echarts_Slider/AddResource': '添加资源',

    // 个人空间 
    '/App/MapType_TopMap': '主题图',
    '/App/MapType_MyMap': '我的地图',

    '/App/ResKnowRelationList': '资源关联知识点列表显示',
    '/App/RelationInformation': '资源知识点关联详情',
    '/App/WisdomAnnotation': '众智详情',
    '/App/ResKnowRelationMap': '资源关联知识点地图显示',
    '/App/MyTask': '我的任务',
    '/App/MyTaskInformation': '标注详情',

};
class BreadcrumbCustom extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor(props, context) {
        super(props, context);
        this.state = {
            pathSnippets: null,
            extraBreadcrumbItems: null
        }
    }
    getPath() {
        this.state.pathSnippets = this.context.router.history.location.pathname.split('/').filter(i => i);
        this.state.extraBreadcrumbItems = this.state.pathSnippets.map((_, index) => {
            var url = `/${this.state.pathSnippets.slice(0, index + 1).join('/')}`;
            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url=='/App'?'/Login_Index':url}>
                        {breadcrumbNameMap[url]}
                    </Link>
                </Breadcrumb.Item>
            );
        });
    }

    componentWillMount() {
        this.getPath();
    }
    componentWillReceiveProps() {
        this.getPath();
    }
    render() {
        return (
            <span>
                <Breadcrumb style={{ margin: '12px 0' }}>
                    {this.state.extraBreadcrumbItems}
                </Breadcrumb>
            </span>
        )
    }
}
export default BreadcrumbCustom;
