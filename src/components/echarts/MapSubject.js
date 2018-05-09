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
class MapSubject extends React.Component {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor(props, context) {
        super(props, context)
        this.initPie = this.initPie.bind(this)
        this.state = {
            Display: "none",
            data_elementary: [
                // {
                //     value: 1,
                //     name: '数学',
                //     subject_id: 1,
                // },
            ],
            data_high: [
                // {
                //     value: 1,
                //     name: '数学',
                //     subject_id: 1,
                // }, {
                //     value: 1,
                //     name: '物理',
                //     subject_id: 2,
                // }, {
                //     value: 1,
                //     name: '化学',
                //     subject_id: 3
                // }, {
                //     value: 1,
                //     name: '生物',
                //     subject_id: 4
                // },
            ]
        }
    }
    selectCount() {
        let data_elementary = []
        let data_high = []
        //根据知识点id查看关联资源列表
        console.log('推荐知识地图列表1111111111111111')
        let ajaxTimeOut =$.ajax({
            url: '/api_v1.1/statisticalAnalysis/selectCount',
            type: "GET",
            dataType: "json",
            data: { 'tag': 1, 'type': 'subject' },
            timeout:2000,
            success: function (data) {
                if (data.erroCode == '0') {
                    console.log('获取学科关联资源数')
                    console.log(data.msg)
                    data.msg.forEach(function (item) {
                        console.log('item')
                        console.log(item)
                        if (item.name == '数学') {
                            data_elementary.push({
                                value: 1,
                                name: item.name + '(' + item.value + ')',
                                subject_id: 1,
                                subject_name:item.name,
                            })
                            data_high.push({
                                value: 1,
                                name: item.name + '(' + item.value + ')',
                                subject_id: 1,
                                subject_name:item.name,
                            })
                        }
                        else if(item.name == '物理'){
                            data_high.push({
                                value: 1,
                                name: item.name + '(' + item.value + ')',
                                subject_id: 2,
                                subject_name:item.name,
                            })
                        }
                        else if(item.name == '化学'){
                            data_high.push({
                                value: 1,
                                name: item.name + '(' + item.value + ')',
                                subject_id:3,
                                subject_name:item.name,
                            })
                        }
                        else if(item.name == '生物'){
                            data_high.push({
                                value: 1,
                                name: item.name + '(' + item.value + ')',
                                subject_id: 4,
                                subject_name:item.name,
                            })
                        }
                        
                    })
                    this.setState({
                        data_elementary: data_elementary,
                        data_high: data_high
                    });
                    console.log('data_elementary')
                    console.log(data_elementary)
                    console.log('data_high')
                    console.log(data_high)
                    console.log('this.state.data_elementary')
                    console.log(this.state.data_elementary)
                    console.log('this.state.data_high')
                    console.log(this.state.data_high)
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
        const map_subject = {
            // title: {
            //     text: 'Subjects choice'
            // },
            tooltip: {
                // formatter: '[{1,2,3,4}]',
                formatter: '{b}',
                // show:false,
            },
            series: [
                {
                    name: '学科选择',
                    type: 'treemap',
                    //roam: 'move',
                    zoomToNodeRatio: 0,
                    nodeClick: false,//屏蔽节点点击移至中心
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
                    data: this.state.data_high
                }
            ]
        }
        var myChart = echarts.init(this.ID) //初始化echarts
        var grade = this.props.eventsOption.grade
        // var version = this.props.eventsOption.version
        var TimeFn = null;   //用于兼容单双击的Timeout函数指针
        this.ID.oncontextmenu = function () {   //屏蔽原本右键“保存图片”等事件
            return false;
        }
        let props = this.props
        //设置options
        if (myChart.getOption() == undefined) {
            myChart.setOption(map_subject)
        }
        else myChart.setOption(myChart.getOption())
        window.onresize = function () {
            myChart.resize()
        }
        // 双击事件
        myChart.on('dblclick', dblClick.bind(this))
        function dblClick(param) {
            clearTimeout(TimeFn)
            const { mapType } = this.props
            if (mapType.mapType == '标准地图') {
                // alert("只触发了双击事件")
                console.log('echarts双击成功')
                console.log('param.data')
                console.log(param.data)
                console.log('grade1111111111111111111111111111111111')
                const { selectMapSubject } = this.props
                selectMapSubject({
                    type: 'selectMapSubject',
                    payload: {
                        // subject_name: '数学',
                        // grade: '小学',
                        // version: '人教版',
                        name: param.data.name,
                        subject_name: param.data.subject_name,
                        subject_id: param.data.subject_id,
                        // grade: grade,
                        // version: version,
                    }
                });
                const { mapInfo } = this.props
                mapInfo({
                    type: 'mapInfo',
                    payload: {
                        mapContent: false,
                    }
                });
                // mapType({
                //     type: 'mapType',
                //     payload: {                
                //         mapType: '标准地图',
                //     }
                // });
                this.context.router.history.push("/App/MapType");//教材体系
            }
            else {
                const { selectMapSubject } = this.props
                selectMapSubject({
                    type: 'selectMapSubject',
                    payload: {
                        name: param.data.name,
                        subject_name: param.data.subject_name,
                        subject_id: param.data.subject_id,
                    }
                });
                this.context.router.history.push("/App/KnowledgeRepository_List_Slider/KnowledgeDetail");//知识库
            }
        }
        if (grade == '小学') {
            let data = this.state.data_elementary;
            chandeData(this.state.data_elementary);
        }
        else {
            let data = this.state.data_high
            chandeData(this.state.data_high);

        }
        function chandeData(data) {
            console.log('grade2000:' + grade)
            let options = myChart.getOption();//获取已生成图形的Option
            options.series[0].data = data
            myChart.setOption(options);
            console.log(options.series[0].data)
        }
    }
    componentWillMount() {
        this.selectCount()
    }
    // componentDidMount() {
    //     this.initPie()
    // }
    componentDidUpdate() {
        // setTimeout(() => {
        //     this.initPie()
        // }, 1000);
        this.initPie()
    }
    // componentWillReceiveProps() {
    //     this.initPie()      
    // }
    render() {
        const { width = "100%", height = '700px' } = this.props
        return <div ref={ID => this.ID = ID} style={{ width, height }}></div>
    }
}
function mapStateToProps(state) {
    return {
        mapType: state.reducer_map_type.mapType,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        selectMapSubject: (state) => dispatch(state),
        mapInfo: (state) => dispatch(state),
        // mapType: (state) => dispatch(state),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapSubject);
