import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink, Switch } from 'react-router';
import { Link, HashRouter,BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducer from '../reducers/index.js';
import Page from '../components/Page.js';
import App from '../App.js';
//检索
import Search_Index from '../components/search/search_index.js';
import searchContent from '../components/search/searchContent.js';


import resourceDetailSearch from '../components/search/resourceDetailSearch.js';
import reviseResourceSearch from '../components/search/reviseResourceSearch.js';
// 知识地图
import RouterKnowledgeManage_List_Slider from './KnowledgeManage_List_Slider.js';
import RouterKnowledgeManage_Echarts_Slider from './KnowledgeManage_Echarts_Slider.js';

// 新增，地图类型

import SelectSubject_Index from '../components/map/SelectSubject_Index.js';//用户登录知识地图首页
import MapType from '../components/map/MapType.js';//选择地图类型：标准，公开，个人
// import MapDisplay from '../components/map/MapDisplay.js';//具体知识地图的echarts呈现

//20171117新增 知识地图类型 网络数据
import AddMap from '../components/map/mapManage/AddMap.js';//添加知识点
import AddTopicMap from '../components/map/mapManage/AddTopicMap.js';//添加知识点
import EditMap from '../components/map/mapManage/EditMap.js';//添加知识点

// 知识库
import RouterKnowledgeRepository_List_Slider from './KnowledgeRepository_List_Slider.js'; //列表导航栏
import RouterKnowledgeRepository_Echarts_Slider from './KnowledgeRepository_Echarts_Slider.js'; //列表导航栏
// import MapDisplay_KnowledgeRepository from '../components/map/MapDisplay_KnowledgeRepository.js';//具体知识地图的echarts呈现
//个人空间
import MapType_TopMap from '../components/map/MapType_TopMap.js';//选择地图类型：标准，公开，个人
import MapType_MyMap from '../components/map/MapType_MyMap.js';//选择地图类型：标准，公开，个人

//登录页面
// import Login from '../components/Login.js';
import Login_Index from '../components/Login_Index.js';

//个人中心
 import RouterUser from './user.js';

//统计分析
//   import RouterStatistic from './statistic.js'; 
import Statistics_Index from '../components/statistics/Statistics_Index.js';
//学习资源
import ResKnowRelationList from '../components/resource/ResKnowRelation/ResKnowRelationList.js';
import RelationInformation from '../components/resource/ResKnowRelation/RelationInformation.js';
import WisdomAnnotation from '../components/resource/ResKnowRelation/WisdomAnnotation.js';
import ResKnowRelationMap from '../components/resource/ResKnowRelation/ResKnowRelationMap.js';
import MyTask from '../components/resource/MyTask.js';
import MyTaskInformation from '../components/resource/MyTaskInformation.js';

const store = createStore(Reducer)
export default class RouterIndex extends Component {
    render() {
        return (
            <Provider store={store}>
            <BrowserRouter>
                <Page>
                {<Redirect to="/Login_Index" />}
                <Switch> 
                <Route path="/Login_Index" component={Login_Index}/>    
                <App path="/App">
                    <Switch>
                        {/* 检索 */}
                         <Search_Index path="/App/Search_Index">
                         <Route path="/App/Search_Index/searchContent" component={searchContent} />
                        </Search_Index>

                         <Route path="/App/resourceDetailSearch" component={resourceDetailSearch} />
                         <Route path="/App/reviseResourceSearch" component={reviseResourceSearch} />
                        {/* 知识地图 */}
                        <RouterKnowledgeManage_List_Slider path={'/App/KnowledgeManage_List_Slider'}/> 
                        <RouterKnowledgeManage_Echarts_Slider path={'/App/KnowledgeManage_Echarts_Slider'}/>                 
                                    
                        <Route exact path="/App/SelectSubject_Index" component={SelectSubject_Index} />
                        <Route exact path="/App/MapType" component={MapType} />                       
                        {/* <Route path="/App/MapDisplay" component={MapDisplay} /> */}
                        {/* 新增20171117 */}
                        <Route path="/App/AddMap" component={AddMap} /> 
                        <Route path="/App/AddTopicMap" component={AddTopicMap} /> 
                        <Route path="/App/EditMap" component={EditMap} /> 

                        {/* 知识库 */}                     
                        {/* <Route  path="/App/MapDisplay_KnowledgeRepository" component={MapDisplay_KnowledgeRepository} />   知识库echarts呈现形式                      */}
                        <RouterKnowledgeRepository_List_Slider path={'/App/KnowledgeRepository_List_Slider'}/>   {/* 知识库左侧导航栏 */} 
                        <RouterKnowledgeRepository_Echarts_Slider path={'/App/KnowledgeRepository_Echarts_Slider'}/>   {/* 知识库左侧导航栏 */} 

                        {/*  个人空间 */}
                        <Route exact path="/App/MapType_TopMap" component={MapType_TopMap} />
                        <Route exact path="/App/MapType_MyMap" component={MapType_MyMap} />

                        {/* 统计分析 */}
                        <Route exact path="/App/Statistics_Index" component={Statistics_Index} />
                         {/* <RouterStatistic path={'/App/Statistics_Index'}/>  */}
                        {/* 个人中心 */}
                       <RouterUser path={'/App/User_Index'}/> 
                        {/* 学习资源 */}
                        <Route path="/App/ResKnowRelationList" component={ResKnowRelationList}/>
                        <Route path="/App/RelationInformation" component={RelationInformation}/>
                        <Route path="/App/WisdomAnnotation" component={WisdomAnnotation}/>   
                        <Route path="/App/ResKnowRelationMap" component={ResKnowRelationMap}/>  
                        <Route path="/App/MyTask" component={MyTask}/> 
                        <Route path="/App/MyTaskInformation" component={MyTaskInformation}/> 
                    </Switch>
                </App>
                </Switch>
               </Page>
            </BrowserRouter>
            </Provider>
        )
    }
}