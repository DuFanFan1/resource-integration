import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Tabs, Row, Col, Layout, Breadcrumb, Checkbox, Input, Button, Card, Icon, Pagination, Form, Tree, message, Modal, Table } from 'antd';
import $ from "jquery";
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import { fastLerp } from 'zrender/lib/tool/color';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const buttoncolor = {
  color: "#fff",
  background: "#2a95de",
  border: "#2a95de",
}
function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

function showTotal(total) {
  return `Total ${total} items`;
}

class searchContent extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      field_c: null,
      subject_c: null,
      r_grade_c: null,
      knowid: null,
      uid: null,
      allpage1: -1,
      allpage2: -1,
      current1: 1,
      current2: 1,
      checkedKeys1: "",
      checkedKeys: [],
      ResourceInfo: [{}],
      treeData: [{}],
      TreeNodeData: [],
      checkedNode: [],
      pagechecked: [],
      treeNode_props: null,
      recommendContent: [{}],
      collection: false,
      resourceList: null,
      relationKnowledgeInfoList: null,
      recommendContentList: null,
      relationKnowledgeId: [],
      temp: [],
      temp1: [],
      visible: false,
      data1: [],
      columns: [
        {
          title: '编号',
          dataIndex: 'num',
          key: 'num',
        },
        {
          title: '用户名',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: '相似度',
          dataIndex: 'sim',
          key: 'sim',
        }]
    }
  }

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
  //获取用户信息
  // getUserInfo(search_info) {
  //   const { login_info } = this.props;  
  // $.ajax({
  //   url: "/api_v1.1/user/getUserInfo_v1_1",
  //   type: "GET",
  //   dataType: "json",
  //   // async: false,
  //   data: {
  //     "username": login_info.username,
  //   },
  //   success: function (data) {
  //     console.log('data用户11111')
  //     console.log(data)
  //     console.log('data.msg.scope', data.msg.scope)
  //     if (data.errorcode == 0) {
  //       if (search_info.field == null) { this.setState({ field_c: data.msg.scope, }); console.log(' this.state.field111111J', this.state.field_c); } else { this.setState({ field_c: search_info.field, }); console.log(' this.state.field112111J', this.state.field_c); }
  //       if (search_info.subject == null) { this.setState({ subject_c: data.msg.course, }); } else { this.setState({ subject_c: search_info.subject, }); }
  //       if (search_info.r_grade == null) { this.setState({ r_grade_c: data.msg.grade, }); } else { this.setState({ r_grade_c: search_info.r_grade, }); }
  //     }
  //     else {
  //       console.log('用户属性获取失败');
  //     }
  //   }.bind(this),
  //   error: function (xhr, status, err) {
  //   }.bind(this)
  // });
  // }
  //获取知识点、资源
  getdata(search_info) {
    const { login_info } = this.props;
    this.setState({
      checkedKeys: [],
      ResourceInfo: [{}],
      treeData: [{}],
      allpage1: -1,
      allpage2: -1,
      pagechecked: [],
    });
    //获取用户信息
    $.ajax({
      url: "/api_v1.1/user/getUserInfo_v1_1",
      type: "GET",
      dataType: "json",
      // async: false,
      data: {
        "username": login_info.username,
      },
      success: function (data) {
        console.log('data用户11111')
        console.log(data)
        console.log('data.msg.scope', data.msg.scope)
        if (data.errorcode == 0) {
          if (search_info.field == null) { this.setState({ field_c: data.msg.scope, }); } else { this.setState({ field_c: search_info.field, }); }
          if (search_info.subject == null) { this.setState({ subject_c: data.msg.course, }); } else { this.setState({ subject_c: search_info.subject, }); }
          if (search_info.r_grade == null) { this.setState({ r_grade_c: data.msg.grade, }); } else { this.setState({ r_grade_c: search_info.r_grade, }); }
          $.ajax({
            url: "/api_v1.1/higherSearch/ResourceAndKnowledgeNodes",
            type: "GET",
            dataType: "json",
            // async: false,
            data: {
              "grade": this.state.r_grade_c,
              "subject": this.state.subject_c,
              "field": this.state.field_c,
              "keyword": search_info.keyWord.join(','),
              "name": search_info.name.join(','),
              "description": search_info.description.join(','),
              "knowledgecount": 10,
              "knowledgepage": 1,
              "resourcecount": 5,
              "resourcepage": 1,
              "uid": login_info.userid
            },
            success: function (data) {
              if (data.errorCode == 0) {
                this.setState({
                  treeData: data.knowledge,
                  allpage1: data.knowledgeAllpages,
                  ResourceInfo: data.resource,
                  allpage2: data.resourceAllpages,
                  current1: 1,
                  current2: 1,
                });
              }
              else {
                console.log('第一步获取失败');
                this.setState({
                  treeData: [],
                  allpage1: [],
                  ResourceInfo: [],
                  allpage2: [],
                  current1: 1,
                  current2: 1,
                });
                Modal.warning({
                  title: '友情提示',
                  content: '暂无内容！',
                });
              }
            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this)
          });
        }
        else {
          console.log('用户属性获取失败');
        }
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
  }

  //选择页码获取知识点
  onChange1 = (page1) => {
    const { search_info } = this.props;
    const { login_info } = this.props;
    console.log('onChangeknoledge this.state.pagechecked', this.state.pagechecked);
    this.setState({
      treeData: [{}]
    });
    for (let i = 0; i < this.state.pagechecked.length; i++) {
      if (this.state.pagechecked[i].page == page1) {
        this.setState({
          checkedKeys: this.state.pagechecked[i].checked,
        })
        break;
      } else {
        this.setState({
          checkedKeys: [],
        });
      }
    }
    //获取用户信息
    $.ajax({
      url: "/api_v1.1/user/getUserInfo_v1_1",
      type: "GET",
      dataType: "json",
      // async: false,
      data: {
        "username": login_info.username,
      },
      success: function (data) {
        console.log('data用户-知识点翻页')
        console.log(data)
        if (data.errorcode == 0) {
          if (search_info.field == null) { this.setState({ field_c: data.msg.scope, }); } else { this.setState({ field_c: search_info.field, }); }
          if (search_info.subject == null) { this.setState({ subject_c: data.msg.course, }); } else { this.setState({ subject_c: search_info.subject, }); }
          if (search_info.r_grade == null) { this.setState({ r_grade_c: data.msg.grade, }); } else { this.setState({ r_grade_c: search_info.r_grade, }); }
          //翻页
          $.ajax({
            url: "/api_v1.1/higherSearch/ResourceAndKnowledgeNodes",
            type: "GET",
            dataType: "json",
            data: {
              "grade": this.state.r_grade_c,
              "subject": this.state.subject_c,
              "field": this.state.field_c,
              "keyword": search_info.keyWord.join(','),
              "name": search_info.name.join(','),
              "description": search_info.description.join(','),
              "knowledgecount": 10,
              "knowledgepage": page1,
              "resourcecount": 5,
              "resourcepage": 1,
              "uid": login_info.userid
            },
            success: function (data) {
              if (data.errorCode == 0) {
                this.setState({
                  treeData: data.knowledge,
                  allpage1: data.knowledgeAllpages,
                  current1: page1,
                });
                // console.log('this.state.allpage', this.state.allpage);
                // console.log('current1-获取后', this.state.current1);
              }
              else {
                console.log('翻页第一步获取失败');
              }
            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this)
          });
        }
        else {
          console.log('用户属性获取失败');
        }
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });

  }
  //选择页码获取资源
  onChange2 = (page) => {
    const { search_info } = this.props;
    const { login_info } = this.props;
    this.setState({
      ResourceInfo: [{}],
    });

    if (this.state.temp1 == 0) {
      //获取用户信息
      $.ajax({
        url: "/api_v1.1/user/getUserInfo_v1_1",
        type: "GET",
        dataType: "json",
        // async: false,
        data: {
          "username": login_info.username,
        },
        success: function (data) {
          console.log('data用户-资源翻页')
          console.log(data)
          if (data.errorcode == 0) {
            if (search_info.field == null) { this.setState({ field_c: data.msg.scope, }); } else { this.setState({ field_c: search_info.field, }); }
            if (search_info.subject == null) { this.setState({ subject_c: data.msg.course, }); } else { this.setState({ subject_c: search_info.subject, }); }
            if (search_info.r_grade == null) { this.setState({ r_grade_c: data.msg.grade, }); } else { this.setState({ r_grade_c: search_info.r_grade, }); }
            //翻页
            $.ajax({
              url: "/api_v1.1/higherSearch/ResourceAndKnowledgeNodes",
              type: "GET",
              dataType: "json",
              data: {
                "grade": this.state.r_grade_c,
                "subject": this.state.subject_c,
                "field": this.state.field_c,
                "keyword": search_info.keyWord.join(','),
                "name": search_info.name.join(','),
                "description": search_info.description.join(','),
                "knowledgecount": 10,
                "knowledgepage": 1,
                "resourcecount": 5,
                "resourcepage": page,
                "uid": login_info.userid
              },
              success: function (data) {
                console.log('data')
                console.log(data)
                if (data.errorCode == 0) {
                  this.setState({
                    ResourceInfo: data.resource,
                    allpage2: data.resourceAllpages,
                    current2: page,
                  });
                  console.log('this.state.allpage', this.state.allpage);
                }
                else {
                  console.log('点击页码第一步获取失败');
                }
              }.bind(this),
              error: function (xhr, status, err) {
              }.bind(this)
            });
          }
          else {
            console.log('用户属性获取失败');
          }
        }.bind(this),
        error: function (xhr, status, err) {
        }.bind(this)
      });
      $.ajax({
        url: "/api_v1.1/higherSearch/ResourceAndKnowledgeNodes",
        type: "GET",
        dataType: "json",
        data: {
          "grade": this.state.r_grade_c,
          "subject": this.state.subject_c,
          "field": this.state.field_c,
          "keyword": search_info.keyWord.join(','),
          "name": search_info.name.join(','),
          "description": search_info.description.join(','),
          "knowledgecount": 10,
          "knowledgepage": 1,
          "resourcecount": 5,
          "resourcepage": page,
          "uid": login_info.userid
        },
        success: function (data) {
          console.log('data')
          console.log(data)
          if (data.errorCode == 0) {
            this.setState({
              ResourceInfo: data.resource,
              allpage2: data.resourceAllpages,
              current2: page,
            });
            console.log('this.state.allpage', this.state.allpage);
          }
          else {
            console.log('点击页码第一步获取失败');
          }
        }.bind(this),
        error: function (xhr, status, err) {
        }.bind(this)
      });
    }
    else {
      $.ajax({
        url: "/api_v1.1/advancedSearch/getQueryResourceDetails",
        type: "GET",
        dataType: "json",
        data: {
          "knowidString": this.state.temp1.join(','),
          "count": 5,
          "page": page,

        },
        success: function (data) {
          console.log('data联动资源');
          console.log(data);
          if (data.errorCode == 0) {
            this.setState({
              ResourceInfo: data.msg,
              allpage2: data.allpages,
              current2: page,
            });
          }
          else {
            console.log('联动信息获取失败');
          }
        }.bind(this),
        error: function (xhr, status, err) {
        }.bind(this)
      });
    }
  }



  // 通过知识点id获取知识地图下一层层级关系
  getKnowledgeStorageNextLayer(knowid) {
    return new Promise((resolve) => {
      $.ajax({
        url: "/api_v1.1/knowledge/getKnowledgeStorageNextLayer",
        type: "GET",
        dataType: "json",
        data: { "knowid": knowid },
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
        }.bind(this)
      });
    })

  }
  //知识点-资源联动
  checkSubmit() {
    const { search_info } = this.props;
    console.log('this.state.checkedNode', this.state.checkedNode);
    console.log('checkSubmit this.state.pagechecked', this.state.pagechecked);
    this.setState({
      temp: [],
      temp1: []
    });
    for (let i = 0; i < this.state.checkedNode.length; i++) {
      if (this.state.checkedNode[i].checked == true) {
        this.state.temp.push(this.state.checkedNode[i].knowid)
      }
    }
    this.setState({
      temp1: this.state.temp
    });
    if (this.state.temp == 0) {
      Modal.warning({
        title: '注意：',
        content: '请选择知识点！',
      });
      //获取用户信息
      $.ajax({
        url: "/api_v1.1/user/getUserInfo_v1_1",
        type: "GET",
        dataType: "json",
        // async: false,
        data: {
          "username": login_info.username,
        },
        success: function (data) {
          console.log('data用户11111')
          console.log(data)
          console.log('data.msg.scope', data.msg.scope)
          if (data.errorcode == 0) {
            if (search_info.field == null) { this.setState({ field_c: data.msg.scope, }); } else { this.setState({ field_c: search_info.field, }); }
            if (search_info.subject == null) { this.setState({ subject_c: data.msg.course, }); } else { this.setState({ subject_c: search_info.subject, }); }
            if (search_info.r_grade == null) { this.setState({ r_grade_c: data.msg.grade, }); } else { this.setState({ r_grade_c: search_info.r_grade, }); }
            //联动接口
            $.ajax({
              url: "/api_v1.1/advancedSearch/queryResourceAndKnowledgeNodes",
              type: "GET",
              dataType: "json",
              data: {
                "r_keyKeyword": search_info.keyWord.join(','),
                "field": this.state.field_c,
                "subject": this.state.subject_c,
                "nameTitle": search_info.name.join(','),
                "grade": this.state.r_grade_c,
                "description": search_info.description.join(','),
                "count": 5,
                "page": 1,
              },
              success: function (data) {
                console.log('知识点、资源', data)
                if (data.errorCode == 0) {
                  this.setState({
                    ResourceInfo: data.resource.resource,
                    allpage2: data.resource.allpages,
                    current2: 1,
                  });
                }

              }.bind(this),
              error: function (xhr, status, err) {
              }.bind(this)
            });
          }
          else {
            console.log('用户属性获取失败');
          }
        }.bind(this),
        error: function (xhr, status, err) {
        }.bind(this)
      });

    }
    else {
      $.ajax({
        url: "/api_v1.1/advancedSearch/getQueryResourceDetails",
        type: "GET",
        dataType: "json",
        data: {
          "knowidString": this.state.temp.join(','),
          "count": 5,
          "page": 1
        },
        success: function (data) {
          console.log('data联动资源');
          console.log(data);
          if (data.errorCode == 0) {
            this.setState({
              ResourceInfo: data.msg,
              allpage2: data.allpages,
              current2: 1,
            });
          }
          else {
            console.log('联动信息获取失败');
            Modal.warning({
              title: '哎呦~',
              content: '出错了！',
            });
          }
        }.bind(this),
        error: function (xhr, status, err) {
        }.bind(this)
      });
    }
  }


  onCheck = (checkedKeys, e) => {
    this.setState({
      checkedKeys: checkedKeys,
    });
    this.state.checkedNode.push({ 'checked': e.checked, 'knowid': e.node.props.dataRef.knowid, 'title': e.node.props.dataRef.title })

    for (let i = this.state.checkedNode.length - 1; i >= 0; i--) {
      if (e.node.props.dataRef.knowid == this.state.checkedNode[i].knowid) {
        if (e.checked == false) {
          this.state.checkedNode.splice(i, 1);
        }
      }
    }
    this.state.pagechecked.push({ 'page': this.state.current1, 'checked': checkedKeys })
    for (let i = this.state.pagechecked.length - 1; i >= 0; i--) {
      if (this.state.current1 == this.state.pagechecked[i].page) {
        if (this.state.pagechecked[i].checked != checkedKeys) {
          this.state.pagechecked.splice(i, 1);
        }
      }
    }
    this.setState({ checkedKeys });
  }

  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      this.getKnowledgeStorageNextLayer(treeNode.props.knowid);
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
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  }

  getRecommendByContent(search_info) {
    //根据用户id查看推荐资源列表
    const { login_info } = this.props;
    // const { search_info } = this.props;
    // 获取用户信息
    $.ajax({
      url: "/api_v1.1/user/getUserInfo_v1_1",
      type: "GET",
      dataType: "json",
      // async: false,
      data: {
        "username": login_info.username,
      },
      success: function (data) {
        console.log('data用户11111')
        console.log(data)
        console.log('data.msg.scope', data.msg.scope)
        if (data.errorcode == 0) {
          if (search_info.field == null) { this.setState({ field_c: data.msg.scope, }); console.log(' this.state.field推荐11', this.state.field_c); console.log('search_info.field推荐11', search_info.field); } else { this.setState({ field_c: search_info.field, }); console.log(' this.state.field推荐12', this.state.field_c); console.log('search_info.field推荐12', search_info.field); }
          if (search_info.subject == null) { this.setState({ subject_c: data.msg.course, }); } else { this.setState({ subject_c: search_info.subject, }); }
          if (search_info.r_grade == null) { this.setState({ r_grade_c: data.msg.grade, }); } else { this.setState({ r_grade_c: search_info.r_grade, }); }
          $.ajax({
            url: "/api_v1.1/apiPackage/getRecommendForUserInSearch",
            type: "GET",
            dataType: "json",
            // async: false,
            data: {
              "UserId": login_info.userid,//1,
              "k": 4,
              "subject": this.state.subject_c,
              "field": this.state.field_c,
              "grade": this.state.r_grade_c
            },
            success: function (data) {
              console.log('推荐资源结果1', data)
              console.log('this.state.field推荐2', this.state.field_c)
              if (data.erroCode == 0) {
                this.setState({
                  recommendContent: data.msg,
                });
              }
              else {
                console.log('推荐资源失败');
              }
            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this)
          });
        }
        else {
          console.log('用户属性获取失败');
        }
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
    $.ajax({
      url: "/api_v1.1/apiPackage/getSimUser",
      type: "GET",
      dataType:
        "json",
      async: false,
      data: { "UserId": login_info.userid },
      success: function (data) {
        (data.msg).map((v, i) => {
          this.state.data1.push({
            key: 'i',
            num: <p>{i + 1}</p>,
            name: <p>{v.username}</p>,
            sim: <p>{v.sim}</p>
          });
        })
      }.bind(this),
      error: function (xhr, status, err) {
      }.bind(this)
    });
  }
  //查看资源详情
  getresourceId(r_id) {
    const { setResourceId } = this.props;
    setResourceId({
      type: 'setResourceId',
      payload: r_id
    });
    this.context.router.history.push("/App/resourceDetailSearch");
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search_info != this.props.search_info) {
      this.getdata(nextProps.search_info);
      this.getRecommendByContent(nextProps.search_info);
    }

  }

  componentDidMount() {

    this.getdata(this.props.search_info);
    this.getRecommendByContent(this.props.search_info);
  }

  render() {
    //推荐资源列表
    if (JSON.stringify(this.state.recommendContent[0]) == '{}') {
      this.state.recommendContentList = (function () {
        return (
          <Row><Col span={24} style={{ textAlign: 'center' }}><p><Icon type="loading" />加载中……</p></Col></Row>
        );
      })();
    } else {
      this.state.recommendContentList = this.state.recommendContent.map((v, i) => {
        return (
          <Card key={i}>
            <Form>
              <FormItem
                label=""
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
                hasFeedback
                style={{ marginBottom: '5px' }}
              >
                <span>{v.r_id}、</span>
                <span dangerouslySetInnerHTML={{ __html: v.r_name }}></span>
                <p dangerouslySetInnerHTML={{ __html: v.r_desc }}></p>
                <Row>
                  <Col span={16}> </Col>
                  <Col span={8}> <Button type="primary" style={{ marginLeft: "50px", float: "right", color: "#fff", background: "#2a95de", border: "#2a95de" }} size="small" onClick={this.getresourceId.bind(this, v.r_id)}>查看详情</Button></Col>
                </Row>
              </FormItem>
            </Form>
          </Card>
        );
      });
    }
    //检索资源列表
    if (JSON.stringify(this.state.ResourceInfo[0]) == '{}') {
      //  console.log(JSON.stringify(this.state.ResourceInfo[0])=='{}');
      this.state.resourceList = (function () {
        return (
          <Row><Col span={24} style={{ textAlign: 'center' }}><p><Icon type="loading" />加载中……</p></Col></Row>
        );
      })();
    } else {

      this.state.resourceList = this.state.ResourceInfo.map((v, i) => {
        return (
          <Card key={i}>
            <p >{v.r_name}</p><br />
            <p style={{ marginLeft: "20px", marginTop: "8px" }}>
              <Col span={16}>来源：{v.r_from}</Col>
              <Col span={8}>
                <Button type="primary" style={{ color: "#fff", background: "#2a95de", border: "#2a95de", marginLeft: "50px" }} size="small" onClick={this.getresourceId.bind(this, v.r_id)}>查看详情</Button>
              </Col>
            </p>
          </Card>
        );
      });
    }
    //知识列表加载
    const relationKnowledgeInfoList1 = this.state.treeData.map(() => {
      if (JSON.stringify(this.state.treeData[0]) == '{}') {
        return (
          <Row key={this.state.treeData[0].knowid}><Col span={24} style={{ textAlign: 'center' }}><p><Icon type="loading" />加载中……</p></Col></Row>
        );
      }
    });
    return (
      <Layout style={{ marginTop: "20px" }}>
        <Row gutter={24}>
          <Col span={7} >
            <Card
              title="知识点列表"
              bordered={true}
              className="search-scroll"
            >
              {relationKnowledgeInfoList1}
              <Row>
                <Tree
                  checkable
                  checkStrictly
                  onCheck={this.onCheck}
                  onChange={onChange}
                  checkedKeys={this.state.checkedKeys}
                  defaultChecked={false}
                  loadData={this.onLoadData} >
                  {this.renderTreeNodes(this.state.treeData)}
                </Tree>
              </Row><br />
              <Row > <Col span={24} style={{ textAlign: 'center' }}>
                <Pagination current={this.state.current1} onChange={this.onChange1} total={this.state.allpage1 * 10} />
              </Col></Row><br />
              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Button type="primary" onClick={this.checkSubmit.bind(this)}>确定</Button>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={10}>
            <Card
              title="检索资源列表"
              bordered={true}
              className="search-scroll">
              <Row>{this.state.resourceList}</Row>
              <Row style={{ textAlign: 'bottom' }}> <Col span={24} style={{ textAlign: 'center' }}>
                <Pagination current={this.state.current2} onChange={this.onChange2} total={this.state.allpage2 * 10} />
              </Col></Row>
            </Card>
          </Col>
          <Col span={7}>
            {/* <Card
              title="资源关联推荐"
              bordered={true}
              className="search-scroll">
              {this.state.recommendContentList}
            </Card> */}

            <Card title={<p>
              {/* <Button style={buttoncolor}>资源推荐</Button> */}资源推荐
              <span style={{ paddingLeft: 10}}><Button style={{ color: "#fff", background: "#2a95de", border: "#2a95de",marginLeft: '50%'}} onClick={this.showModal}>推荐解释</Button></span>
              <Modal
                title={<p>
                  <span style={{ paddingLeft: 10 }}>用户及其相似度值</span>
                </p>}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <p><Table columns={this.state.columns} dataSource={this.state.data1} pagination={false} showHeader={true} size="middle" /></p>
              </Modal>
            </p>} bordered={true} className="search-scroll">
              {this.state.recommendContentList}
            </Card>
          </Col>
        </Row>
      </Layout >
    );
  }
}

function mapStateToProps(state) {
  return {
    search_info: state.search_module1.search_info,
    login_info: state.reducer_login.login_info
  };
}


function mapDispatchToProps(dispatch) {
  return {
    setResourceId: (state) => dispatch(state)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(searchContent);