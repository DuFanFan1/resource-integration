var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var data = require('../../database/db');

var knowledge = require('../../model/api_v1.1/knowledge')
var knowledge_struct = require('../../model/api_v1.1/knowledge_struct')
var knowledge_struct_rela_know = require('../../model/api_v1.1/knowledge_struct_rela_know')
var knowledge_struct_index = require('../../model/api_v1.1/knowledge_struct_index')
var knowledge_struct_rela_know_view = require('../../model/api_v1.1/knowledge_struct_rela_know_view')
//var perknowledge_struct = require('../../model/api_v1.1/perknowledge_struct')
//var perknowledge_struct_rela_know = require('../../model/api_v1.1/perknowledge_struct_rela_know')
var knowledge_res_relation = require('../../model/api_v1.1/knowledge_res_relation');
var resource = require('../../model/api_v1.1/resource');

var Knowledge = knowledge(data.testdb, Sequelize);
var Knowledge_struct = knowledge_struct(data.testdb, Sequelize);
var Knowledge_struct_rela_know = knowledge_struct_rela_know(data.testdb, Sequelize);
var Knowledge_struct_index = knowledge_struct_index(data.testdb, Sequelize)
var Knowledge_struct_rela_know_view = knowledge_struct_rela_know_view(data.testdb, Sequelize);
//var Perknowledge_struct = perknowledge_struct(data.testdb, Sequelize);
//var Perknowledge_struct_rela_know = perknowledge_struct_rela_know(data.testdb, Sequelize);
var Knowledge_res_relation = knowledge_res_relation(data.testdb, Sequelize);
const Resource = resource(data.testdb, Sequelize);

var time = new Date();

//通过知识点knowid和节点structid建立节点和知识点关联关系（即节点关联知识点）
function addKnowledgeRelations(req, res) {
    const JsonArray = req.body.JsonArray;
    console.log(req.body);
    Knowledge_struct_rela_know.bulkCreate(

        JsonArray

    )
        .then(result => {
            if (result.length != 0) {

                Knowledge_struct_rela_know.findAll({
                    order:[
                        ['id','DESC']
                    ],
                    limit:JsonArray.length
                })
                .then(result1=>{
                    let rs0 = {
                        errorCode: 0,
                        msg: result1
                    }
                    res.send(rs0);
                })
               
            } else {
                let rs1 = {
                    errorCode: 1,
                    msg: "failure"
                }
                res.send(rs1);
            }
        });
}

//通过pre_structid和knowid删除地图结构节点的关联知识点
function deleteKnowledgeRelations(req, res) {

    const knowid = req.query.knowid;
    const structid = req.query.structid;

    Knowledge_struct_rela_know.destroy({
        where: { structid: structid, knowid: knowid }
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
        })
}
Knowledge_struct.hasMany(Knowledge_struct_rela_know, { foreignKey: 'structid' });
Knowledge_struct_rela_know.belongsTo(Knowledge, { foreignKey: 'knowid' });
//通过mapid获取知识地图echarts层级结构
async function getKonwldedgeMapStruct(req, res) {
    var starttime = (new Date()).valueOf();
    const mapid = req.query.mapid;
    var structdata = [];
    var pre_structdata = [];
    var links = [];
    var map = new Map();
    result = await Knowledge_struct_index.findOne({
        attributes: ['map_name'],
        where: {
            mapid: mapid
        }
    })
    result1 = await Knowledge_struct.findAll({
        //attributes: ['structid', 'title', 'pre_structid', 'is_knowledge','structpath'],
        where: { mapid: mapid },
    });

    if (result == null || result.length == 0) {
        res.json({ errorCode: '1', msg: 'mapid对应的map不存在' })
    } else {
        if (result1 == null || result1.length == 0) {
            res.json({ errorCode: '1', msg: 'mapid对应的struct不存在' })
        } else {
            //先拿到基本内容
            let structFirstitem = {
                knowid: 0,
                name: 0 + ',' + result.dataValues.map_name,
                category: 1,
                //level:0,
                value: result.dataValues.map_name
            }
            structdata.push(structFirstitem);
            for (let i = 0; i < result1.length; i++) {
                map[result1[i].dataValues.structid] = result1[i].dataValues;
                let structitem = {
                    knowid: result1[i].dataValues.structid,
                    name: result1[i].dataValues.structid + ',' + result1[i].dataValues.title,
                    is_knowledge: result1[i].dataValues.is_knowledge,
                    pre_structid: result1[i].dataValues.pre_structid,
                    category: 2,
                    level:result1[i].dataValues.level,
                    value: result1[i].dataValues.title,
                    reletedResCount:0
                }
                let pre_structitem = {
                    pre_structid: result1[i].dataValues.pre_structid,
                    title: result1[i].dataValues.structid + ',' + result1[i].dataValues.title,
                    structid: result1[i].dataValues.structid
                }
                structdata.push(structitem);
                pre_structdata.push(pre_structitem);
            }
            /**
             * 添加struct的links关联
             */
            for(let i=0;i<pre_structdata.length;i++){
                var pre_result = map[pre_structdata[i].pre_structid];
                if(pre_result !=null){
                    let linksitem = {
                        source: pre_result.structid + ',' + pre_result.title,
                        target: pre_structdata[i].title
                    }
                    links.push(linksitem);
                }
                if(pre_structdata[i].pre_structid == 0){
                    let item = {
                        source: '0,' + result.dataValues.map_name,
                        target: pre_structdata[i].title
                    }
                    links.unshift(item);
                }
            }
            result2 = await Knowledge_struct_rela_know.findAll({
                where:{
                    mapid:mapid,
                    structid: {
                        [Op.ne]: 0
                    }
                },
                include:{
                    model:Knowledge,
                    where:{knowid:Sequelize.col('knowledge_struct_rela_know.knowid')}
                }
            })
            //console.log(result2[0].dataValues);
            var map1 = new Map();
            for(let i=0; i<result2.length; i++){
                map1[result2[i].dataValues.knowledge.knowid] = result2[i].dataValues.knowledge;
                //console.log('1'+result2[i].dataValues.knowledge.title);
                let structitem = {
                    knowid: result2[i].dataValues.knowledge.knowid,
                    name: result2[i].dataValues.knowledge.knowid + ',' + result2[i].dataValues.knowledge.title,
                    is_knowledge: result2[i].dataValues.knowledge.is_knowledge,
                    pre_structid: result2[i].dataValues.knowledge.pre_knowid,
                    category:2,
                    level: result2[i].dataValues.knowledge.level,
                    value: result2[i].dataValues.knowledge.title,
                    reletedResCount:result2[i].dataValues.knowledge.res_count
                }
                structitem.name += '('+result2[i].dataValues.knowledge.res_count+')';
                structitem.value += '('+result2[i].dataValues.knowledge.res_count+')';
                structdata.push(structitem);
                //console.log('2'+result2[i].dataValues.knowledge.title);
                let linksitem = {
                    source: result2[i].dataValues.structid + ',' + map[result2[i].dataValues.structid].title,
                    target: result2[i].dataValues.knowid+','+map1[result2[i].dataValues.knowid].title + '('+result2[i].dataValues.knowledge.res_count+')'
                }
                //console.log('3'+result2[i].dataValues.knowledge.title);
                links.push(linksitem);
            }

            /*//利用方法异步处理拿取links中的关系
            links = await getquery(pre_structdata, mapid);
            var StructidArray = await getStructidArray(mapid);
            //console.log(StructidArray)
            var KnowledgeStruct = await getKnowledgeStruct(StructidArray)
            var structid_res_knowidInfo = KnowledgeStruct.Infos
            for (let i = 0; i < structid_res_knowidInfo.length; i++) {
                await structdata.push(structid_res_knowidInfo[i])
            }
            var structid_res_knowidLink = KnowledgeStruct.Links
            for (let i = 0; i < structid_res_knowidLink.length; i++) {
                await links.push(structid_res_knowidLink[i])
            }*/
            resultJson = {
                "data": structdata,
                "links": links
            }
            res.json({ errorCode: '0', msg: resultJson })
            console.log((new Date()).valueOf()-starttime);
        }
    }
}

//查询一层级以下的关联关系
async function getquery(array, mapid) {
    var links = [];
    result2 = await Knowledge_struct_index.findOne({
        attributes: ['map_name'],
        where: {
            mapid: mapid
        }
    })
    result = await Knowledge_struct.findAll({
        attributes: ['title', 'structid'],
        where: { pre_structid: 0, mapid: mapid }
    })
    if (result == 0 || result.length == 0) {
        res.json({ errorCode: '1', msg: 'pre_struct为0对应的mapid不存在' })
    } else {
        for (let i = 0; i < result.length; i++) {
            let pre_struct_is_0_item = {
                source: 0 + ',' + result2.dataValues.map_name,
                target: result[i].dataValues.structid + ',' + result[i].dataValues.title,
            }
            links.push(pre_struct_is_0_item);
        }
        for (let j = 1; j < array.length; j++) {
            result1 = await Knowledge_struct.findOne({
                attributes: ['title', 'structid'],
                where: { structid: array[j].pre_structid }
            })
            if (result1 != null) {
                //console.log(result1.dataValues.title);
                let linksitem = {
                    source: result1.dataValues.structid + ',' + result1.dataValues.title,
                    target: array[j]['title']
                }
                links.push(linksitem);
            }
        }
    }
    return links;
}

Knowledge_struct_rela_know.belongsTo(Knowledge, { foreignKey: 'knowid' });
Knowledge_struct_rela_know.belongsTo(Knowledge_struct, { foreignKey: 'structid' });
//对object组成的array进行去重
function unique(array) {
    var result = [];
    //console.log(array.length)
    var obj = {};
    for (var i = 0; i < array.length; i++) {
        if (obj[array[i].structid + '+' + array[i].knowid] == null) {
            result.push(array[i]);
            obj[array[i].structid + '+' + array[i].knowid] = 1;
        }
    }
    return result;
}
async function getStructidArray(mapid) {
    var array = [];
    result = await Knowledge_struct_rela_know.findAll({
        attributes: ['structid', 'knowid', 'preknowid', 'contain_child'],
        where: { mapid: mapid }
    });
    for (let i = 0; i < result.length; i++) {
        let item = {
            structid: result[i].dataValues.structid,
            knowid: result[i].dataValues.knowid,
            preknowid: result[i].dataValues.preknowid,
            contain_child: result[i].dataValues.contain_child
        }
        array.push(item)
    }
    //console.log(unique(array))
    return unique(array)
}

//根据mapid中的structid去关联knowledge的层级结构
async function getKnowledgeStruct(array) {
    var structid_res_knowidInfos = [];
    var structid_res_knowidLinks = [];
    for (let i = 0; i < array.length; i++) {
        if(array[i].preknowid == 0){
            result = await Knowledge.findOne({
                attributes: ['title', 'is_knowledge'],
                where: {
                    knowid: array[i].knowid
                }
            })
            result1 = await Knowledge_struct.findOne({
                attributes: ['title'],
                where: {
                    structid: array[i].structid
                }
            })
            if (result != null && result.length != 0 && result1 != null && result1 != 0) {
                let no_childLink = {
                    source: array[i].structid + ',' + result1.dataValues.title,
                    target: array[i].knowid + ',' + result.dataValues.title
                }
                structid_res_knowidLinks.push(no_childLink);
                let no_childInfo = {
                    knowid: array[i].knowid,
                    name: array[i].knowid + ',' + result.dataValues.title,
                    is_knowledge: result.dataValues.is_knowledge,
                    pre_knowid: array[i].preknowid,
                    category: 3,
                    value:result.dataValues.title
                }
                structid_res_knowidInfos.push(no_childInfo);
            }
        }else{
            result = await Knowledge.findOne({
                attributes: ['title', 'is_knowledge'],
                where: {
                    knowid: array[i].knowid
                }
            })
            result1 = await Knowledge.findOne({
                attributes: ['title', 'is_knowledge'],
                where: {
                    knowid: array[i].preknowid
                }
            })
            if (result != null && result.length != 0 && result1 != null && result1 != 0) {
                let childknowidInfo = {
                    knowid: array[i].knowid,
                    name: array[i].knowid + ',' + result.dataValues.title,
                    is_knowledge: result.dataValues.is_knowledge,
                    pre_knowid: array[i].preknowid,
                    category: 3,
                    value:result.dataValues.title
                }
                structid_res_knowidInfos.push(childknowidInfo)
                let knowledge_structLink = {
                    source: array[i].preknowid + ',' + result1.dataValues.title,
                    target: array[i].knowid + ',' + result.dataValues.title
                }
                structid_res_knowidLinks.push(knowledge_structLink)
            }
        }    
    }
    //console.log(unique(structid_res_knowidInfos))
    //console.log(structid_res_knowidLinks)
    return { Infos: unique(structid_res_knowidInfos), Links: structid_res_knowidLinks }
}


//通过知识点knowid删除知识地图中与知识点的关联关系
/*
1.判断knowid是否为父节点；
2.如果是，需要更新它为父节点的节点pre_knowid为0，再执行删除操作；
3.如果不是，只需要执行删除操作
*/
async function deleteRelationKnowid(req, res) {

    const knowid = req.query.knowid;
    //1.判断是否为父
    result = await Knowledge_struct_rela_know.findAll({
        where: { knowid: knowid }
    })
    console.log(result[0].dataValues.preknowid);
    console.log(result[0].dataValues.id);
    //如果为子直接删除
    if (result[0].dataValues.preknowid != 0) {

        Knowledge_struct_rela_know.destroy({
            where: { knowid: knowid }
        })
            .then(result1 => {
                if (result1 != 0) {
                    let rs0 = {
                        errorCode: 0,
                        msg: "delete success"
                    }
                    res.send(rs0);
                } else {
                    let rs1 = {
                        errorCode: 1,
                        msg: "delete failure"
                    }
                    res.send(rs1);
                }
            })
    } else {

        result3 = await Knowledge_struct_rela_know.findAll({

            where: { preknowid: knowid }
        })
        console.log("result3.length");
        console.log(result3.length);

        if (result3.length != 0) {

            Knowledge_struct_rela_know.update({
                preknowid: 0
            }, {
                    where: { preknowid: knowid }
                })
                .then(async result2 => {
                    console.log(result2);
                    if (result2 != 0) {
                        //表示执行更新成功，进入下一步操作，删除
                        await Knowledge_struct_rela_know.destroy({
                            where: { knowid: knowid }
                        })
                            .then(result5 => {
                                if (result5 != 0) {
                                    let rs0 = {
                                        errorCode: 0,
                                        msg: "delete success"
                                    }
                                    res.send(rs0);
                                } else {
                                    let rs1 = {
                                        errorCode: 1,
                                        msg: "delete failure"
                                    }
                                    res.send(rs1);
                                }
                            })
                    } else {
                        //表示执行更新失败
                        let rs2 = {
                            errorCode: 2,
                            msg: "update failure"
                        }
                        res.send(rs1);
                    }

                })

        } else {
            result4 = await Knowledge_struct_rela_know.destroy({
                where: { knowid: knowid }
            })
            if (result4 != 0) {
                let rs0 = {
                    errorCode: 0,
                    msg: "delete success"
                }
                res.send(rs0);
            } else {
                let rs1 = {
                    errorCode: 1,
                    msg: "delete failure"
                }
                res.send(rs1);
            }
        }

    }
}



async function updatemapid(req, res) {


    for (var id = 32; id <= 1073; id++) {
        console.log(id);
        result = await Knowledge_struct.update({
            id: id
        }, {
                where: {
                    structid: id
                }
            })
    }
    res.send("okay");
}

async function updateView_url(req, res) {


    for (let i = 1; i <= 61374; i++) {
        console.log(i);
        result = await Resource.update({
            view_url: '202.114.40.155:8080/'+'question?id='+i
        }, {
                where: {
                    r_id: i
                }
            })
    }
    res.send("okay");
}

async function updateFileSize(req, res){

    result = await Resource.findAll({
        where:{
            r_id:{[Op.lte]:61374}
        }
    })

     for(let i=0;i<61375;i++){
         console.log("i",i)
        console.log("Length",result[i].dataValues.r_name.length+result[i].dataValues.r_desc.length)
        Resource.update({
            file_size:result[i].dataValues.r_name.length+result[i].dataValues.r_desc.length
        },{
            where:{
                r_id:{[Op.lte]:61374}
            }
        })
    } 
    res.send(result);

}


/* 
function personalMapSave(req, res) {
    const mapid = req.query.mapid;
    const uid = req.query.uid;

    Knowledge_struct_index.findOne({
        where: {
            mapid: mapid
        }
    })
        .then(result => {
            if (result == null || result.length == 0) {
                res.json({ errorCode: '1', msg: 'mapid对应的知识地图不存在' })
            } else {
                if (result.dataValues.uid == uid) {
                    res.json({ errorCode: '2', msg: '该用户已经将该地图另存为' })
                } else {
                    Knowledge_struct_index.create({
                        map_name: result.dataValues.map_name,
                        field: result.dataValues.field,
                        grade: result.dataValues.grade,
                        subject: result.dataValues.subject,
                        version: result.dataValues.version,
                        kmap_type: '自定义地图',
                        is_shared: result.dataValues.is_shared,
                        is_del: result.dataValues.is_del,
                        uid: uid,
                        addtime: time
                    })
                        .then(result1 => {
                            if (result1 == null || result1.length == 0) {
                                res.json({ errorCode: '3', msg: '个人知识地图创建失败' })
                            } else {
                                Knowledge_struct_index.findOne({
                                    attributes: ['mapid'],
                                    where: {
                                        map_name: result.dataValues.map_name,
                                        uid: uid
                                    }
                                })
                                    .then(async result2 => {
                                        if (result2 == null || result2.length == 0) {
                                            res.json({ errorCode: '4', msg: '用户另存为的mapid对应的知识地图获取失败' })
                                        } else {
                                            await Knowledge_struct_rela_know.findAll({
                                                where: {
                                                    mapid: mapid
                                                }
                                            })
                                                .then(result3 => {
                                                    if (result3 == null || result3.length == 0) {
                                                        res.json({ errorCode: '5', msg: 'struct_rela_know信息获取失败' })
                                                    } else {
                                                        for (let i = 0; i < result3.length; i++) {
                                                            Perknowledge_struct_rela_know.create({
                                                                structid: result3[i].dataValues.structid,
                                                                mapid: result2.dataValues.mapid,
                                                                knowid: result3[i].dataValues.knowid,
                                                                preknowid: result3[i].dataValues.preknowid,
                                                                contain_child: result3[i].dataValues.contain_child
                                                            })
                                                        }
                                                    }
                                                })
                                            await Knowledge_struct.findAll({
                                                where: {
                                                    mapid: mapid
                                                }
                                            })
                                                .then(result4 => {
                                                    if (result4 == null || result4.length == 0) {
                                                        res.json({ errorCode: '6', msg: '用户另存为的mapid对应的知识点结构获取失败' })
                                                    } else {
                                                        for (let i = 0; i < result4.length; i++) {
                                                            Perknowledge_struct.create({
                                                                structid: result4[i].dataValues.structid,
                                                                mapid: result2.dataValues.mapid,
                                                                title: result4[i].dataValues.title,
                                                                pre_structid: result4[i].dataValues.pre_structid,
                                                                description: result4[i].dataValues.description,
                                                                keywords: result4[i].dataValues.keywords,
                                                                is_knowledge: result4[i].dataValues.is_knowledge,
                                                                subject: result4[i].dataValues.subject,
                                                                uid: uid,
                                                                addtime: time,
                                                                update_time: time
                                                            })
                                                        }
                                                    }
                                                })
                                        }
                                    })
                            }
                        })
                }
            }
        })
} */
module.exports = {
    addKnowledgeRelations: addKnowledgeRelations,
    deleteKnowledgeRelations: deleteKnowledgeRelations,
    getKonwldedgeMapStruct: getKonwldedgeMapStruct,
    deleteRelationKnowid: deleteRelationKnowid,
    updatemapid: updatemapid,
    //personalMapSave: personalMapSave,
    updateView_url:updateView_url,
    updateFileSize:updateFileSize
}
