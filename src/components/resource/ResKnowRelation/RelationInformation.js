import React, { Component } from 'react';
import $ from 'jquery';
import { Row, Col, Card } from 'antd';
import { Menu, Breadcrumb, Icon,Input,Dropdown,Button,Table,Modal,Form} from 'antd';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
const confirm = Modal.confirm;
const FormItem = Form.Item;
const buttoncolor = {
  color:"#fff",
  background:"#2a95de",
  border:"#2a95de",
}

class RelationInformation extends Component {
  static contextTypes = {
    router: PropTypes.object
}
// 状态机
constructor(props, context) {
    super(props, context);
  this.state = {
    visible: false,
    content: null,
    posts: [],
    relation_res:[
      {
        "knowid":4,
        "r_id" : 4,
      }
    ],
  }
  this.allMarkDetail();
}
//通过r_id,knowid查询关联详情
getdata() {
  const { knowid_info, resourceid_info } = this.props;  
  console.log(knowid_info);
  console.log(resourceid_info);
  console.log("通过r_id,knowid查询关联详情");
  let ajaxTimeOut = $.ajax({
    url: "/api_v1.1/knowledge_res_relation/getRelatedDetailOfKnowAndRes_v1_1",
    type: "GET",
    dataType: "json",
    timeout:2000,
    data:{
         "r_id": resourceid_info,
         "knowid": knowid_info,
        },
    success: function (data) {
      if (data.errorCode == '0') {
        console.log('获取关联详情');
        console.log('成功从reducer中获取关联详情');
        this.setState({ 
          relation_res: data.msg,
          knowledgetitle:data.msg.title });
        console.log(this.state.relation_res);
        console.log("知识点标题");
        console.log(this.state.knowledgetitle);
      }
      else {   
        console.log('不存在这样的资源与知识点的关联');
        console.log(data);
        this.setState({ relation_rest: data.msg });
        console.log(this.state.relation_res);
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

 //通过资源id、知识点id获取众智标注权重
 allMarkDetail = () => {
  const { knowid_info, resourceid_info } = this.props; 
  console.log(knowid_info);
  console.log(resourceid_info);
  console.log("通过资源id、知识点id获取众智标注权重");
  let ajaxTimeOut = $.ajax({
    url: "/api_v1.1/mark_management/allMarkDetail",
    type: "GET",
    dataType: "json",
    timeout:2000,
    data: {
      "knowid":knowid_info,
      "r_id":resourceid_info,
    },
    success: function (data) {
      if (data.errorCode == '0') {
        console.log('成功获取众智标注信息');
        console.log('成功从reducer中获取众智标注');
        this.setState({ 
          r_title: data.msg[0].title,
          r_desc:data.msg[0].r_desc,
          people_mark_weight:data.msg[0].people_mark_weight
        });
        console.log(this.state.people_mark_weight);      
      }
      else {
        console.log('不存在众智标注信息');
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

//删除完之后跳转到ResKnowRelationList页
DeleteSuccess() {
  this.context.router.history.push("/App/ResKnowRelationList");
}
//showModal方法
state = { visible: false }
showModal = () => {
  this.setState({
    visible: true,
  });
}
handleOk = (e) => {
  const { knowid_info, resourceid_info } = this.props; 
  console.log(e);
  this.setState({
    visible: false,
  });
  let ajaxTimeOut = $.ajax({
    url:"/api_v1.1/knowledge_resource/resourceRelationDelete_v1_1",
    type: "DELETE",
    dataType: "json",
    timeout:2000,
    data: {"knowid":knowid_info, "r_id":resourceid_info},
    success: function (data) {
      if (data.errorCode == 0) {
        console.log('成功删除关联知识点');
        console.log('成功从reducer中获取知识点id');
        this.DeleteSuccess();  
      }
      else {
        console.log('删除关联知识点失败');
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
handleCancel = (e) => {
  console.log(e);
  this.setState({
    visible: false,
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
componentDidMount() {
  this.getdata();
  const { resourceid_info } = this.props;
  this.ResourceInformation(resourceid_info);
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
      let isNull; 
      if (this.state.relation_res.weight == null) {
        isNull = (
              <p>
                未标注
              </p>
        )            
      }else {
        isNull = (
          <p>
             {this.state.relation_res.weight}
          </p>
          )
      }
      //判断专家评注是否为空
      let isexpert_mark_weightNull; 
      if (this.state.relation_res.expert_mark_weight == null) {
        isexpert_mark_weightNull = (
              <p>
                未标注
              </p>
        )            
      }else {
        isexpert_mark_weightNull = (
          <p>
             {this.state.relation_res.expert_mark_weight}
          </p>
          )
      }
      //判断自动标注是否为空
      let isauto_weightNull; 
      if (this.state.relation_res.auto_weight == null) {
        isauto_weightNull = (
              <p>
                未标注
              </p>
        )            
      }else {
        isauto_weightNull = (
          <p>
             {this.state.relation_res.auto_weight}
          </p>
          )
      }
     //判断众智标注是否为空
     let ispeople_mark_weightNull; 
     if (this.state.people_mark_weight == null) {
       ispeople_mark_weightNull = (
             <p>
               未标注
             </p>
       )            
     }else {
       ispeople_mark_weightNull = (
         <p>
            {this.state.people_mark_weight}&nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="/App/WisdomAnnotation"><span style={{color:"#2a95de"}}>众智详情</span></Link>
         </p>
         )
     }
      return (
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
                     wrapperCol={{ span: 16}}
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
              <Row>
                 {/* <Card> */}
                  <Row>
                    <Col span={2} style={{fontSize:13,fontWeight: 'bold'}}>关联权重:</Col>
                    <Col span={15}  style={{fontSize:13}}>{isNull}</Col>
                    </Row><br/>
                  <Row>
                  <Col span={2} style={{fontSize:13,fontWeight: 'bold'}}>标注权重:</Col>
                  <Col span={20} style={{fontSize:13}}>
                         <Col span={3}>专家标注：</Col><Col span={3}>{isexpert_mark_weightNull}</Col>
                         <Col span={3}>自动标注：</Col><Col span={3}>{isauto_weightNull}</Col>
                         <Col span={3}>众智标注：</Col><Col span={5}>{ispeople_mark_weightNull}</Col>
                  </Col>
                  </Row><br/>
                    <p> 
                        <Card title={<p style={{ paddingBottom: '10px'}} >
                             <Row>
                                 <Col span={9}>知识点名称：{this.state.knowledgetitle}</Col>
                             </Row>
                         </p>} bordered={true} >
                            <Row><Col>{this.state.relation_res.description}</Col></Row><br/><br/>
                            <Row>
                                <Col span={5}>适用范围：{this.state.relation_res.field}</Col> 
                                <Col span={8}> 添加时间：{this.state.relation_res.addtime}</Col> 
                                <Col span={5}>
                                <Button type="danger" onClick={this.showModal}>删除关联</Button></Col>
                                <Modal
                                          title="删除关联"
                                          style={{ textAlign: 'center'}}
                                          visible={this.state.visible}
                                          onOk={this.handleOk}
                                          onCancel={this.handleCancel}
                                >
                                            <div>
                                                <p>确认删除该关联的知识点吗？</p>
                                            </div>
                                </Modal>
                            </Row>
                        </Card>
                     </p>
                {/* </Card>  */}
              </Row>  
            </Col>
            </Row>
        </Card>
 );   
    }
 }   
    function mapStateToProps(state) {
      return {
          knowid_info: state.reducer_knowid.knowid_info,
          resourceid_info: state.reducer_resourceid.resourceid_info
      };
    }  
    
    function mapDispatchToProps(dispatch) {
      return {
          
      };
    } 
    export default connect(
      mapStateToProps,
      mapDispatchToProps
    )(RelationInformation);