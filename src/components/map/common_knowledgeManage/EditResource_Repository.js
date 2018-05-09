import React, {Component} from 'react';
import {Input, Upload, message, Button, Icon, Select, Card, Form, Row} from 'antd';
import $ from 'jquery';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
const buttoncolor = {
  color:"#fff",
  background:"#2a95de",
  border:"#2a95de",
}
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

class EditResource1 extends Component {

  static contextTypes = {
    router: PropTypes.object
  } 
// 状态机
constructor(props,context) {
super(props,context);
  this.state = {
    resource:  [
    {
      r_id: 4,
      r_name: "",
      r_desc:"",
      r_key: "",
      rtype: "",
      field: "",
      subject: "",
      grade: "",
      file_url: "",
      difficulty: "",   
}],
}
}
//首先获取资源信息
getdata() {
  const { resourceid_info } = this.props;  
  let ajaxTimeOut = $.ajax({
    url:"/api_v1.1/knowledge_resource/resourceDetail_v1_1",
    type: "GET",
    dataType: "json",
    timeout:2000,
    data:{"r_id":resourceid_info},
    success: function (data) {
      if (data.errorCode == '0') {
        console.log('成功获取reducer中该资源');
        console.log(data);
        this.setState({ 
          resource: data.msg[0],
          r_name:data.msg[0].r_name.replace(/^[1-9]/,"").replace(/^、/,""),
          r_desc:data.msg[0].r_desc,
          r_key: data.msg[0].r_key.replace(/^[1-9]/,"").replace(/^、/,""),
          rtype: data.msg[0].rtype,
          subject: data.msg[0].subject,
          field: data.msg[0].field,
          grade: data.msg[0].grade,
          difficulty: data.msg[0].difficulty
        });
        console.log(this.state.resource);
        console.log(this.state.r_name);
        console.log(this.state.r_desc);
        console.log(this.state.r_name.join(this.state.r_desc))
        console.log("资源名称1111");
      }
      else {     
        console.log('资源不存在');
        this.setState({ resource: data.msg[0] });
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

InputRnameChange(e){  
  this.setState({  
    r_name:e.target.value,  
  });  
  console.log(e.target.value);
}
InputRdescChange(e){  
  this.setState({  
    r_desc:e.target.value,  
  });  
  console.log(e.target.value);
}  
InputRkeyChange(e){  
  this.setState({  
    r_key:e.target.value,  
  });  
  console.log(e.target.value);
}  

SelectRSubjectChange(e){  console.log(e);
  this.setState({  
    subject:e,  
  });  
  
}  
SelectRFieldChange(e){  console.log(e);
  this.setState({  
    field:e,  
  });  
  
}
SelectRgradeChange(e){  console.log(e);
  this.setState({  
    grade:e,  
  });  
  
}  
SelectRdifficultyChange(e){   console.log(e);
  this.setState({  
    difficulty:e,  
  });  
}

componentDidMount() {
  this.getdata();
}
componentWillReceiveProps(nextProps) {
  console.log("打印nextProps")
  console.log(nextProps)
}

//修改资源信息
putdata() {
  const { resourceid_info } = this.props;  
  let ajaxTimeOut = $.ajax({
    url:"/api_v1.1/knowledge_resource/resourceEdit_v1_1",
    type: "PUT",
    dataType: "json",
    timeout:2000,
    data:{
     "r_id":resourceid_info,
     "r_name":this.state.r_name,
      "r_desc":this.state.r_desc,
      "r_key":this.state.r_key,
      // "rtype": this.state.rtype,
      "subject": this.state.subject,
      "field": this.state.field,
      "grade": this.state.grade,
      "difficulty": this.state.difficulty
    },
    success: function (data) {
      console.log(data);
      if (data.errorCode == '0') {
        console.log('修改成功');
        console.log(data);
        this.back();
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

back(){
  const { displayType } = this.props;
  if(displayType.displayType=='知识库-列表'){this.context.router.history.push("/App/KnowledgeRepository_List_Slider/ResList_Repository");}
  else if(displayType.displayType=='知识库-地图'){this.context.router.history.push("/App/KnowledgeRepository_Echarts_Slider/ResList_Repository");}
  else if(displayType.displayType=='知识地图-列表'){this.context.router.history.push("/App/KnowledgeManage_List_Slider/ResList");}
  else if(displayType.displayType=='知识地图-地图'){this.context.router.history.push("/App/KnowledgeManage_Echarts_Slider/ResList");}
}
 render(){
      const { getFieldProps } = this.props.form;
           const tailFormItemLayout = {
             wrapperCol: {
               xs: {
                 span: 24,
                 offset: 0,
               },
               sm: {
                 span: 14,
                 offset: 6,
               },
             },
           };

          let isABCD;
          var regString1 = /span/;  
          var regString = /[A-D]+/; 
          if (regString1.test(this.state.r_desc)) {
              isABCD = (
                 <p>
                   <p dangerouslySetInnerHTML={{__html:this.state.r_desc}}></p>
                  </p>
            )            
          }else if (regString.test(this.state.r_desc)) {
           isABCD = (
              <p>
                 {this.state.r_name}
                 <p dangerouslySetInnerHTML={{__html:this.state.r_desc}}></p>
               </p>
         )   
       }else{
            isABCD = (
              <span>
                <p dangerouslySetInnerHTML={{__html:this.state.r_desc}}></p>
              </span>
              )
          }
     return (
       <Card>
            <Form>
            <FormItem
              label="资源名称"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              hasFeedback  
              style={{ marginBottom: '5px' }} 
            >
              {/* <Input placeholder={this.state.r_name}  {...getFieldProps('r_name')} value={this.state.r_name} onChange={this.InputRnameChange.bind(this)}/> */}
              <p {...getFieldProps('r_name') } onChange={this.InputRnameChange.bind(this)}>{this.state.r_name}</p>
            </FormItem>
            <FormItem
              label="资源描述"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              hasFeedback
              style={{ marginBottom: '7px' }}
            >
              {/* <TextArea {...getFieldProps('r_desc') } value={this.state.r_desc} rows={4} onChange={this.InputRdescChange.bind(this)}> */}
            <p {...getFieldProps('r_desc') } onChange={this.InputRdescChange.bind(this)}>{isABCD}</p>
             {/* </TextArea> */}
            </FormItem>
            <FormItem
              label="关键字"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              hasFeedback
            >
              <Input {...getFieldProps('r_key') } value={this.state.r_key} onChange={this.InputRkeyChange.bind(this)}/>
            </FormItem>
            <FormItem
              label="领域"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              hasFeedback
            >
              <Select {...getFieldProps('field')} value={this.state.field} onChange={this.SelectRFieldChange.bind(this)}>
                <Option value="基础教育">基础教育</Option>
                <Option value="高等教育">高等教育</Option>
                <Option value="成人教育">成人教育</Option>
              </Select>
            </FormItem>
            <FormItem
              label="适用对象"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              hasFeedback
            >
              <Select {...getFieldProps('grade') } value={this.state.grade} onChange={this.SelectRgradeChange.bind(this)}>
                <Option value="高中">高中</Option>
                <Option value="初中">初中</Option>
                <Option value="小学">小学</Option>
              </Select>
              </FormItem>
              <FormItem
                label="学科"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
                hasFeedback
              >
                <Select {...getFieldProps('subject') } value={this.state.subject} onChange={this.SelectRSubjectChange.bind(this)}>
                  <Option value="数学">数学</Option>
                  <Option value="语文">语文</Option>
                  <Option value="英语">英语</Option>
                  <Option value="生物">生物</Option>
                  <Option value="物理">物理</Option>
                </Select>
              </FormItem>
              <FormItem
                label="难易程度"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
                hasFeedback
              >
                <Select  {...getFieldProps('difficulty') } value={this.state.difficulty} onChange={this.SelectRdifficultyChange.bind(this)}>
                  <Option value="简单">简单</Option>
                  <Option value="困难">困难</Option>
                  <Option value="中等">中等</Option>
                </Select>
              </FormItem>
              <FormItem {...tailFormItemLayout} >
               <Button style={buttoncolor} size="large" onClick={this.putdata.bind(this)}>保存</Button>
               <Button type="default" size="large"  onClick={this.back.bind(this)}>返回</Button>
              </FormItem>
             </Form>
            </Card>
           );
         }
}
const EditResource = Form.create()(EditResource1);

function mapStateToProps(state) {
  return {
      resourceid_info: state.reducer_resourceid.resourceid_info,
      knowledgeInfo: state.reducer_map_knowledge.knowledgeInfo,
      displayType: state.reducer_diaplay_type.displayType,
  };
}


function mapDispatchToProps(dispatch) {
  return {
      
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditResource);