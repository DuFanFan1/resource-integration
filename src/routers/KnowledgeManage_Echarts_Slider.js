import React, { Component } from 'react';
import { Router, Route } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';

//知识地图
import KnowledgeManage_Echarts_Slider from '../components/map/KnowledgeManage_Echarts_Slider.js';//知识地图列表呈现index
import StructDetail from '../components/map/common_knowledgeManage/StructDetail.js';//知识地图列表呈现初始化详情页面
import EditStruct from '../components/map/common_knowledgeManage/EditStruct.js';//编辑知识点
import Relatedknowledge from '../components/map/common_knowledgeManage/Relatedknowledge.js';//关联知识元
import Relatedknowledge_Auto from '../components/map/common_knowledgeManage/Relatedknowledge_Auto.js';//关联知识元
import AddStruct from '../components/map/common_knowledgeManage/AddStruct.js';//关联知识元
import AddTopMapStruct from '../components/map/common_knowledgeManage/AddTopMapStruct.js';//关联知识元
import RecommendResourceDetail from '../components/map/common_knowledgeManage/RecommendResource_CXR.js';//关联资源页面
//关联资源
import ResList from '../components/map/common_knowledgeManage/ResList.js';//关联资源页面
import EditResource from '../components/map/common_knowledgeManage/EditResource.js';//编辑资源页面
import ResInformation from '../components/map/common_knowledgeManage/ResInformation.js';//编辑资源页面
import AddResource from '../components/map/common_knowledgeManage/AddResource.js';//添加资源页面
import RecommendResource from '../components/map/common_knowledgeManage/RecommendResource.js';//查看推荐资源详情页
export default class RouterKnowledgeManage_Echarts_Slider extends Component {
    render() {
        return (
            <KnowledgeManage_Echarts_Slider>
                <Route exact path="/App/KnowledgeManage_Echarts_Slider/StructDetail" component={StructDetail} />               
                <Route path="/App/KnowledgeManage_Echarts_Slider/EditStruct" component={EditStruct} />
                <Route path="/App/KnowledgeManage_Echarts_Slider/AddStruct" component={AddStruct} />
                <Route path="/App/KnowledgeManage_Echarts_Slider/AddTopMapStruct" component={AddTopMapStruct} />
                <Route path="/App/KnowledgeManage_Echarts_Slider/Relatedknowledge" component={Relatedknowledge} />
                <Route path="/App/KnowledgeManage_Echarts_Slider/Relatedknowledge_Auto" component={Relatedknowledge_Auto} />
                <Route path="/App/KnowledgeManage_Echarts_Slider/RecommendResourceDetail" component={RecommendResourceDetail} />
                <Route path="/App/KnowledgeManage_Echarts_Slider/ResList" component={ResList} />
                <Route path="/App/KnowledgeManage_Echarts_Slider/EditResource" component={EditResource} />
                <Route path="/App/KnowledgeManage_Echarts_Slider/ResInformation" component={ResInformation} />
                <Route path="/App/KnowledgeManage_Echarts_Slider/AddResource" component={AddResource} />
                <Route path="/App/KnowledgeManage_Echarts_Slider/RecommendResource" component={RecommendResource} />
            </KnowledgeManage_Echarts_Slider>

        )
    }
}