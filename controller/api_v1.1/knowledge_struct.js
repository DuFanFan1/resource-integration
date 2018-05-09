var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs')

var data = require('../../database/db');

var knowledge_struct = require('../../model/api_v1.1/knowledge_struct')
var knowledge_struct_rela_know = require('../../model/api_v1.1/knowledge_struct_rela_know')
var knowledge = require('../../model/api_v1.1/knowledge')
var resknowledgenodedetail = require('../../model/api_v1.1/resknowledgenodedetail')
var knowledge_struct_res_relation_temp = require('../../model/api_v1.1/knowledge_struct_res_relation_temp')
var resource = require('../../model/api_v1.1/resource')
var structid_res_resource_view = require('../../model/api_v1.1/structid_res_resource_view')

var Resource = resource(data.testdb, Sequelize)
var Knowledge_struct_res_relation_temp = knowledge_struct_res_relation_temp(data.testdb, Sequelize)
var Knowledge_struct = knowledge_struct(data.testdb, Sequelize)
var Knowledge_struct_rela_know = knowledge_struct_rela_know(data.testdb, Sequelize)
var Knowledge = knowledge(data.testdb, Sequelize)
var Resknowledgenodedetail = resknowledgenodedetail(data.testdb, Sequelize)
var Structid_res_resource_view = structid_res_resource_view(data.testdb, Sequelize)

var time = new Date();

//7.通过mapid获取知识地图列表形式第一层级结构
function getKnowledgeRelationStruct(req, res) {

    const mapid = req.query.mapid;
    const pre_id = 0;

    //先根据mapid和pre_structid找出第一层级节点的structid
    Knowledge_struct.findAll({

        where: { mapid: mapid, pre_structid: pre_id },

    })
        .then(result => {
            console.log("result" + result);
            //如果此mapid存在则查询第一层级节点信息
            if (result != null) {

                Knowledge_struct.findAll({
                    where: {
                        pre_structid: result[0].dataValues.structid,
                        mapid: mapid
                    }
                })
                    .then(async result0 => {
                        console.log(result0);
                        if (result0.length != 0) {
                            let isLeaf = true;
                            var resultJsonArray = [];

                            for (let i = 0; i < result0.length; i++) {
                                let item = {
                                    structid: result0[i].dataValues.structid,
                                    title: result0[i].dataValues.title,
                                    is_knowledge: result0[i].dataValues.is_knowledge,
                                    key: "" + i + "",
                                    isLeaf: true
                                };
                                resultJsonArray.push(item);
                                try {
                                    //let com= await testAsync();
                                    await Knowledge_struct.findAll({
                                        where: { pre_structid: result0[i].dataValues.structid, mapid: mapid }
                                    }).then(async result1 => {
                                        if (result1.length != 0) {
                                            resultJsonArray[i].isLeaf = false;
                                            console.log(resultJsonArray[i].isLeaf);
                                        } else {
                                            await Knowledge_struct_rela_know.findAll({
                                                where: { structid: result0[i].dataValues.structid }
                                            })
                                                .then(result2 => {
                                                    if (result2.length != 0) {
                                                        resultJsonArray[i].isLeaf = false;
                                                    } else {
                                                        resultJsonArray[i].isLeaf = true;
                                                    }
                                                })
                                        }
                                    });
                                } catch (err) {
                                    console.log(err);
                                }
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
                    })
            } else {
                let rs2 = {
                    errorCode: 2,
                    msg: "no this map"
                }
                res.send(rs2);
            }
        })
}

const {Console} = require('console');
const output = fs.createWriteStream('./log/stdout.log');
const errorOutput = fs.createWriteStream('./log/stderr.log');
const logger = new Console(output, errorOutput);

//通过mapid获取知识地图列表形式第一层级结构(修改)
function getKnowledgeRelationStruct1(req, res) {

    const mapid = req.query.mapid;
    const pre_id = 0;

    //先根据mapid和pre_structid找出第一层级节点的structid
    Knowledge_struct.findAll({

        where: { mapid: mapid, pre_structid: pre_id },

    })
        .then(async result => {
            console.log("result" + result);
            //如果此mapid存在则查询第一层级节点信息
            logger.log('result', result)

            if (result.length != 0) {
                let isLeaf = true;
                var resultJsonArray = [];

                for (let i = 0; i < result.length; i++) {
                    let item = {
                        structid: result[i].dataValues.structid,
                        mapid: result[i].dataValues.mapid,
                        title: result[i].dataValues.title,
                        pre_structid: result[i].dataValues.pre_structid,
                        description: result[i].dataValues.description,
                        keywords: result[i].dataValues.keywords,
                        is_knowledge: result[i].dataValues.is_knowledge,
                        uid: result[i].dataValues.uid,
                        addtime: result[i].dataValues.addtime,
                        update_time: result[i].dataValues.update_time,
                        key: "" + i + "",
                        isLeaf: false
                    }
                    resultJsonArray.push(item);
                    try {
                        //let com= await testAsync();
                        await Knowledge_struct.findAll({
                            where: { pre_structid: result[i].dataValues.structid, mapid: mapid }
                        }).then(result1 => {
                            if (result1.length != 0) {
                                resultJsonArray[i].isLeaf = false;
                                console.log(resultJsonArray[i].isLeaf);
                            } else {
                                resultJsonArray[i].isLeaf = true;
                            }
                        })
                    } catch (err) {
                        console.log(err);
                    }
                    //获取每个节点资源数
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
        })
}

//通过structid查询知识地图下一层级的结构(列表呈现)
//因增加knowledge_struct表中新增id和knowledge_struct_rela_know表中maipid，
//所以在查询的时候需要增加mapid进行条件约束
/*
查询此structid是否有子节点
--1.在knowledge_struct表中是否有子节点；
--2.在knowledge_struct_rela_know表中是否有子节点,如果有则读取建立视图的信息；
--3.也有可能是structid的子节点中，既有在knowledge_struct表中，也有在knowledge_struct_rela_know关联关系中；
ps:删除原来的Knowledgeview视图
*/
async function getKnowledgeRelationStructNextbyStructid(req, res) {

    const structid = req.query.structid;
    const mapid = req.query.mapid;
    var resultJsonArray = [];
    var resultJsonArrayN = [];
    let isLeaf = false;

    //操作knowledge_struct表
    result1 = await Knowledge_struct.findAll({

        where: { pre_structid: structid, mapid: mapid }
    })
    //如果在knowledge_struct表中有记录则提取具体消息
    if (result1.length != 0) {

        for (let i = 0; i < result1.length; i++) {

            let item = {

                structid: result1[i].dataValues.structid,
                title: result1[i].dataValues.title,
                pre_structid: result1[i].dataValues.pre_structid,
                description: result1[i].dataValues.description,
                keywords: result1[i].dataValues.keywords,
                is_knowledge: result1[i].dataValues.is_knowledge,
                uid: result1[i].dataValues.uid,
                addtime: result1[i].dataValues.addtime,
                update_time: result1[i].dataValues.update_time,
                isLeaf: isLeaf

            };

            //查询当前structid节点的子节点是否有子节点
            result2 = await Knowledge_struct.findAll({
                where: { pre_structid: result1[i].dataValues.structid, mapid: mapid }
            })
            //如果在knowledge_struct表中有则其不为叶子节点
            if (result2.length != 0) {

                item.isLeaf = false;
                console.log(item.isLeaf);

            } else {
                //如果在knowledge_struct表中没有，则需要查询knowledge_struct_rela_know表中是否有关联的知识元knowid
                result3 = await Knowledge_struct_rela_know.findAll({
                    where: { structid: result1[i].dataValues.structid, mapid: mapid }
                })
                //对查询结果做判断
                if (result3.length != 0) {
                    //如果在knowledge_struct_rela_know表中有记录，则不为叶子节点
                    item.isLeaf = false;
                    console.log(item.isLeaf);
                } else {
                    //如果在knowledge_struct_rela_know表中没有记录，则为叶子节点
                    item.isLeaf = true;
                    console.log(item.isLeaf);
                }
            }
            
            resultJsonArray.push(item);
        }

    }
    //如果在Knowledge_struct表中没有记录，则查询关联关系表
    //需要卡preknowid的值为0才能得到准确的值，因为如果把叶子节点信息拿到了
    result4 = await Knowledge_struct_rela_know.findAll({
        where: { structid: structid, preknowid: 0, mapid: mapid }
    })
    if (result4.length != 0) {
        console.log("result4.length");
        console.log(result4.length);
        //如果存在结果，则拉去出其子节点详细信息，并核实其是否有子节点
        for (let i = 0; i < result4.length; i++) {

            result5 = await Knowledge.findAll({

                where: { knowid: result4[i].dataValues.knowid }
            })
            //将对应的knowid的详细信息进行获取
            if (result5.length != 0) {
                for (let j = 0; j < result5.length; j++) {

                    let item = {

                        knowid: result5[j].dataValues.knowid,
                        title: result5[j].dataValues.title,
                        pre_knowid: result5[j].dataValues.pre_knowid,
                        description: result5[j].dataValues.description,
                        contribute: result5[j].dataValues.contribute,
                        keywords: result5[j].dataValues.keywords,
                        language: result5[j].dataValues.language,
                        importance: result5[j].dataValues.importance,
                        is_knowledge: result5[j].dataValues.is_knowledge,
                        field: result5[j].dataValues.field,
                        grade: result5[j].dataValues.grade,
                        subject: result5[j].dataValues.subject,
                        addtime: result5[j].dataValues.addtime,
                        updatetime: result5[j].dataValues.updatetime,
                        isLeaf: isLeaf

                    }
                    //对应查询result5的knowid是否是叶子节点,在关联关系中查询是否包含孩子节点的信息
                    result6 = await Knowledge_struct_rela_know.findAll({
                        where: { knowid: result5[j].dataValues.knowid, structid: structid, mapid: mapid }
                    })
                    console.log("result6.length");
                    console.log(result6.length);
                    if (result6[0].dataValues.contain_child == "否") {
                        item.isLeaf = true;
                        console.log(item.isLeaf);
                    } else {
                        item.isLeaf = false;
                        console.log(item.isLeaf);
                    }
                    result7 = await Knowledge.findOne({
                        attributes:[[Sequelize.fn('SUM', Sequelize.col('knowledge.res_count')),'res_num']],
                        where:{
                            knowpath:{
                                [Op.like]: result5[j].dataValues.knowpath + '%',
                            }
                        }
                    })
                    if (result7 != null) {
                        item.title = item.title +'('+ result7.dataValues.res_num+')';
                    } else {
                        item.title = item.title + '(0)';
                    }
                    //判断完后再插入到数组中
                    resultJsonArrayN.push(item);
                }
            }
        }
    }
    //合并两种情况的数据
    var result = await mergeArray(resultJsonArray, resultJsonArrayN)

    let rs0 = {
        errorCode: 0,
        msg: result
    }
    res.send(rs0);
}

function doublequeryTestDemo(req, res) {

    const structid = req.query.id1;

    Knowledge_struct.destroy({
        where: { structid: structid }
    })
        .then(result => {
            if (result != 0) { console.log("null") };
            res.send(result);

        })
    //console.log(result.length);
    //说明findAll的结果还是个数组
}


//将arr2中的数据元素添加到arr1中
function mergeArray(arr1, arr2) {

    arr2.forEach(element => {

        arr1.push(element);

    });
    return arr1;

}
//数组循环遍历读取
function readList(arr) {

    arr.forEach(element => {
        console.log(element);
    })
}


//通过层级structid获取节点详情
function getKnowledgeStructDetails(req, res) {

    const structid = req.query.structid;

    Knowledge_struct.findAll({

        where: { structid: structid }

    })
        .then(result => {
            if (result.length != 0) {
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

//通过mapid，以及节点信息添加知识地图层级节点
/*
1.添加修改——如果pre_structid=0的话,就直接插入;否则，就去查询structpath然后更改
*/
async function addKnowledgeNodeInfoDetails(req, res) {

    const mapid = req.body.mapid;
    const title = req.body.title;
    const pre_structid = req.body.pre_structid;
    const description = req.body.description;
    const keywords = req.body.keywords;
    //const is_knowledge = req.body.is_knowledge;
    const uid = req.body.uid

    leastid = await Knowledge_struct.findAll({
        order:
            [
                ['structid', 'DESC']
            ]
    })
    console.log(leastid[0].dataValues.structid);
    if (pre_structid == 0) {
    let structidpathid = leastid[0].dataValues.structid + 1
    result0 = await Knowledge_struct.create({
            structid: leastid[0].dataValues.structid + 1,
            mapid: mapid,
            title: title,
            pre_structid: pre_structid,
            description: description,
            keywords: keywords,
            is_knowledge: "否",
            uid: uid,
            addtime: time,
            update_time: time,
            structpath: structidpathid + ',',
            level: 1,
            struct_res_count: 0
        })
    if (result0.length != 0) {
            Knowledge_struct.findAll({
                order: [
                    ['id', 'DESC']
                ],
                limit: 1
            })
            .then(result => {
                    let rs0 = {
                        errorCode: 0,
                        msg: result
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

    } else {
        result1 = await Knowledge_struct.findOne({
            where: { structid: pre_structid }
        })
        console.log("structpath", result1.dataValues.structpath);

        var structid_add = leastid[0].dataValues.structid + 1;
        console.log("structid_add", structid_add);
        Knowledge_struct.create({

            structid: leastid[0].dataValues.structid + 1,
            mapid: mapid,
            title: title,
            pre_structid: pre_structid,
            description: description,
            keywords: keywords,
            is_knowledge: "否",
            uid: uid,
            addtime: time,
            update_time: time,
            structpath: result1.dataValues.structpath + structid_add + ',',
            level: result1.dataValues.structpath.split(',').length,
            struct_res_count: 0
        })
            .then(result => {
                if (result.length != 0) {
                    Knowledge_struct.findAll({
                        order: [
                            ['id', 'DESC']
                        ],
                        limit: 1
                    })
                        .then(result => {
                            let rs0 = {
                                errorCode: 0,
                                msg: result
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
}

//通过structid修改节点信息
function updateKnowledgeNodeInfoDetails(req, res) {

    const structid = req.body.structid;

    const title = req.body.title;
    const description = req.body.description;
    const keywords = req.body.keywords;

    Knowledge_struct.update({

        title: title,
        description: description,
        keywords: keywords,
        is_knowledge: "否",
        updatetime: time
    },
        {
            where: { structid: structid }
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

//通过structid删除节点信息
/*
--操作knowledge_struct_rela_know
1.查询knowledge_struct_rela_know中是否有此structid
2.有更新structid的值为pre_structid
--操作knowledge_struct
1.执行更新
2.执行查询
*/
async function deleteStructNode(req, res) {

    const structid = req.query.structid;
    const pre_structid = req.query.pre_structid;

    //1.操作knowledge_struct_rela_know;查询knowledge_struct_rela_know表中是否有structid
    result = await Knowledge_struct_rela_know.findAll({

        where: { structid: structid }

    })
    console.log("result");
    console.log(result);
    if (result.length != 0) {
        //2.更新structid
        result1 = await Knowledge_struct_rela_know.update({

            structid: pre_structid

        }, {
                where: { structid: structid }
            })
        console.log("result1");
        console.log(result1);
    }
    //如果在关联关系表中没有关系，则只在struct表中执行操作
    //执行更新{}

    result2 = await Knowledge_struct.findAll({
        where: { pre_structid: structid }
    })
    console.log("result2");
    console.log(result2);
    if (result2.length != 0) {
        result3 = await Knowledge_struct.update({

            pre_structid: pre_structid

        }, {
                where: { pre_structid: structid }
            })
        console.log("result3");
        console.log(result3);
    }

    result4 = await Knowledge_struct.destroy({

        where: { structid: structid }

    })
    console.log("result4");
    console.log(result4);
    if (result4 != 0) {

        let rs0 = {
            errorCode: 0,
            msg: "update delete success"
        }
        res.send(rs0);
    } else {

        let rs1 = {
            errorCode: 1,
            msg: " failure"
        }
        res.send(rs1);
    }

}
//根据知识地图的节点获取其相关联的知识元
/*
1.根据structid，mapid直接获取structpath中最长的字符串
2.切分字符串，并获取最后一个数字num
3.根据num查询获取knowledge_struct_rela_know是否有记录
4.如果有，则呈现所有记录；如果没有，则返回无
*/
Knowledge_struct_rela_know.hasMany(Knowledge,{foreignKey:'knowid',sourceKey:'knowid'});
async function presentKnowledgeStructResNodeDetail(req, res){

    const structid = req.query.structid;
    const mapid = req.query.mapid;
    const level = req.query.level;

    result0 = await Knowledge_struct.findAll({
        where:{
            mapid:mapid,
            structid:{[Op.gte]:structid},
            level:{[Op.gte]:level}
        }
    })
    //用于存储最长的字符串
    var resultArray = []
    let maxLength = result0[0].dataValues.structpath.split(',').length
    console.log('maxLength', maxLength);
    console.log('structpath', result0.length);
    //查找出最长字符串
     for(let i=1; i<result0.length; i++){
       if(result0[i].dataValues.structpath.split(',').length>=maxLength){
           maxLength = result0[i].dataValues.structpath.split(',').length
       } 
    }
    //获取最长的几个字符串
    for(let i=1; i<result0.length; i++){
        if(result0[i].dataValues.structpath.split(',').length>=maxLength){
            resultArray.push(result0[i])  
        }
    }
    var queryNumArray = []
    //获取最长字符串的最后一位数字(有可能是个数组，需要做循环处理)
    for(let i=0; i<resultArray.length; i++){
    var splitArray = resultArray[i].structpath.split(',')
    /* var transferArray = []
    for(let i=0; i<splitArray.length-1; i++){
        transferArray.push(parseInt(splitArray[i]))
    } */
    console.log('resultArray.length', resultArray.length);
    console.log('splitArray',splitArray);
    console.log('splitArray.length',splitArray.length);
    //console.log('transferArray',transferArray);
    queryNumArray.push(splitArray[splitArray.length-2])
    
    //console.log("num",splitArray[maxLength-1]);
    }
    console.log('queryNumArray', queryNumArray)
    //res.send(queryNumArray)
     var finalResultArray = []
    //查询资源
    
    for(let i=0; i<queryNumArray.length; i++){
        queryNum = parseInt(queryNumArray[i])
        console.log("i",parseInt(queryNumArray[i]))
        //关联查询
        
        result1 = await Knowledge_struct_rela_know.findAll({
            where:{structid:queryNum},
            include:{
                model:Knowledge,
                where:{knowid: Sequelize.col('knowledge_struct_rela_know.knowid')}
            }
        })
       
       /*  result1 = await Resknowledgenodedetail.findAll({
            where:{structid:queryNum}
        }) */
        if(result1.length!=0){
            finalResultArray.push(result1)
            console.log(result1)
        }
    }


    if(finalResultArray.length!=0){
        let rs0 = {
            errorCode: 0,
            msg: finalResultArray
        }
        res.send(rs0);
    }else{
        let rs1 = {
            errorCode: 1,
            msg: "no data"
        }
        res.send(rs1);
    } 
} 




/* Knowledge_struct_rela_know.hasMany(Knowledge,{foreignKey:'knowid',sourceKey:'knowid'});
async function testHasMany(req, res){

    const structid = req.query.structid;

    result = await Knowledge_struct_rela_know.findAll({
        where:{structid:structid},
        include:{
            model:Knowledge,
            where:{knowid: Sequelize.col('Knowledge_struct_rela_know.knowid')}
        }
    })
    console.log(result)
    res.send(result)
} */
async function presentViewKnowledgeStructResNodeDetail(req,res){

    const structid = req.query.structid;
    const mapid = req.query.mapid;
    const limit = req.query.count;
    const page = req.query.page;

    result = await Resknowledgenodedetail.findAndCountAll({
        where:{
            mapid:mapid,
            [Op.or]:[{
                structpath:{
                    [Op.like]:structid+',%'
                },
                structpath:{
                    [Op.like]:'%'+structid+',%'
                }
            }]
        },
        limit:limit*1,
        offset:(page - 1) * limit
    })
    length = result.length
    console.log("length",length)
    if(length!=0){
        let rs0 = {
            errorCode: 0,
            allpages: Math.ceil(result.count / limit),
            msg: result
        }
        res.send(rs0);
    }else{
        let rs1 = {
            errorCode: 1,
            msg: "no data"
        }
        res.send(rs1);
    } 
}

Knowledge_struct_res_relation_temp.hasMany(Resource, {foreignKey: 'r_id',sourceKey:'r_id'});
function KnowledgeStructResNodeDetail(req,res){
        
    const structid = req.query.structid;
    var limit = req.query.count;
    var page = req.query.page;

   Knowledge_struct_res_relation_temp.findAndCountAll({
       attributes:['mapid','structid','r_id'],
        where:{
            structid:structid
        },
        include:{
            attributes: ['r_name', 'contribute','grade','view_url','subject', 'file_size', 'create_time', 'difficulty', 'r_desc', 'file_url', 'answer', 'rtype'],
            model:Resource,
            where: {
                r_id: Sequelize.col('knowledge_struct_res_relation_temp.r_id')
            }
        },
        limit: limit * 1,
        offset: (page - 1) * limit
    })
    
    .then(result =>{
    if(result.count == 0 || result == null){
        res.json({errorCode:1,msg:'no data'})
        console.log('result---0', result)
    }else{
        console.log('result--not null', result)
        var resultJsonArray = [];
        for(let i = 0; i< result.rows.length; i++){
            let item = {
                mapid:result.rows[i].dataValues.mapid,
                structid:result.rows[i].dataValues.structid,
                r_id:result.rows[i].dataValues.r_id,
                r_name:result.rows[i].dataValues.resources[0].dataValues.r_name,
                contribute:result.rows[i].dataValues.resources[0].dataValues.contribute,
                grade:result.rows[i].dataValues.resources[0].dataValues.grade,
                view_url:result.rows[i].dataValues.resources[0].dataValues.view_url,
                subject:result.rows[i].dataValues.resources[0].dataValues.subject,
                file_size:result.rows[i].dataValues.resources[0].dataValues.file_size,
                create_time:result.rows[i].dataValues.resources[0].dataValues.create_time,
                difficulty:result.rows[i].dataValues.resources[0].dataValues.difficulty,
                r_desc:result.rows[i].dataValues.resources[0].dataValues.r_desc,
                file_url:result.rows[i].dataValues.resources[0].dataValues.file_url,
                answer:result.rows[i].dataValues.resources[0].dataValues.answer,
                rtype:result.rows[i].dataValues.resources[0].dataValues.rtype
            }
            resultJsonArray.push(item);
        }
        
        console.log('resultJsonArray', resultJsonArray)
        res.json({ errorCode: 0 , allpages: Math.ceil(result.count / limit), msg:resultJsonArray})
    }
})
}

async function countKnowledgeStructResResouces(req, res){

    const structid = req.query.structid;
    const mapid = req.query.mapid;
    const limit = req.query.count;
    const page = req.query.page;

    result = await Structid_res_resource_view.findAndCountAll({
        where:{
            mapid:mapid,
            [Op.or]:[{
                structpath:{
                    [Op.like]:structid+',%'
                },
                structpath:{
                    [Op.like]:'%'+structid+',%'
                }
            }]
        },
        limit:limit*1,
        offset:(page - 1) * limit
    })
    //console.log('result.rows[0].dataValues.r_id', result.rows[0].dataValues.r_id)
    if(result.count == 0 || result == null){
        res.json({errorCode:1,msg:'no data'})
        console.log('result---0', result)
    }else{
        var resultJsonArray = [];
        for(let i = 0; i< result.rows.length; i++){
            let item = {
                mapid:result.rows[i].dataValues.mapid,
                structid:result.rows[i].dataValues.structid,
                r_id:result.rows[i].dataValues.r_id,
                r_name:result.rows[i].dataValues.r_name,
                contribute:result.rows[i].dataValues.contribute,
                grade:result.rows[i].dataValues.grade,
                view_url:result.rows[i].dataValues.view_url,
                subject:result.rows[i].dataValues.subject,
                file_size:result.rows[i].dataValues.file_size,
                create_time:result.rows[i].dataValues.create_time,
                difficulty:result.rows[i].dataValues.difficulty,
                r_desc:result.rows[i].dataValues.r_desc,
                file_url:result.rows[i].dataValues.file_url,
                answer:result.rows[i].dataValues.answer,
                rtype:result.rows[i].dataValues.rtype
            }
            resultJsonArray.push(item);
        }
        let rs0 = {
            errorCode: 0,
            allpages: Math.ceil(result.count / limit),
            msg: resultJsonArray
        }
        res.send(rs0);
    }
}

module.exports = {
    getKnowledgeRelationStruct: getKnowledgeRelationStruct,
    getKnowledgeRelationStructNextbyStructid: getKnowledgeRelationStructNextbyStructid,
    getKnowledgeStructDetails: getKnowledgeStructDetails,
    addKnowledgeNodeInfoDetails: addKnowledgeNodeInfoDetails,
    updateKnowledgeNodeInfoDetails: updateKnowledgeNodeInfoDetails,
    deleteStructNode: deleteStructNode,
    doublequeryTestDemo: doublequeryTestDemo,
    getKnowledgeRelationStruct1: getKnowledgeRelationStruct1,
    presentKnowledgeStructResNodeDetail: presentKnowledgeStructResNodeDetail,
    presentViewKnowledgeStructResNodeDetail:presentViewKnowledgeStructResNodeDetail,
    KnowledgeStructResNodeDetail:KnowledgeStructResNodeDetail,
    countKnowledgeStructResResouces:countKnowledgeStructResResouces
   /*  testHasMany:testHasMany */

}