import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import $ from 'jquery';
import { Row, Col, Card, Breadcrumb, Button, Form, Select, Checkbox, Input, Icon, Modal,Collapse,Alert } from 'antd';
import { Link, HashRouter } from 'react-router-dom'
import echarts from 'echarts-diy-yukipedia/lib/echarts' //必须
import 'echarts-diy-yukipedia/lib/component/tooltip'
import 'echarts-diy-yukipedia/lib/component/legend'
import 'echarts-diy-yukipedia/lib/chart/pie'
import 'echarts-diy-yukipedia/lib/chart/graph'
import { connect } from 'react-redux';
import PropTypes from "prop-types";
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const buttoncolor = {
    color:"#fff",
    background:"#2a95de",
    border:"#2a95de",
}

 //复选框 
function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
} 

class ResKnowRelationMap1 extends Component {
    //添加关联知识点弹出框处理
   state = { visible: false }
   showModal = () => {
   this.setState({
    visible: true,
   });
   }
   handleOk = (e) => {
    const { resourceid_info } = this.props;
   console.log(e);
   this.setState({
    visible: false,
    echartsoption: {
        ifAdd: true,
        newname:this.state.searchknowid_title,
      },
  });
      this.addRelateKnowledge();
      setTimeout(() => {
        this.getdata(resourceid_info);
        this.initPie();
    }, 1000);
      $("#content").load(location.href + ' #content>*'); 
      console.log("局部刷新成功");
   }
   handleCancel = (e) => {
   console.log(e);
   this.setState({
    visible: false,
   });
 }

 //自动添加Model
 state = {
    modal1Visible: false,
    modal2Visible: true,
  }
  setModal1Visible(modal1Visible) {
    this.setState({ modal1Visible });
    this.calculateResourceWeight();
  }
  setModal2Visible(modal2Visible) {
    const { resourceid_info } = this.props;
    this.setState({ 
      modal2Visible,
      modal1Visible: false,
      echartsoption: {
        ifAdd: true,
        newname:this.state.searchknowid_title,
      },
     });
     this.addRelateKnowledge_autoweight();
     setTimeout(() => {
        this.getdata(resourceid_info);
        this.initPie();
    }, 1000);
     $("#content1").load(location.href + ' #content1>*'); 
     console.log("局部刷新成功111");
  }

    static contextTypes = {
        router: PropTypes.object
    }
     // 状态机
    constructor(props, context) {
        super(props, context)
        this.initPie = this.initPie.bind(this)
        this.state = {
            visible: false,
            resource:'',
            allPages: -1,
            current: 1,
            searchknowid_title:'',
            auto_weight:[],
            posts: [],
            expert_mark_weight:[],
            echartsoption: {
                ifAdd: false,
                selectcategory: 0,
                newcategory: 1,
                newname: ''
              },
            know_resource:  [
              {
                "r_id" : 4,
              }
            ],
            getKnowledge:[
              {
                "title":"",
                "addtime":"",
              }
            ],
            getknowid: 4,
            Display: "none",
            optionData: [{
                dataindex:1,
            }],
            knowresweight:[{
                "title":null,
                "weight":null,
                "knowid":null
              }],
            "rcontent":"除法"
        }
    }

 componentDidMount() {
    const { resourceid_info } = this.props;
    this.getdata(resourceid_info); 
    this.ResourceInformation(resourceid_info);
    this.calculateResourceWeight();
}
componentWillReceiveProps(){
    const { resourceid_info } = this.props;
    this.getdata(resourceid_info); 
    this.ResourceInformation(resourceid_info);
    this.initPie();
}
componentDidUpdate() {   
    this.initPie();
}
  //获取资源关联知识点知识地图
getdata(resourceid_info) {
    let ajaxTimeOut = $.ajax({
    url:"/api_v1.1/knowledge_res_relation/getRelationKnowledge_v1_1",
    type: "GET",
    dataType: "json",
    timeout:2000,
    data:{"r_id":resourceid_info,"count": 100, "page": 1},
    success: function (data) {
      if (data.errorcode == '1') {
        console.log('不存在该资源关联的知识点');
        this.setState({ optionData: [{ value: '关联知识点', draggable: true, category: 0, }] });
        console.log(this.state.optionData);
      }
      else {   
        console.log('成功获取资源的关联知识点');
        console.log('成功获取reducer资源的关联知识点');
        console.log(data);
        data.msg.unshift({ value: '关联知识点', draggable: true, category: 0, })
        console.log(data.msg);
        this.setState({ 
            optionData: data.msg ,
            resource: data.msg[1].file_url,
            allPages: data.allpages,
        });
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
    const Relationmapsource = {
        series: [
            {
                type: 'graph',
                layout: 'force',
                // 节点大小
                symbolSize: 60,
                // focusNodeAdjacency: true,
                roam: true,
                categories: [{
                    name: '一级节点',
                    itemStyle: {
                        normal: {
                            color: "#26c6da", //颜色
                        }
                    }
                },
                {
                    name: '二级节点',
                    itemStyle: {
                        normal: {
                            color: "#2a95de",
                        }
                    }
                },
                {
                    name: '二级节点',
                    itemStyle: {
                        normal: {
                            color: "#f2b368",
                        }
                    }
                },
                ],
                label: {
                    normal: {
                        show: true,
                        position: 'top',//设置label显示的位置
                        formatter: '{c}',//设置label读取的值为value
                        // formatter: '{c}',//设置label读取的值为value
                        textStyle: {
                            fontSize: 12
                        },
                    }
                },
                //放大程度
                force: {
                    repulsion: 1000
                },
                edgeSymbolSize: [4, 50],
                // 数据
                data: this.state.optionData,
                // 建立关系
                links: [{
                    source: 0,
                    target: 1,
                   
                }, {
                    source: 0,
                    target: 2,
                      
                }, {
                    source: 0,
                    target: 3,
                      
                }, {
                    source: 0,
                    target: 4,
                   
                }, {
                    source: 0,
                    target: 5,
                }, {
                    source: 0,
                    target: 6,
                }, {
                    source: 0,
                    target: 7,
                    
                }, {
                    source: 0,
                    target: 8,
                }, {
                    source: 0,
                    target: 9,
                }, {
                    source: 0,
                    target: 10,
                    
                },
                {
                    source: 0,
                    target: 11,
                },{
                    source: 0,
                    target: 12,
                },{
                    source: 0,
                    target: 13,
                },{
                    source: 0,
                    target: 14,
                },{
                    source: 0,
                    target: 15,
                },{
                    source: 0,
                    target: 16,
                },{
                    source: 0,
                    target: 17,
                },
                ],
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
    var ifAdd = this.state.echartsoption.ifAdd;
    var selectcategory = this.state.echartsoption.selectcategory;
    var newname = this.state.echartsoption.newname;
    var newcategory = this.state.echartsoption.newcategory;
    
    this.ID.oncontextmenu = function () {   //屏蔽原本右键“保存图片”等事件
        return false;
    }
    let props = this.props
    //设置options
    myChart.setOption(Relationmapsource);
    if(ifAdd){
        addNode();
    }
    // 双击事件
    myChart.on('dblclick', dblClick.bind(this))
    function dblClick(param) {
        clearTimeout(TimeFn)
        // alert("只触发了双击事件")
        console.log('echarts单击成功')
        console.log('param.data')
        console.log(param.data)
        const { setKnowidState } = this.props;
        setKnowidState({
          type: 'GetKnowIDSuccess',
          payload: param.data.knowid,
      });
        this.context.router.history.push("/App/RelationInformation");
        
    }

    function addNode() {
        let options = myChart.getOption();//获取已生成图形的Option param
        myChart.setOption(options);
    }
  }
  //根据学科关键字查询知识点
getKnowledgeByKeywords = () => {
    let ajaxTimeOut = $.ajax({
        url:"/api_v1.1/knowledge/getKnowledgeByKeywords_v1_1",
        type: "GET",
        dataType: "json",
        timeout:2000,
        data: {
            "subject": this.props.form.getFieldValue('subject'),
            "keywords": this.props.form.getFieldValue('keywords'),
        },
        success: function (data) {
            if (data.errorCode == 0) {
              console.log('成功获取搜索资源');
              this.setState({ 
                getKnowledge: data.msg,
              });
              console.log(this.state.getKnowledge);           
            }
            else {
              console.log('没有数据');
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
  // 弹出框-添加关联知识点成功
    success() {
      confirm({
        title: '添加成功',
        onOk() {
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }

    InputExpertWeightChange(e){ 
        const expert_mark_weight1=this.state.expert_mark_weight; 
        expert_mark_weight1.push(e.target.value) 
        console.log(expert_mark_weight1);
        this.setState({
            expert_mark_weight:expert_mark_weight1
        });
          console.log(JSON.stringify(this.state.expert_mark_weight));
       }
       InputAutoWeightChange(e){ 
        const auto_weight1=this.state.auto_weight; 
        auto_weight1.push(e.target.value) 
        console.log(auto_weight1);
        this.setState({
          auto_weight:auto_weight1
        });
          console.log(JSON.stringify(this.state.auto_weight));
       }
//添加关联知识点
addRelateKnowledge = () => {
    const { searchknowid_info } = this.props;
    const { resourceid_info } = this.props;
    console.log(searchknowid_info);
    console.log(this.state.expert_mark_weight);
    let ajaxTimeOut = $.ajax({
      url:"/api_v1.1/knowledge_res_relation/addRelateKnowledgeWeight_v1_1",
      type: "POST",
      dataType: "json",
      timeout:2000,
      data:({
         "knowid":searchknowid_info,      
        "r_id": resourceid_info,
        "expert_mark_weight": JSON.stringify(this.state.expert_mark_weight)
      }
      ),
      success: function (data) {
        console.log('添加关联知识点成功');
        console.log(data);
        if (data.errorCode == "0") {
           console.log('添加关联知识点失败'); 
          }
        else { 
          console.log('添加关联知识点成功');
          this.success();
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

  //修改资源关联知识点自动权重
addRelateKnowledge_autoweight = () => {  
    console.log('进入修改资源关联知识点自动权重') ;
    const { recommendedknowid_infogroup } = this.props;
    const { resourceid_info } = this.props;
    let ajaxTimeOut = $.ajax({
       url: "/api_v1.1/knowledge_res_relation/addRelateKnowledge_autoweight_v1_1",
       type: "POST",
       dataType: "json",
       timeout:2000,
       data: { 
         "knowid":recommendedknowid_infogroup,
         "r_id":resourceid_info,   
         "auto_weight":JSON.stringify(this.state.auto_weight)
       },
       success: function (data) {
           if (data.errorcode == '1') {
               console.log('修改自动权重failure');
           }
           else {
               console.log('修改自动权重success');
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
  //显示资源关联知识点自动权重
  calculateResourceWeight(e) {   
    console.log('进入自动计算知识点权重') ;
    let ajaxTimeOut = $.ajax({
        url:"/api_v1.1/apiPackage/knowResWeight",
        type: "GET",
        dataType: "json",
        timeout:2000,
        data: { 
          "rcontent":this.state.r_name   //根据资源描述信息自动关联知识点
        },
        success: function (data) {
            if (data.erroCode == '0') {
              console.log('成功自动推送知识点信息');
              this.setState({ 
                knowresweight: data.msg,
              });
              console.log(this.state.knowresweight);        
            }
            else {
              console.log('没有数据1111111');
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
   //发送推荐的关联知识点id
sendRecommendKnowid(id){
    var countsCheckBox_1 = $("input[type='checkbox']:checked");  
    var knowledgeid = [];  
    for(var i=0;i<countsCheckBox_1.length;i++){  
      id = {};  
      id['id'] = countsCheckBox_1[i].value;  
      knowledgeid[i] = id;  
    }  
    const { setRecommendKnowidStategroup } = this.props;
    setRecommendKnowidStategroup({
      type: 'GetRecommendedKnowidSuccessgroup',
      payload: JSON.stringify(knowledgeid)
    });
  }
  
  //根据资源id查看资源详情
  ResourceInformation(resourceid_info) {
    let ajaxTimeOut = $.ajax({
     url:"/api_v1.1/knowledge_resource/resourceDetail_v1_1",
      type: "GET",
      dataType: "json",
      timeout:2000,
      async:false,
      data:{"r_id":resourceid_info},
      success: function (data) {
        console.log('成功获取reducer传过来的资源id');
        if (data.errorCode == '0') {
            console.log('成功获取该资源');
            console.log(data);
            this.setState({ 
                resource: data.msg[0],
                file_url: data.msg[0].file_url,
                r_desc: data.msg[0].r_desc,
                r_name: data.msg[0].r_name.replace(/^[1-9]/,"").replace(/^、/,""),
                rtype: data.msg[0].rtype,
                field: data.msg[0].field,
                subject: data.msg[0].subject,
                grade: data.msg[0].grade,
             }); 
            console.log(this.state.resource);  
            console.log(this.state.resource.file_url);
            console.log(this.state.rtype);
            console.log("数据库中路由");   
        }
        else {  
            console.log('资源不存在');    
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
  

//发送检索到的关联知识点id
sendSearchKnowid(id){
    var countsCheckBox = $("input[type='checkbox']:checked");  
    var knowledgesid = [];  
    for(var i=0;i<countsCheckBox.length;i++){  
      id = {};  
      id['id'] = countsCheckBox[i].value;  
      knowledgesid[i] = id;  
    }  
    const { setSearchKnowidState } = this.props;
    setSearchKnowidState({
      type: 'GetSearchKnowidSuccess',
      payload: JSON.stringify(knowledgesid)
    });
  }

 render() {
    let isABCD;
    var regString1 = /span/;
    var regString = /[A-D]+/;   
   if (regString1.test(this.state.r_desc) && regString.test(this.state.r_desc) || regString.test(this.state.r_desc) || regString1.test(this.state.r_desc)) {
        isABCD = (
                <Form>
                   <FormItem
                         label={<span style={{ fontWeight: 'bold' }}>资源描述</span>}
                         labelCol={{ span: 5 }}
                         wrapperCol={{ span: 16}}
                         hasFeedback
                         style={{ marginBottom: '5px' }}
                    >
                      <p dangerouslySetInnerHTML={{__html:this.state.r_name + this.state.r_desc}}></p>
                   </FormItem>
            </Form>
      )            
    }else{
        isABCD = (
            <Form>
                <FormItem
                     label={<span style={{ fontWeight: 'bold' }}>资源名称</span>}
                     labelCol={{ span: 5}}
                     wrapperCol={{ span: 16}}
                     hasFeedback
                     style={{ marginBottom: '5px' }}
                >
                <span >{this.state.r_name}</span>
               </FormItem>
               <FormItem
                     label={<span style={{ fontWeight: 'bold' }}>资源描述</span>}
                     labelCol={{ span: 5 }}
                     wrapperCol={{ span:16}}
                     hasFeedback
                     style={{ marginBottom: '5px' }}
                >
               <p dangerouslySetInnerHTML={{__html:this.state.r_desc}}></p>
               </FormItem> 
        </Form>
  )            
    }
    console.log(this.state.knowresweight.length)
    console.log("this.state.knowresweight")
    let knowresweightList;
    if(this.state.knowresweight.length == 0){
      knowresweightList = (
        <p>
            <Alert
                message="没有自动推荐的知识点"
                type="info"
                showIcon
            />
        </p>
    )
    }else{
     knowresweightList = this.state.knowresweight.map((v, i) => {
        return (
          <div>
                  <Panel header={<p style={{ paddingBottom: '10px'}} disabled>
                  <Row span={24}>
                        <Col span={6} onClick={this.sendRecommendKnowid.bind(this,v.knowid)}>
                        <input type="checkbox" value={v.knowid}></input>
                        </Col>
                        <Col span={12}>{v.title}</Col>
                        <Col span={6}>
                        <Input size="small" placeholder={v.weight} style={{width:60}}  onPressEnter={this.InputAutoWeightChange.bind(this)}/>
                        </Col>
                  </Row>
              </p>}>
            </Panel>
          </div>
        );}
      );
    }
        const getKnowledgeList = this.state.getKnowledge.slice(1).map((v, i) => {
            const { getFieldProps } = this.props.form;
            return (
              <div>
                      <Panel header={<p style={{ paddingBottom: '10px'}} disabled>
                            <Row span={24}>
                                 <Col span={1} onClick={this.sendSearchKnowid.bind(this,v.knowid)}>
                                     <input type="checkbox" value={v.knowid}></input>
                                </Col>
                                  <Col span={9}>{v.title}</Col>
                                  <Col span={7}>{v.addtime}</Col>
                                  <Col span={7}>
                                     <Input size="small" placeholder="0-1之间" style={{width:60}}  onPressEnter={this.InputExpertWeightChange.bind(this)}/>
                                  </Col>
                            </Row>
                        </p>}>
                      </Panel>
              </div>
            );}
          );

        const { width = "100%", height = '700px' } = this.props
        const { getFieldProps } = this.props.form;
        return (
        <Row>
          <Row>
          </Row>
          <Row>
             <table style={{float:'right'}}>
                 <tbody>
                     <tr >
                          <td>
                                <Button style={buttoncolor} onClick={this.showModal}>检索添加</Button>
                          </td>
                          <td>
                                <Button style={buttoncolor} onClick={() => this.setModal1Visible(true)}>推荐添加</Button>
                                <Modal
                                title="推荐添加的知识点"
                                style={{ top: 20 }}
                                visible={this.state.modal1Visible}
                                onOk={() => this.setModal2Visible(false)}
                                onCancel={() => this.setModal1Visible(false)}
                            >
                            <div id="content1">
                            <Card title={<p style={{ paddingBottom:'10px'}} >
                                 <Row span={24}>
                                     <Col span={6}>是否添加</Col>
                                     <Col span={12}>知识点名称</Col>
                                     <Col span={6}>关联权重</Col>
                                  </Row>
                                  </p>} bordered>
                                     {knowresweightList}
                            </Card>
                            </div>
                           </Modal>
                        </td>
                         <td><Link to="/App/ResKnowRelationList"><Button style={buttoncolor} >按列表显示</Button></Link></td>
                   </tr>
                </tbody>
             </table>
             <Modal  visible={this.state.visible}
             onOk={this.handleOk}
             onCancel={this.handleCancel}
        >
         <Form >
            <FormItem style={{paddingLeft:20,paddingTop:30}} label="请输入检索条件">  
                <Select style={{ width: 75 }} placeholder="学科" {...getFieldProps('subject') }>
                      <Option value="数学">数学</Option>
                      <Option value="英语">英语</Option>
                      <Option value="地理">地理</Option>
                      <Option value="化学">化学</Option>
                      <Option value="政治">政治</Option>
                      <Option value="物理">物理</Option>
                      <Option value="语文">语文</Option>
                      <Option value="历史">历史</Option>
                </Select>                
              <Input placeholder="关键字" style={{ width: 150}}  {...getFieldProps('keywords') } />     
              <Button type="default" onClick={this.getKnowledgeByKeywords}>检索</Button>
          </FormItem >
         </Form>
         <div>
           <Card title={<p style={{ paddingBottom:'10px'}} >
                 <Row span={24}>
                     <Col span={10}>知识点名称</Col>
                     <Col span={8}>添加时间</Col>
                     <Col span={4}>设置权重</Col>
                 </Row>
                </p>} bordered>
                <div id="content"> {getKnowledgeList} </div>
            </Card>
         </div>
      </Modal> 
     </Row>
     <Card>
         <Row>
            <Col span={7}>
              <Card title={<p style={{ paddingBottom: '10px' }}><Button style={buttoncolor} size="large">资源简介</Button></p>} bordered={true}>
               <Form>
                    <p>{isABCD}</p>
                  <FormItem
                      label={<span style={{ fontWeight: 'bold' }}>资源类型</span>}
                      labelCol={{ span: 5 }}
                      wrapperCol={{ span: 16 }}
                      hasFeedback  
                      style={{ marginBottom: '5px' }} 
                  >
                      <p>{this.state.rtype}</p>
                </FormItem>
                <FormItem
                     label={<span style={{ fontWeight: 'bold' }}>资源领域</span>}
                     labelCol={{ span: 5 }}
                     wrapperCol={{ span: 16 }}
                     hasFeedback  
                     style={{ marginBottom: '5px' }} 
                  >
                      <p>{this.state.field}</p>
               </FormItem>
               <FormItem
                     label={<span style={{ fontWeight: 'bold' }}>学科</span>}
                     labelCol={{ span: 5 }}
                     wrapperCol={{ span: 16 }}
                     hasFeedback  
                     style={{ marginBottom: '5px' }} 
                  >
                   <p>{this.state.subject}</p>
              </FormItem>
              <FormItem
                  label={<span style={{ fontWeight: 'bold' }}>适用年级</span>}
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 16 }}
                  hasFeedback  
                  style={{ marginBottom: '5px' }} 
                  >
                 <p>{this.state.grade}</p>
                 </FormItem>
         </Form>
      </Card>
             </Col>
             <Col span={17}>
             <Card  style={{paddingRight:80, paddingLeft:50,paddingTop:20}}>
                    <div ref={ID => this.ID = ID} style={{ width, height:450 }}></div>     
            </Card>    
            </Col> 
      </Row>
    </Card>
 </Row>
    );
}
}
const ResKnowRelationMap = Form.create()(ResKnowRelationMap1)
function mapStateToProps(state) {
    return {
      resourceid_info: state.reducer_resourceid.resourceid_info,
      searchknowid_info: state.reducer_searchknowid.searchknowid_info,
      recommendedknowid_infogroup: state.reducer_recommendedknowidgroup.recommendedknowid_infogroup,
    };
  }
  
  
  function mapDispatchToProps(dispatch) {
    return {
      setKnowidState: (state) => dispatch(state),
      setSearchKnowidState: (state) => dispatch(state),
      setRecommendKnowidStategroup: (state) => dispatch(state)
    };
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ResKnowRelationMap);

