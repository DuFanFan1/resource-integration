import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { Card, Form } from 'antd';
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';
import IMG from './images/course.png';
import DOC from './images/doc.png';
import SOURCE from './images/source.png';

const FormItem = Form.Item;

class ResInformation extends Component {
    // 状态机
    constructor(props) {
        super(props);
        this.state = {
            resource: '',
            file_url: '',
            r_desc: '',
            r_name: '',
            subject: '',
            rtype:'',
        }
    }
    //根据资源id查看资源详情
    getdata() {
        $.ajax({
            url: "/api_v1.1/knowledge_resource/resourceDetail_v1_1",
            type: "GET",
            dataType: "json",
            async: false,
            data: { "r_id": this.props.name },
            success: function (data) {
                if (data.errorCode == '0') {
                    this.setState({
                        resource: data.msg[0],
                        file_url: data.msg[0].file_url,
                        r_desc: data.msg[0].r_desc,
                        r_name: data.msg[0].r_name,
                        subject: data.msg[0].subject,
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
            }.bind(this)
        });
    }

    componentWillMount() {
        this.getdata();
    }
    componentDidMount() {
    }

    render() {
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
        } else if (this.state.resource.rtype == "试题") {
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
                            <span >{this.state.resource.r_name.replace(/^[1-9]/, "").replace(/^、/, "")}</span>
                        </FormItem>
                        <FormItem
                            label=''
                            labelCol={{ span: 0 }}
                            wrapperCol={{ span: 16 }}
                            hasFeedback
                            style={{ marginBottom: '3px' }}
                        >
                            <p dangerouslySetInnerHTML={{ __html: this.state.r_desc }}></p>
                        </FormItem>
                    </Form>
                )
            }
        } else if (this.state.resource.rtype == "课件") {
            //ppt预览的方式
            showStyle = (
                <span>
                    <a href={this.state.file_url} target="_blank">
                        <p><img src={IMG} style={{ width: 80, height: 90 }} /></p>
                        <p>{this.state.resource.r_name}</p>
                    </a>
                </span>
            )
        }
        else if (this.state.resource.rtype == "案例" || this.state.resource.rtype == "文献" || this.state.resource.rtype == "试卷") {
            //案例预览的方式
            showStyle = (
                <span>
                    <a href={this.state.file_url} target="_blank">
                        <p><img src={DOC} style={{ width: 80, height: 90 }} /></p>
                        <p>{this.state.resource.r_name}</p>
                    </a>
                </span>
            )
        } else if (this.state.resource.rtype == "素材") {
            //素材预览的方式
            showStyle = (
                <span>
                    <a href={this.state.file_url} target="_blank">
                        <p><img src={SOURCE} style={{ width: 80, height: 90 }} /></p>
                        <p>{this.state.resource.r_name}</p>
                    </a>
                </span>
            )
        }
        return (
            <div>
                <Card style={{ height: 900 }} title={<p>{this.state.resource.r_name.replace(/^[1-9]/, "").replace(/^、/, "")}</p>}>
                    {showStyle}
                </Card>
            </div>
        )
    }
}

export default {
    doit: function doit(id) {
        ReactDOM.render(<ResInformation name={id} />, document.getElementById('react-container'));
    }

}
// ReactDOM.render(<ResInformation/>, document.getElementById('react-container'));
