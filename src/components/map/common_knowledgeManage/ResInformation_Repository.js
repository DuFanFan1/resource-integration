import React, {Component} from 'react';
import $ from 'jquery';
import {Button, Icon, Input, Card, Row, Col, message, Modal,Radio,Form, Collapse,Table} from 'antd';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';
import IMG from './images/course.png';
import DOC from './images/doc.png';
import SOURCE from './images/source.png';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
function onChange(e) {
    console.log(`radio checked:${e.target.value}`);
  }
const buttoncolor = {
    color:"#fff",
    background:"#2a95de",
    border:"#2a95de",
}
 
class ResInformation extends Component {
 //推荐解释弹出框
 state = { visible: false }
 showModal = () => {
   this.setState({
     visible: true,
   });
 }
 handleOk = (e) => {
   console.log(e);
   this.setState({
     visible: false,
   });
 }
 handleCancel = (e) => {
   console.log(e);
   this.setState({
     visible: false,
   });
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
      posts: [],
      resource_answer: "",
      view_url:null,
      resource:  [
        {
          "r_id" :4,
        }
      ],
      recommendContent: [
        {
            "r_id": 1,
            "r_name": "分数乘法",
        }
    ], 
    recommendExplanation: [
        {
            "title": "分数乘法",
        }
    ],
    }
  }       
  //根据资源id查看资源详情
  getdata() {
    const { resourceid_info } = this.props;    
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
                r_name: data.msg[0].r_name,
                subject: data.msg[0].subject,
                // r_desc: data.msg[0].r_desc.replace(/\"/g, ""),
                // r_desc: data.msg[0].r_desc.replace(/A/g,"<span><br><br>A</span>"),
                rtype: data.msg[0].rtype,
             }); 
            console.log(this.state.resource);  
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
        
   // 根据资源id和关联资源个数k推荐资源关联
   getRecommendByContent = () => {
    const { resourceid_info } = this.props;  
    let ajaxTimeOut = $.ajax({
        url: "/api_v1.1/apiPackage/getRecommendByRid",
        type: "GET",
        dataType: "json",
        timeout:2000,
        data: { "Rid": resourceid_info, k: 4, },
        success: function (data) {
            console.log('获取推荐资源列表')
            console.log(data)
            this.setState({ recommendContent: data.msg });
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

//关联知识点个数为0时提醒
warning() {
    Modal.warning({
      title: '没有关联的知识点',
    });
  }
 //发送资源id到资源关联知识点页面
     sendResourceId(id) {
        if(this.state.resource.relationCount == 0){
            this.warning();
         }else{
        console.log('进入reducer中发送资源id');
        console.log(id);
        const { setResourceState } = this.props;
        setResourceState({
            type: 'GetResourceIDSuccess',
            payload: id
        });
        this.context.router.history.push("/App/ResKnowRelationList");
    }
    }

//发送推荐资源id到查看资源详情页面
sendRecommendResourceIdtoResInformation(id) {
    const { displayType } = this.props;
    console.log('进入reducer中发送资源id');
    console.log(id);
    const { setRecommendResourceState } = this.props;
    setRecommendResourceState({
        type: 'GetRecommendResourceIDSuccess',
        payload: id
    });
    if(displayType.displayType=='知识库-列表'){this.context.router.history.push("/App/KnowledgeRepository_List_Slider/RecommendResource");}
    else if(displayType.displayType=='知识库-地图'){this.context.router.history.push("/App/KnowledgeRepository_Echarts_Slider/RecommendResource");}
    else if(displayType.displayType=='知识地图-列表'){this.context.router.history.push("/App/KnowledgeManage_List_Slider/RecommendResource");}
    else if(displayType.displayType=='知识地图-地图'){this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/RecommendResource");}
    // this.context.router.history.push("/App/KnowledgeRepository_List_Slider/RecommendResource");
}
  componentWillMount() {
    const { displayType } = this.props;
    this.setState({ display_type: displayType.displayType })
    this.recommendExplanation();
    this.getdata();
    this.getRecommendByContent();  
  }

  // 推荐解释
  recommendExplanation = () => {
    const { resourceid_info } = this.props; 
    let ajaxTimeOut = $.ajax({
        url: "/api_v1.1/apiPackage/getRelationKByRid",
        type: "GET",
        dataType: "json",
        timeout:2000,
        data: { "Rid": resourceid_info},
        success: function (data) {
            this.setState({
                recommendExplanation: data.msg
            });
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

  back(){
    const { displayType } = this.props;
    if(displayType.displayType=='知识库-列表'){this.context.router.history.push("/App/KnowledgeRepository_List_Slider/ResList_Repository");}
    else if(displayType.displayType=='知识库-地图'){this.context.router.history.push("/App/KnowledgeRepository_Echarts_Slider/ResList_Repository");}
    else if(displayType.displayType=='知识地图-列表'){this.context.router.history.push("/App/KnowledgeManage_List_Slider/ResList");}
    else if(displayType.displayType=='知识地图-地图'){this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/ResList");}
}
    render(){  
        let showStyle;
        if (this.state.resource.rtype == "网络课程") {
            showStyle = (
            <span>
                <p>
                  <Video autoPlay loop muted
                      controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
                      poster=""
                      onCanPlayThrough={() => {
                          // Do stuff
                       }}>
                      <source src={this.state.file_url} type="video/mp4" />
                     <track label="English" kind="subtitles" srcLang="en" src="" default />
                 </Video>
                 </p>
            </span>
          )
        } else if(this.state.resource.rtype == "试题"){ 
            var regString = /[A-D]+/;  
            var regString1 = /span/;  
            if (regString1.test(this.state.r_desc) && regString.test(this.state.r_desc)) {
                showStyle = (
                    <Form>
                        <FormItem
                            label=""
                            labelCol={{ span: 0 }}
                            wrapperCol={{ span: 24 }}
                            hasFeedback
                            style={{ marginBottom: '5px' }}
                        >
                            <p dangerouslySetInnerHTML={{ __html: this.state.r_desc }}></p>
                        </FormItem>
                    </Form>
            )
            }
            else if (regString1.test(this.state.r_desc) || regString.test(this.state.r_desc) || this.state.r_desc) {     
            showStyle = (
                    <Form>
                    <FormItem
                           label=''
                           labelCol={{ span: 0 }}
                           wrapperCol={{ span: 16 }}
                           hasFeedback
                           style={{ marginBottom: '3px' }}
                       >
                         <span >{this.state.resource.r_name.replace(/^[1-9]/,"").replace(/^、/,"")}</span>
                  </FormItem>
                  <FormItem
                           label=''
                           labelCol={{ span: 0 }}
                           wrapperCol={{ span: 16 }}
                           hasFeedback
                           style={{ marginBottom: '3px' }}
                       >
                       <p dangerouslySetInnerHTML={{__html: this.state.r_desc}}></p>
                  </FormItem>
                  </Form>
                    )
             }
        }else if(this.state.resource.rtype == "课件"){
            //ppt预览的方式
            showStyle = (
                <span>
                 <a href={this.state.file_url} target="_blank">
                     <p><img src={IMG} style={{width:80,height:90}}/></p>
                     <p>{this.state.resource.r_name}</p>
                 </a>
             </span>
             )
        }
        else if(this.state.resource.rtype == "案例" || this.state.resource.rtype == "文献" || this.state.resource.rtype == "试卷"){
            //案例预览的方式
            showStyle = (
                <span>
                 <a href={this.state.file_url} target="_blank">
                     <p><img src={DOC} style={{width:80,height:90}}/></p>
                     <p>{this.state.resource.r_name}</p>
                 </a>
             </span>
             )
        } else if(this.state.resource.rtype == "素材"){
            //素材预览的方式
            showStyle = (
                <span>
                 <a href={this.state.file_url} target="_blank">
                     <p><img src={SOURCE} style={{width:80,height:90}}/></p>
                     <p>{this.state.resource.r_name}</p>
                 </a>
             </span>
             )
        }
        let isABCD;
        var regString1 = /span/;
        var regString = /[A-D]+/;   
         if (regString1.test(this.state.r_desc) && regString.test(this.state.resource.r_desc) || regString1.test(this.state.r_desc)) {
            isABCD = (
                <Form>
                     <FormItem
                             label={<span style={{ fontWeight: 'bold' }}>资源名称</span>}
                             labelCol={{ span: 8 }}
                             wrapperCol={{ span: 16}}
                             hasFeedback
                             style={{ marginBottom: '5px' }}
                        >
                        <span >{this.state.resource.r_name.replace(/^[1-9]/,"").replace(/^、/,"")}</span>
                       </FormItem>
              </Form>
          )
        }else if (regString.test(this.state.resource.r_desc)) {
            isABCD = (
                    <Form>
                        <FormItem
                             label={<span style={{ fontWeight: 'bold' }}>资源名称</span>}
                             labelCol={{ span: 8 }}
                             wrapperCol={{ span: 16}}
                             hasFeedback
                             style={{ marginBottom: '5px' }}
                        >
                        <span >{this.state.resource.r_name.replace(/^[1-9]/,"").replace(/^、/,"")}</span>
                       </FormItem>
                       <FormItem
                             label={<span style={{ fontWeight: 'bold' }}>资源描述</span>}
                             labelCol={{ span: 8 }}
                             wrapperCol={{ span: 16}}
                             hasFeedback
                             style={{ marginBottom: '5px' }}
                        >
                          <p dangerouslySetInnerHTML={{__html:this.state.resource.r_name.replace(/^[1-9]/,"").replace(/^、/,"") + this.state.r_desc}}></p>
                       </FormItem>
                </Form>
          )            
        }else{
            isABCD = (
                <Form>
                    <FormItem
                         label={<span style={{ fontWeight: 'bold' }}>资源名称</span>}
                         labelCol={{ span: 8 }}
                         wrapperCol={{ span: 16}}
                         hasFeedback
                         style={{ marginBottom: '5px' }}
                    >
                    <span >{this.state.resource.r_name.replace(/^[1-9]/,"").replace(/^、/,"")}</span>
                   </FormItem>
                   <FormItem
                         label={<span style={{ fontWeight: 'bold' }}>资源描述</span>}
                         labelCol={{ span: 8 }}
                         wrapperCol={{ span: 16}}
                         hasFeedback
                         style={{ marginBottom: '5px' }}
                    >
                   <p dangerouslySetInnerHTML={{__html:this.state.r_desc}}></p>
                   </FormItem> 
            </Form>
      )            
        }
     
    // 推荐资源
    let recommendContentList;
    if (this.state.recommendContent == "no response from server") {
      recommendContentList = (
            <p>暂无推荐内容</p>
        )
    } else {
     recommendContentList = this.state.recommendContent.map((v, i) => {
        console.log(v.r_name.replace(/^[1-9]/,"").replace(/^、/,""))
        console.log("推荐资源字符串匹配")
            return (
                <p key={i}>
                        <p>
                           {i + 1}、{v.r_name.replace(/^[1-9]/,"").replace(/^、/,"")}
                            <Button style={{ background: "#F1C40F", color: "#fff", float: 'right' }} size="small"
                            onClick={this.sendRecommendResourceIdtoResInformation.bind(this, v.r_id)} >
                                 详情
                            </Button>
                        </p><br/>
                </p>
            );
        }
        );
    }

         // 推荐解释
     let recommendExplanationList
     if (this.state.recommendExplanation == 'no response from server') {
        recommendExplanationList = (
         <p>暂无内容</p>
       )
     }
     else {
     recommendExplanationList = this.state.recommendExplanation.map((v, i) => {
        const columns = [{
            title: '关联资源',
            dataIndex: '关联资源',
            key: '关联资源',
            width: 80,
          }
        ];
          
          const data = [{
            key: 'i',
            关联资源: <p style={{width:200}}>{i+1}、{v.title}</p>,
          }
        ];           
        return (
            <Table columns={columns} dataSource={data} pagination={false} showHeader={false} size="middle"/>
        );
    }
    );
}
        if (this.state.display_type == '知识库-列表') {
        return(
            <Card>
                <Col span={24}>
                <Row>
                <Form>
                      <FormItem
                        label=""
                        labelCol={{ span: 0}}
                        wrapperCol={{ span: 24 }}
                        hasFeedback
                        style={{fontSize:15,fontWeight:2500}}
                      > 
                    {this.state.resource.r_name.replace(/^[1-9]/,"").replace(/^、/,"")}
                    </FormItem>
                </Form>
                </Row>
                <Row> 
                    <Col span={15}>
                        <Card style={{height:750}} title={<p>
                            <RadioGroup onChange={onChange} defaultValue="a" size="large">
                                        <RadioButton value="a" onClick={this.back.bind(this)}>返回上一级</RadioButton>
                                        <RadioButton value="b">难度级别：{this.state.resource.difficulty}</RadioButton>
                                        <RadioButton value="c">维护人数{this.state.resource.maintenanceNumber}个</RadioButton>
                                        <RadioButton value="d" onClick={this.sendResourceId.bind(this, this.state.resource.r_id)}>
                                              <a style={{color:"#2a95de",border:"#2a95de"}}>关联知识点</a><a style={{color:"#2a95de",border:"#2a95de"}}>{this.state.resource.relationCount}个</a>
                                        </RadioButton>   
                            </RadioGroup>
                                </p>
                        }>
                        <p>{ showStyle }</p>
                    </Card>
                </Col>
                <Col span={9}>
                     <div>
                           <Card title={<p><Button style={buttoncolor} size="large">资源简介</Button></p>} bordered={true}>
                                  <span>
                                      <p>{isABCD}</p>
                                      <Form>
                                           <FormItem
                                                  label={<span style={{ fontWeight: 'bold' }}>关键字</span>}
                                                  labelCol={{ span: 8 }}
                                                  wrapperCol={{ span: 16 }}
                                                  hasFeedback
                                                  style={{ marginBottom: '5px' }}
                                              >
                                                <span >{this.state.resource.r_key.replace(/^[1-9]/,"").replace(/^、/,"")}</span>
                                         </FormItem>
                                     
                                    
                                           <FormItem
                                                  label={<span style={{ fontWeight: 'bold' }}>资源类型</span>}
                                                  labelCol={{ span: 8 }}
                                                  wrapperCol={{ span: 16 }}
                                                  hasFeedback
                                                  style={{ marginBottom: '5px' }}
                                              >
                                                <span >{this.state.resource.rtype}</span>
                                         </FormItem>
                                         <FormItem
                                                  label={<span style={{ fontWeight: 'bold' }}>领域</span>}
                                                  labelCol={{ span: 8 }}
                                                  wrapperCol={{ span: 16 }}
                                                  hasFeedback
                                                  style={{ marginBottom: '5px' }}
                                              >
                                                <span >{this.state.resource.field}</span>
                                         </FormItem>
                                         <FormItem
                                                  label={<span style={{ fontWeight: 'bold' }}>学科</span>}
                                                  labelCol={{ span: 8 }}
                                                  wrapperCol={{ span: 16 }}
                                                  hasFeedback
                                                  style={{ marginBottom: '5px' }}
                                              >
                                                <span >{this.state.resource.subject}</span>
                                         </FormItem>
                                         <FormItem
                                                  label={<span style={{ fontWeight: 'bold' }}>适用年级</span>}
                                                  labelCol={{ span: 8 }}
                                                  wrapperCol={{ span: 16 }}
                                                  hasFeedback
                                                  style={{ marginBottom: '5px' }}
                                              >
                                                <span >{this.state.resource.grade}</span>
                                         </FormItem>
                                      </Form>
                                 </span> 
                          </Card> 
                          <Card title={<p>
                            <Button style={buttoncolor} size="large">资源推荐</Button>
                            <span style={{paddingLeft:10}}><Button style={buttoncolor} onClick={this.showModal} size="large">推荐解释</Button></span>
                            <Modal
                                 title={<p>
                                            <Button style={buttoncolor}>当前资源</Button>
                                            <span style={{paddingLeft:10}}><span dangerouslySetInnerHTML={{__html: this.state.resource.r_name.replace(/^[1-9]/,"").replace(/^、/,"")}}></span>
                                            </span>
                                        </p>}
                                 visible={this.state.visible}
                                 onOk={this.handleOk}
                                 onCancel={this.handleCancel}
                             >
                                 {/* <p><Button style={{width:'100%',paddingTop:0,background:'#F1C40F',color:'#FFF',border:"#F1C40F"}}>关联的资源及权重</Button></p> */}
                                 <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>关联知识点</Button></p>
                                 <p>{recommendExplanationList}</p>
                           </Modal>
                            </p>} bordered={true} >
                                 {recommendContentList}
                        </Card>              
                        {/* <Card title={<p><Button style={buttoncolor} size="large">资源推荐</Button></p>} bordered={true} >
                                 {recommendContentList}
                        </Card> */}
                     </div>
                </Col>
            </Row>     
        </Col>
    </Card>
    )
    }else{
    return(
    <Card>
        <RadioGroup onChange={onChange} defaultValue="a" size="large">
                <RadioButton value="a" onClick={this.back.bind(this)}>返回上一级</RadioButton>
                <RadioButton value="b">难度级别：{this.state.resource.difficulty}</RadioButton>
                <RadioButton value="c">维护人数{this.state.resource.maintenanceNumber}个</RadioButton>
                <RadioButton value="d" onClick={this.sendResourceId.bind(this, this.state.resource.r_id)}>
                    <a style={{color:"#2a95de",border:"#2a95de"}}>关联知识点</a><a style={{color:"#2a95de",border:"#2a95de"}}>{this.state.resource.relationCount}个</a>
                </RadioButton>   
        </RadioGroup>
        <Card title={<p>{this.state.resource.r_name.replace(/^[1-9]/,"").replace(/^、/,"")}</p>}>
                <p>{ showStyle }</p>
        </Card>
        <div>
             <Collapse defaultActiveKey="1">
                  <Panel header={<Button style={buttoncolor} size="large">资源简介</Button>} key="1" style={{ background: "#fff" }}>
                          <span>
                              <p>{isABCD}</p>
                              <Form>
                                   <FormItem
                                          label={<span style={{ fontWeight: 'bold' }}>关键字</span>}
                                          labelCol={{ span: 8 }}
                                          wrapperCol={{ span: 16 }}
                                          hasFeedback
                                          style={{ marginBottom: '5px' }}
                                      >
                                        <span >{this.state.resource.r_key.replace(/^[1-9]/,"").replace(/^、/,"")}</span>
                                 </FormItem>
                                   <FormItem
                                          label={<span style={{ fontWeight: 'bold' }}>资源类型</span>}
                                          labelCol={{ span: 8 }}
                                          wrapperCol={{ span: 16 }}
                                          hasFeedback
                                          style={{ marginBottom: '5px' }}
                                      >
                                        <span >{this.state.resource.rtype}</span>
                                 </FormItem>
                                 <FormItem
                                          label={<span style={{ fontWeight: 'bold' }}>领域</span>}
                                          labelCol={{ span: 8 }}
                                          wrapperCol={{ span: 16 }}
                                          hasFeedback
                                          style={{ marginBottom: '5px' }}
                                      >
                                        <span >{this.state.resource.field}</span>
                                 </FormItem>
                                 <FormItem
                                          label={<span style={{ fontWeight: 'bold' }}>学科</span>}
                                          labelCol={{ span: 8 }}
                                          wrapperCol={{ span: 16 }}
                                          hasFeedback
                                          style={{ marginBottom: '5px' }}
                                      >
                                        <span >{this.state.resource.subject}</span>
                                 </FormItem>
                                 <FormItem
                                          label={<span style={{ fontWeight: 'bold' }}>适用年级</span>}
                                          labelCol={{ span: 8 }}
                                          wrapperCol={{ span: 16 }}
                                          hasFeedback
                                          style={{ marginBottom: '5px' }}
                                      >
                                        <span >{this.state.resource.grade}</span>
                                 </FormItem>
                              </Form>
                         </span> 
                         </Panel>
                </Collapse>
                <Collapse defaultActiveKey="1">
                  <Panel header={<p><Button style={buttoncolor} size="large">资源推荐</Button>
                      <span style={{paddingLeft:10}}><Button style={buttoncolor} onClick={this.showModal} size="large">推荐解释</Button></span>
                      <Modal
                           title={<p>
                                      <Button style={buttoncolor}>当前资源</Button>
                                      <span style={{paddingLeft:10}}><span dangerouslySetInnerHTML={{__html: this.state.resource.r_name.replace(/^[1-9]/,"").replace(/^、/,"")}}></span>
                                      </span>
                                  </p>}
                           visible={this.state.visible}
                           onOk={this.handleOk}
                           onCancel={this.handleCancel}
                       >
                           {/* <p><Button style={{width:'100%',paddingTop:0,background:'#F1C40F',color:'#FFF',border:"#F1C40F"}}>关联的资源及权重</Button></p> */}
                           <p><Button style={{ width: '100%', paddingTop: 0, background: '#F1C40F', color: '#FFF', border: "#F1C40F" }}>关联知识点</Button></p>
                           <p>{recommendExplanationList}</p>
                     </Modal>
                </p>} key="1" style={{ background: "#fff" }}>
                    {recommendContentList}
                  </Panel>
                </Collapse>
             </div>  
  </Card>
)
    }

    }
}

function mapStateToProps(state) {
    return {
        resourceid_info: state.reducer_resourceid.resourceid_info,
        displayType: state.reducer_diaplay_type.displayType,
    };
  }
  
  
  function mapDispatchToProps(dispatch) {
    return {
        setResourceState: (state) => dispatch(state),
        setRecommendResourceState: (state) => dispatch(state),
    };
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ResInformation);

