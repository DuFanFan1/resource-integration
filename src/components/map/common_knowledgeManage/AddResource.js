import React, { Component } from 'react';
import { Select, Breadcrumb, Icon,Input, Dropdown,Button,Tabs,Table,Card,Collapse, Col, Row, Checkbox,Modal, Form } from 'antd';
import {Link} from 'react-router-dom';
import $ from 'jquery';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const Panel = Collapse.Panel;
const Option = Select.Option;
const confirm = Modal.confirm;
const buttoncolor = {
  color:"#fff",
  background:"#2a95de",
  border:"#2a95de",
}
const customPanelStyle = {
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
};

class AddResource extends Component {

  static contextTypes = {
    router: PropTypes.object
}
constructor(props, context) {
    super(props, context)
    this.state = {
        "r_id":4,
        knowtitles:["分数"],
        auto_weight:[],
        expert_mark_weight:[],
        knowresweight:[{
          "title":null,
          "weight":0.5,
          "knowid":1
        }],
        getKnowledge:[
          {
            "title":"",
            "addtime":"",
          }
        ],
        getKnowledge_export:[
          {
             "knowledge_name":"",
          }
        ],
    }
  }

onload(){
    $("#selectedknow1").hide();
    $("#selectedknow").hide();
}
  componentDidMount() {
    this.onload(); 
  }
  componentWillReceiveProps(nextProps) {
    console.log("打印nextProps");
    console.log(nextProps);
    console.log(nextProps.knowledgeInfo.knowledge_id);
    this.setState({
      knowledge_title:nextProps.knowledgeInfo.knowledge_name,
    });
    this.getknowids(nextProps.knowledgeInfo);
  }
//添加自动关联的知识点
addRelateKnowledge_autoweight = () => {  
  console.log('进入添加自动关联知识点') ;
  const { autoknowid_info } = this.props;
  console.log( autoknowid_info);
  console.log(this.state.r_id);
 $.ajax({
    url: "/api_v1.1/knowledge_res_relation/addRelateKnowledge_autoweight_v1_1",
     type: "POST",
     dataType: "json",
     data: { 
       "knowid":autoknowid_info,
       "r_id":this.state.r_id,   //这里需要根据当前添加的r_id确定
      "auto_weight":JSON.stringify(this.state.auto_weight)
     },
     success: function (data) {
         if (data.errorcode == '1') {
             console.log('修改自动权重failure');
         }
         else {
             console.log('修改自动权重success');
             this.success();
         }
     }.bind(this),
     error: function (xhr, status, err) {
     }.bind(this)
 });
}

getknowids(knowledgeInfo){
   const getKnowledge_export1=this.state.getKnowledge_export;
   getKnowledge_export1.push(knowledgeInfo);
   var res1 = [];
   for(var i=0; i < getKnowledge_export1.length; i++){
     var item = getKnowledge_export1[i]
     res1.indexOf(item)===-1 && res1.push(item)
   }
   console.log(res1);
   console.log("去重");
   console.log(getKnowledge_export1);
   this.setState({
    getKnowledge_export:res1
  }) 
  console.log(this.state.getKnowledge_export);
  console.log("点击知识点数组");
  }
 
//手动点击echarts中知识点进行添加
addRelateKnowledge = () => {
  const { echartknowid_info } = this.props;
  const { resourceid_info } = this.props;
  console.log(echartknowid_info);
  console.log(this.state.expert_mark_weight);
  $.ajax({
    url:"/api_v1.1/knowledge_res_relation/addRelateKnowledgeWeight_v1_1",
    type: "POST",
    dataType: "json",
    data:({
      "knowid":echartknowid_info,       
      "r_id": this.state.r_id,
      "expert_mark_weight":JSON.stringify(this.state.expert_mark_weight)
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
    }.bind(this)
  });
}
//发送echart点击得到的关联知识点id
sendechartKnowid(id){
  var countsCheckBox1 = $('input[name="demo"]:checked');  
  var knowledgesid_export = [];  
  for(var i=0;i<countsCheckBox1.length;i++){  
    id = {};  
    id['id'] = countsCheckBox1[i].value;  
    knowledgesid_export[i] = id;  
  }  
  const { setechartKnowidState } = this.props;
  setechartKnowidState({
    type: 'GetechartKnowidSuccess',
    payload: JSON.stringify(knowledgesid_export)
  });
}
//发送推荐的关联知识点id
sendAutoKnowid(id){
  var countsCheckBox = $("input[type='checkbox']:checked"); 
  // var countsCheckBox1 = $('input[name="test"]:checked');  
  var knowledgeid = [];  
  for(var i=0;i<countsCheckBox.length;i++){  
    id = {};  
    id['id'] = countsCheckBox[i].value;  
    knowledgeid[i] = id;  
  }  
  const { setAutoKnowidState } = this.props;
  setAutoKnowidState({
    type: 'GetAutoKnowidSuccess',
    payload: JSON.stringify(knowledgeid)
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

//修改资源关联知识点自动权重
calculateResourceWeight(e) {   
  console.log('进入自动计算知识点权重') ;
 $.ajax({
    url:"/api_v1.1/apiPackage/knowResWeight",
     type: "GET",
     dataType: "json",
     data: { 
       "rcontent":"除法"  //根据资源描述信息自动关联知识点
     },
     success: function (data) {
      if (data.erroCode == '0') {
        console.log('成功获取自动推送知识点信息');
        this.setState({ 
          knowresweight: data.msg,
        });
        console.log(this.state.knowresweight);  
        $("#selectedknow").show(); 
        $("#selectedknow1").show();     
      }
      else {
        console.log('没有数据1111111');
      }
  }.bind(this),
  error: function (xhr, status, err) {
  }.bind(this)
 });
}

changer_desc(e) { this.setState({ r_desc: e.target.value }); }//资源描述信息
changeweight(e) { this.setState({ weight: e.target.value }); }//资源关联知识点权重
changemenuweight(e) { this.setState({ menuweight: e.target.value }); }//资源关联知识点权重

 //添加资源成功弹出框
 success() {
  Modal.success({
    title: '添加成功',
  });
}
//使用ajax方式添加带文件资源
AddResource = () => {  
    var formData = new FormData($( "#uploadForm" )[0]);  // 要求使用的html对象
    $.ajax({  
         url: '/api_v1.1/upload/addResource_v1_1' ,  
         type: 'POST',  
         data: formData,  
         async: true,  
         // 下面三个参数要指定，如果不指定，会报一个JQuery的错误 
　　　　　cache: false,  
         contentType: false,  
         processData: false,  
         success: function (data) {
              if (data.errorcode == '1') {
                    console.log('添加资源failure');
               }
              else {
                    console.log('添加资源success');
                    console.log(data.r_id);
                    this.setState({ 
                        r_id: data.r_id
                    });
                    this.success();
              }
                }.bind(this),
                error: function (xhr, status, err) {
                }.bind(this)
            }); 
} 
 //添加资源成功弹出框
 success1() {
  Modal.success({
    title: '导入成功',
  });
}
//批量导入
batchImportResource = () => {  
  var formData = new FormData($( "#uploadzip" )[0]);  // 要求使用的html对象
  $.ajax({  
       url: '/api_v1.1/upload/batchImportResource_v1_1' ,  
       type: 'POST',  
       data: formData,  
       async: true,  
       // 下面三个参数要指定，如果不指定，会报一个JQuery的错误 
　　　　cache: false,  
       contentType: false,  
       processData: false,  
       success: function (data) {
            if (data.errorcode == '0') {
                  console.log('批量导入资源成功');
                  this.success1();
             }
            else {
                  console.log('批量导入失败');
            }
              }.bind(this),
              error: function (xhr, status, err) {
              }.bind(this)
          }); 
} 

render(){
  const knowresweightList = this.state.knowresweight.map((v, i) => {
    return (
      <div>
              <Panel header={<p style={{ paddingBottom: '10px'}} disabled>
                    <Row span={24}>
                          <Col span={2} onClick={this.sendAutoKnowid.bind(this,v.knowid)}>
                              <input type="checkbox" value={v.knowid}></input>
                          </Col>
                          <Col span={10}>{v.title}</Col>
                          <Col span={5}>
                          <Input size="small" placeholder="0-1之间" style={{width:60}} onPressEnter={this.InputAutoWeightChange.bind(this)}/>
                          </Col>
                    </Row>
                </p>} style={customPanelStyle}>
              </Panel>
      </div>
    );}
  );

  const knowresweightList_export = this.state.getKnowledge_export.slice(3).map((v, i) => {
    return (
      <div>
              <Panel header={<p style={{ paddingBottom:'10px'}} disabled>
                    <Row span={24}>
                           <Col span={2} onClick={this.sendechartKnowid.bind(this,v.knowledge_id)}>
                              <input type="checkbox" name="demo" value={v.knowledge_id}></input>
                          </Col> 
                          <Col span={6}>{v.knowledge_name}</Col>
                          <Col span={5}>
                          <Input size="small" placeholder="0-1之间" style={{width:60}} onPressEnter={this.InputExpertWeightChange.bind(this)}/>
                          </Col>
                    </Row>
                </p>} style={customPanelStyle}>
              </Panel>
      </div>
    );}
  );
const { getFieldProps } = this.props.form;
  return(    
      <Card>
        <Tabs defaultActiveKey="1">
         <TabPane tab="单条导入" key="1">
         <div>
          <Row>
            <Col span={24}>
            <Card>
            <form id= "uploadForm">  
             {/*使用form表单的形式提交带文件表单
             <form action="/resource/addResource_v1_0" method="post" encType="multipart/form-data" target="nm_iframe"> */}
                     <FormItem
                        label="资源名称"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        hasFeedback
                      > 
                      <Input type="text" name="r_name"/> 
                     </FormItem>
                     <FormItem
                        label="资源描述"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        hasFeedback
                      > 
                      <Input type="text" name="r_desc"/> 
                     </FormItem>
                     <FormItem
                        label="资源类型"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        hasFeedback
                      >
                        <Select name="rtype">
                          <option value="素材">素材</option>
                          <option value="课件">课件</option>
                          <option value="试卷">试卷</option>
                          <option value="试题">试题</option>                         
                        </Select>
                      </FormItem>
                      <FormItem
                        label="资源内容"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        hasFeedback
                        >
                         <Input type="file" name="file"/>
                      </FormItem>
                      <FormItem
                        label="语言"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        hasFeedback
                      >
                      <Select defaultValue="中文" name="r_language">
                          <option value="中文">中文</option>
                          <option value="英文">英文</option>
                      </Select>                     
                      </FormItem>
                      <FormItem
                        label="领域"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        hasFeedback
                      >
                      <Select name="field">
                         <option value="基础教育">基础教育</option>
                         <option value="高等教育">高等教育</option>
                         <option value="成人教育">成人教育</option>
                    </Select>                    
                      </FormItem>
                      <FormItem
                        label="适用年级"
                        labelCol={{ span:6 }}
                        wrapperCol={{ span: 18 }}
                        hasFeedback
                      >
                      <Select name="grade">
                      <option value="高中">高中</option>
                      <option value="初中">初中</option>
                      <option value="小学">小学</option>
                    </Select>          
                      </FormItem>
                      <FormItem
                        label="学科"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        hasFeedback
                      >
                      <Select  name="subject">
                          <option value="数学">数学</option>
                          <option value="语文">语文</option>
                          <option value="英语">英语</option>
                          <option value="物理">物理</option>
                          <option value="生物">生物</option>
                    </Select>    
                      </FormItem>
                      <FormItem
                        label="难度"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        hasFeedback      
                      >
                      <Select name="difficulty">
                      <option value="简单">简单</option>
                      <option value="中等">中等</option>
                      <option value="困难">困难</option>
                    </Select>
                      </FormItem>
                      <FormItem
                        label="关键字"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        hasFeedback
                      > 
                      <Input type="text" name="r_key"/> 
                     </FormItem>
                     <FormItem
                        label="目的"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        hasFeedback
                      > 
                      <Input type="text" name="purpose"/> 
                     </FormItem>
                     <FormItem
                        label="评注"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18}}
                        hasFeedback
                      > 
                      <Input name="annotation"  onChange={this.calculateResourceWeight.bind(this)}/> 
                     </FormItem>
                     <Row><Col span={9}></Col>
                     <Col><Button style={buttoncolor}  onClick={this.AddResource}>提交</Button></Col></Row>
               </form>     
                 <Card title="自动关联" bordered={false} style={{ width:"100%" }}>
                   <p id="selectedknow">
                     {knowresweightList} 
                     <Col span={8}/><Button type="default" onClick={this.addRelateKnowledge_autoweight}>确定</Button>
                  </p>               
                </Card> 
                <Card title="手动添加" bordered={false} style={{ width:"100%" }}>
                      <p id="selectedknow1">
                         {knowresweightList_export}
                         <Col span={8}/><Button type="default" onClick={this.addRelateKnowledge}>确定</Button>
                      </p>  
            </Card> 
               <Col span={8}/>
            </Card>
            </Col>
          </Row>
         </div>
         </TabPane>
         <TabPane tab="批量导入" key="2"> 
           <Row>
           <Col span={24}>
           <Card>
           <form id="uploadzip">
                      <FormItem
                        label="点击下载模板"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        hasFeedback
                      >   
                      <a href="http://192.168.71.201:8080/template/resource_model.zip">                    
                          <Button>
                            <Icon type="download" />下载
                          </Button>
                      </a>                       
                      </FormItem>
                      <FormItem
                        label="请选择导入的文件"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        hasFeedback
                      >
                         <Input type="file" name="zip"/>
                        {/* <Button style={buttoncolor} onClick={this.batchImportResource}>确定</Button><br/> */}
                      </FormItem>
                      <FormItem
                        label=""
                        labelCol={{ span:8 }}
                        wrapperCol={{ span: 16 }}
                        hasFeedback
                      >
                        <Col span={6}/><Button style={buttoncolor} onClick={this.batchImportResource}>确定</Button>
                      </FormItem>
              </form>
              </Card>
            </Col>
            </Row>
         </TabPane>
       </Tabs>
        </Card>
        );
    }
}
AddResource = Form.create()(AddResource);
 function mapStateToProps(state) {
    return {
      knowledgeInfo: state.reducer_map_knowledge.knowledgeInfo,
      autoknowid_info: state.reducer_autoknowid.autoknowid_info,
      echartknowid_info: state.reducer_echartknowid.echartknowid_info,
    };
  }
  
  
  function mapDispatchToProps(dispatch) {
    return {
      setAutoKnowidState: (state) => dispatch(state),
      setechartKnowidState:(state) =>dispatch(state),
    };
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddResource);
  