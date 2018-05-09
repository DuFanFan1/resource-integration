import React from 'react'
import $ from 'jquery';
import echarts from 'echarts-diy-yukipedia/lib/echarts' //必须
import 'echarts-diy-yukipedia/lib/component/tooltip'
import 'echarts-diy-yukipedia/lib/component/legend'
import 'echarts-diy-yukipedia/lib/chart/pie'
import 'echarts-diy-yukipedia/lib/chart/graph'
import 'echarts-diy-yukipedia/lib/chart/treemap'
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import PropTypes from "prop-types";
import { Modal,message } from 'antd';
import '../../../style_css/antd.css';
const confirm = Modal.confirm;
var preSelectName = null;
var preSelectCategory = null;
var userName = null;
class MapDisplay extends React.Component {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor(props, context) {
        super(props, context)
        this.initPie = this.initPie.bind(this)
        this.state = {
            Display: "none",
            echartsdata: [],
            echartslinks: [],
            legendData: []
        }
    }
    warning_nodata() {
        Modal.warning({
            title: '友情提示：',
            content: '暂无数据',
        });
    }
    warning() {
        Modal.warning({
            title: '友情提示：',
            content: '请选择非跟节点',
        });
    }
    // 通过知识地图id获取层级结构
    getKonwldedgeStorageStruct(URL, DATA, mapName) {
        let ajaxTimeOut = $.ajax({
            url: URL,
            // url: "/api_v1.1/knowledge_struct/getKnowledgeMapStruct",
            type: "GET",
            dataType: "json",
            data: DATA,
            timeout:2000,
            // data: { "mapid": map_id },
            success: function (data) {
                console.log('地图echarts-data')
                console.log(data)
                // data.msg.data.unshift({ knowid: -1, name: data.msg.links[0].source, category: 0 })
                if (data.errorCode == 0) {
                    const { isBatchAddTopMapStruct } = this.props;
                    isBatchAddTopMapStruct({
                        type: 'isBatchAddTopMapStruct',
                        payload: {
                            isBatchAddTopMapStruct: false,
                        },
                    });
                    // PubSub.publish('topMapHadData');
                    data.msg.data.forEach(function (node) {
                        node.isSpread = "close"
                        var temp = node.name
                        var n = 0
                        makeCategory(temp)
                        node.category_fake = n          //此处代码在自行根据结构判断每个节点的层级，即原计划的rank
                        function makeCategory(name) {
                            for (let m in data.msg.links) {
                                if (data.msg.links[m].target == name) {
                                    let name1 = data.msg.links[m].source
                                    n = n + 1
                                    makeCategory(name1)
                                }
                            }
                        }
                        if (node.is_knowledge == '是') {
                            node.symbol = 'roundRect'
                            node.category = 3
                        }
                    })
                    data.msg.data.forEach(function (node) {
                        if (node.category_fake == 0 || node.category_fake == 1) {
                            node.isSpread = "open"
                        }

                    })
                    preSelectCategory = data.msg.data[1].category;
                    preSelectName = data.msg.data[1].name;
                    data.msg.data[1].category = 0;
                    const { knowledgeInfo } = this.props;
                    knowledgeInfo({
                        type: 'knowledgeInfo',
                        payload: {
                            mapContent: true,
                            index: 1,
                            // category: param.data.category,
                            knowledge_id: data.msg.data[1].knowid,
                            knowledge_name: data.msg.data[1].name,
                            pre_knowid: data.msg.data[1].pre_knowid,
                            is_knowledge: data.msg.data[1].is_knowledge,
                            pre_name: data.msg.data[1].value,
                            reletedResCount: data.msg.data[1].reletedResCount,
                        },
                    });
                    this.setState({
                        echartsdata: data.msg.data,
                        echartslinks: data.msg.links
                    });
                }
                else {
                    const { isBatchAddTopMapStruct } = this.props;
                    isBatchAddTopMapStruct({
                        type: 'isBatchAddTopMapStruct',
                        payload: {
                            isBatchAddTopMapStruct: true,
                        },
                    });
                    const { selectMapSubject } = this.props;
                    this.warning_nodata();
                    this.setState({
                        echartsdata: [
                            {
                                "value": mapName,
                                "name": mapName,
                                "category_fake": 0
                            },],
                        // echartsdata: [{"name":mapName}],
                        echartslinks: []
                    });
                    // data=[{"name":mapName}];
                }

                console.log(data);
                console.log(this.state.echartslinks);
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
        var that = this;
        var data = []
        var links = []
        var max_category=0
        if(userName=='2015112791'){
            this.state.echartsdata.forEach(function (node) {
                max_category=max_category>node.category_fake?max_category:node.category_fake
                if (node.category_fake < 3) {
                    data.push(node)
                }
            })
        }
        else if(userName=='2015112792'){
            this.state.echartsdata.forEach(function (node) {
                max_category=max_category>node.category_fake?max_category:node.category_fake
                if (node.category_fake < 4) {
                    data.push(node)
                }
            })
        }
        else{
            this.state.echartsdata.forEach(function (node) {
                max_category=max_category>node.category_fake?max_category:node.category_fake
                if (node.category_fake < 3) {
                    data.push(node)
                }
            })
        }
        var map_standard = {
            legend: {
                orient: 'vertical',
                left: 'top',
                data: this.state.legendData //['当前操作节点','根节点','地图节点','知识点']
            },
            series: [
                {
                    type: 'graph',
                    layout: 'force',
                    // 节点大小
                    symbolSize: (value, params) => {
                        switch (params.data.category_fake) {
                            case 0:return 60;break;
                            case 1:return 45;break;
                            case 2:return 35;break;
                            case 3:return 25;break;
                            case 4:return 15;break;
                            default:return 25;
                        };
                    },
                    nodeScaleRatio:0,
                    roam: true,
                    categories: [
                        {
                            name: '当前操作节点',
                            itemStyle: {
                                normal: {
                                    color: "#f2b368", //红色
                                    // color: "#009800", //颜色
                                }
                            }
                        },
                        {
                            name: '根节点',
                            itemStyle: {
                                normal: {
                                    // color: "#D48265", //橙色
                                    color: "#9ccc65", //青
                                }
                            }
                        },
                        {
                            name: '地图节点',
                            itemStyle: {
                                normal: {
                                    // color: "#91C7AE",//篮
                                    color: "#2a95de",//篮
                                }
                            }
                        },
                        {
                            name: '知识点',
                            itemStyle: {
                                normal: {
                                    // color: "#D53A35",//青
                                    // color: "#C23531",//篮
                                }
                            }
                        },
                    ],
                    // 节点标签
                    // 节点标签
                    label: {
                        normal: {
                            show: true,
                            position: 'top',//设置label显示的位置
                            formatter: '{c}',//设置label读取的值为value
                            // formatter: '{c}',//设置label读取的值为value
                            textStyle: {
                                fontSize: '12rem'
                            },
                        }
                    },
                    //放
                    animationEasing: 'quarticIn',
                    animationDelay: function (idx) {
                        return idx * 1000;
                    },
                    animationDuration: function (idx) {
                        // 越往后的数据延迟越大
                        return idx * 1000;
                    },
                    animationDurationUpdate: function (idx) {
                        // 越往后的数据延迟越大
                        return idx * 1000;
                    }, animationDelayUpdate: function (idx) {
                        // 越往后的数据延迟越大
                        return idx * 1000;
                    },
                    draggable:true,
                    //放大程度
                    force: {
                        repulsion: 1000,
                        gravity:0.2,
                    },
                    // 数据
                    // data: this.state.echartsdata,
                    data: data,
                    // 建立关系 
                    links: this.state.echartslinks,
                    // 连接线样式
                    lineStyle: {
                        normal: {
                            opacity: 0.9,//连接线的透明度 
                            width: 1, //连接线的粗细 
                            curveness: 0,//连线的弧度
                        }
                    }
                }
            ]
        };
        var myChart = echarts.init(this.ID) //初始化echarts
        var TimeFn = null;   //用于兼容单双击的Timeout函数指针
        var ifBatchAdd = this.props.eventsOption.ifBatchAdd
        var ifAdd = this.props.eventsOption.ifAdd
        var ifDelete = this.props.eventsOption.ifDelete
        var ifEdit = this.props.eventsOption.ifEdit
        var selectIndex = this.props.eventsOption.selectIndex
        var selectcategory = this.props.eventsOption.selectcategory
        var selectName = this.props.eventsOption.selectName
        var newname = this.props.eventsOption.newname;
        var newcategory = this.props.eventsOption.newcategory;

        var knowledge_id = this.props.eventsOption.knowledge_id;
        var is_knowledge = this.props.eventsOption.is_knowledge;
        var pre_knowid = this.props.eventsOption.pre_knowid;

        var reletedResCount = this.props.eventsOption.reletedResCount;//判断是否为知识库
        var is_knowledge_Repository = this.props.eventsOption.is_knowledge_Repository;//判断是否为知识库


        // 切换版本
        var chang_Map = this.props.eventsOption.chang_Map;
        var mapId = this.props.eventsOption.mapId;

        // var mapType = this.props.eventsOption.mapType
        var dataFromDB = this.state.echartsdata //层次型加载
        var linksFromDB = this.state.echartslinks //层次型加载
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
        // 单击事件
        myChart.on('click', transIndex.bind(this))
        function transIndex(param) {
            clearTimeout(TimeFn)
            TimeFn = setTimeout(() => {
                let pre_knowid;
                let level;
                // if (param.dataIndex != 0) {
                console.log('echarts单击成功')
                console.log('param.data')
                console.log(param.data)
                const { knowledgeInfo } = this.props;
                let options = myChart.getOption();
                let nodesOption = options.series[0].data;
                for (let m in nodesOption) {
                    if (preSelectName != null && preSelectName == nodesOption[m].name) {
                        nodesOption[m].category = preSelectCategory;
                    }
                    if (nodesOption[m].name == param.data.name

                    ) {
                        nodesOption[m].category = 0;
                    }
                }
                if (preSelectName != param.data.name

                ) {
                    preSelectName = param.data.name;
                    preSelectCategory = param.data.category;
                }
                myChart.setOption(options);
                if (param.data.is_knowledge == '否') {
                    pre_knowid = param.data.pre_structid;
                    level=param.data.level
                }
                else {
                    pre_knowid = param.data.pre_knowid;
                }
                if (param.dataIndex != 0) {
                    knowledgeInfo({
                        type: 'knowledgeInfo',
                        payload: {
                            mapContent: true,
                            index: param.dataIndex,
                            // category: param.data.category,
                            knowledge_id: param.data.knowid,
                            knowledge_name: param.data.name,
                            pre_name: param.data.value,
                            pre_knowid: pre_knowid,
                            is_knowledge: param.data.is_knowledge,
                            reletedResCount: param.data.reletedResCount,
                            level: level,

                        },
                    });
                }
                else {
                    knowledgeInfo({
                        type: 'knowledgeInfo',
                        payload: {
                            mapContent: false,
                            index: param.dataIndex,
                            pre_name: param.data.value,
                            // category: param.data.category,
                            knowledge_id: 0,
                            knowledge_name: param.data.name,
                            level: level,
                        },
                    });

                }

                // } else {
                //     this.confirm_alert2()
                // }

            }, 333)
        }
        // 双击事件
        myChart.on('dblclick', spreadCategory.bind(this))
        function spreadCategory(param) {
            clearTimeout(TimeFn)
            const { knowledgeInfo } = this.props;
            let pre_knowid;
            let level;
            let options = myChart.getOption();
            let nodesOption = options.series[0].data;
            let linksOption = options.series[0].links;
            let tempLinks = linksFromDB
            let tempData = dataFromDB
            let position = 0
            let position1 = 0
            for (let m in nodesOption) {
                if (preSelectName != null && preSelectName == nodesOption[m].name) {
                    nodesOption[m].category = preSelectCategory;
                }
                if (nodesOption[m].name == param.data.name

                ) {
                    nodesOption[m].category = 0;
                }
            }
            if (preSelectName != param.data.name

            ) {
                preSelectName = param.data.name;
                preSelectCategory = param.data.category;
            }
            if (param.data.is_knowledge == '否') {
                pre_knowid = param.data.pre_structid;
                level=param.data.level
            }
            else {
                pre_knowid = param.data.pre_knowid;
            }
            if (param.dataIndex != 0) {
                knowledgeInfo({
                    type: 'knowledgeInfo',
                    payload: {
                        mapContent: true,
                        index: param.dataIndex,
                        // category: param.data.category,
                        knowledge_id: param.data.knowid,
                        knowledge_name: param.data.name,
                        pre_knowid: pre_knowid,
                        pre_name: param.data.value,
                        is_knowledge: param.data.is_knowledge,
                        reletedResCount: param.data.reletedResCount,
                        level: level
                    },
                });
            }
            else {
                knowledgeInfo({
                    type: 'knowledgeInfo',
                    payload: {
                        mapContent: false,
                        index: param.dataIndex,
                        // category: param.data.category,
                        knowledge_id: 0,
                        knowledge_name: param.data.name,
                        level: level
                    },
                });

            }
            for (let m in tempData) {
                if (tempData[m].name == param.data.name) { position = m }
            }
            for (let m in nodesOption) {
                if (nodesOption[m].name == param.data.name) { position1 = m }
            }
            if (param.data.isSpread == "close") {
                let tempTarget = []
                tempLinks.forEach(function (node) {
                    if (node.source == param.data.name) {
                        tempTarget.push(node.target)
                        for (let m in tempData) {
                            if (tempData[m].name == node.target) {
                                let n = 0
                                for (let m in nodesOption) {
                                    if (nodesOption[m].name == node.target) { n++ }
                                }
                                if (n == 0) { nodesOption.push(tempData[m]) }
                            }
                        }
                    }
                })
            }
            else if (param.data.isSpread == "open") {
                function tempDelete(tempName) {
                    linksOption.forEach(function (node) {
                        if (node.source == tempName) {
                            for (let m in nodesOption) {
                                if (nodesOption[m].name == node.target) {
                                    nodesOption.splice(m, 1)
                                    tempDelete(node.target)
                                }
                            }
                        }
                    })
                }
                tempDelete(param.data.name)

            }
            if (param.data.isSpread == "open") {
                nodesOption[position1].isSpread = "close";
            }
            else { nodesOption[position1].isSpread = "open" }
            myChart.setOption(options)
        }
        function dblClick(param) {
            clearTimeout(TimeFn)
            let pre_knowid;
            // if (param.dataIndex != 0) {
            // alert("只触发了双击事件")
            console.log('echarts单击成功')
            console.log('param.data')
            console.log(param.data)
            const { knowledgeInfo } = this.props;
            let options = myChart.getOption();
            let nodesOption = options.series[0].data;
            for (let m in nodesOption) {
                if (preSelectName != null && preSelectName == nodesOption[m].name) {
                    nodesOption[m].category = preSelectCategory;
                }
                if (nodesOption[m].name == param.data.name

                ) {
                    nodesOption[m].category = 0;
                }
            }
            if (preSelectName != param.data.name

            ) {
                preSelectName = param.data.name;
                preSelectCategory = param.data.category;
            }
            if (param.data.is_knowledge == '否') {
                pre_knowid = param.data.pre_structid;
            }
            else {
                pre_knowid = param.data.pre_knowid;
            }
            if (param.dataIndex != 0) {
                knowledgeInfo({
                    type: 'knowledgeInfo',
                    payload: {
                        mapContent: true,
                        index: param.dataIndex,
                        // category: param.data.category,
                        knowledge_id: param.data.knowid,
                        knowledge_name: param.data.name,
                        pre_knowid: pre_knowid,
                        is_knowledge: param.data.is_knowledge
                    },
                });
            }
            else {
                knowledgeInfo({
                    type: 'knowledgeInfo',
                    payload: {
                        mapContent: false,
                        index: param.dataIndex,
                        // category: param.data.category,
                        knowledge_id: 0,
                        knowledge_name: param.data.name,
                    },
                });

            }
            // const { mapInfo } = this.props
            // mapInfo({
            //     type: 'mapInfo',
            //     payload: {
            //         index: param.dataIndex, // 节点索引
            //         map_id: param.data.kmapid,// 知识地图id
            //         map_name: param.data.name,// 知识地图name
            //     }
            // });
            // this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/KnowledgeDetail");
            // let nodesOption = options.series[0].data;//当前加载数据
            let tempLinks = this.state.echartslinks  //初始化数据关系
            let tempData = this.state.echartsdata//初始化数据
            tempLinks.forEach(function (node) { //通过遍历原始关系数组找到下一层需要加载的数据
                if (node.source == param.data.name) { //如果某一节点的原始关系等于当前选中节点
                    for (let m in tempData) {
                        if (tempData[m].name == node.target) {  //在原始数据中找到下一层数据
                            let n = 0
                            // 遍历当前记载数据
                            for (let m in nodesOption) {
                                if (nodesOption[m].name == node.target) { n++ }
                            }
                            if (n == 0) { nodesOption.push(tempData[m]) }
                            // nodesOption.push(tempData[m])
                        }
                    }

                }
            })
            if (param.data.isSpread == "open") {
                nodesOption[position1].isSpread = "close";
            }
            else { nodesOption[position1].isSpread = "open" }
            myChart.setOption(options)

            // }
            // else {
            //     this.confirm_alert2()
            // }
        }
        if (ifDelete) {
            deleteNode();
        }
        else if (ifAdd) {
            addNode();
        }
        else if (ifBatchAdd) {
            batchAddNode();
        }
        else if (ifEdit) {
            editNode();
        }
        else if (chang_Map) {
            console.log('11111111111changMap')
            // this.editNode.bind(this);
            changMaps();
        }
        // changMap
        function changMaps() {
            console.log('mapId')
            console.log(mapId)
            let ajaxTimeOut = $.ajax({
                // url: URL,
                url: "/api_v1.1/knowledge_struct_rela_know/getKonwldedgeMapStruct",
                type: "GET",
                dataType: "json",
                // data: DATA,
                async:false,
                data: { "mapid": mapId },
                timeout:2000,
                success: function (data) {
                    console.log('地图echarts-data-切换版本学段')
                    console.log(data)
                    // data.msg.data.unshift({ knowid: -1, name: data.msg.links[0].source, category: 0 })
                    if (data.errorCode == 0) {
                        data.msg.data.forEach(function (node) {
                            node.isSpread = "close"
                            var temp = node.name
                            var n = 0
                            makeCategory(temp)
                            node.category_fake = n          //此处代码在自行根据结构判断每个节点的层级，即原计划的rank
                            function makeCategory(name) {
                                for (let m in data.msg.links) {
                                    if (data.msg.links[m].target == name) {
                                        let name1 = data.msg.links[m].source
                                        n = n + 1
                                        makeCategory(name1)
                                    }
                                }
                            }
                            if (node.is_knowledge == '是') {
                                node.symbol = 'roundRect';
                                node.category = 3
                            }
                        })
                        data.msg.data.forEach(function (node) {
                            if (node.category_fake == 0 || node.category_fake == 1) {
                                node.isSpread = "open"
                            }

                        })
                        preSelectCategory = data.msg.data[1].category;
                        preSelectName = data.msg.data[1].name;
                        data.msg.data[1].category = 0;
                        const { knowledgeInfo } = that.props;
                        knowledgeInfo({
                            type: 'knowledgeInfo',
                            payload: {
                                mapContent: true,
                                index: 1,
                                // category: param.data.category,
                                knowledge_id: data.msg.data[1].knowid,
                                knowledge_name: data.msg.data[1].name,
                                pre_knowid: data.msg.data[1].pre_knowid,
                                is_knowledge: data.msg.data[1].is_knowledge,
                                pre_name: data.msg.data[1].value,
                                reletedResCount: data.msg.data[1].reletedResCount,
                            },
                        });
                        that.setState({
                            echartsdata: data.msg.data,
                            echartslinks: data.msg.links
                        });
                    }
                    else {
                        const { selectMapSubject } = that.props;
                        that.warning_nodata();
                        that.setState({
                            echartsdata: [
                                {
                                    "value": mapName,
                                    "name": mapName,
                                    "category_fake": 0
                                },],
                            // echartsdata: [{"name":mapName}],
                            echartslinks: []
                        });
                        // data=[{"name":mapName}];
                    }

                    console.log('echartsdata');
                    console.log(echartsdata);
                    console.log('echartslinks');
                    console.log(echartslinks);
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

            dataFromDB = that.state.echartsdata //层次型加载
            linksFromDB = that.state.echartslinks //层次型加载
            data = []
            that.state.echartsdata.forEach(function (node) {
                if (node.category_fake < 3) {
                    data.push(node)
                }
            })
            let options = myChart.getOption();//获取已生成图形的Option
            options.series[0].data = data;
            options.series[0].links = that.state.echartslinks;
            console.log('options.series[0].data');
            console.log(options.series[0].data);
            console.log('options.series[0].links');
            console.log(options.series[0].links);
            myChart.setOption(options);
            // Modal.success({
            //     title: '友情提示：',
            //     content: '切换成功',
            // });
            // const { isBatchAddTopMapStruct } = this.props;
            // isBatchAddTopMapStruct({
            //     type: 'isBatchAddTopMapStruct',
            //     payload: {
            //         isBatchAddTopMapStruct: false,
            //     },
            // });
            message.success('地图操作成功');
            // setTimeout(() => {
      
            // }, 1000);


        }
        //删除节点事件
        function deleteNode() {
            let options = myChart.getOption();//获取已生成图形的Option
            let nodesOption = options.series[0].data;//获得所有节点的数组
            let linksOption = options.series[0].links;//获得所有连接的数组
            // var categoryLength = options.series[0].categories.length;
            // let nodeLength = nodesOption.length
            //如果要添加节点，有两个步骤，首先data出现该节点的内容，然后links含有它的链接。    
            let newsource = ''
            let tempData = dataFromDB  //原始数据
            //将选择的节点的子节点的父节点设为该节点的父节点
            if (selectIndex == 0) { alert("您确定要删除根节点吗？"); }
            else {
                // 删除linksOption关系
                for (let m in linksOption) {
                    if (linksOption[m].target == selectName) {
                        newsource = linksOption[m].source//找到当前节点的父节点
                        linksOption.splice(m, 1)//还应该删除连线才对
                    }
                }

                for (let m in linksOption) {
                    if (linksOption[m].source == selectName) {
                        linksOption[m].source = newsource

                        let count = 0
                        let searchName = linksOption[m].target
                        for (let t in nodesOption) {
                            if (nodesOption[t].name == searchName) { count++ }
                        }
                        if (count == 0) {
                            for (let s in tempData) {
                                if (tempData[s].name == searchName) { nodesOption.push(tempData[s]) }
                            }
                        }
                        // linksNodes.push(linksOption[m].target);
                    }
                }//然后删除
                nodesOption.splice(selectIndex, 1);//这个属性从0开始计数是同数组的索引相同
                myChart.setOption(options);
                console.log(options)
            }
        }
        // 批量添加节点
        function batchAddNode() {
            console.log("批量关联")
            console.log("newname")
            console.log(newname)
            let options = myChart.getOption();//获取已生成图形的Option param
            let nodesOption = options.series[0].data;//获得所有节点的数组
            let linksOption = options.series[0].links;//获得所有连接的数组
            // let newNode = {
            //     name: newname,/*nodesOption.length + selectName,  data.name */
            //     draggable: true,
            //     // category:newcategory/*selectcategory + 1  data.category */
            // }

            // 遍历添加节点
            for (let q in newname) {
                nodesOption.push({ name: newname[q].name, value: newname[q].name, symbol: newname[q].symbol })
            }
            // 确定关系
            for (let m in newname) {
                if (newname[m].preknowid == 0) {
                    linksOption.push({ source: selectName, target: newname[m].name })
                }
                else {
                    let newknowid = newname[m].knowid
                    let newSelectName;
                    for (let n in newname) {
                        if (newname[n].knowid == newname[m].preknowid && newname[n].preknowid == 0) {
                            newSelectName = newname[n].name
                        }
                    }
                    for (let k in newname) {
                        if (newname[k].knowid == newknowid && newname[k].preknowid != 0) {
                            linksOption.push({ source: newSelectName, target: newname[k].name })
                        }
                    }
                }
            }
            console.log("nodesOption")
            console.log(nodesOption)
            console.log("linksOption")
            console.log(linksOption)
            myChart.setOption(options);
        }
        // 添加节点
        function addNode() {
            let options = myChart.getOption();//获取已生成图形的Option param
            let nodesOption = options.series[0].data;//获得所有节点的数组
            let linksOption = options.series[0].links;//获得所有连接的数组
            let newNode
            if (is_knowledge == '是') {
                newNode = {
                    value: newname,
                    name: knowledge_id + newname,/*nodesOption.length + selectName,  data.name */
                    draggable: true,
                    mapContent: true,
                    knowid: knowledge_id,
                    is_knowledge: is_knowledge,
                    pre_knowid: pre_knowid,
                    symbol: 'roundRect',
                    category: 3


                    // category:newcategory/*selectcategory + 1  data.category */
                }
            }
            else {
                newNode = {
                    value: newname,
                    name: knowledge_id + newname,
                    draggable: true,
                    mapContent: true,
                    knowid: knowledge_id,
                    is_knowledge: is_knowledge,
                    pre_structid: pre_knowid,
                    category: 2
                    // category:newcategory/*selectcategory + 1  data.category */
                }

            }

            let newLink = {
                source: selectName,
                target: newNode.name
            }
            linksOption.push(newLink);
            nodesOption.push(newNode);
            myChart.setOption(options);
        }
        // 编辑节点
        function editNode() {
            let options = myChart.getOption();//获取已生成图形的Option param
            let nodesOption = options.series[0].data;//获得所有节点的数组
            let linksOption = options.series[0].links;//获得所有连接的数组
            let tempData = dataFromDB
            let tempLinks = linksFromDB
            // if (is_knowledge_Repository == true) { newname = newname + '(' + reletedResCount + ')' }//如果为知识库echarts
            newname = newname + '(' + reletedResCount + ')'
            for (let m in nodesOption) {
                if (nodesOption[m].name == selectName) {
                    nodesOption[m].name = knowledge_id + newname;
                    nodesOption[m].value = newname;
                }
            }
            for (let m in linksOption) {
                if (linksOption[m].source == selectName) {
                    linksOption[m].source = knowledge_id + newname
                    // linksNodes.push(linksOption[m].target);
                }
                if (linksOption[m].target == selectName) {
                    linksOption[m].target = knowledge_id + newname
                }
            }
            preSelectName = knowledge_id + newname;
            // for (let m in tempData) {
            //     if (tempData[m].name == selectName) {
            //         tempData[m].name = newname;
            //     }
            // }
            // for (let m in tempLinks) {
            //     if (tempLinks[m].source == selectName) {
            //         tempLinks[m].source = newname
            //         // linksNodes.push(linksOption[m].target);
            //     }
            //     if (tempLinks[m].target == selectName) {
            //         tempLinks[m].target = newname
            //     }
            // }
            myChart.setOption(options);
        }
         //////////////////////////////////////////////////这段代码是对滚轮缩放展现层级的尝试 2018/4/12
         function getStage(){
            let options = myChart.getOption();
            let nodesOption = options.series[0].data;
            let max=0
            nodesOption.forEach(function(node){
                max=max>node.category_fake?max:node.category_fake
            })
            return max
        }
        var zoom=myChart.getOption().series[0].zoom
        var startZoom=myChart.getOption().series[0].zoom
    //    var stageNow=getStage()
   //    var keepStep=getStage()
        myChart.on('graphRoam', function (params) {
        let oldZoom=zoom;
        zoom = myChart._coordSysMgr._coordinateSystems[0]._zoom;  //连续变化值
        let isScale=(zoom!==oldZoom)  //是否仅为平移拖动
          if(isScale){
            let keepStep=getStage()
           
            var jugIsUp=(params.zoom<1?false:true) //放大为true
           
           1<keepStep<max_category+1&&scale(zoom,jugIsUp)
          
             function scale(pot,up){
                let options = myChart.getOption();
                let nodesOption = options.series[0].data;
                let linksOption = options.series[0].links;
                let tempData=dataFromDB
                if(up){
                    let count=0
                    keepStep<max_category&&tempData.forEach(function(node){
                        if(node.category_fake==keepStep+1){
                            count++
                            nodesOption.push(node)
                    }
                    })
                    if(count!==0){keepStep+=1}
                }
                else{
                let count=0
                   keepStep>1&&tempData.forEach(function(node){
                    if(node.category_fake==keepStep){
                        for(let m in nodesOption){
                            if(nodesOption[m].name==node.name){
                               count++
                               nodesOption.splice(m, 1)
                            }
                        }
                    
                }
                })
                if(count!==0){keepStep-=1}
            }
                myChart.setOption(options)
/*
                myChart.setOption({
                    series:[{
                        zoom:keepStep
                    }]  
                })
*/
             }
            }
            });
        //////
    }
    componentWillMount() {
        let URL;
        let DATA;
        let mapName
        const { mapType } = this.props;
        const { mapGrage } = this.props;
        const { login_info } = this.props;
        userName=login_info.username;
        if (mapType.mapType == '知识库') {
            this.setState({ legendData: ['当前操作节点', '根节点', '知识点'] })
            const { selectMapSubject } = this.props;
            URL = "/api_v1.1/knowledge/getKonwldedgeStorageStruct1";
            DATA = { "subject": selectMapSubject.subject_name, "grade": mapGrage.grade }
            mapName = selectMapSubject.subject_name;

        }
        else {
            this.setState({ legendData: ['当前操作节点', '根节点', '地图节点', '知识点'] })
            const { mapInfo } = this.props;
            // console.log(mapInfo)
            // URL="/api_v1.1/knowledge_struct/getKnowledgeMapStruct";
            // DATA={"kmap_id":mapInfo.map_id}
            URL = "/api_v1.1/knowledge_struct_rela_know/getKonwldedgeMapStruct";
            DATA = { "mapid": mapInfo.map_id }
            mapName = mapInfo.map_name
        }
        this.getKonwldedgeStorageStruct(URL, DATA, mapName)
    }
    componentDidUpdate() {
        setTimeout(() => {
            this.initPie()
        }, 800);
        // this.initPie()
    }
    shouldComponentUpdate(nextProps, nextState) {
        console.log('nextProps', nextProps.eventsOption != this.props.eventsOption);
        console.log('nextProps', nextProps)
        console.log('this.props', this.props)
        console.log('nextState', nextState)
        console.log('this.state.echartsdata', this.state.echartsdata)
        console.log('this.state.echartsdata', nextState.echartsdata.length != this.state.echartsdata.length)
        return (nextProps.eventsOption != this.props.eventsOption || nextState.echartsdata.length != this.state.echartsdata.length);
    }

    render() {
        const { width = "100%", height = '700px' } = this.props
        return <div ref={ID => this.ID = ID} style={{ width, height }}></div>
    }
}
function mapStateToProps(state) {
    return {
        selectMapSubject: state.reducer_map_subject.selectMapSubject,
        mapType: state.reducer_map_type.mapType,
        mapInfo: state.reducer_map_info.mapInfo,
        mapGrage: state.reducer_map_grade.mapGrage,
        login_info: state.reducer_login.login_info
    };
}
function mapDispatchToProps(dispatch) {
    return {
        knowledgeInfo: (state) => dispatch(state),
        isBatchAddTopMapStruct: (state) => dispatch(state),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapDisplay);



