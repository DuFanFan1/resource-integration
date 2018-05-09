import React, { Component } from 'react';
import '../../../style_css/antd.css';
import { Input, Upload, message, Button, Icon, Select, Card, Layout,Form,Modal } from 'antd';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { connect } from 'react-redux';
const { TextArea } = Input;
const FormItem=Form.Item;
const confirm = Modal.confirm;
const buttoncolor = {
  color:"#fff",
  background:"#2a95de",
  border:"#2a95de",
}
class reviseResourceSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource:  [
      ],
      r_name:"",
      r_desc:"",
      r_key: "",
      rtype2:"",
      r_grade: "",
      subject:"",
      field: "",
      view_url:null,
      difficulty: ""
  }
}
  getdata() {
    console.log('进入ReviseResourceSearch');
    const {resourceid}=this.props
    $.ajax({
      url:"/resource/resourceDetail1",
      type: "GET",
      dataType: "json",
      data:{"r_id":resourceid},
      success: function (data) {
        if (data.errorCode == "0") {
          console.log('成功获取该资源');
          console.log(data);
          this.setState({ 
            resource: data.msg,
            r_name:data.msg.r_name,
            r_desc:data.msg.r_desc,
            r_key: data.msg.r_key,
            rtype2:data.msg.rtype2,
            r_grade: data.msg.r_grade,
            subject:data.msg.subject,
            field: data.msg.field,
            view_url:data.msg.view_url,
            difficulty: data.msg.difficulty
          });
          console.log(this.state.resource);
        }
        else {     
          console.log('资源111不存在');
          this.setState({ resource: data.msg });
          console.log(this.state.resource);
        }
  
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
  }
  InputRnameChange(e){  
    this.setState({  
      r_name:e.target.value,  
    }); 
  }
  InputRdescChange(e){  
    this.setState({  
      r_desc:e.target.value,  
    });  
  }  
  InputRkeyChange(e){  
    this.setState({  
      r_key:e.target.value,  
    });  
  }  
  SelectRtype2Change(e){  
    this.setState({  
      rtype2:e,  
    });  
  }  
  SelectRfieldChange(e){  console.log(e);
    this.setState({  
      field:e,  
    });  
    
  }  
  SelectRsubjectChange(e){  console.log(e);
    this.setState({  
      subject:e,  
    });  
    
  }
  SelectRgradeChange(e){  console.log(e);
    this.setState({  
      r_grade:e,  
    });  
    
  }  
  SelectRdifficultyChange(e){   console.log(e);
    this.setState({  
      difficulty:e,  
    });  
   
  }
  putdata() {
    const{resourceid}=this.props;
    $.ajax({
      url:"/resource/editResource1",
      type: "PUT",
      dataType: "json",
      data:{
        "r_id":resourceid,
       "r_name":this.state.r_name,
        "r_desc":this.state.r_desc,
        "field":this.state.field,
        "subject":this.state.subject,
        "r_grade": this.state.r_grade,
        "r_key":this.state.r_key,     
        "rtype2": this.state.rtype2,
        "difficulty": this.state.difficulty
      },
      success: function (data) {
        console.log(data);
        if (data.errorCode == "0") {
          console.log('成功put该资源');
          console.log(data);
          this.success();
        }
        else {     
          console.log('put资源不存在');
          this.failure();
        }
  
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
  }
   // 弹出框-添加知识点成功
   success() {
    confirm({
      title: '修改成功',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  // 弹出框-添加知识点失败
  failure() {
    confirm({
      title: '修改失败',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  componentDidMount() {
    this.getdata();
  
  }
  render() {
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
    return (
      <Layout>
        <div style={{ paddingTop: '30px' }}>
            <Card style={{ height: '1000px' }} title="修改资源信息">
              <Form>
                <FormItem
                  label={<span >资源名称</span>}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 8 }}
                  hasFeedback   
                > 
                  <Input placeholder={this.state.r_name}  {...getFieldProps('r_name')} value={this.state.r_name} onChange={this.InputRnameChange.bind(this)}/>
                </FormItem>
                <FormItem
                  label="知识点内容"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 8 }}
                  hasFeedback
                >
                  <img src={this.state.view_url} />
                </FormItem>
                <FormItem
                  label="资源描述"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 8 }}
                  hasFeedback
                >
                  <TextArea  rows={4} value={this.state.r_desc} onChange={this.InputRdescChange.bind(this)}/>
                </FormItem>
                <FormItem
                  label="关键字"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 8 }}
                  hasFeedback
                >
                  <Input  value={this.state.r_key} onChange={this.InputRkeyChange.bind(this)}/>
                </FormItem>
                <FormItem
                  label="领域"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 8 }}
                  hasFeedback
                >
                  <Select style={{ width: 200 }} value={this.state.field} onChange={this.SelectRfieldChange.bind(this)}>
                    <Option value="基础教育">基础教育</Option>
                    <Option value="学前教育">学前教育</Option>
                    <Option value="职业教育">职业教育</Option>
                    <Option value="高等教育">高等教育</Option>
                  </Select>
                </FormItem>
                <FormItem
                  label="适用对象"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 8 }}
                  hasFeedback
                >
                  <Select style={{ width: 200 }} value={this.state.r_grade} onChange={this.SelectRgradeChange.bind(this)}>
                    <Option value="一年级">一年级</Option>
                    <Option value="二年级">二年级</Option>
                    <Option value="三年级">三年级</Option>
                    <Option value="四年级">四年级</Option>
                    <Option value="五年级">五年级</Option>
                    <Option value="六年级">六年级</Option>
                    <Option value="七年级">七年级</Option>
                    <Option value="八年级">八年级</Option>
                    <Option value="九年级">九年级</Option>
                  </Select>
                  </FormItem>
                  <FormItem
                    label="学科"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                    hasFeedback
                  >
                    <Select style={{ width: 200 }}  value={this.state.subject} onChange={this.SelectRsubjectChange.bind(this)}>
                      <Option value="数学">数学</Option>
                      <Option value="语文">语文</Option>
                      <Option value="英语">英语</Option>
                      <Option value="地理">地理</Option>
                      <Option value="生物">生物</Option>
                      <Option value="科学">科学</Option>
                      <Option value="政治">政治</Option>
                      <Option value="历史">历史</Option>
                      <Option value="物理">物理</Option>
                      <Option value="化学">化学</Option>
                      <Option value="体育">体育</Option>
                      <Option value="美术">美术</Option>
                      <Option value="音乐">音乐</Option>
                    </Select>
                  </FormItem>
                  <FormItem
                    label="难易程度"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                    hasFeedback
                  >
                    <Select style={{ width: 80 }} value={this.state.difficulty} onChange={this.SelectRdifficultyChange.bind(this)}>
                      <Option value="容易">容易</Option>
                      <Option value="困难">困难</Option>
                      <Option value="中等">中等</Option>
                    </Select>
                  </FormItem>

                  <FormItem
                    label="类型"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                    hasFeedback
                  >
                    <Select style={{ width: 200 }} value={this.state.rtype2} onChange={this.SelectRtype2Change.bind(this)}>
                      <Option value="媒体素材">媒体素材</Option>
                      <Option value="课件">课件</Option>
                      <Option value="电子图书">电子图书</Option>
                      <Option value="示范课例">示范课例</Option>
                      <Option value="微课">微课</Option>
                      <Option value="网络课程">网络课程</Option>
                      <Option value="试题">试题</Option>
                      <Option value="文本类素材">文本类素材</Option>
                      <Option value="动画类素材">动画类素材</Option>
                      <Option value="视频类素材">视频类素材</Option>
                      <Option value="音频类素材">音频类素材</Option>
                      <Option value="图片类素材">图片类素材</Option>
                      <Option value="交互课件">交互课件</Option>
                    </Select>
                  </FormItem>
                  <FormItem {...tailFormItemLayout} >
                    <Link to="/App/resourceDetailSearch"><Button type="primary" size="large" style={buttoncolor}>返回</Button></Link>
                    <Button type="primary" size="large" onClick={this.putdata.bind(this)} style={buttoncolor}>保存</Button>
                  </FormItem>
              </Form>
            </Card>
          </div> 
      </Layout>
   );
  }
}
reviseResourceSearch = Form.create()(reviseResourceSearch);
function mapStateToProps(state) {
  return {
    resourceid: state.search_module2.resourceid
  };
}


function mapDispatchToProps(dispatch) {
  return {
    
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reviseResourceSearch);