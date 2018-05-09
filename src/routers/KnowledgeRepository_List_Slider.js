import React, { Component } from 'react';
import { Router, Route } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';

//知识地图
import KnowledgeRepository_List_Slider from '../components/map/KnowledgeRepository_List_Slider.js';//知识地图列表呈现index
import Addknowledge from '../components/map/knowledge_repository/Addknowledge.js';//关联知识元
import EditKnowledge from '../components/map/knowledge_repository/EditKnowledge.js';//关联知识元
import KnowledgeDetail from '../components/map/knowledge_repository/KnowledgeDetail.js';//关联知识元
import RecommendResourceDetail from '../components/map/common_knowledgeManage/RecommendResource_CXR.js';//关联资源页面


//关联资源
import ResList_Repository from '../components/map/common_knowledgeManage/ResList_Repository.js';//关联资源页面
import EditResource_Repository from '../components/map/common_knowledgeManage/EditResource_Repository.js';//编辑资源页面
import ResInformation_Repository from '../components/map/common_knowledgeManage/ResInformation_Repository.js';//编辑资源页面
import RecommendResource from '../components/map/common_knowledgeManage/RecommendResource.js';//推荐资源页面
import AddResourceList from '../components/map/common_knowledgeManage/AddResourceList.js';//添加资源页面
export default class RouterKnowledgeManage_List_Slider extends Component {
    render() {
        return (
            <KnowledgeRepository_List_Slider>
                <Route exact path='/App/KnowledgeRepository_List_Slider/Addknowledge' component={Addknowledge} />                           
                <Route path="/App/KnowledgeRepository_List_Slider/EditKnowledge" component={EditKnowledge} />
                <Route path="/App/KnowledgeRepository_List_Slider/KnowledgeDetail" component={KnowledgeDetail} />
                <Route path="/App/KnowledgeRepository_List_Slider/RecommendResourceDetail" component={RecommendResourceDetail} />
                {/* 关联资源 */}
                <Route path="/App/KnowledgeRepository_List_Slider/ResList_Repository" component={ResList_Repository} />
                <Route path="/App/KnowledgeRepository_List_Slider/EditResource_Repository" component={EditResource_Repository} />
                <Route path="/App/KnowledgeRepository_List_Slider/ResInformation_Repository" component={ResInformation_Repository} />
                <Route path="/App/KnowledgeRepository_List_Slider/RecommendResource" component={RecommendResource} />
                <Route path="/App/KnowledgeRepository_List_Slider/AddResourceList" component={AddResourceList} />
            </KnowledgeRepository_List_Slider>

        )
    }
}