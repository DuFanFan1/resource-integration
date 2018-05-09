import React, { Component } from 'react';
// import { Tabs, Row, Col, Layout, Checkbox, Breadcrumb, Input, Button, Card, Icon, Radio, DatePicker, Form, message, Select, Tag, Modal, } from 'antd';
import 'antd/dist/antd.css';
// import $ from 'jquery';
import PropTypes from "prop-types";
import moment from 'moment';
import { connect } from 'react-redux';
import repository from './images/repository.png';
import information from './images/information.png';
import mymap from './images/mymap.png';
import mytask from './images/mytask.png';
import mytopicmap from './images/mytopicmap.png';
import search from './images/search.png';
import statistics from './images/statistics.png';
import teachingmaterial from './images/teachingmaterial.png';
import zykyun from './images/zykyun.png';
import { Card } from 'antd';


const gridStyle1 = {
    width: '33%',
    height: '200px',
    textAlign: 'center',
    background: '#c23531',
    color: '#FFFFFF'
};
const gridStyle2 = {
    width: '33%',
    height: '200px',
    textAlign: 'center',
    background: '#dd8668',
    color: '#FFFFFF'
};
const gridStyle3 = {
    width: '33%',
    height: '200px',
    textAlign: 'center',
    background: '#DE9C04',
    color: '#FFFFFF'
};
const gridStyle4 = {
    width: '33%',
    height: '200px',
    textAlign: 'center',
    background: '#314656',
    color: '#FFFFFF'
};
const gridStyle5 = {
    width: '33%',
    height: '200px',
    textAlign: 'center',
    background: '#91c7ae',
    color: '#FFFFFF'
};
const gridStyle6 = {
    width: '33%',
    height: '200px',
    textAlign: 'center',
    background: '#bda29a',
    color: '#FFFFFF'
};
const gridStyle7 = {
    width: '33%',
    height: '200px',
    textAlign: 'center',
    background: '#61a0a8',
    color: '#FFFFFF'
};
const gridStyle8 = {
    width: '33%',
    height: '200px',
    textAlign: 'center',
    background: '#8FBC8F',
    color: '#FFFFFF'
};
const gridStyle9 = {
    width: '33%',
    height: '200px',
    textAlign: 'center',
    background: '#6e7074',
    color: '#FFFFFF'
};
class MapSubject extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor(props, context) {
        super(props, context)
        // this.state = {
        //     Display: "none",
        // }
    }
    mapType(maptype) {
        const { mapType, type1 } = this.props;

        if (maptype == '知识库') {
            mapType({
                type: 'mapType',
                payload: {
                    mapType: '知识库',
                }
            });
            type1({
                type: 'type1',
                payload: {
                    mapType: 'repository',
                }
            })
            this.context.router.history.push("/App/SelectSubject_Index");
        }
        else if (maptype == '知识地图') {
            mapType({
                type: 'mapType',
                payload: {
                    mapType: '标准地图',
                }
            });
            type1({
                type: 'type1',
                payload: {
                    mapType: 'map',
                }
            })
            this.context.router.history.push("/App/SelectSubject_Index");
        }
        else if (maptype == '我的地图') {
            mapType({
                type: 'mapType',
                payload: {
                    mapType: '我的地图',
                }
            });
            type1({
                type: 'type1',
                payload: {
                    mapType: 'mytask',
                }
            });
            this.context.router.history.push("/App/MapType_MyMap");
        }
        else if (maptype == '主题图') {
            mapType({
                type: 'mapType',
                payload: {
                    mapType: '主题图',
                }
            });
            type1({
                type: 'type1',
                payload: {
                    mapType: 'mytopicmap',
                }
            });
            this.context.router.history.push("/App/MapType_TopMap");
        }
        else if (maptype == '统计分析') {
            type1({
                type: 'type1',
                payload: {
                    mapType: 'statistics',
                }
            })
            this.context.router.history.push("/App/Statistics_Index");
        }
        else if (maptype == '资源检索') {
            type1({
                type: 'type1',
                payload: {
                    mapType: 'search',
                }
            });
            this.context.router.history.push("/App/Search_Index");
        }
        else if (maptype == '学习资源库') {
            type1({
                type: 'type1',
                payload: {
                    mapType: 'zyk-yun',
                }
            });
            window.location.href = 'http://zyk-yun.mypep.com.cn/app/resource/manage.php';
        }
        else if (maptype == '个人信息') {
            type1({
                type: 'type1',
                payload: {
                    mapType: 'information',
                }
            });
            this.context.router.history.push("/App/User_Index/MyInformation");
        }
        else if (maptype == '我的任务') {
            type1({
                type: 'type1',
                payload: {
                    mapType: 'mytask',
                }
            });
            this.context.router.history.push("/App/MyTask"); 
        }

    }
    render() {
        const { login_info } = this.props;
        return (

            <Card bordered={false}>
                <Card.Grid
                    style={gridStyle1}                 
                    onClick={this.mapType.bind(this, '知识库')}
                >
                     <br/><img src={repository} style={{ width: 70, height: 80 }} /><br/>
                    <h1 style={{color: '#FFFFFF'}}>知识库</h1>
                </Card.Grid>
                <Card.Grid
                    style={gridStyle2}
                    onClick={this.mapType.bind(this, '知识地图')}
                >
                   <br/> <img src={teachingmaterial} style={{ width: 70, height: 80 }} /><br />
                    <h1 style={{color: '#FFFFFF'}}>知识地图</h1>
                </Card.Grid>
                <Card.Grid
                    style={gridStyle3}
                  
                    onClick={this.mapType.bind(this, '学习资源库')}
                >
                     <br/> <img src={zykyun} style={{ width: 70, height: 80 }} /><br />
                     <h1 style={{color: '#FFFFFF'}}>学习资源库</h1>
                </Card.Grid>
                <Card.Grid
                    style={gridStyle4}
                    onClick={this.mapType.bind(this, '主题图')}
                >
                    <br /> <img src={mytopicmap} style={{ width: 70, height: 80 }} /><br />
                    <h1 style={{color: '#FFFFFF'}}>主题图</h1>
                </Card.Grid>
                <Card.Grid
                    style={gridStyle5}
                    onClick={this.mapType.bind(this, '统计分析')}
                >
                    <br /> <img src={statistics} style={{ width: 70, height: 80 }} /><br />
                    <h1 style={{color: '#FFFFFF'}}>统计分析</h1>
                </Card.Grid>
                <Card.Grid
                    style={gridStyle6}
                    onClick={this.mapType.bind(this, '个人信息')}
                >
                    <br /> <img src={information} style={{ width: 70, height: 80 }} /><br />
                    <h1 style={{color: '#FFFFFF'}}>个人信息</h1>
                </Card.Grid>
                <Card.Grid
                    style={gridStyle7}
                    onClick={this.mapType.bind(this, '我的地图')}
                >
                    <br /> <img src={mymap} style={{ width: 70, height: 80 }} /><br />
                    <h1 style={{color: '#FFFFFF'}}>我的地图</h1>
                </Card.Grid>
                <Card.Grid
                    style={gridStyle8}
                    onClick={this.mapType.bind(this, '资源检索')}
                >
                    <br /> <img src={search} style={{ width: 70, height: 80 }} /><br />
                    <h1 style={{color: '#FFFFFF'}}>资源检索</h1>
                </Card.Grid>
                <Card.Grid
                    style={gridStyle9}
                    onClick={this.mapType.bind(this, '我的任务')}
                >
                    <br /> <img src={mytask} style={{ width: 70, height: 80 }} /><br />
                    <h1 style={{color: '#FFFFFF'}}>我的任务</h1>
                </Card.Grid>

            </Card>

        );
    }
}
function mapStateToProps(state) {
    return {
        login_info: state.reducer_login.login_info,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        mapType: (state) => dispatch(state),
        type1: (state) => dispatch(state),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapSubject)
