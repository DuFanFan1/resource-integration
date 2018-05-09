import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts-diy-yukipedia/lib/echarts' //必须
import 'echarts-diy-yukipedia/lib/component/tooltip'
import 'echarts-diy-yukipedia/lib/component/legend'
import 'echarts-diy-yukipedia/lib/chart/pie'
import 'echarts-diy-yukipedia/lib/chart/graph'
import $ from 'jquery';
export default class BarGraph extends Component {
    constructor(props) {
        super(props)
        this.initBar = this.initBar.bind(this)
        this.state = {
            optionData: [],
            optionName: []
        }
        /*         this.state = {
                   optionData:[
                        {
                          "name": "初中",
                          "value": 2
                        },
                        {
                          "name": "小学",
                          "value": 2
                        }
                      ],
                    optionName:[],
                } */
    }
    initBar() {
        console.log("initBar");
        console.log(this.state.optionData);
        const option = {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.state.optionName,//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '数量'
                }
            ],
            series: [
                {
                    name: '详细数值',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.props.optionData//[10, 52, 200, 334, 390, 330, 220]
                }
            ]
        };
        var myChart = echarts.init(this.ID) //初始化echarts
        if (this.props.optionData != null) {
            for (var i = 0; i < this.props.optionData.length; i++) {
                this.state.optionName.push(this.props.optionData[i].name)
            }
            console.log(this.state.optionName)
            console.log(this.state.optionData)


        }
        myChart.setOption(option)

    }
    componentDidMount() {
        this.initBar();
    }
    /*     componentDidUpdate() {
   
           this.initBar()
       } */
    render() {
        const { width = "100%", height = '350px' } = this.props
        return <div ref={ID => this.ID = ID} style={{ width, height }}></div>
    }
}
