import { combineReducers } from 'redux'

function reducer_login(state = {}, action) {
    switch (action.type) {
        case 'LoginSuccess':
            console.log("LoginSuccess");
            console.log(action.payload);
            return { login_info: action.payload };
        default:
            return state;
    }
}
function search_module1(state = {}, action) {
    switch (action.type) {
        case 'SearchSuccess':
            console.log("SearchSuccess");
            console.log(action.payload);
            return { search_info: action.payload };
        default:
            return state;
    }
}

function search_module2(state = {}, action) {
    switch (action.type) {
        case 'setResourceId':
            console.log("setResourceId");
            console.log(action.payload);
            return { resourceid: action.payload };
        default:
            return state;
    }
}

//选择知识地图呈现类型-list or  echarts
function reducer_diaplay_type(state = {}, action) {
    switch (action.type) {
        case 'displayType':
            console.log("displayType");
            console.log(action.payload);
            return { displayType: action.payload };

        default:
            return state;
    }
}
//推荐资源返回类型判断-
function reducer_back_type(state = {}, action) {
    switch (action.type) {
        case 'backType':
            console.log("backType");
            console.log(action.payload);
            return { backType: action.payload };

        default:
            return state;
    }
}
//选择知识地图学段
function reducer_map_type(state = {}, action) {
    switch (action.type) {
        case 'mapType':
            console.log("mapType");
            console.log(action.payload);
            return { mapType: action.payload };

        default:
            return state;
    }
}

function reducer_type(state = {}, action) {
    switch (action.type) {
        case 'type1':
            console.log("type1");
            console.log(action.payload);
            return { type1: action.payload };

        default:
            return state;
    }
}
//选择知识地图学段
function reducer_map_grade(state = {}, action) {
    switch (action.type) {
        case 'mapGrage':
            console.log("mapGrage");
            console.log(action.payload);
            return { mapGrage: action.payload };

        default:
            return state;
    }
}
//选择知识地图版本
function reducer_map_version(state = {}, action) {
    switch (action.type) {
        case 'mapVersion':
            console.log("mapVersion");
            console.log(action.payload);
            return { mapVersion: action.payload };

        default:
            return state;
    }
}
//选择知识地图学科信息（id和name）
function reducer_map_subject(state = {}, action) {
    switch (action.type) {
        case 'selectMapSubject':
            console.log("selectMapSubject");
            console.log(action.payload);
            return { selectMapSubject: action.payload };

        default:
            return state;
    }
}

//选择具体知识地图，（抛出mapid）
function reducer_map_info(state = {}, action) {
    switch (action.type) {
        case 'mapInfo':
            console.log("mapInfo");
            console.log(action.payload);
            return { mapInfo: action.payload };
        default:
            return state;
    }
}
//知识地图信息-选中某一地图，抛出mapid和具体的知识点id

function reducer_map_knowledge(state = {}, action) {
    switch (action.type) {
        case 'knowledgeInfo':
            console.log("knowledgeInfo");
            console.log(action.payload);
            return { knowledgeInfo: action.payload };
        default:
            return state;
    }
}
//是否可以批量导入主题如结构

function reducer_isBatchAddTopMapStruct(state = {}, action) {
    switch (action.type) {
        case 'isBatchAddTopMapStruct':
            console.log("isBatchAddTopMapStruct");
            console.log(action.payload);
            return { isBatchAddTopMapStruct: action.payload };
        default:
            return state;
    }
}
//暂不使用
// function reducer_map(state = {}, action) {
//     switch (action.type) {
//         case 'mapInformation':
//             console.log("mapInformation");
//             console.log(action.payload);
//             return { mapInformation: action.payload };
//         default:
//             return state;
//     }
// }
function reducer_resource(state = {}, action) {
    switch (action.type) {
        case 'GetResourceSuccess':
            console.log("GetResourceSuccess");
            console.log(action.payload);
            return { resource_info: action.payload };
        default:
            return state;
    }
}
//通过知识点查询关联资源的某一个资源r_id
function reducer_resourceid(state = {}, action) {
    switch (action.type) {
        case 'GetResourceIDSuccess':
            console.log("GetResourceIDSuccess");
            console.log(action.payload);
            return { resourceid_info: action.payload };
        default:
            return state;
    }
}

//推荐资源的r_id
function reducer_Recommendresourceid(state = {}, action) {
    switch (action.type) {
        case 'GetRecommendResourceIDSuccess':
            console.log("GetRecommendResourceIDSuccess");
            console.log(action.payload);
            return { resourceid_info: action.payload };
        default:
            return state;
    }
}
//资源关联知识点中的某一个知识点knowid
function reducer_knowid(state = {}, action) {
    switch (action.type) {
        case 'GetKnowIDSuccess':
            console.log("GetKnowIDSuccess");
            console.log(action.payload);
            return { knowid_info: action.payload };
        default:
            return state;
    }
}
//添加关联知识点中检索到的某一个知识点knowid
function reducer_searchknowid(state = {}, action) {
    switch (action.type) {
        case 'GetSearchKnowidSuccess':
            console.log("GetSearchKnowidSuccess");
            console.log(action.payload);
            console.log("获取搜索的数组knowid")
            return { searchknowid_info: action.payload };
        default:
            return state;
    }
}
//添加关联知识点中推荐到的某一个知识点knowid
function reducer_recommendedknowid(state = {}, action) {
    switch (action.type) {
        case 'GetRecommendedKnowidSuccess':
            console.log("GetRecommendedKnowidSuccess");
            console.log(action.payload);
            console.log("获取搜索的数组knowid")
            return { recommendedknowid_info: action.payload };
        default:
            return state;
    }
}
//添加关联知识点中推荐到的某一个知识点knowid数组
function reducer_recommendedknowidgroup(state = {}, action) {
    switch (action.type) {
        case 'GetRecommendedKnowidSuccessgroup':
            console.log("GetRecommendedKnowidSuccessgroup");
            console.log(action.payload);
            console.log("获取搜索的数组knowid")
            return { recommendedknowid_infogroup: action.payload };
        default:
            return state;
    }
}

//添加资源页面的自动推荐知识点id数组
function reducer_autoknowid(state = {}, action) {
    switch (action.type) {
        case 'GetAutoKnowidSuccess':
            console.log("GetAutoKnowidSuccess");
            console.log(action.payload);
            return { autoknowid_info: action.payload };
        default:
            return state;
    }
}
//接收资源添加echart点击得knowid的数组
function reducer_echartknowid(state = {}, action) {
    switch (action.type) {
        case 'GetechartKnowidSuccess':
            console.log("GetechartKnowidSuccess");
            console.log(action.payload);
            return { echartknowid_info: action.payload };
        default:
            return state;
    }
}
export default combineReducers({
    reducer_login,
    search_module1,
    search_module2,
    reducer_resource,
    reducer_back_type,
    reducer_diaplay_type,
    reducer_map_type,
    reducer_map_grade,
    reducer_map_version,
    reducer_map_subject,
    reducer_map_info,
    reducer_map_knowledge,
    reducer_isBatchAddTopMapStruct,
    // reducer_map,
    reducer_knowid,
    reducer_resourceid,
    reducer_searchknowid,
    reducer_recommendedknowid,
    reducer_recommendedknowidgroup,
    reducer_autoknowid,
    reducer_echartknowid,
    reducer_Recommendresourceid,
    reducer_type
})