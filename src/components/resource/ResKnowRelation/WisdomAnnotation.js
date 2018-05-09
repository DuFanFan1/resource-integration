import React, { Component } from 'react';
import Highcharts from 'highcharts'
import { Row, Col } from 'antd';
import { Layout, Menu, Breadcrumb, Icon,Input,Dropdown,Button,Table,Card, Form} from 'antd';
import $ from 'jquery';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
const { SubMenu } = Menu;
const Search = Input.Search;
const { Content, Sider } = Layout;
const FormItem = Form.Item;
const buttoncolor = {
  color:"#fff",
  background:"#2a95de",
  border:"#2a95de",
}

class WisdomAnnotation extends Component {  
  static contextTypes = {
    router: PropTypes.object
  }
// 状态机
constructor(props,context) {
    super(props,context);
      this.state = {
        people_mark_weight:null,
        peopleMarkDetail1:[
          {
            "weight": null,
            "username": null,
            "user_weight": null,
          }
        ],
        relation_res:[
          {
            "knowid":4,
            "r_id" : 4,
          }
        ],
      }
    }
      //通过资源id、知识点id获取众智标注信息
      getCrowsWeight = () => {
        const { knowid_info, resourceid_info } = this.props; 
        let ajaxTimeOut = $.ajax({
          url: "/api_v1.1/mark_management/allMarkDetail",
          type: "GET",
          dataType: "json",
          timeout:2000,
          data: {
            "knowid": knowid_info,
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

    //通过资源id、知识点id获取众智详情
      peopleMarkDetail = () => {
        const { knowid_info,resourceid_info } = this.props;
        console.log(knowid_info);
        console.log(resourceid_info);
        let ajaxTimeOut = $.ajax({
            url:"/api_v1.1/knowledge_resource/peopleMarkDetail_v1_1",
            type: "GET",
            dataType: "json",
            timeout:2000,
            data:{ "knowid":knowid_info, "r_id": resourceid_info },
            success: function (data) {
                if (data.errorCode == "0") {
                  console.log('成功获取众智详情111');
                  console.log(resourceid_info);
                  console.log(data);
                  this.setState({ 
                    peopleMarkDetail1: data.msg,
                    //file_url:data.msg[0].file_url
                   });
                  console.log(this.state.peopleMarkDetail1); 
                  //console.log(this.state.file_url);    
                  console.log("众智标注权重11111111111");               
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
 //根据资源id查看资源详情
 ResourceInformation(resourceid_info) {
  let ajaxTimeOut = $.ajax({
   url:"/api_v1.1/knowledge_resource/resourceDetail_v1_1",
    type: "GET",
    dataType: "json",
    async:false,
    timeout:2000,
    data:{"r_id":resourceid_info},
    success: function (data) {
      console.log('成功获取reducer传过来的资源id');
      if (data.errorCode == '0') {
          console.log('成功获取该资源');
          console.log(data);
          this.setState({ 
              resource: data.msg[0],
             // file_url: data.msg[0].file_url,
              r_desc: data.msg[0].r_desc,
              r_name: data.msg[0].r_name.replace(/^[1-9]/,"").replace(/^、/,""),
              rtype: data.msg[0].rtype,
              field: data.msg[0].field,
              subject: data.msg[0].subject,
              grade: data.msg[0].grade,
           }); 
          console.log(this.state.resource);  
          //console.log(this.state.resource.file_url);
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
         this.getCrowsWeight();
         this.peopleMarkDetail();
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
            {this.state.people_mark_weight}
         </p>
         )
     }
      const peopleMarkDetailList = this.state.peopleMarkDetail1.map((v, i) => {
        return (
            <div style={{ paddingBottom: '10px', height:50 }} >              
                   <Row span={24} key={i}>
                       <Col span={8}>{v.username}</Col>
                       <Col span={8}>{v.user_weight}</Col>
                       <Col span={8}>{v.weight}</Col>
                   </Row>                                
            </div>
        );
    }
    );

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
                  <Row>
                    <Col span={2} style={{fontSize:13,fontWeight: 'bold'}}>众智标注:</Col>
                    <Col span={4}  style={{fontSize:13}}>{ispeople_mark_weightNull}</Col>
                  </Row><br/>
                <Card bordered={true} title={<p style={{ paddingBottom: '10px', background:"#F7F7F7"}} >
                        <Row span={24}>
                            <Col span={8}>用户名</Col>
                            <Col span={8}>用户权重</Col>
                            <Col span={8}>权重</Col>
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
  };
}


function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WisdomAnnotation);