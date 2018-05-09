import React from 'react'
import $ from 'jquery';
import echarts from 'echarts-diy-yukipedia/lib/echarts' //必须
import 'echarts-diy-yukipedia/lib/component/tooltip'
import 'echarts-diy-yukipedia/lib/component/legend'
import 'echarts-diy-yukipedia/lib/chart/pie'
import 'echarts-diy-yukipedia/lib/chart/graph'
import 'echarts-diy-yukipedia/lib/chart/treemap'
import { connect } from 'react-redux';
import PropTypes from "prop-types";
// import Alert from 'antd/lib/alert';
import {  Modal } from 'antd';
import '../../../style_css/antd.css';  // Add
const confirm = Modal.confirm;
const buttoncolor = {
    color:"#fff",
    background:"#2a95de",
    border:"#2a95de",
}
let isNull=false;
class MapType extends React.Component {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor(props, context) {
        super(props, context)
        this.initPie = this.initPie.bind(this)
        this.state = {
            Display: "none",
            optionData: [],
            isNull:false,
        }
    }
     //无权操作提示语
     warning() {
        Modal.warning({
          title: '友情提示：',
          content: '暂无数据',
        });
      }
    //通过学科，学段，版本，类型获取标准知识地图列表-by bing
    //获取主题图
    //获取我的地图
    getMapType = (URL,DATA) => {  
        let ajaxTimeOut = $.ajax({
            url: URL,
            // url: "/api_v1.1/knowledge_struct_index/queryKnowledgeMapbySFVT",
            type: "GET",
            dataType: "json",
            data: DATA,
            timeout:2000,
            // data: { "subject": subject_name,"grade" :grade,"version":version,"kmap_type": '标准地图' },
            success: function (data) {
                console.log('data');
                console.log(data);
                if (data.errorCode == 1) { 
                    this.setState({ optionData: [] });
                    this.setState({ isNull: false });
                    console.log('暂无数据')
                    this.warning();
                }
                else {
                    this.setState({ isNull: true });
                    this.setState({ optionData: data.msg });
                    console.log(this.state.optionData);
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

   
    initPie() {
        const map_standard = {
            tooltip: {
                formatter: '{b}'
            },
            series: [
                {
                    name: '学科选择',
                    type: 'treemap',
                    //roam: 'move',
                    zoomToNodeRatio: 0,
                    nodeClick:false,//屏蔽节点点击移至中心
                    breadcrumb: {
                        show: false
                    },
                    label: {
                        normal: {
                            fontSize: 20
                        },
                        show: true,
                        formatter: '{b}'
                    },
                    color: [
                        '#c23531', '#314656', '#61a0a8', '#dd8668',
                        '#91c7ae', '#6e7074', '#61a0a8', '#bda29a',
                        '#44525d', '#c4ccd3'
                    ],
                    colorSaturation: [0.35, 0.5],
                    itemStyle: {
                        normal: {
                            gapWidth: 1,
                            borderWidth: 0.5,
                            borderWidthColorSaturation: 0.6,  
                        }
                    },
                    data:this.state.optionData
                }
            ]
        }        
        var myChart = echarts.init(this.ID) //初始化echarts
        var TimeFn = null;   //用于兼容单双击的Timeout函数指针
        var ifAdd = this.props.eventsOption.ifAdd
        var ifDelete = this.props.eventsOption.ifDelete
        var ifEdit = this.props.eventsOption.ifEdit
        var isChangType = this.props.eventsOption.isChangType
        var grade = this.props.eventsOption.grade
        var version = this.props.eventsOption.version
        var selectIndex = this.props.eventsOption.selectIndex
        var selectName = this.props.eventsOption.selectName
        var newname = this.props.eventsOption.newname;
        var newcategory = this.props.eventsOption.newcategory; 
  
        this.ID.oncontextmenu = function () {   //屏蔽原本右键“保存图片”等事件
            return false;
        }
        let props = this.props
        //设置options
        if (myChart.getOption() == undefined) {
            myChart.setOption(map_standard)
        }
        else myChart.setOption(myChart.getOption())
        window.onresize = function () {
            myChart.resize()
        }
        myChart.on('click', transIndex.bind(this))
        function transIndex(param) {
            if(this.state.isNull==true || isNull==true){
                clearTimeout(TimeFn)
                TimeFn = setTimeout(() => {
                    console.log('echarts单击成功')
                    console.log('param.data')
                    console.log(param.data)
                    const { knowledgeInfo } = this.props;
                    knowledgeInfo({
                        type: 'knowledgeInfo',
                        payload: {mapContent: false, knowledge_id:1 },
                    });
                    const { mapInfo } = this.props
                    mapInfo({
                        type: 'mapInfo',
                        payload: {
                            mapContent:true,
                            index: param.dataIndex,
                            map_id: param.data.mapid,
                            map_name: param.data.name,
                            version: param.data.version,
                            subject: param.data.subject,
                        }
                    });
    
                }, 333)
            }
        }
        // 双击事件
        myChart.on('dblclick', dblClick.bind(this))
        function dblClick(param) {
            clearTimeout(TimeFn)
            if(this.state.isNull==true || isNull==true){
                        // alert("只触发了双击事件")
            console.log('echarts单击成功')
            console.log('param.data')
            console.log(param.data)
            const { knowledgeInfo } = this.props;
            knowledgeInfo({
                type: 'knowledgeInfo',
                payload: {mapContent: false, knowledge_id:1 },
            });
            const { mapInfo } = this.props
            mapInfo({
                type: 'mapInfo',
                payload: {
                    mapContent:true,
                    index: param.dataIndex, // 节点索引
                    map_id: param.data.mapid,// 知识地图id
                    map_name: param.data.name,// 知识地图name
                    version: param.data.version,
                    subject: param.data.subject,
                }
            });
            this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/StructDetail");
            // this.context.router.history.push("/App/MapDisplay");
            }
        }
        if (ifDelete) {
            deleteNode();
        }
        else if (isChangType) {
            console.log('isChangType:'+isChangType)
            let URL;
            let DATA;
            const { mapType } = this.props;
            const { login_info } = this.props;
            if(mapType.mapType=='标准地图'){
                const { selectMapSubject } = this.props;
                URL="/api_v1.1/knowledge_struct_index/queryKnowledgeMapbySFVT";
                DATA={ "subject": selectMapSubject.subject_name,"grade" :grade,"version":version,"kmap_type": '标准地图' }
            }
            else if(mapType.mapType=='主题图'){
                URL="/api_v1.1/knowledge_struct_index/queryKnowledgeMapbyTVU";
                DATA={ "kmap_type": '自定义地图',"version":'主题图',"uid": login_info.userid }
            }
            else if(mapType.mapType=='我的地图'){
                URL="/api_v1.1/knowledge_struct_index/queryKnowledgeMapbyTVU";
                DATA={ "kmap_type": '自定义地图',"version":'自定义地图',"uid": login_info.userid  }   
            }
            console.log('URL:'+URL)
            console.log('DATA:'+DATA)
            console.log(DATA)
            getMapTypes(URL,DATA);
        }
        //获取网络请求
        function getMapTypes(URL,DATA) {
            let options = myChart.getOption();//获取已生成图形的Option
            let ajaxTimeOut =$.ajax({
                url: URL,
                // url: "/api_v1.1/knowledge_struct_index/queryKnowledgeMapbySFVT",
                type: "GET",
                dataType: "json",
                data: DATA,
                timeout:2000,
                // data: { "subject": subject_name,"grade" :grade,"version":version,"kmap_type": '标准地图' },
                success: function (data) {
                    if (data.errorCode == 1) { 
                        options.series[0].data=[]
                        isNull=false
                        console.log('暂无数据')
                        Modal.warning({
                            title: '友情提示：',
                            content: '暂无数据',
                          });
                    }
                    else {
                        options.series[0].data=data.msg
                        isNull=true
                        console.log('options.series[0].data');
                        console.log(options.series[0].data);
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
            // myChart.setOption(options);
            setTimeout(() => {
                myChart.setOption(options);
             }, 200);
        }
        //删除节点事件
        function deleteNode() {
            console.log('地图删除1714');
            let options = myChart.getOption();//获取已生成图形的Option
            let nodesOption = options.series[0].data;//获得所有节点的数组
            if (selectIndex == 0) { alert("您确定要删除根节点吗？"); }
            else {  
                console.log('nodesOption');          
                console.log(nodesOption);          
                nodesOption.splice(selectIndex-1, 1);//这个属性从0开始计数是同数组的索引相同
                myChart.setOption(options);
                console.log(options)
            }
        }
    }
    componentDidMount() {
        let URL;
        let DATA;
        const { mapType } = this.props;
        const { login_info } = this.props;
        if(mapType.mapType=='标准地图'){
            const { selectMapSubject } = this.props;
            const { mapGrage } = this.props;
            const { mapVersion } = this.props;
            URL="/api_v1.1/knowledge_struct_index/queryKnowledgeMapbySFVT";
            DATA={ "subject": selectMapSubject.subject_name,"grade" :mapGrage.grade,"version":mapVersion.version,"kmap_type": '标准地图' }
        }
        else if(mapType.mapType=='主题图'){
            URL="/api_v1.1/knowledge_struct_index/queryKnowledgeMapbyTVU";
            DATA={ "kmap_type": '自定义地图',"version":'主题图',"uid": login_info.userid }
        }
        else if(mapType.mapType=='我的地图'){
            URL="/api_v1.1/knowledge_struct_index/queryKnowledgeMapbyTVU";
            DATA={ "kmap_type": '自定义地图',"version":'自定义地图',"uid": login_info.userid  }   
        }
        this.getMapType(URL,DATA);
        // this.initPie()
    }
    componentDidUpdate() {
        setTimeout(() => {
           this.initPie()
        }, 200); 
    }
    render() {
        const { width = "100%", height = '700px' } = this.props
        return <div ref={ID => this.ID = ID} style={{ width, height }}></div>
    }
}
function mapStateToProps(state) {
    return {
        selectMapSubject: state.reducer_map_subject.selectMapSubject,
        mapGrage: state.reducer_map_grade.mapGrage,
        mapVersion: state.reducer_map_version.mapVersion,
        mapType: state.reducer_map_type.mapType,
        login_info: state.reducer_login.login_info
    };
}
function mapDispatchToProps(dispatch) {
    return {
        mapInfo: (state) => dispatch(state),
        knowledgeInfo: (state) => dispatch(state),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapType);



