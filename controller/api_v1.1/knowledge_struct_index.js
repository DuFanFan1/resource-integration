var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var data = require('../../database/db');

var knowledge_struct_index = require('../../model/api_v1.1/knowledge_struct_index');
var knowledge_struct = require('../../model/api_v1.1/knowledge_struct');
var knowledge_struct_rela_know = require('../../model/api_v1.1/knowledge_struct_rela_know');
var knowledge_struct_rela_know_view = require('../../model/api_v1.1/knowledge_struct_rela_know_view');
//var perknowledge_struct_rela_know = require('../../model/api_v1.1/perknowledge_struct_rela_know');
//var perknowledge_struct = require("../../model/api_v1.1/perknowledge_struct");

var Knowledge_struct_index = knowledge_struct_index(data.testdb, Sequelize);

var Knowledge_struct = knowledge_struct(data.testdb, Sequelize);
var Knowledge_struct_rela_know = knowledge_struct_rela_know(data.testdb, Sequelize);
var Knowledge_struct_rela_know_view = knowledge_struct_rela_know_view(data.testdb, Sequelize);
//var Perknowledge_struct = perknowledge_struct(data.testdb, Sequelize);
//var perknowledge_struct_rela_know = perknowledge_struct_rela_know(data.testdb, Sequelize);

var time = new Date();

//1.添加知识地图
function addKnowledgeMaps(req, res) {

    const map_name = req.body.map_name;
    const field = req.body.field;
    const grade = req.body.grade;
    const subject = req.body.subject;
    const version = req.body.version;
    const kmap_type = req.body.kmap_type;
    const is_shared = req.body.is_shared;
    const uid = req.body.uid;

    Knowledge_struct_index.create({

        map_name: map_name,
        field: field,
        grade: grade,
        subject: subject,
        version: version,
        kmap_type: kmap_type,
        is_shared: is_shared,
        uid: uid,
        is_del: 1,
        addtime: time,
        update_time: time,
        click_count: 0,
        edit_count: 0

    }).then(result => {
        if (result.length != 0) {
            let rs0 = {
                errorCode: 0,
                msg: "success"
            }
            res.send(rs0);
        } else {
            let rs1 = {
                errorCode: 1,
                msg: "failure"
            }
            res.send(rs1);
        }
    });

}
//2.通过mapid删除知识地图
function deleteKnowledgeMaps(req, res) {

    const mapid = req.query.mapid;

    Knowledge_struct_index.update({

        is_del: 2

    },
        { where: { mapid: mapid } }
    )
        .then(result => {
            if (result != 0) {
                let rs0 = {
                    errorCode: 0,
                    msg: "success"
                }
                res.send(rs0);
            } else {
                let rs1 = {
                    errorCode: 1,
                    msg: "failure"
                }
                res.send(rs1);
            }
        })
}
//3.通过mapid获取知识地图描述信息详情
function getKnowledgeMap(req, res) {

    const mapid = req.query.mapid;

    Knowledge_struct_index.findOne({

        where: { mapid: mapid }

    })
        .then(result => {
            if (result != null) {
                let rs0 = {
                    errorCode: 0,
                    msg: result
                }
                res.send(rs0);
            } else {
                let rs1 = {
                    errorCode: 1,
                    msg: "no data"
                }
                res.send(rs1);
            }
        })
}
//4.通过mapid编辑知识地图
function editKnowledgeMapDescriptions(req, res) {

    const mapid = req.body.mapid;

    const map_name = req.body.map_name;
    const field = req.body.field;
    const grade = req.body.grade;
    const subject = req.body.subject;
    const version = req.body.version;
    const kmap_type = req.body.kmap_type;
    const is_shared = req.body.is_shared;
    const uid = req.body.uid;

    Knowledge_struct_index.update({

        map_name: map_name,
        field: field,
        grade: grade,
        subject: subject,
        version: version,
        kmap_type: kmap_type,
        is_shared: is_shared,
        uid: uid,
        update_time: time

    }, {
            where: { mapid: mapid }
        })
        .then(result => {
            if (result != 0) {
                let rs0 = {
                    errorCode: 0,
                    msg: "success"
                }
                res.send(rs0);
            } else {
                let rs1 = {
                    errorCode: 1,
                    msg: "failure"
                }
                res.send(rs1);
            }
        });

}
//5.通过学科，学段，版本，类型获取知识地图列表
function queryKnowledgeMapbySFVT(req, res) {

    const subject = req.query.subject;
    const grade = req.query.grade;
    const version = req.query.version;
    const kmap_type = req.query.kmap_type;

    Knowledge_struct_index.findAll({
        where: {
            subject: subject,
            grade: grade,
            version: version,
            kmap_type: kmap_type,
            is_del: 1
        }
    })
        .then(result => {
            var resultJsonArray = [];
            if (result.length != 0) {
                for (let i = 0; i < result.length; i++) {
                    let item = {
                        value: 1,
                        mapid: result[i].dataValues.mapid,
                        name: result[i].dataValues.map_name,
                        field: result[i].dataValues.field,
                        grade: result[i].dataValues.grade,
                        subject: result[i].dataValues.subject,
                        version: result[i].dataValues.version,
                        kmap_type: result[i].dataValues.kmap_type,
                        is_shared: result[i].dataValues.is_shared,
                        is_del: result[i].dataValues.is_del,
                        uid: result[i].dataValues.uid,
                        addtime: result[i].dataValues.addtime,
                        update_time: result[i].dataValues.update_time,
                        click_count: result[i].dataValues.click_count,
                        edit_count: result[i].dataValues.edit_count
                    };
                    resultJsonArray.push(item);
                }
                let rs0 = {
                    errorCode: 0,
                    msg: resultJsonArray
                }
                res.send(rs0);
            } else {
                let rs1 = {
                    errorCode: 1,
                    msg: "failure"
                }
                res.send(rs1);
            }
        });
}
//通过地图类型，地图版本，用户uid获取我的地图列表（即用户另存为后的地图列表）
function queryKnowledgeMapbyTVU(req, res) {

    const kmap_type = req.query.kmap_type;
    const version = req.query.version;
    const uid = req.query.uid;

    Knowledge_struct_index.findAll({

        where: {
            kmap_type: kmap_type,
            version: version,
            uid: uid,
            is_del:"不删除"
        }
    }).then(result => {
        var resultJsonArray = [];
        if (result.length != 0) {
            for (let i = 0; i < result.length; i++) {
                let item = {
                    value: 1,
                    mapid: result[i].dataValues.mapid,
                    name: result[i].dataValues.map_name,
                    field: result[i].dataValues.field,
                    grade: result[i].dataValues.grade,
                    subject: result[i].dataValues.subject,
                    version: result[i].dataValues.version,
                    kmap_type: result[i].dataValues.kmap_type,
                    is_shared: result[i].dataValues.is_shared,
                    is_del: result[i].dataValues.is_del,
                    uid: result[i].dataValues.uid,
                    addtime: result[i].dataValues.addtime,
                    update_time: result[i].dataValues.update_time,
                    click_count: result[i].dataValues.click_count,
                    edit_count: result[i].dataValues.edit_count
                };
                resultJsonArray.push(item);
            }
            let rs0 = {
                errorCode: 0,
                msg: resultJsonArray
            }
            res.send(rs0);
        } else {
            let rs1 = {
                errorCode: 1,
                msg: "failure"
            }
            res.send(rs1);
        }
    });
}

//通过mapid获取知识地图echarts形式层级结构（知识地图和主题图）
/*
--knowledge_struct_index表
1.查询mapid=x的时候的map_name
--knowledge_struct
2.查询mapid=x&&pre_knowid=0的title名
--knowledge_struct_view
3.提取出structid之间本身的逻辑关系(存为数组1),并存储structid为数组，方便下面提取与其关联的知识点
--knowledge_struct_rela_know
4.遍历structid数组，得到structid与knowid之间的关系，并将knowid存储成数组，方便下面knowid来使用
--knowledge
5.通过knowid查询获得到title；
6.通过pre_knowid=knowid获得到其子节点（存为数组2）；
7.合并两个数组，存储成数据结构
*/

//另存为个人知识地图
/*
--操作knowledge_struct_index
1.复制传参过来指定的mapid的所有内容，然后修改其中的kmap_type:自定义地图/version:主题图/uid:用户id
--操作knowledge_struct
2.复制mapid为传参过来的mapid
--操作关联了mapid的视图，
3.查询structid和knowid的关联记录
--操作knowledge_struct_rela_know
4.插入查询所得到的数组
*/
async function saveAsAnOtherMaps(req, res) {

    const mapid = req.query.mapid;
    const map_name = req.query.map_name;
    const uid = req.query.uid;

    //--操作knowledge_struct_index表
    //1.查询、修改、插入记录
    result0 = await Knowledge_struct_index.findAll({

        where: { mapid: mapid }

    })
    console.log(result0[0].dataValues.version);
    //console.log(matchEnum(result0[0].dataValues.version,versionArray));
    console.log(result0[0].dataValues.is_del);
    //console.log(matchEnum(result0[0].dataValues.is_del,is_delArray));
    console.log("result0.length——"); console.log(result0.length);
    if (result0.length != 0) {
        //此判断有点多余,可否一并省去

        result1 = await Knowledge_struct_index.create({
            map_name: map_name,
            field: result0[0].dataValues.field,
            grade: result0[0].dataValues.grade,
            subject: result0[0].dataValues.subject,
            version: "自定义地图",
            kmap_type: "自定义地图",
            is_shared: result0[0].dataValues.is_shared,
            is_del: result0[0].dataValues.is_del,
            uid: uid,
            addtime: time,
            update_time: time,
            click_count: 0,
            edit_count: 0
        })
        //console.log(result0[0].dataValues.version);
        console.log("result1——");
        console.log(result1);
        if (result1 != 0) {
            //如果已经插入进去新记录了，查询最新的mapid是多少
            LeastMapid = await Knowledge_struct_index.findAll({
                order: [
                    ['mapid', 'DESC']
                ]
            })
            console.log("LeastMapid——");
            console.log(LeastMapid[0].dataValues.mapid);
        }

        //--操作Knowledge_struct表
        result2 = await Knowledge_struct.findAll({

            where: { mapid: mapid }

        })
        var structidArray = [];
        var relationArray = [];

        //如果在knowledge_struct表中有结构记录就保存到struct数组中，方便多条记录插入
        console.log("result2.length——");
        console.log(result2.length);
        if (result2.length != 0) {

            for (let i = 0; i < result2.length; i++) {

                let item = {
                    structid: result2[i].dataValues.structid,
                    mapid: LeastMapid[0].dataValues.mapid,
                    title: result2[i].dataValues.title,
                    pre_structid: result2[i].dataValues.pre_structid,
                    description: result2[i].dataValues.description,
                    keywords: result2[i].dataValues.keywords,
                    is_knowledge: result2[i].dataValues.is_knowledge,
                    uid: uid,
                    addtime: time,
                    update_time: time,
                    structpath:result2[i].dataValues.structpath,
                    level:result2[i].dataValues.level,
                    struct_res_count:result2[i].dataValues.struct_res_count

                }
                structidArray.push(item);
            }
            console.log("structidArray.length——");
            console.log(structidArray.length);

        }
        //拿到structArray数据后插入到Knowledge_struct表中为新记录
        result3 = await Knowledge_struct.bulkCreate(

            structidArray

        )
        console.log("result3.length——");
        console.log(result3.length);

        if (result3.length != 0) {
            //复制完struct表后执行对关联关系表的查询复制

            result4 = await Knowledge_struct_rela_know.findAll({
                where: { mapid: mapid }
            })

            if (result4.length != 0) {

                for (let j = 0; j < result4.length; j++) {
                    let item = {

                        structid: result4[j].dataValues.structid,
                        mapid: LeastMapid[0].dataValues.mapid,
                        knowid: result4[j].dataValues.knowid,
                        preknowid: result4[j].dataValues.preknowid,
                        contain_child: result4[j].dataValues.contain_child

                    }
                    relationArray.push(item);
                }
                result5 = await Knowledge_struct_rela_know.bulkCreate(

                    relationArray

                )
                if (result5 != 0) {

                    let rs0 = {
                        errorCode: 0,
                        msg: "success"
                    }
                    res.send(rs0);

                }


            } else {
                let rs0 = {
                    errorCode: 0,
                    msg: "success"
                }
                res.send(rs0);
            }

        } else {

            let rs1 = {
                errorCode: 1,
                msg: "no struct (success)"
            }
            res.send(rs1);

        }
    }
}


//字符串枚举类型转换
function matchEnum(str, kindArray) {

    for (let i = 0; i < kindArray.length; i++) {

        if (str == kindArray[i]) {
            return i;
        }
    }
}

module.exports = {
    addKnowledgeMaps: addKnowledgeMaps,
    deleteKnowledgeMaps: deleteKnowledgeMaps,
    getKnowledgeMap: getKnowledgeMap,
    editKnowledgeMapDescriptions: editKnowledgeMapDescriptions,
    queryKnowledgeMapbySFVT: queryKnowledgeMapbySFVT,
    queryKnowledgeMapbyTVU: queryKnowledgeMapbyTVU,
    saveAsAnOtherMaps: saveAsAnOtherMaps
}