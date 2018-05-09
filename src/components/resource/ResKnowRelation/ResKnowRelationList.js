import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import $ from 'jquery';
import { Layout, Menu, Breadcrumb, Icon,Input,Dropdown,Button,Table,Form,Checkbox,Select,Modal, Alert,Collapse,message,Pagination} from 'antd';
import {Link} from 'react-router-dom';
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

class ResKnowRelationList1 extends Component {
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
   });
  this.addRelateKnowledge();
  setTimeout(() => {
    this.getdata(resourceid_info);
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
   });
   this.addRelateKnowledge_autoweight();
   setTimeout(() => {
    this.getdata(resourceid_info);
}, 1000);
   $("#content1").load(location.href + ' #content1>*'); 
   console.log("局部刷新成功11"); 
}
 static contextTypes = {
  router: PropTypes.object
}

// 状态机
constructor(props,context) {
  super(props,context);
  this.state = {
    visible: false,
    content: null,
    allPages: -1,
    current: 1,
    posts: [],
    expert_mark_weight:[],
    auto_weight:[],
    "rcontent":"除法",
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
    knowresweight:[{
      "title":null,
      "weight":null,
      "knowid":null
    }],
    getknowid: 4,
    resource:'',
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
}

onChange = (page) => {
  const { resourceid_info } = this.props;
  console.log(page);
  let ajaxTimeOut = $.ajax({
    url: "/api_v1.1/knowledge_res_relation/getRelationKnowledge_v1_1",
    type: "GET",
    dataType: "json",
    timeout:2000,
    data: { "r_id":resourceid_info, "count":7, "page": page },
    success: function (data) {
      console.log('data222');
      console.log(data);
      if (data.errorcode == '1') {
        console.log('不存在该资源关联的知识点');
      }
      else {   
        console.log('成功获取资源的关联知识点');
        console.log('成功获取reducer资源的关联知识点');
        this.setState({ 
          know_resource: data.msg ,
          resource: data.msg[0].file_url,
          current: page
        });
        console.log(this.state.know_resource);
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
//获取资源关联知识点列表
getdata(resourceid_info) {
  let ajaxTimeOut = $.ajax({
    url:"/api_v1.1/knowledge_res_relation/getRelationKnowledge_v1_1",
    type: "GET",
    dataType: "json",
    timeout:2000,
    data: { "r_id":resourceid_info, "count":7, "page": 1 },
    success: function (data) {
      console.log(resourceid_info);
      if (data.errorcode == '1') {
        console.log('不存在该资源关联的知识点');
      }
      else {   
        console.log('成功获取资源的关联知识点');
        console.log('成功获取reducer资源的关联知识点');
        this.setState({ 
          know_resource: data.msg ,
          resource: data.msg[0].file_url,
          allPages: data.allpages,
        });
        console.log(this.state.know_resource);
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
        // this.props.add(this.props.know_resource);
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

InputAutoWeightChange(e){ 
  const auto_weight1=this.state.auto_weight; 
  auto_weight1.push(e.target.value) 
  console.log(auto_weight1);
  this.setState({
    auto_weight:auto_weight1
  });
    console.log(JSON.stringify(this.state.auto_weight));
 }
//添加推荐的关联知识点
addRelateKnowledge_autoweight = () => {  
  console.log('进入修改资源关联知识点自动权重') ;
  const { recommendedknowid_info } = this.props;
  const { resourceid_info } = this.props;
  let ajaxTimeOut = $.ajax({
     url: "/api_v1.1/knowledge_res_relation/addRelateKnowledge_autoweight_v1_1",
     type: "POST",
     dataType: "json",
     timeout:2000,
     data: { 
       "knowid":recommendedknowid_info,
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
       "rcontent":this.state.r_name  //根据资源描述信息自动关联知识点
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
            console.log(this.state.resource.r_desc);
            console.log("this.state.r_desc");
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

//发送知识点id
sendKnowId(id){
  console.log('id');
  console.log(id);
  const { setKnowidState } = this.props;
  setKnowidState({
    type: 'GetKnowIDSuccess',
    payload: id
});
this.context.router.history.push("/App/RelationInformation");
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

//发送推荐的关联知识点id
sendRecommendKnowid(id){
  var countsCheckBox_1 = $("input[type='checkbox']:checked");  
  var knowledgeid = [];  
  for(var i=0;i<countsCheckBox_1.length;i++){  
    id = {};  
    id['id'] = countsCheckBox_1[i].value;  
    knowledgeid[i] = id;  
  }  
  const { setRecommendKnowidState } = this.props;
  setRecommendKnowidState({
    type: 'GetRecommendedKnowidSuccess',
    payload: JSON.stringify(knowledgeid)
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
  const know_resource = this.state.know_resource.map((v, i) => {
    return (
      <div>
              <Panel header={<p style={{ paddingBottom: '10px'}} disabled>
                    <Row>
                          <Col span={5}>{v.title}</Col>
                          <Col span={8}>{v.weight}</Col>
                          <Col span={5}>
                              <Button style={buttoncolor} onClick={this.sendKnowId.bind(this,v.knowid)}>查看详情</Button>
                          </Col>
                    </Row>
                </p>}>
              </Panel>
      </div>
    );}
  );
  const getKnowledgeList = this.state.getKnowledge.slice(1).map((v, i) => {
  const { getFieldProps } = this.props.form;
    return (
      <div>
              <Panel header={<p style={{ paddingBottom: '10px'}} disabled>
                    <Row span={24}>
                          <Col span={1} onClick={this.sendSearchKnowid.bind(this,v.knowid)}>
                              <input type="checkbox" value={v.knowid}/>
                          </Col>                          
                          <Col span={9}>{v.title}</Col>
                          <Col span={9}>{v.addtime}</Col>
                          <Col span={5}>
                          <Input size="small" placeholder="0-1之间" style={{width:60}}  onPressEnter={this.InputExpertWeightChange.bind(this)}/>
                          </Col>
                    </Row>
                </p>}>
              </Panel>
      </div>
    );}
  );
  const { getFieldProps } = this.props.form;
      return (
       <Row>
            <Row>
             </Row>
             <Row>
                    <table style={{float: 'right'}}>
                         <tbody>
                            <tr >
                                <td>
                                    <Button style={buttoncolor} onClick={this.showModal}>检索添加</Button>
                                </td>
                                <td>
                                    <Button style={buttoncolor} onClick={() => this.setModal1Visible(true)}>推荐添加</Button>
                                       <Modal
                                           title="推荐添加的知识点"
                                           style={{ top: 200 }}
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
                                <td><Link to="/App/ResKnowRelationMap"><Button style={buttoncolor} >按地图显示</Button></Link></td>
                           </tr>
                        </tbody>
                     </table>
                      <Modal  visible={this.state.visible}
                              style={{ top: 200 }}
                             onOk={this.handleOk}
                             onCancel={this.handleCancel}
                        >
                         <Form>
                            <FormItem style={{paddingLeft:20,paddingTop:30}} label="请输入检索条件">  
                            <Select style={{ width: 75 }} placeholder="学科" {...getFieldProps('subject') }>
                                  <Option value="数学">数学</Option>
                                  <Option value="英语">英语</Option>
                                  <Option value="地理">地理</Option>
                                  <Option value="化学">化学</Option>
                                  <Option value="物理">物理</Option>
                                  <Option value="语文">语文</Option>
                            </Select> 
                                               
                              <Input placeholder="关键字" style={{ width: 150}}  {...getFieldProps('keywords') } />     
                              <Button type="default" onClick={this.getKnowledgeByKeywords}>检索</Button>
                          </FormItem >
                         </Form>
                         <div>
                           <Card title={<p style={{ paddingBottom:'10px'}} >
                                 <Row span={24}>
                                     <Col span={10}>知识点名称</Col>
                                     <Col span={9}>添加时间</Col>
                                     <Col span={5}>设置权重</Col>
                                 </Row>
                                </p>} bordered>
                                <div id="content"> {getKnowledgeList}</div>
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
                 </Col><Col span={1}></Col>
                 <Col span={16}>
                            <Card title={<p>
                                 <Row>
                                     <Col span={5}>知识点名称</Col>
                                     <Col span={8}>关联权重</Col>
                                     <Col span={5}><span>查看详情</span></Col>
                                 </Row>
                                </p>}>
                                    {know_resource}
                                    <Pagination current={this.state.current} onChange={this.onChange} total={this.state.allPages * 10} />
                            </Card>
                 </Col>
           </Row>
        </Card>
    </Row>
      );  
}
}
const ResKnowRelationList = Form.create()(ResKnowRelationList1)

function mapStateToProps(state) {
  return {
    resourceid_info: state.reducer_resourceid.resourceid_info,
    searchknowid_info: state.reducer_searchknowid.searchknowid_info,
    recommendedknowid_info: state.reducer_recommendedknowid.recommendedknowid_info,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setKnowidState: (state) => dispatch(state),
    setSearchKnowidState: (state) => dispatch(state),
    setRecommendKnowidState: (state) => dispatch(state)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResKnowRelationList);