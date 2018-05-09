
var express = require('express');
var router = express.Router();
var http = require('http');
var conf = require('../configure');

//var vhost = '202.114.40.140';
var vport = conf.vHost_Port.vport;
var vhost = conf.vHost_Port.vhost;

//中文转urlencode
function url_encode(url) {
    url = encodeURIComponent(url);
    url = url.replace(/\%3A/g, ":");
    url = url.replace(/\%2F/g, "/");
    url = url.replace(/\%3F/g, "?");
    url = url.replace(/\%3D/g, "=");
    url = url.replace(/\%26/g, "&");
    url = url.replace(/\%5B/g, "[");
    url = url.replace(/\%5D/g, "]");
    url = url.replace(/\%22/g, "\"");
    url = url.replace(/\%2C/g, ",");
    url = url.replace(/\%7B/g, "{");
    url = url.replace(/\%7D/g, "}");
    return url;
}
//1.EXpress封裝接口樣例
function getFolderList(req, response) {

    const id = req.query.folderid;
    var headers = { 'folderid': id };
    var content = '';
    console.log(headers);

    var options = {
        host: '202.114.33.117',
        port: 8080,
        path: '/wsRESTfulService/mooc/lesson/getFolderList',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            var result = JSON.parse(content);
            response.json(result);
        });

    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}

//2.柯立秋：1.根据输入的知识点内容、描述信息等，获取关键字
function knowKeyWord(req, response) {

    const knowcontent = req.query.knowcontent;
    var headers = { 'knowcontent': knowcontent };
    let content = '';
    data = require('querystring').stringify(headers)
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/knowrelationservice/knowkeyword',
        method: 'POST',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: content })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }

            //var result = JSON.parse(content);

        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.write(data);
    req.end();
}

//3.根据一个知识点的id和另一个知识点内容计算知识点关联权重
function knowResWeight(req, response) {

    const rcontent = req.query.rcontent;

    let core = '';

    var body = { 'rcontent': rcontent };
    data = require('querystring').stringify(body)
    console.log(body);
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/knowrelationservice/knowresweight',
        method: 'POST',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            //console.log(body)
            core += body;
        }).on("end", function () {
            if (core[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (core.length != 0 && core != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(core) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
        //console.log(req);
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.write(data)
    req.end();
}

//4.根据一个知识点的id和另一个知识点内容计算知识点关联权重
function calculateResourceWeight(req, response) {

    const rcontent = req.query.rcontent;

    let core = '';

    console.log(rcontent);

    var body = { 'rcontent': rcontent };

    var options = {
        host: vhost,
        port: vport,
        path: '/restful/services/knowrelationservice/knowresweight',
        method: 'POST',
        body: body
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            core += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();

}

//5.刘佳敏：普通检索
function normalSelect(req, response) {

    const searchWord = req.query.searchWord;
    var headers = { 'searchWord': searchWord };
    var content = '';
    console.log(headers);

    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/Res/getM',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            var result = JSON.parse(content);
            response.json(result);
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();


}

//6.高级检索
function highSelect(req, response) {

    const checkboxName = req.body.checkboxName;
    const themeTitle = req.body.themeTitle;
    const searchWord = req.body.searchWord;
    const matchingWays = req.body.matchingWays;
    const pageNum = req.body.pageNum;
    const publishedTime1 = req.body.publishedTime1;
    const publishedTime2 = req.body.publishedTime2;
    const checkName = req.body.checkName;

    var body = {
        'checkboxName': checkboxName,
        'themeTitle': themeTitle,
        'searchWord': searchWord,
        'matchingWays': matchingWays,
        'pageNum': pageNum,
        'publishedTime1': publishedTime1,
        'publishedTime2': publishedTime2,
        'checkName': checkName
    };
    var content = '';
    console.log(body);

    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/Res/getF',
        method: 'GET',
        body: body
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            var result = JSON.parse(content);
            response.json(result);
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}

//刘佳敏 20171130
function liujiamin(req, response) {
    const keyWord = req.body.keyWord;
    const scope = req.body.scope;
    const field = req.body.field;
    const subject = req.body.subject;
    const name = req.body.name;
    const r_grade = req.body.r_grade;
    const description = req.body.description;

    var body = {
        'keyWord': url_encode(keyWord),
        'scope': url_encode(scope),
        'field': url_encode(field),
        'subject': url_encode(subject),
        'name': url_encode(name),
        'r_grade': url_encode(r_grade),
        'description': url_encode(description)
    };
    var content = '';
    console.log(body);

    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/Res/getSources',
        method: 'GET',
        headers: body
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}

//7.杨贞：知识点关联检索



function knowledgeRelationSelect(req, response) {
    const keyword = req.query.keyword;
    //const scope = req.query.scope;
    const field = req.query.field;
    const subject = req.query.subject;
    const name = req.query.name;
    const grade = req.query.grade;
    const description = req.query.description;
    const count = req.query.count;
    const page = req.query.page;
    const countk = req.query.countk;
    const pagek = req.query.pagek;
    const uid = req.query.uid;
    var headersArray = {
        'field': url_encode(field),
        'subject': url_encode(subject),
        'grade': url_encode(grade),
        'keyword': url_encode(keyword),
        'name': url_encode(name),
        'description': url_encode(description),
        'count': count,
        'page': page,
        'countk': countk,
        'pagek': pagek,
        'uid': uid
    };

    // if (keyWord == undefined || keyWord == null || scope == undefined || scope == null) {
    //     res.json({ erroCode: '1', msg: 'keyWord或者scope为空，请输入值，或等待接口再次调整' })
    // } else {
    //     if (field == undefined || field == null) {
    //         delete headersArray['field']
    //         console.log(headersArray)
    //     }
    //     if (subject == undefined || subject == null) {
    //         delete headersArray['subject']
    //     }
    //     if (r_grade == undefined || r_grade == null) {
    //         delete headersArray['r_grade']
    //     }
    //     if (name == undefined || name == null) {
    //         delete headersArray['name']
    //     }
    //     if (description == undefined || description == null) {
    //         delete headersArray['description']
    //     }
        var content = '';
        console.log(headersArray);

        var options = {
            host: '202.114.40.140',
            port: '8080',
            path: '/UCF/recommend/knowrelationquery/getQ',
            method: 'GET',
            headers: headersArray
        };

        var req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (body) {
                content += body;
            }).on("end", function () {
                if (content[0] == '<') {
                    response.json({ erroCode: '1', msg: 'no response from server' })
                } else {
                    if (content.length != 0 && content != null) {
                        response.json({ erroCode: '0', msg: JSON.parse(content) })
                    } else {
                        response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                    }
                }
            });
        });
        req.on('error', function (e) {
            console.log("auth_user error: " + e.message);
        });
        req.end();
    }
// }

function getMultisourceInfo(req, response) {
    const knowid = req.query.knowid;
    var headers = {
        'knowid': knowid
    };
    var content = '';
    //console.log(body);

    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/knowrelationquery/getSuKnow',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}
function yangzhen(req, response) {
    const knowledgeInfo = req.query.knowledgeInfo;
    const count = req.query.count;
    const page = req.query.page;
    var body = {
        'knowledgeInfo': url_encode(knowledgeInfo),
        'count': count,
        'page': page
    };
    var content = '';
    console.log(body);

    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/knowrelationquery/getK',
        method: 'GET',
        headers: body
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }

        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}
//8.徐帅：众智
function getCrowsWeight(req, response) {

    const knowledge = req.query.knowledge;
    const resourceId = req.query.resourceId;
    var headers = { 'knowledge': knowledge, 'resourceId': resourceId };
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/Res/getCrowsWeight',
        method: 'GET',
        body: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}

//9.王立彬：推荐接口
function getRecommendByContent(req, response) {

    const userId = req.query.userId;
    const recommendTag = req.query.recommendTag;
    const num = req.query.num;
    var headers = { 'userId': userId, 'recommendTag': recommendTag, 'num': num };
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/Res/getRecommendByContent',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}

//1、	知识库中：知识地图-知识点详情-推荐资源
function getRecommendByKnow(req, response) {
    const IsKnowId = req.query.IsKnowId;
    const knowId = req.query.knowId;
    const k = req.query.k;

    var headers = { 'knowId': knowId, 'k': k , 'IsKnowId': IsKnowId};
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/RecommedForSystem/getRecommendByKnow',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}

//2、	知识库中：查看资源详情-跳到资源详情界面-推荐资源模块
function getRecommendByRid(req, response) {

    const Rid = req.query.Rid;
    const k = req.query.k;

    var headers = { 'Rid': Rid, 'k': k };
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/RecommedForSystem/getRecommendByRid',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}

//3、	教材体系中：知识地图-知识点详情-推荐资源
function getRecommendByKnowForV(req, response) {

    const KnowId = req.query.KnowId;
    const Version = req.query.Version;
    const k = req.query.k;
    const IsKnowId = req.query.IsKnowId;

    var headers = { 'KnowId': KnowId, 'Version':new Buffer(Version).toString('base64','utf-8'), 'k': k ,'IsKnowId': IsKnowId};
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/RecommedForSystem/getRecommendByKnowForV',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}

//4、	教材体系中：查看资源详情-跳到资源详情界面-推荐资源模块
function getRecommendByRidForV(req, response) {

    const Rid = req.query.Rid;
    const Version = req.query.Version;
    const k = req.query.k;

    // urlVersion = url_encode(Version);
    // console.log(urlVersion);
    // strVersion = decodeURIComponent(urlVersion);
    // console.log(strVersion);
    var headers = { 'Rid': Rid, 'Version': new Buffer(Version).toString('base64','utf-8'), 'k': k };
    console.log(headers)
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/RecommedForSystem/getRecommendByRidForV',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}

//5、	个人知识地图中：知识地图-知识点详情-推荐资源
function getRecommendByKnowForUser(req, response) {

    const UserId = req.query.UserId;
    const KnowId = req.query.KnowId;
    const k = req.query.k;
    const IsKnowId = req.query.IsKnowId;

    var headers = { 'UserId': UserId, 'KnowId': KnowId, 'k': k ,'IsKnowId' : IsKnowId};
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/RecommedForSystem/getRecommendByKnowForUser',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}

//6、	个人知识地图中：查看资源详情-跳到资源详情界面-推荐资源模块
function getRecommendByRidForUser(req, response) {

    const UserId = req.query.UserId;
    const Rid = req.query.Rid;
    const k = req.query.k;

    var headers = { 'UserId': UserId, 'Rid': Rid, 'k': k };
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/RecommedForSystem/getRecommendByRidForUser',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        })
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}

//7、	检索界面中：推荐资源
function getRecommendForUserInSearch(req, response) {

    const UserId = req.query.UserId;
    const subject = req.query.subject;
    const field = req.query.field;
    const grade = req.query.grade;
    const k = req.query.k;

    var headers = { 
        'field': new Buffer(field).toString('base64','utf-8'),
        'subject': new Buffer(subject).toString('base64','utf-8'),
        'grade': new Buffer(grade).toString('base64','utf-8'), 
        'UserId': UserId,
        'k': k 
    };
    console.log(headers)
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/RecommedForSystem/getRecommendForUserInSearch',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}
//2018-01-22添加人教社的请求转发避免出现跨域问题
function sendRequestforRenJiaoPublish(req, response){
    /* 
    const username = req.query.username;
    const timestamp = req.query.timestamp;
    const authid = req.query.authid;
 */
    const username = req.query.username;
    const password = req.query.password;


    var content = '';

    var options = {
        host:'192.168.71.201',
        port:3000,
        path:'/api_v1.1/user/login_v1_1?username='+username+'&password='+password,
        method:'GET',
    };

    console.log('options', options)
    var req = http.request(options, function(res){
        res.setEncoding('utf8');
        res.on('data', function(body){
            content +=body;
            console.log('content', content)
        }).on("end",function(){
            //var result = stringify(content);
            response.send(content);
        })
    })
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
    
}
//1. 知识库/知识地图 中的知识点详情推荐解释
function getRelationK(req, response) {
    const IsKnowId = req.query.IsKnowId;
    const KnowId = req.query.KnowId;

    var headers = { 'KnowId': KnowId,'IsKnowId': IsKnowId};
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/RecommedForSystem/getRelationK',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}
//2. 知识库/知识地图 中的资源详情推荐解释
function getRelationKByRid (req, response) {

    const Rid = req.query.Rid;

    var headers = { 'Rid': Rid};
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/RecommedForSystem/getRelationKByRid',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}
//3. 我的地图的知识点详情推荐解释
function getRelationKWithUser  (req, response) {

    const UserId = req.query.UserId;
    const KnowId = req.query.KnowId;
    const IsKnowId = req.query.IsKnowId;

    var headers = { 'UserId': UserId, 'KnowId': KnowId, 'IsKnowId' : IsKnowId};
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/RecommedForSystem/getRelationKWithUser',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        });
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}
//4. 我的地图的资源详情推荐解释
function getRelationKByRidWithUser (req, response) {

    const UserId = req.query.UserId;
    const Rid = req.query.Rid;

    var headers = { 'UserId': UserId, 'Rid': Rid};
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/RecommedForSystem/getRelationKByRidWithUser',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        })
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}
//5. 检索界面的推荐解释
function getSimUser (req, response) {

    const UserId = req.query.UserId;
    var headers = { 'UserId': UserId};
    let content = '';
    var options = {
        host: vhost,
        port: vport,
        path: '/UCF/recommend/RecommedForSystem/getSimUser',
        method: 'GET',
        headers: headers
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            content += body;
        }).on("end", function () {
            if (content[0] == '<') {
                response.json({ erroCode: '1', msg: 'no response from server' })
            } else {
                if (content.length != 0 && content != null) {
                    response.json({ erroCode: '0', msg: JSON.parse(content) })
                } else {
                    response.json({ erroCode: '2', msg: '数据为空或者数据传输出错' })
                }
            }
        })
    });
    req.on('error', function (e) {
        console.log("auth_user error: " + e.message);
    });
    req.end();
}
module.exports = {
    getFolderList: getFolderList,
    knowKeyWord: knowKeyWord,
    knowResWeight: knowResWeight,
    knowledgeRelationSelect: knowledgeRelationSelect,
    getCrowsWeight: getCrowsWeight,
    getMultisourceInfo: getMultisourceInfo,
    liujiamin: liujiamin,
    yangzhen: yangzhen,
    getRecommendByKnow: getRecommendByKnow,
    getRecommendByRid: getRecommendByRid,
    getRecommendByKnowForV: getRecommendByKnowForV,
    getRecommendByRidForV: getRecommendByRidForV,
    getRecommendByKnowForUser: getRecommendByKnowForUser,
    getRecommendByRidForUser: getRecommendByRidForUser,
    //getRecommendForUserInSearch: getRecommendForUserInSearch,
    getRecommendForUserInSearch: getRecommendForUserInSearch,
    sendRequestforRenJiaoPublish: sendRequestforRenJiaoPublish,
    getRelationK: getRelationK,
    getRelationKByRid: getRelationKByRid,
    getRelationKWithUser: getRelationKWithUser,
    getRelationKByRidWithUser: getRelationKByRidWithUser,
    getSimUser: getSimUser

}
