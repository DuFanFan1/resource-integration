import React, { Component } from 'react';
import $ from 'jquery';
import { Router, Route, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';
import { Link, HashRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import '../../../../style_css/antd.css';  // Add
import { Tabs, Icon, Form, Input, Button, Breadcrumb, Select, Radio, Layout, Card, Row, Col, Modal, Tree, Checkbox, Alert } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const confirm = Modal.confirm;
let JsonArray = [];
let JsonArray_Echarts = [];
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
class Relatedknowledge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      display: 'none',
      parent_know: null,
      spanwidth: 10,
      content: false,
      checkedKeys: [],
      selectedKeys: [],
      SearchknowledgeResult: [],
      //树形
      keywords: '',
      treeData: [],
      TreeNodeData: [],
      RelatedknowledgeResult: [],
      RelatedButton: [],
      checkedNode: [],
      checkedNode_List: [],
      checkedNode_Echarts: [],
    }
  }
  getkeywords(e) { this.setState({ keywords: e.target.value }); } //知识点title
  // 通过关键字搜索关联知识点第一层级关系
  getSearchknowledgeResult() {
    const { knowledgeInfo } = this.props;
    const { mapInfo } = this.props;
    if (knowledgeInfo.is_knowledge == '是') {
      this.confirm_alert()
    } else {
      if (this.state.keywords == '') {
        Modal.warning({
          title: '友情提示',
          content: '内容不能为空，请完整填写',
        });
      }
      else {
        this.setState({
          checkedNode: [],
          checkedKeys: []
        });
        let ajaxTimeOut = $.ajax({
          url: "/api_v1.1/knowledge/queryFirstLayerRelation",
          type: "GET",
          dataType: "json",
          data: { "keywords": this.state.keywords, "subject": mapInfo.subject, },
          timeout: 2000,
          success: function (data) {
            console.log('通过关键字搜索关联知识点第一层级关系-')
            console.log('data.errorCode-' + data.errorCode)
            if (data.errorCode == 0) {
              this.setState({
                treeData: data.msg
              });
              this.setState({
                SearchknowledgeResult: [
                  { 'title': '' },
                ]
              })
              this.setState({
                RelatedButton: [
                  { 'title': '可关联' },
                ]
              })
            }
            else {
              this.setState({
                SearchknowledgeResult: [
                  { 'title': '暂无可关联数据' },
                ]
              });
              this.setState({
                treeData: []
              });
              this.setState({
                RelatedButton: [
                  { 'title': '不可关联' },
                ]
              })
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
    }
  }
  // 通过知识点knowid搜索关联知识点第二层级关系
  querySecondLayerRelation(knowid) {
    //通过structid查询知识地图的结构-by bing
    return new Promise((resolve) => {
      let ajaxTimeOut = $.ajax({
        url: "/api_v1.1/knowledge/querySecondLayerRelation",
        type: "GET",
        dataType: "json",
        data: { "knowid": knowid },
        timeout: 2000,
        success: function (data) {
          if (data.errorCode == 1) {
            console.log('该知识点没有下一层结构');
          }
          else {
            console.log('成功获取该知识点的下一层极结构');
            console.log(data);
            this.setState({ TreeNodeData: data.msg });
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
    })
  }
  // 节点和知识点建立关联关系
  addKnowledgeRelations() {
    const { displayType } = this.props;
    const display_type = displayType.displayType;
    const { knowledgeInfo } = this.props;
    // alert(this.props.form.getFieldValue('kmap_name') + "-" + this.props.form.getFieldValue('kcid3') + "-" + this.props.form.getFieldValue('kcid2'));
    console.log('JsonArray')
    console.log(JsonArray)
    if (JsonArray.length == 0) {
      Modal.warning({
        title: '友情提示',
        content: '内容不能为空，请选中需要关联的知识点',
      });
    }
    else {
      let ajaxTimeOut = $.ajax({
        url: "/api_v1.1/knowledge_struct_rela_know/addKnowledgeRelations",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        // data:"gjswjoiw",
        // data: JsonArray,
        data: JSON.stringify({ "JsonArray": JsonArray }),
        timeout: 2000,
        success: function (data) {
          console.log('节点关联知识点成功');
          console.log(data);
          console.log('display_type:' + display_type);
          if (display_type == '知识地图-列表') {
            // if (data.errorCode == 0) { console.log('成功添加地图节点'); this.success() }
            if (data.errorCode == 0) { console.log('节点关联知识点1942'); PubSub.publish('addKnowledgeSuccess', this.state.title); this.success() }
            else { console.log('添加知识元失败'); this.failure() }
          }
          else {
            const addknowledgeInfo = { 'sindex': knowledgeInfo.index, 'sname': knowledgeInfo.knowledge_name, 'names': JsonArray_Echarts }
            if (data.errorCode == 0) { console.log('成功添加知识元'); PubSub.publish('batchAddStructSuccess_Echarts', addknowledgeInfo); this.success() }
            else { console.log('添加知识元失败'); this.failure() }
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
      this.props.form.resetFields();
    }
  }
  onCheck = (checkedKey, e) => {
    const { displayType } = this.props;
    const display_type = displayType.displayType;
    const { knowledgeInfo } = this.props;
    const { mapInfo } = this.props;
    const map_id = mapInfo.map_id;
    const knowledge_id = knowledgeInfo.knowledge_id;
    console.log('onCheck', checkedKey);
    console.log('e', e)
    console.log('eknowid', e.node.props.dataRef.knowid)
    this.state.checkedNode.push({ 'checked': e.checked, 'knowid': e.node.props.dataRef.knowid, 'preknowid': e.node.props.dataRef.pre_knowid, 'title': e.node.props.dataRef.title, "contain_child": e.node.props.dataRef.isLeaf == true ? '否' : '是' })
    for (let i = 0; i < this.state.checkedNode.length; i++) {
      if (e.node.props.dataRef.knowid == this.state.checkedNode[i].knowid) {
        if (e.checked == false) {
          this.state.checkedNode.splice(i, 1);
        }
      }
    }
    this.setState({
      checkedKeys: checkedKey,
    });
    console.log("this.state.checkedNode")
    console.log(this.state.checkedNode)
    // 储祥瑞
    JsonArray = [];
    JsonArray_Echarts = [];
    this.state.checkedNode.forEach(function (item) {
      if (item.checked == true) {
        JsonArray.push({ "structid": knowledge_id, "mapid": map_id, "knowid": item.knowid, "preknowid": item.preknowid, "contain_child": item.contain_child });
        JsonArray_Echarts.push({ "knowid": item.knowid, "name": item.title, "preknowid": item.preknowid, "contain_child": item.contain_child, 'symbol': 'roundRect', "category": 3 });
      }
    })
    console.log('JsonArray111111')
    console.log(JsonArray)
    JsonArray.forEach(function (item1) {
      if (item1.preknowid != 0) {
        let count = 0;
        JsonArray.forEach(function (item2) {
          if (item2.knowid == item1.preknowid && item2.preknowid == 0) {
            count++
          }
        })
        if (count == 0) {
          JsonArray.forEach(function (item3) {
            if (item3.preknowid == item1.preknowid) {
              item3.preknowid = 0;
            }
          })
        }
      }
    })
    JsonArray_Echarts.forEach(function (item1) {
      if (item1.preknowid != 0) {
        let count = 0;
        JsonArray_Echarts.forEach(function (item2) {
          if (item2.knowid == item1.preknowid && item2.preknowid == 0) {
            count++
          }
        })
        if (count == 0) {
          JsonArray_Echarts.forEach(function (item3) {
            if (item3.preknowid == item1.preknowid) {
              item3.preknowid = 0;
            }
          })
        }
      }
    })
  }
  onSelect = (selectedKeys, e) => {
    console.log('onSelect e');
    console.log(e);
    this.setState({ selectedKeys });
  }
  // 结果呈现
  onLoadData = (treeNode) => {
    console.log('treeNode11')
    console.log(treeNode)
    console.log('treeNode.props')
    console.log(treeNode.props)
    console.log('treeNode.props.dataRef.children')
    console.log(treeNode.props.dataRef.children)
    this.setState({ treeNode_props: treeNode.props, });
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      // this.getKnowledgeRelationStructNext();
      this.querySecondLayerRelation(treeNode.props.knowid);
      setTimeout(() => {
        treeNode.props.dataRef.children = this.state.TreeNodeData;
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      }, 1000);
    });
  }
  renderTreeNodes(data) {
    // onClick={this.handleClick.bind(this, item)}
    // <input type="checkbox" value={{ "structid":knowledge_id,"mapid":map_id, "knowid": item.knowid,"preknowid": item.pre_knowid, "contain_child": item.isLeaf==true?'否':'是' }}></input>
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={<p > {item.title} </p>} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} title={<p >  {item.title}</p>} dataRef={item} />;
    });
  }
  // 弹出框-添加知识点成功
  // 弹出框-添加知识点成功
  success() {
    Modal.success({
      title: '友情提示',
      content: '关联成功',
    });
  }
  // 弹出框-添加知识点失败
  failure() {
    Modal.error({
      title: '友情提示',
      content: '关联失败',
    });
  }
  confirm_alert() {
    Modal.warning({
      title: '友情提示：',
      content: '此节点无权进行此操作',
    });
  }
  componentWillMount() {
    const { displayType } = this.props;
    const display_type = displayType.displayType;
    if (display_type == '列表') {
      this.setState({ spanwidth: 10 })
    }
    else { this.setState({ spanwidth: 18 }) }
    const { knowledgeInfo } = this.props;
    if (knowledgeInfo.is_knowledge == '是') {
      this.confirm_alert()
    }
    else {
      this.setState({ parent_know: knowledgeInfo.pre_name })
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log('nextProps')
    console.log(nextProps.knowledgeInfo)
    if (nextProps.knowledgeInfo.is_knowledge == '是') {
      // this.confirm_alert()
      this.setState({
        display: 'block',
        keywords: null,
        treeData: [],
        RelatedButton: [
          { 'title': '不可关联' },
        ],
        SearchknowledgeResult: [
          { 'title': '暂无可关联数据' },
        ]
      })
    }
    else {
      this.setState({ parent_know: nextProps.knowledgeInfo.pre_name })
      this.setState({ display: 'none' })
    }
  }
  render() {
    //搜索结果
    const SearchknowledgeResult = this.state.SearchknowledgeResult.map((v, i) => {
      if (v.title == '暂无可关联数据') {
        return (
          <p style={{ paddingTop: '50px', fontSize: '20px', paddingLeft: '50px' }} >暂无可关联数据</p>
        );
      }
    }
    );
    // 关联按钮
    const RelatedButton = this.state.RelatedButton.map((v, i) => {
      if (v.title == '可关联') {
        return (
          <Button type="primary" htmlType="submit" onClick={this.addKnowledgeRelations.bind(this)}>关联</Button>
        );
      }
    }
    );

    return (
      <div >
        {/* <div style={{ height: '750px', paddingTop: '30px' }}> */}
        <div style={{ display: this.state.display }}>
          <Alert
            message="友情提示："
            description="此节点无权进行此操作."
            type="warning"
            showIcon
          />
          {/* <Alert message="此节点无权进行此操作" type="warning" showIcon /> */}
        </div>
        <Card style={{ height: '1750px', paddingTop: '20px' }} >
          <div style={{ paddingTop: '10px' }}>
            <Form>
              <FormItem
                label="父节点"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: this.state.spanwidth }}
                hasFeedback
              >
                <span>{this.state.parent_know}</span>
              </FormItem>
              <FormItem
                label="输入检索关键字"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: this.state.spanwidth }}
                hasFeedback
              >
                <Input value={this.state.keywords} onChange={this.getkeywords.bind(this)} placeholder='必填' />
              </FormItem>
              <FormItem {...tailFormItemLayout} >
                <Button type="primary" htmlType="submit" onClick={this.getSearchknowledgeResult.bind(this)}>确定</Button>
              </FormItem>
            </Form>
            <div style={{ paddingTop: '50px' }}>
              {SearchknowledgeResult}
              <Tree
                loadData={this.onLoadData}
                checkable
                checkStrictly
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
              // onSelect={this.onSelect.bind(this)}
              // selectedKeys={this.state.selectedKeys}
              >
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>
              {RelatedButton}
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
Relatedknowledge = Form.create()(Relatedknowledge);
// export default Relatedknowledge;
function mapStateToProps(state) {
  return {
    knowledgeInfo: state.reducer_map_knowledge.knowledgeInfo,
    mapInfo: state.reducer_map_info.mapInfo,
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
)(Relatedknowledge);
