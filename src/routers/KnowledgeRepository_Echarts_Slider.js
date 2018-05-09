import React, { Component } from 'react';
import { Router, Route } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';

//知识地图
import KnowledgeRepository_Echarts_Slider from '../components/map/KnowledgeRepository_Echarts_Slider.js';//知识地图列表呈现index
import KnowledgeDetail from '../components/map/knowledge_repository/KnowledgeDetail.js';//知识地图列表呈现初始化详情页面
import EditKnowledge from '../components/map/knowledge_repository/EditKnowledge.js';//编辑知识点
import Addknowledge from '../components/map/knowledge_repository/Addknowledge.js';//关联知识元
import RecommendResourceDetail from '../components/map/common_knowledgeManage/RecommendResource_CXR.js';//关联资源页面

// 关联资源
import ResList_Repository from '../components/map/common_knowledgeManage/ResList_Repository.js';//关联资源页面
import EditResource_Repository from '../components/map/common_knowledgeManage/EditResource_Repository.js';//编辑资源页面
import ResInformation_Repository from '../components/map/common_knowledgeManage/ResInformation_Repository.js';//编辑资源页面
import RecommendResource from '../components/map/common_knowledgeManage/RecommendResource.js';//推荐资源页面

export default class RouterKnowledgeRepository_Echarts_Slider extends Component {
    render() {
        return (
            <KnowledgeRepository_Echarts_Slider>
                <Route  path="/App/KnowledgeRepository_Echarts_Slider/KnowledgeDetail" component={KnowledgeDetail} />               
                <Route path="/App/KnowledgeRepository_Echarts_Slider/EditKnowledge" component={EditKnowledge} />
                <Route path="/App/KnowledgeRepository_Echarts_Slider/Addknowledge" component={Addknowledge} />
                <Route path="/App/KnowledgeRepository_Echarts_Slider/RecommendResourceDetail" component={RecommendResourceDetail} />
                <Route path="/App/KnowledgeRepository_Echarts_Slider/ResList_Repository" component={ResList_Repository} />
                <Route path="/App/KnowledgeRepository_Echarts_Slider/EditResource_Repository" component={EditResource_Repository} />
                <Route path="/App/KnowledgeRepository_Echarts_Slider/ResInformation_Repository" component={ResInformation_Repository} />
                {/* <Route path="/App/KnowledgeRepository_Echarts_Slider/AddResource" component={AddResource} /> */}
                <Route path="/App/KnowledgeRepository_Echarts_Slider/RecommendResource" component={RecommendResource} />
            </KnowledgeRepository_Echarts_Slider>

        )
    }
}