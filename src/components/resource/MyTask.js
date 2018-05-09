import React, { Component } from 'react';
import { Layout, Icon,Alert, Input,Form,Button,message,Tabs,Table,Tag,Card,Row,Col,Pagination,Modal} from 'antd';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import $ from 'jquery';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { Content} = Layout;
let index;
let currentEditName = "确定";
// let resourcePushAll = [{}];
class MyTask1 extends Component {
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
      allPages: -1,
      current: 1,
      tag:0,
      inputValue:[,,,,,,,,],//绑定的输入框文本
      // editName:['确定','修改'],//操作按钮
      usertask: [{}],
      resourcePushAll : [{}]
    }
  }

  getRid(id){
    this.setState({
      r_id:id
    });
    console.log(id);
    console.log("获取资源id");
  }
  getKnowid(id,i){
    index=i
    console.log(i);
    console.log("获取知识点i1111");
    this.setState({
      knowid:id
    });
    console.log(id);
    console.log("获取知识点id");
  }

 componentWillMount() {
  let ajaxTimeOut = $.ajax({
    url:"/api_v1.1/mark_management/allTask",
    type: "GET",
    dataType: "json",
    timeout:2000,
    async:false,
    success: function (data) {
        if (data.errorCode == "0") {
          console.log('全部推送任务存入文件');
          console.log(data);
        }
        else {   
          console.log('推送任务获取失败');
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
  
  let ajaxTimeOut1 = $.ajax({
    url:"/api_v1.1/mark_management/resourcePush",
    type: "GET",
    dataType: "json",
    timeout:2000,
    data: { "tag":0},
    async:false,
    success: function (data) {
        if (data.errorCode == "0") {
          console.log('推送任务成功111');
          console.log(data)
          console.log('推送任务成功222');
          console.log(data.msg)         
          this.setState({ 
            resourcePushAll: data.msg,
            tag: this.state.tag + 1
          });
          console.log('推送任务this.state.resourcepush');
          console.log(this.state.resourcePushAll);
          console.log('初始化后this.state.tag')
          console.log(this.state.tag)
        }
        else {   
          console.log('推送任务失败');
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
  // this.myTask();
  const { login_info } = this.props;
  let ajaxTimeOut2 = $.ajax({
    url:"/api_v1.1/mark_management/myTaskClassify",
    type: "GET",
    dataType: "json",
    timeout:2000,
    async:false,
    data: { "uid":login_info.userid, "count":8, "page": 1},
    success: function (data) {
      if (data.errorCode == '0') {
        console.log('成功获取用户完成的任务');
        console.log(data);
        console.log(data.msg1);
        console.log("data.msg1pages");
        console.log(data.msg1pages);
        console.log("data.msg2pages");
        console.log(data.msg2pages);
        this.setState({ 
          usertask: data.msg1,
          usertaskhavedone: data.msg2,
          errorCode: data.errorCode,
          allPages: data.msg1pages,
          allPages1: data.msg2pages,
        });
      }
      else {
        console.log('获取我完成的任务失败');
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

 //换一批，无数据警告
 warning1() {
  Modal.warning({
    title: '无更多数据',
  });
}

resourcePush() {
  console.log("换一批中tag",this.state.tag)
  let ajaxTimeOut = $.ajax({
  url:"/api_v1.1/mark_management/resourcePush",
  type: "GET",
  dataType: "json",
  timeout:2000,
  data: { "tag":this.state.tag},
  async:false,
  success: function (data) {
      if (data.errorCode == "0") {
        console.log(data)
        console.log(data.msg)
        console.log('推送任务成功');
        if(data.msg.length == 0){
          console.log("换一批没有更对数据")
          this.warning1();
        }else{
        this.setState({ 
          resourcePushAll: data.msg,
          tag: this.state.tag + 1
        });
        console.log('换一批推送任务this.state.resourcePushAll');
        console.log(this.state.resourcePushAll);
      }
    } else {   
        console.log('推送任务失败');
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

onChange = (page) => {
  const { login_info } = this.props;
  let ajaxTimeOut = $.ajax({
    url:"/api_v1.1/mark_management/myTaskClassify",
    type: "GET",
    dataType: "json",
    timeout:2000,
    data: { "uid":login_info.userid, "count":8, "page": page},
    success: function (data) {
      console.log(data);
      if (data.errorCode == '0') {
        console.log('成功获取用户完成的任务');
        this.setState({ 
          usertask: data.msg1,
          usertaskhavedone: data.msg2,
          current: page
        });
      }
      else {
        console.log('获取我完成的任务失败');
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

onChange1 = (page) => {
  const { login_info } = this.props;
  let ajaxTimeOut = $.ajax({
    url:"/api_v1.1/mark_management/myTaskClassify",
    type: "GET",
    dataType: "json",
    timeout:2000,
    data: { "uid":login_info.userid, "count":8, "page": page},
    success: function (data) {
      console.log(data);
      if (data.errorCode == '0') {
        console.log('成功获取用户完成的任务');
        this.setState({ 
          usertask: data.msg1,
          usertaskhavedone: data.msg2,
          current1: page
        });
      }
      else {
        console.log('获取我完成的任务失败');
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

 //我标注的任务
 myTask() {
  const { login_info } = this.props;
  let ajaxTimeOut = $.ajax({
    url:"/api_v1.1/mark_management/myTaskClassify",
    type: "GET",
    dataType: "json",
    timeout:2000,
    data: { "uid":login_info.userid, "count":8, "page": 1},
    success: function (data) {
      if (data.errorCode == '0') {
        console.log('成功获取用户完成的任务');
        console.log(data);
        console.log(data.msg1);
        this.setState({ 
          usertask: data.msg1,
          usertaskhavedone: data.msg2,
          errorCode: data.errorCode,
          allPages: data.msg1pages,
          allPages1: data.msg2pages,
        });
      }
      else {
        console.log('获取我完成的任务失败');
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

 //设置权重成功弹出框
 warning() {
  Modal.warning({
    title: '输入不能为空',
  });
}

//添加用户标注表中的权重
user_mark_knowresWeight() {
  const { login_info } = this.props;
  console.log(this.state.knowid);
  console.log(this.state.r_id);
  console.log("getdata中获取knowid和r_id1111");
  var regString = /^0\.[0-9]*[1-9]$/;
  if(this.state.MarkWeight == null){
    this.warning()
  }else if(regString.test(this.state.MarkWeight)){
    let ajaxTimeOut = $.ajax({
      url:"/api_v1.1/mark_management/user_mark_knowresWeight",
      type: "GET",
      dataType: "json",
      timeout:2000,
      //async:false,
      data: {
          "knowid": this.state.knowid,
          "r_id":this.state.r_id,
          "uid":login_info.userid,
          "weight":this.state.MarkWeight
         },
      success: function (data) {
        console.log('标注是否成功data.msg',data.msg)
        if (data.msg == 'success') {
          console.log('找到资源与知识点的关联，更新成功');
          this.myTask(); 
          message.config({
            top: 200,
            duration: 2,
          });
          message.success('标注成功');
          console.log('标注接口中this.state.tag')
          console.log(this.state.tag)
          setTimeout(() => {
            let ajaxTimeOut = $.ajax({
              url:"/api_v1.1/mark_management/resourcePush",
              type: "GET",
              dataType: "json",
              timeout:2000,
              data: { "tag":this.state.tag-1},
              success: function (data) {
                  if (data.errorCode == "0") {
                    this.setState({ 
                      resourcePushAll: data.msg,
                    });
                  }
                  else {   
                    console.log('推送任务失败');
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
        },300);
      //   if(this.state.inputValue[index] != null){
      //     this.state.editName = "修改"
      //  }else{
      //     this.state.editName = "确定"
      //  } 
        }
        else {   
          console.log('没有找到资源与知识点的关联，创建一条记录');
          this.myTask(); 
          message.config({
            top: 200,
            duration: 2,
          });
          message.success('标注成功');
          console.log('标注接口中this.state.tag')
          console.log(this.state.tag)
          setTimeout(() => {
            let ajaxTimeOut = $.ajax({
              url:"/api_v1.1/mark_management/resourcePush",
              type: "GET",
              dataType: "json",
              timeout:2000,
              data: { "tag":this.state.tag-1},
              success: function (data) {
                  if (data.errorCode == "0") {
                    this.setState({ 
                      resourcePushAll: data.msg,
                    });
                  }
                  else {   
                    console.log('推送任务失败');
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
        }, 300);
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
  }else{
    message.config({
      top: 200,
      duration: 2,
    });
    message.error('请输入0-1之间的数');
  }
}

  clear(){
    this.state.inputValue=[]
    console.log("清空input输入框成功");
  }

  InputAutoWeightChange(e){
    this.state.inputValue[index]=e.target.value;
    this.setState({
      MarkWeight:e.target.value,
    });
      console.log("this.state.MarkWeight是多少？？？？");
      console.log(this.state.MarkWeight);
   }

  //发送资源id到查看我的任务的标注详情页面
     sendResourceIdtoResInformation(id) {
      console.log('进入reducer中发送资源id');
      console.log(id);
      const { setResourceState } = this.props;
      setResourceState({
          type: 'GetResourceIDSuccess',
          payload: id
      });
      this.context.router.history.push("/App/MyTaskInformation");
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
this.context.router.history.push("/App/MyTaskInformation");
}

  render(){
    const { getFieldProps } = this.props.form;
    const resourcepushList = this.state.resourcePushAll.map((v, i) => {
        let isABCD;
        var regString = /[A-D]+/; 
        var regString1 = /span/;  
        if (regString1.test(v.r_desc) && regString.test(v.r_desc) || regString.test(v.r_desc)) {
        isABCD = (
            <p dangerouslySetInnerHTML={{__html: v.r_name.replace(/^[1-9]/,"").replace(/^、/,"") + v.r_desc}}></p>
        )            
        }else if (regString1.test(v.r_desc) || v.r_desc) {
          isABCD = (
              <p dangerouslySetInnerHTML={{__html:v.r_desc}}></p> 
        )            
      }

      const columns = [{
        title: '知识点名称',
        dataIndex: '知识点名称',
        key: '知识点名称',
        width: 80,
      }, {
        title: '资源描述',
        dataIndex: '资源描述',
        key: '资源描述',
        width:270,
      },
       {
        title: '标注权重',
        dataIndex: '标注权重',
        key: '标注权重',
        width: 50,
      }
    ];
    // currentEditName = this.state.editName[0]
      const data = [{
        key: 'i',
        知识点名称: v.title,
        资源描述: isABCD,
        // 众智权重: v.people_mark_weight,
        标注权重: <p onClick={this.getRid.bind(this,v.r_id)}>
                      <Input size="small" placeholder="0-1之间" style={{ width: 60}}
                         onClick={this.getKnowid.bind(this, v.knowid,i)} 
                         onChange={this.InputAutoWeightChange.bind(this)}
                         value={this.state.inputValue[i]}/>
                  <Button type="primary" size="small" onClick={this.user_mark_knowresWeight.bind(this)}>确定</Button>
                 </p>
      }];
     
      return ( 
              <Table columns={columns} dataSource={data} pagination={false} showHeader={false} size="middle"/>            
      );}
    );

    //我标注的任务——进行中
    let usertasktodoList;
    if (typeof(this.state.usertask) == undefined) {
      usertasktodoList=(
       <p>
         <Alert
           message="没有正进行的任务哦~"
           type="info"
           showIcon
         />
        </p>
        );
    }else{
      usertasktodoList = this.state.usertask.map((v, i) => {
      let isABCD;
      var regString = /[A-D]+/;   
      if (regString.test(v.r_desc)) {
          isABCD = (
              <p dangerouslySetInnerHTML={{__html:v.r_name.replace(/^[1-9]/,"").replace(/^、/,"") + v.r_desc}}></p> 
        )            
      }else {
          isABCD = (
          <span>
              <p dangerouslySetInnerHTML={{__html:v.r_desc}}></p> 
          </span>
          )
      }
      const columns_mytask = [{
        title: '知识点名称',
        dataIndex: '知识点名称',
        key: '知识点名称',
        width: 80,
      }, {
        title: '资源描述',
        dataIndex: '资源描述',
        key: '资源描述',
        width:280,
      }, {
        title: '我标注的权重',
        dataIndex: '我标注的权重',
        key: '我标注的权重',
        width: 80,
      }
    ];
    const data_mytask = [{
      key: 'i',
      知识点名称: i + 1 + (this.state.current - 1) * 8 + '、' + v.title,
      资源描述: isABCD,
      // 关联权重: v.relationweight,
      我标注的权重:  <p onClick={this.sendResourceIdtoResInformation.bind(this, v.r_id)}>
                             <span onClick={this.sendKnowId.bind(this,v.knowid)}>
                             &nbsp;&nbsp; {v.usermarkweight}&nbsp;&nbsp;<Button type="primary" size="small">查看详情</Button></span>
                </p>
    }];
      return (    
            <Table columns={columns_mytask} dataSource={data_mytask} pagination={false} showHeader={false} size="middle"/>    
          );
    }
  );
 } 
 //我标注的任务——已完成
 let usertaskhavedoneList;
 if (typeof(this.state.usertaskhavedone) == undefined) {
  usertaskhavedoneList=(
   <p>
     <Alert
        message="没有已完成的任务哦~"
        type="info"
        showIcon
      />
     </p>
     );
 }else{
   //我完成的任务列表
   usertaskhavedoneList = this.state.usertaskhavedone.map((v, i) => {
   let isABCD;
   var regString = /[A-D]+/;   
   if (regString.test(v.r_desc)) {
       isABCD = (
           <p dangerouslySetInnerHTML={{__html:v.r_name.replace(/^[1-9]/,"").replace(/^、/,"") + v.r_desc}}></p> 
     )            
   }else {
       isABCD = (
       <span>
           <p dangerouslySetInnerHTML={{__html:v.r_desc}}></p> 
       </span>
       )
   }
   const columns_mytask = [{
     title: '知识点名称',
     dataIndex: '知识点名称',
     key: '知识点名称',
     width: 80,
   }, {
     title: '资源描述',
     dataIndex: '资源描述',
     key: '资源描述',
     width:210,
   }, {
     title: '关联权重',
     dataIndex: '关联权重',
     key: '关联权重',
     width: 70,
   }, {
     title: '我标注的权重',
     dataIndex: '我标注的权重',
     key: '我标注的权重',
     width: 80,
   }
 ];
 const data_mytask = [{
   key: 'i',
   知识点名称: i + 1 + (this.state.current - 1) * 8 + '、' + v.title,
   资源描述: isABCD,
   关联权重: v.relationweight,
   我标注的权重:  <p onClick={this.sendResourceIdtoResInformation.bind(this, v.r_id)}>
                          <span onClick={this.sendKnowId.bind(this,v.knowid)}>
                          &nbsp;&nbsp; {v.usermarkweight}&nbsp;&nbsp;<Button type="primary" size="small">查看详情</Button></span>
             </p>
 }];
   return (      
         <Table columns={columns_mytask} dataSource={data_mytask} pagination={false} showHeader={false} size="middle"/>    
        );
 }
);
} 

  return(
   <Layout style={{height:"100%"}}>
    <Content style={{ padding: '0 30px',height:"80%" }}>
      <Layout style={{ padding: '24px 0', background: '#fff' }}>
        <Content style={{ padding: '0 24px', minHeight:500 }}>
        <Tabs defaultActiveKey="2">
         <TabPane tab="我标注的任务" key="1">
             <Tabs defaultActiveKey="1">
                  <TabPane tab="进行中" key="1">
                       <Card  style={{minHeight:500,paddingRight:20, paddingLeft:30,paddingTop:10}} title={<p>
                                 <Row>
                                     <Col span={8}>知识点名称</Col>
                                     <Col span={12}>资源描述</Col>
                                     <Col span={4}>我标注的权重</Col>
                                 </Row>
                                </p>}>
                                   {usertasktodoList} <br/>
                                   <Pagination current={this.state.current} onChange={this.onChange} total={this.state.allPages * 10} />
                       </Card>
                 </TabPane>
                 <TabPane tab="已完成" key="2">
                       <Card  style={{minHeight:500,paddingRight:20, paddingLeft:30,paddingTop:10}} title={<p>
                                 <Row>
                                     <Col span={6}>知识点名称</Col>
                                     <Col span={10}>资源描述</Col>
                                     <Col span={4}>关联权重</Col>
                                     <Col span={4}>我标注的权重</Col>
                                 </Row>
                                </p>}>
                                   {usertaskhavedoneList} <br/>
                                   <Pagination current={this.state.current1} onChange={this.onChange1} total={this.state.allPages1 * 10} />
                       </Card>
                 </TabPane>
              </Tabs>
         </TabPane>
         <TabPane tab="推荐任务" key="2">
         <Card  style={{minHeight:500,paddingRight:20, paddingLeft:30,paddingTop:10}} title={<p style={{ paddingBottom: '10px'}} >
                                 <Row>
                                     <Col span={8}>知识点名称</Col>
                                     <Col span={12}>资源描述</Col>
                                     {/* <Col span={4}>众智权重</Col> */}
                                     <Col span={4}><span>标注权重</span></Col>
                                 </Row>
                                </p>}>
                                    {resourcepushList}
          </Card>
         <span style={{paddingLeft:"90%"}} onClick={this.clear.bind(this)}><Button type="primary" onClick={this.resourcePush.bind(this)}>换一批</Button></span>
         </TabPane>
       </Tabs>
        </Content>
      </Layout>
    </Content>
  </Layout>
        );
    }
}
const MyTask = Form.create()(MyTask1)

 function mapStateToProps(state) {
  return {
    login_info: state.reducer_login.login_info
  };
}

function mapDispatchToProps(dispatch) {
  return {
      setResourceState: (state) => dispatch(state),
      setKnowidState: (state) => dispatch(state),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyTask);