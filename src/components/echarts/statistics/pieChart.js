import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts-diy-yukipedia/lib/echarts' //必须
import 'echarts-diy-yukipedia/lib/component/tooltip'
import 'echarts-diy-yukipedia/lib/component/legend'
import 'echarts-diy-yukipedia/lib/chart/pie'
import 'echarts-diy-yukipedia/lib/chart/graph'
import $ from 'jquery';
export default class PieChart extends Component {
    constructor(props) {
        super(props)
        this.initPie = this.initPie.bind(this)
        this.state = {
            optionData: [],
            optionName: []
        }
    }
    initPie() {
        console.log("initPie");
        console.log(this.state.optionData);
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:this.state.optionName
            },
            series: [
                {
                    name:'详细数值',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:this.props.optionData
                }
            ]
        };
        
        var myChart = echarts.init(this.ID) //初始化echarts
        if (this.props.optionData != null) {
            for (var i = 0; i < this.props.optionData.length; i++) {
                this.state.optionName.push(this.props.optionData[i].name)
            }
/*             console.log(this.state.optionName)
            console.log(this.state.optionData) */
        }
        myChart.setOption(option)

    }
    componentDidMount() {
        this.initPie();
    }
    render() {
        const { width = "100%", height = '350px' } = this.props
        return <div ref={ID => this.ID = ID} style={{ width, height }}></div>
    }
}
