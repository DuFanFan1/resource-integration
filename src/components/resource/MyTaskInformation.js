import React, { Component } from 'react';
import { Layout,Icon, Input,Button,Card,Row,Col,Modal,Form,Table} from 'antd';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import echarts from 'echarts/lib/echarts' //必须
import PropTypes from "prop-types";
import $ from 'jquery';
const FormItem = Form.Item;
const { Content } = Layout;
 let update_times=[];  
 let marktimes=[];  
class MyTaskInformation extends Component {

  static contextTypes = {
    router: PropTypes.object
  }
  // 状态机
  constructor(props,context) {
    super(props,context);
    this.initBar = this.initBar.bind(this);
    this.initLine = this.initLine.bind(this);
    this.state = {
      visible: false,
      content: null,
      posts: [],
      peopleMarkDetail1:[
        {
          "weight": null,
          "username": null,
          "user_weight": null,
        }
      ],
    }
  }
  initBar() {
      console.log('柱状图this.state.userAccuracy')
      console.log(this.state.userAccuracy)
    const option = {
      title : {
        text : '用户标注准确率',
      },
        color: ['#2a95de'],
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
                name:'用户',        //X轴名称单位
                nameLocation:'end', //名称的位置
                nameTextStyle:{     //名称的样式
                    color:'#999',
                    fontSize:'18px'
                },
                nameGap:2,  //名称与X轴的距离
                data: this.state.userList,
                // data: ['xinlan','Archer'],
                axisTick: {
                    alignWithLabel: true
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name:'标注准确率',        //y轴名称单位
                nameTextStyle:{     //名称的样式
                    color:'#999',
                    fontSize:'18px'
                },
                nameGap:3,  //名称与y轴的距离
            }
        ],
        series: [
            {
                name: '准确率',
                type: 'bar',
                barWidth: '20%',
                data: this.state.userAccuracy
                // data: [0.0909,0.667]
            }
        ]
    };
    var myChart = echarts.init(this.ID) //初始化echarts
    myChart.setOption(option)
}

initLine() {
const option1 = {
  title : {
        text : '当前用户置信度走势',
      },
  tooltip : {
      trigger: 'axis'
  },
  toolbox: {
      show : true,
      feature : {
          mark : {show: true},
          // dataView : {show: true, readOnly: false},
          // magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          // restore : {show: true},
          // saveAsImage : {show: true}
      }
  },
  calculable : true,
  xAxis : [
      {
          type : 'category',
          name:'标注时间',        //X轴名称单位
          nameLocation:'end', //名称的位置
          nameTextStyle:{     //名称的样式
              color:'#999',
              fontSize:'15px'
          },
          nameGap:2,  //名称与X轴的距离
          boundaryGap : false,
        //   data:this.state.marktime
          data:marktimes
      }
  ],
  yAxis : [
      {
          type : 'value',
          name:'标注值',        //X轴名称单位
          nameTextStyle:{     //名称的样式
              color:'#999',
              fontSize:'18px'
          },
          nameGap:2,  //名称与y轴的距离
      }
  ],
  series : [
      {
          name:'当前用户置信度',
          type:'line',
          stack: '总量',
          data:this.state.usercredit
      },
  ]
};                 
var myChart = echarts.init(this.ID1) //初始化echarts
myChart.setOption(option1)
}

  componentWillMount() {
    this.peopleMarkDetail();
    this.knowledgeInformation();
    this.userMarkAccuracy();
    this.userCreditRecord();
    setTimeout(() => {
        this.initBar();
    },1000); 
    setTimeout(() => {
        this.initLine();
    }, 1500); 
  }

//用户标注准确率
userMarkAccuracy = () => {
    const { knowid_info,resourceid_info } = this.props;
    console.log(resourceid_info);
    console.log(knowid_info);
    console.log("资源知识点信息");
    let ajaxTimeOut = $.ajax({
        url:"/api_v1.1/mark_management/userMarkAccuracy",
        type: "GET",
        dataType: "json",
        timeout:2000,
        data:{ "knowid":knowid_info, "r_id": resourceid_info },
        success: function (data) {
            if (data.errorCode == '0') {
              console.log('用户标注准确率');
              console.log(data);
              this.setState({ 
                userList: data.msg[0],
                userAccuracy: data.msg[1]
               }); 
               console.log('this.state.userList')
               console.log(this.state.userList) 
               console.log('this.state.userAccuracy') 
               console.log(this.state.userAccuracy)              
            }
            else {           
              console.log('用户准确率相关记录不存在');
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

 //通过资源id、知识点id获取众智详情
 peopleMarkDetail = () => {
  const { knowid_info,resourceid_info } = this.props;
  console.log(resourceid_info);
  console.log(knowid_info);
  console.log("资源知识点信息");
  let ajaxTimeOut = $.ajax({
      url:"/api_v1.1/knowledge_resource/peopleMarkDetail_v1_1",
      type: "GET",
      dataType: "json",
      timeout:2000,
      data:{ "knowid":knowid_info, "r_id": resourceid_info },
      success: function (data) {
          if (data.errorCode == "0") {
            console.log(data);
            console.log('data.msg.length')
            console.log(data.msg.length)
            var i;
            var j=0;
            for(i=0;i<data.msg.length;i++){
                update_times[j] = data.msg[i].update_time.replace(/[A-Z]/g," ").replace(/\.000/g,"")
                // update_times[j] = new Date(Date.parse(data.msg[i].update_time.replace(/[A-Z]/g," ").replace(/\.000/g,"")) + 8*60*60).toLocaleString()
                j++;
            }
            console.log('update_times更新时间组')
            console.log(update_times)
            this.setState({ 
              peopleMarkDetail1: data.msg,
              r_desc: data.msg[0].r_desc,
              r_name: data.msg[0].r_name.replace(/^[1-9]/,"").replace(/^、/,"")
             });   
          }
          else {           
            console.log('获取众智详情失败');
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
 //通过资源id、知识点id获取众智详情
 knowledgeInformation = () => {
  const { knowid_info } = this.props;
  console.log(knowid_info);
  let ajaxTimeOut = $.ajax({
      url:"/api_v1.1/knowledge/getKnowledgeNodeInformations",
      type: "GET",
      dataType: "json",
      timeout:2000,
      data:{ "knowid":knowid_info},
      success: function (data) {
          if (data.errorCode == 0) {
            console.log('成功获取知识点id信息');
            console.log(data);
            this.setState({ 
              title: data.msg.title
             });
            console.log(this.state.title);                 
          }
          else {           
            console.log('获取知识点信息失败');
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

 //获取用户标注记录
 userCreditRecord = () => {
    const { login_info } = this.props;
    let ajaxTimeOut = $.ajax({
        url:"/api_v1.1/mark_management/userCreditRecord",
        type: "GET",
        dataType: "json",
        timeout:2000,
        data:{ "uid":login_info.userid},
        success: function (data) {
            if (data.errorCode == '0') {
              console.log('用户置信度历史信息');
              var i;
              var j=0;
             
              for(i=0;i<data.msg[0].length;i++){
                marktimes[j] = data.msg[0][i].replace(/[A-Z]/g," ").replace(/\.000/g,"")
                //   marktimes[j] = new Date(Date.parse(data.msg[0][i].replace(/[A-Z]/g," ").replace(/\.000/g,"")) + 8*60*60).toLocaleString()
                  j++;
              }
              console.log('marktimes更新时间组1111')
              console.log(marktimes)
              this.setState({ 
                marktime: data.msg[0],
                usercredit: data.msg[1]
               }); 
               console.log('usercredit组111')  
               console.log(this.state.usercredit)            
            }
            else {           
              console.log('用户相关记录不存在');
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

  render(){
    let isABCD;
    var regString = /[A-D]+/;  
    var regString1 = /span/;  
    if(regString1.test(this.state.r_desc) && regString.test(this.state.r_desc) || regString1.test(this.state.r_desc) || regString.test(this.state.r_desc)){ 
      isABCD = (
          <p dangerouslySetInnerHTML={{__html: this.state.r_name + this.state.r_desc}}></p>  
      )
    }else{ 
        isABCD = (
            <p>
              <p dangerouslySetInnerHTML={{__html:this.state.r_desc}}></p>  
            </p>
      )            
    }

       const peopleMarkDetailList = this.state.peopleMarkDetail1.map((v, i) => {
          const columns = [{
            title: '标注者',
            dataIndex: '标注者',
            key: '标注者',
            width: 120,
          }, {
            title: '标注权重',
            dataIndex: '标注权重',
            key: '标注权重',
            width: 120,
          }, {
            title: '用户信用',
            dataIndex: '用户信用',
            key: '用户信用',
            width: 120,
          }, {
            title: '更新时间',
            dataIndex: '更新时间',
            key: '更新时间',
            width: 140,
          }
        ];
          const data = [{
            key: 'i',
            标注者: v.username,
            标注权重: v.weight,
            用户信用: v.user_credit,
            更新时间: update_times[i]
          }];

        return (       
            <Table columns={columns} dataSource={data} pagination={false} showHeader={false} size="middle"/>                   
        );
    }
    );
  const { width = "100%", height = '350px' } = this.props
  return(
      <Card>
      <Row>
        <Col span={22}>
        <Form>
             <FormItem
                        label={<span style={{ fontWeight: 'bold' }}>知识点</span>}
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 15 }}
                        hasFeedback
                        style={{ marginBottom: '5px' }}
                      > 
                      <p>{this.state.title}</p>
            </FormItem>
            <FormItem
                        label={<span style={{ fontWeight: 'bold' }}>资源详情</span>}
                        labelCol={{ span:2 }}
                        wrapperCol={{ span: 15 }}
                        hasFeedback
                        style={{ marginBottom: '5px' }}
                      > 
                      <p>{isABCD}</p>
            </FormItem>
      </Form>
      </Col>
      <Col span={1}><Link to="/App/MyTask"><Button type="primary" >返回上一级</Button></Link></Col>
      </Row>
      <Row>
          <Col span={13}>
             <Card>
               <div ref={ID => this.ID = ID} style={{ width, height }}></div>
               <div ref={ID1 => this.ID1 = ID1} style={{ width, height }}></div>
            </Card>
          </Col>
          <Col span={1}></Col>
          <Col span={10}>
             <Card  style={{minHeight:745}} title={<p>
                        <Row span={24}>
                            <Col span={6}>标注用户</Col>
                            <Col span={6}>标注权重</Col>
                            <Col span={6}>用户信用</Col>
                            <Col span={6}>更新时间</Col>
                        </Row>
                    </p>} >                  
                     <p>{peopleMarkDetailList}</p>
                  </Card>
          </Col>
      </Row>
        </Card>       
        );
    }
}

 function mapStateToProps(state) {
  return {
      resourceid_info: state.reducer_resourceid.resourceid_info,
      knowid_info: state.reducer_knowid.knowid_info,
      login_info: state.reducer_login.login_info
  };
}


function mapDispatchToProps(dispatch) {
  return {
     
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyTaskInformation);