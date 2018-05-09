var express = require('express');
var router = express.Router();
var data = require('../../database/db');
const Sequelize = require('sequelize');

var resource = require('../../model/api_v1.1/resource');
var knowledge = require('../../model/api_v1.1/knowledge');
var knowledge_res_relation = require('../../model/api_v1.1/knowledge_res_relation');
var user = require('../../model/api_v1.1/user');
var user_mark_knowres = require('../../model/api_v1.1/user_mark_knowres');
var knowledge_struct_res_relation_temp = require('../../model/api_v1.1/knowledge_struct_res_relation_temp');
var knowledge_struct = require('../../model/api_v1.1/knowledge_struct');
var resource2 = require('../../model/api_v1.1/resource2')

const Resource = resource(data.testdb, Sequelize);
const Knowledge = knowledge(data.testdb, Sequelize);
const Knowledge_res_relation = knowledge_res_relation(data.testdb, Sequelize);
const User = user(data.testdb, Sequelize);
const User_mark_knowres = user_mark_knowres(data.testdb, Sequelize);
const Knowledge_struct_res_relation_temp = knowledge_struct_res_relation_temp(data.testdb,Sequelize);
const Knowledge_struct = knowledge_struct(data.testdb,Sequelize);
const Resource2 = resource2(data.testdb,Sequelize)

const Op = Sequelize.Op;

var time = new Date();

Knowledge_res_relation.belongsTo(Knowledge, { foreignKey: 'knowid' });
Knowledge_res_relation.belongsTo(Resource, { foreignKey: 'r_id' });

//输入knowid   输出title、r_id、r_name、r_type、r_desc、view_url、answer、difficulty、create_time、contribute、r_size、weight
function knowidResource_v1_1(req, res) {
    var knowid = req.query.knowid;
    var limit = req.query.count;
    var page = req.query.page;

    Knowledge_res_relation.findAndCountAll({
        attributes: ['r_id', 'weight'],
        where: {
            knowid: knowid,
        },
        include: [{
            model: Resource,
            attributes: ['r_name', 'contribute','grade','view_url','subject', 'file_size', 'create_time', 'difficulty', 'r_desc', 'file_url', 'answer', 'rtype'],
            where: {
                r_id: Sequelize.col('knowledge_res_relation.r_id')
            }
        }, {
            model: Knowledge,
            attributes: ['title'],
            where: { knowid: Sequelize.col('knowledge_res_relation.knowid') }
        }],
        limit: limit * 1,
        offset: (page - 1) * limit
    })
        .then(result => {
            //console.log(result);
            if (result.count == 0 || result == null) {
                res.json({ errorCode: '1', msg: '不存在该知识点的关联资源' });
            } else {
                var resultJsonArray = [];
                console.log("result.rows[0]",result.rows[0])
                for (let i = 0; i < result.rows.length; i++) {
                    var date = new Date(result.rows[i].dataValues.resource.create_time * 1000);
                    var create_time = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                    let item = {
                        weight: result.rows[i].dataValues.weight,
                        r_id: result.rows[i].dataValues.r_id,
                        subject: result.rows[i].dataValues.resource.subject,
                        grade: result.rows[i].dataValues.resource.grade,
                        title: result.rows[i].dataValues.knowledge.title,
                        r_name: result.rows[i].dataValues.resource.r_name,
                        r_desc: result.rows[i].dataValues.resource.r_desc,
                        rtype: result.rows[i].dataValues.resource.rtype,
                        view_url: result.rows[i].dataValues.resource.view_url,
                        answer: result.rows[i].dataValues.resource.answer,
                        difficulty: result.rows[i].dataValues.resource.difficulty,
                        create_time: create_time,
                        contribute: result.rows[i].dataValues.resource.contribute,
                        file_size: result.rows[i].dataValues.resource.file_size
                    };
                    resultJsonArray.push(item);
                }
                res.json({ errorCode: '0', allpages: Math.ceil(result.count / limit), msg: resultJsonArray })
            }
        })
}
Knowledge_struct_res_relation_temp.belongsTo(Knowledge_struct, { foreignKey: 'structid' });
Knowledge_struct_res_relation_temp.belongsTo(Resource, { foreignKey: 'r_id' });
function structidResource(req,res){
    var structid = req.query.structid;
    var limit = req.query.count;
    var page = req.query.page;

    Knowledge_struct_res_relation_temp.findAndCountAll({
        attributes: ['r_id'],
        where: {
            structid: structid,
        },
        include: [{
            model: Resource,
            attributes: ['r_name', 'contribute','grade','view_url','subject', 'file_size', 'create_time', 'difficulty', 'r_desc', 'file_url', 'answer', 'rtype'],
            where: {
                r_id: Sequelize.col('knowledge_struct_res_relation_temp.r_id')
            }
        }, {
            model: Knowledge_struct,
            attributes: ['title'],
            where: { structid: Sequelize.col('knowledge_struct_res_relation_temp.structid') }
        }],
        limit: limit * 1,
        offset: (page - 1) * limit
    })
        .then(result => {
            //console.log(result);
            if (result.count == 0 || result == null) {
                res.json({ errorCode: '1', msg: '不存在该知识点的关联资源' });
            } else {
                var resultJsonArray = [];
                console.log("result.rows[0]",result.rows[0])
                for (let i = 0; i < result.rows.length; i++) {
                    var date = new Date(result.rows[i].dataValues.resource.create_time * 1000);
                    var create_time = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                    let item = {
                        //weight: result.rows[i].dataValues.weight,
                        r_id: result.rows[i].dataValues.r_id,
                        subject: result.rows[i].dataValues.resource.subject,
                        grade: result.rows[i].dataValues.resource.grade,
                        title: result.rows[i].dataValues.knowledge_struct.title,
                        r_name: result.rows[i].dataValues.resource.r_name,
                        r_desc: result.rows[i].dataValues.resource.r_desc,
                        rtype: result.rows[i].dataValues.resource.rtype,
                        view_url: result.rows[i].dataValues.resource.view_url,
                        answer: result.rows[i].dataValues.resource.answer,
                        difficulty: result.rows[i].dataValues.resource.difficulty,
                        create_time: create_time,
                        contribute: result.rows[i].dataValues.resource.contribute,
                        file_size: result.rows[i].dataValues.resource.file_size
                    };
                    resultJsonArray.push(item);
                }
                res.json({ errorCode: '0', allpages: Math.ceil(result.count / limit), msg: resultJsonArray })
            }
        })
}
function resourceSelectStruct(req, res) {
    const structid = req.param('structid');

    const rtype = req.param('rtype');
    const version = req.param('version');
    const tag = req.param('tag');
    const count = req.param('count');
    const page = req.param('page')

    Knowledge_struct_res_relation_temp.findAll({
        attributes: ['r_id'],
        where: {
            structid: structid,
        },
        include: [{
            model: Resource,
            attributes: ['r_name', 'contribute', 'file_size', 'create_time', 'difficulty', 'r_desc', 'file_url', 'answer', 'rtype', 'version'],
            where: {
                r_id: Sequelize.col('knowledge_struct_res_relation_temp.r_id'),
            }
        }, {
            model: Knowledge_struct,
            attributes: ['title'],
            where: { structid: Sequelize.col('knowledge_struct_res_relation_temp.structid') }
        }]
    })
        .then(async result => {
            //console.log(result);
            if (result == null) {
                res.json({ errorCode: '1', msg: '不存在该知识点的关联资源' });
            } else {
                var resultJsonArray = [];
                for (let i = 0; i < result.length; i++) {
                    var date = new Date(result[i].dataValues.resource.create_time * 1000);
                    var create_time = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                    let item = {
                        //weight: result[i].dataValues.weight,
                        r_id: result[i].dataValues.r_id,

                        title: result[i].dataValues.knowledge_struct.title,

                        version: result[i].dataValues.resource.version,
                        r_name: result[i].dataValues.resource.r_name,
                        r_desc: result[i].dataValues.resource.r_desc,
                        rtype: result[i].dataValues.resource.rtype,
                        view_url: result[i].dataValues.resource.view_url,
                        answer: result[i].dataValues.resource.answer,
                        difficulty: result[i].dataValues.resource.difficulty,
                        create_time: create_time,
                        contribute: result[i].dataValues.resource.contribute,
                        r_size: result[i].dataValues.resource.r_size
                    };
                    await resultJsonArray.push(item);
                }
                if (rtype == null) {
                    if (version == null) {
                        if (tag == null) {
                            console.log(resultJsonArray)
                            var resultJsonArray1 = await arrayCut(resultJsonArray, count, page)
                            res.json({ errorCode: '0', msg: resultJsonArray1 })
                        } else if (tag == 1) {
                            var array = resultJsonArray.sort(keysort('weight', true));
                            var array1 = await arrayCut(array, count, page)
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 2) {
                            resultJsonArray = difficultyToNumber(resultJsonArray);
                            var array = resultJsonArray.sort(keysort('difficulty', false));
                            array = numberToDifficulty(array);
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 3) {
                            var array = resultJsonArray.sort(keysort('create_time', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else {
                            res.json({ errorCode: '1', msg: 'wrong tag' })
                        }
                    } else {
                        var versionSelectArray = await versionSelect(resultJsonArray, version);
                        if (tag == null) {
                            var versionSelectArray1 = await arrayCut(versionSelectArray, count, page);
                            res.json({ errorCode: '0', msg: versionSelectArray1 })
                        } else if (tag == 1) {
                            var array = versionSelectArray.sort(keysort('weight', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 2) {
                            resultJsonArray = difficultyToNumber(versionSelectArray);
                            var array = resultJsonArray.sort(keysort('difficulty', false));
                            array = numberToDifficulty(array);
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 3) {
                            var array = versionSelectArray.sort(keysort('create_time', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else {
                            res.json({ errorCode: '1', msg: 'wrong tag' })
                        }
                    }
                } else {
                    var typeSelectArray = await rtypeSelect(resultJsonArray, rtype);
                    if (version == null) {
                        if (tag == null) {
                            var typeSelectArray1 = await arrayCut(typeSelectArray, count, page);
                            res.json({ errorCode: '0', msg: typeSelectArray1 })
                        } else if (tag == 1) {
                            var array = typeSelectArray.sort(keysort('weight', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 2) {
                            resultJsonArray = difficultyToNumber(typeSelectArray);
                            var array = resultJsonArray.sort(keysort('difficulty', false));
                            array = numberToDifficulty(array);
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 3) {
                            var array = typeSelectArray.sort(keysort('create_time', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else {
                            res.json({ errorCode: '1', msg: 'wrong tag' })
                        }
                    } else {
                        var versionSelectArray = await versionSelect(typeSelectArray, version);
                        if (tag == null) {
                            var versionSelectArray1 = await arrayCut(versionSelectArray, count, page);
                            res.json({ errorCode: '0', msg: versionSelectArray1 })
                        } else if (tag == 1) {
                            var array = versionSelectArray.sort(keysort('weight', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 2) {
                            resultJsonArray = difficultyToNumber(versionSelectArray);
                            var array = resultJsonArray.sort(keysort('difficulty', false));
                            array = numberToDifficulty(array);
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 3) {
                            var array = versionSelectArray.sort(keysort('create_time', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else {
                            res.json({ errorCode: '1', msg: 'wrong tag' })
                        }
                    }
                }
            }
        })
}
//根据weight对资源进行排序
function weightOrder_v1_1(req, res) {
    var knowid = req.param('knowid');

    Knowledge_res_relation.findAll({
        attributes: ['r_id', 'weight'],
        where: {
            knowid: knowid,
        },
        order: [
            ['weight', 'DESC']
        ],
        include: [{
            model: Resource,
            attributes: ['r_name', 'contribute', 'file_size', 'create_time', 'difficulty', 'r_desc', 'file_url', 'answer', 'rtype'],
            where: {
                r_id: Sequelize.col('knowledge_res_relation.r_id')
            }
        }, {
            model: Knowledge,
            attributes: ['title'],
            where: { knowid: Sequelize.col('knowledge_res_relation.knowid') }
        }]
    })
        .then(result => {
            //console.log(result);
            if (result == null) {
                res.json({ errorCode: '1', msg: '不存在该知识点的关联资源' });
            } else {
                var resultJsonArray = [];
                for (let i = 0; i < result.length; i++) {
                    var date = new Date(result[i].dataValues.resource.create_time * 1000);
                    var create_time = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                    let item = {
                        weight: result[i].dataValues.weight,
                        r_id: result[i].dataValues.r_id,

                        title: result[i].dataValues.knowledge.title,

                        r_name: result[i].dataValues.resource.r_name,
                        r_desc: result[i].dataValues.resource.r_desc,
                        rtype: result[i].dataValues.resource.rtype,
                        view_url: result[i].dataValues.resource.view_url,
                        answer: result[i].dataValues.resource.answer,
                        difficulty: result[i].dataValues.resource.difficulty,
                        create_time: create_time,
                        contribute: result[i].dataValues.resource.contribute,
                        r_size: result[i].dataValues.resource.r_size
                    };
                    resultJsonArray.push(item);
                }
                res.json({ errorCode: '0', msg: resultJsonArray })
            }
        })
}

//根据难度difficulty对关联资源排序
function difficultyOrder_v1_1(req, res) {
    var knowid = req.param('knowid');

    Knowledge_res_relation.findAll({
        attributes: ['r_id', 'weight'],
        where: {
            knowid: knowid,
        },
        order: [
            ['weight', 'DESC']
        ],
        include: [{
            model: Resource,
            attributes: ['r_name', 'contribute', 'file_size', 'create_time', 'difficulty', 'r_desc', 'file_url', 'answer', 'rtype'],
            where: {
                r_id: Sequelize.col('knowledge_res_relation.r_id')
            }
        }, {
            model: Knowledge,
            attributes: ['title'],
            where: { knowid: Sequelize.col('knowledge_res_relation.knowid') }
        }]
    })
        .then(result => {
            //console.log(result);
            if (result == null) {
                res.json({ errorCode: '1', msg: '不存在该知识点的关联资源' });
            } else {
                var resultJsonArray = [];
                for (let i = 0; i < result.length; i++) {
                    var date = new Date(result[i].dataValues.resource.create_time * 1000);
                    var create_time = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                    let item = {
                        weight: result[i].dataValues.weight,
                        r_id: result[i].dataValues.r_id,
                        title: result[i].dataValues.knowledge.title,
                        r_name: result[i].dataValues.resource.r_name,
                        r_desc: result[i].dataValues.resource.r_desc,
                        rtype: result[i].dataValues.resource.rtype,
                        view_url: result[i].dataValues.resource.view_url,
                        answer: result[i].dataValues.resource.answer,
                        difficulty: result[i].dataValues.resource.difficulty,
                        create_time: create_time,
                        contribute: result[i].dataValues.resource.contribute,
                        r_size: result[i].dataValues.resource.r_size
                    };
                    resultJsonArray.push(item);
                }
                res.json({ errorCode: '0', msg: resultJsonArray })
            }
        })
}

//根据create_time对关联资源排序
function keysort(key, sortType) {
    return function (a, b) {
        return sortType ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
    }
}

function createtimeOrder_v1_1(req, res) {
    var knowid = req.param('knowid');

    Knowledge_res_relation.findAll({
        attributes: ['r_id', 'weight'],
        where: {
            knowid: knowid,
        },
        include: [{
            model: Resource,
            attributes: ['r_name', 'contribute', 'file_size', 'create_time', 'difficulty', 'r_desc', 'file_url', 'answer', 'rtype'],
            where: {
                r_id: Sequelize.col('knowledge_res_relation.r_id')
            }
        }, {
            model: Knowledge,
            attributes: ['title'],
            where: { knowid: Sequelize.col('knowledge_res_relation.knowid') }
        }]
    })
        .then(result => {
            //console.log(result);
            if (result == null) {
                res.json({ errorCode: '1', msg: '不存在该知识点的关联资源' });
            } else {
                var resultJsonArray = [];
                for (let i = 0; i < result.length; i++) {
                    var date = new Date(result[i].dataValues.resource.create_time * 1000);
                    var create_time = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                    let item = {
                        weight: result[i].dataValues.weight,
                        r_id: result[i].dataValues.r_id,

                        title: result[i].dataValues.knowledge.title,

                        r_name: result[i].dataValues.resource.r_name,
                        r_desc: result[i].dataValues.resource.r_desc,
                        rtype: result[i].dataValues.resource.rtype,
                        view_url: result[i].dataValues.resource.view_url,
                        answer: result[i].dataValues.resource.answer,
                        difficulty: result[i].dataValues.resource.difficulty,
                        create_time: create_time,
                        contribute: result[i].dataValues.resource.contribute,
                        r_size: result[i].dataValues.resource.r_size
                    };
                    resultJsonArray.push(item);
                }
                var array = resultJsonArray.sort(keysort('create_time', true));
                res.json({ errorCode: '0', msg: array })
            }
        })
}

//根据rtype、version筛选资源
function rtypeSelect(array, condition) {
    const result = [];
    var conditionArr = [];
    //await console.log(arr)
    condition = condition.slice(1, condition.length - 1);
    conditionArr = condition.split(',');
    //condition = ['课件','视频']
    array.forEach(element => {
        conditionArr.forEach(rtype => {
            if (element['rtype'] == rtype) {
                result.push(element)
            }
        })
    });
    //await console.log(result)
    return result;
}
function versionSelect(array, condition) {
    const result = [];
    var conditionArr = [];
    //await console.log(array)
    condition = condition.slice(1, condition.length - 1)
    conditionArr = condition.split(',')
    array.forEach(element => {
        conditionArr.forEach(version => {
            if (element['version'] == version) {
                result.push(element)
            }
        })
    });
    //await console.log(result)
    return result;
}
function difficultyToNumber(array) {
    for (let i = 0; i < array.length; i++) {

        if (array[i].difficulty == '困难') {
            array[i].difficulty = 3
        } else if (array[i].difficulty == '中等') {
            array[i].difficulty = 2
        } else if (array[i].difficulty == '简单') {
            //console.log(array[i].difficulty)
            array[i].difficulty = 1
        } else {
            delete array[i]
        }
    }
    return array
}
function numberToDifficulty(array) {
    for (let i = 0; i < array.length; i++) {

        if (array[i].difficulty == 3) {
            array[i].difficulty = '困难'
        } else if (array[i].difficulty == 2) {
            array[i].difficulty = '中等'
        } else if (array[i].difficulty == 1) {
            //console.log(array[i].difficulty)
            array[i].difficulty = '简单'
        } else {
            delete array[i]
        }
    }
    return array
}
function arrayCut(array, count, page) {
    var result = [];
    var from = (page - 1) * count;
    var to = page * count;
    var len = array.length;
    console.log(len);
    if (to <= len) {
        for (let i = from; i < to; i++) {
            result.push(array[i])
        }
    } else if (to > len && to <= (len + count)) {
        for (let i = from; i < len; i++) {
            result.push(array[i])
        }
    }
    return result;
}

function resourceSelect_v1_1(req, res) {
    const knowid = req.param('knowid');

    const rtype = req.param('rtype');
    const version = req.param('version');
    const tag = req.param('tag');
    const count = req.param('count');
    const page = req.param('page')

    Knowledge_res_relation.findAll({
        attributes: ['r_id', 'weight'],
        where: {
            knowid: knowid,
        },
        include: [{
            model: Resource,
            attributes: ['r_name', 'contribute', 'file_size', 'create_time', 'difficulty', 'r_desc', 'file_url', 'answer', 'rtype', 'version'],
            where: {
                r_id: Sequelize.col('knowledge_res_relation.r_id'),
            }
        }, {
            model: Knowledge,
            attributes: ['title'],
            where: { knowid: Sequelize.col('knowledge_res_relation.knowid') }
        }]
    })
        .then(async result => {
            //console.log(result);
            if (result == null) {
                res.json({ errorCode: '1', msg: '不存在该知识点的关联资源' });
            } else {
                var resultJsonArray = [];
                for (let i = 0; i < result.length; i++) {
                    var date = new Date(result[i].dataValues.resource.create_time * 1000);
                    var create_time = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                    let item = {
                        weight: result[i].dataValues.weight,
                        r_id: result[i].dataValues.r_id,

                        title: result[i].dataValues.knowledge.title,

                        version: result[i].dataValues.resource.version,
                        r_name: result[i].dataValues.resource.r_name,
                        r_desc: result[i].dataValues.resource.r_desc,
                        rtype: result[i].dataValues.resource.rtype,
                        view_url: result[i].dataValues.resource.view_url,
                        answer: result[i].dataValues.resource.answer,
                        difficulty: result[i].dataValues.resource.difficulty,
                        create_time: create_time,
                        contribute: result[i].dataValues.resource.contribute,
                        r_size: result[i].dataValues.resource.r_size
                    };
                    await resultJsonArray.push(item);
                }
                if (rtype == null) {
                    if (version == null) {
                        if (tag == null) {
                            console.log(resultJsonArray)
                            var resultJsonArray1 = await arrayCut(resultJsonArray, count, page)
                            res.json({ errorCode: '0', msg: resultJsonArray1 })
                        } else if (tag == 1) {
                            var array = resultJsonArray.sort(keysort('weight', true));
                            var array1 = await arrayCut(array, count, page)
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 2) {
                            resultJsonArray = difficultyToNumber(resultJsonArray);
                            var array = resultJsonArray.sort(keysort('difficulty', false));
                            array = numberToDifficulty(array);
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 3) {
                            var array = resultJsonArray.sort(keysort('create_time', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else {
                            res.json({ errorCode: '1', msg: 'wrong tag' })
                        }
                    } else {
                        var versionSelectArray = await versionSelect(resultJsonArray, version);
                        if (tag == null) {
                            var versionSelectArray1 = await arrayCut(versionSelectArray, count, page);
                            res.json({ errorCode: '0', msg: versionSelectArray1 })
                        } else if (tag == 1) {
                            var array = versionSelectArray.sort(keysort('weight', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 2) {
                            resultJsonArray = difficultyToNumber(versionSelectArray);
                            var array = resultJsonArray.sort(keysort('difficulty', false));
                            array = numberToDifficulty(array);
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 3) {
                            var array = versionSelectArray.sort(keysort('create_time', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else {
                            res.json({ errorCode: '1', msg: 'wrong tag' })
                        }
                    }
                } else {
                    var typeSelectArray = await rtypeSelect(resultJsonArray, rtype);
                    if (version == null) {
                        if (tag == null) {
                            var typeSelectArray1 = await arrayCut(typeSelectArray, count, page);
                            res.json({ errorCode: '0', msg: typeSelectArray1 })
                        } else if (tag == 1) {
                            var array = typeSelectArray.sort(keysort('weight', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 2) {
                            resultJsonArray = difficultyToNumber(typeSelectArray);
                            var array = resultJsonArray.sort(keysort('difficulty', false));
                            array = numberToDifficulty(array);
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 3) {
                            var array = typeSelectArray.sort(keysort('create_time', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else {
                            res.json({ errorCode: '1', msg: 'wrong tag' })
                        }
                    } else {
                        var versionSelectArray = await versionSelect(typeSelectArray, version);
                        if (tag == null) {
                            var versionSelectArray1 = await arrayCut(versionSelectArray, count, page);
                            res.json({ errorCode: '0', msg: versionSelectArray1 })
                        } else if (tag == 1) {
                            var array = versionSelectArray.sort(keysort('weight', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 2) {
                            resultJsonArray = difficultyToNumber(versionSelectArray);
                            var array = resultJsonArray.sort(keysort('difficulty', false));
                            array = numberToDifficulty(array);
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else if (tag == 3) {
                            var array = versionSelectArray.sort(keysort('create_time', true));
                            var array1 = await arrayCut(array, count, page);
                            res.json({ errorCode: '0', msg: array1 })
                        } else {
                            res.json({ errorCode: '1', msg: 'wrong tag' })
                        }
                    }
                }
            }
        })
}

//根据r_id 查看资源详情
function resourceDetail_v1_1(req, res) {
    const r_id = req.param('r_id');
    Resource.findOne({
        attributes: ['r_name', 'r_desc', 'rtype', 'r_key', 'contribute', 'create_time', 'file_size', 'grade', 'subject', 'field', 'difficulty', 'answer', 'file_url'],
        where: {
            r_id: r_id
        }
    })
        .then(result => {
            if (result == null) {
                res.json({ errorCode: '1', msg: '资源id不存在' })
            } else {
                Knowledge_res_relation.count({
                    attributes: ['knowid'],
                    where: {
                        r_id: r_id
                    }
                })
                    .then(result1 => {
                        if (result1 == null) {
                            res.json({ errorCode: '1', msg: '该资源不存在关联知识点' })
                        } else {
                            User_mark_knowres.count({
                                attributes: ['uid'],
                                where: {
                                    r_id: r_id
                                }
                            })
                                .then(result2 => {
                                    if (result2 == null) {
                                        res.json({ errorCode: '1', msg: '该资源没有人员进行维护' })
                                    } else {
                                        var date = new Date(result.dataValues.create_time * 1000);
                                        var create_time = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                                        let item = {
                                            r_id: r_id,
                                            r_name: result.dataValues.r_name,
                                            r_desc: result.dataValues.r_desc,
                                            r_key: result.dataValues.r_key,
                                            rtype: result.dataValues.rtype,
                                            grade: result.dataValues.grade,
                                            subject: result.dataValues.subject,
                                            field: result.dataValues.field,
                                            difficulty: result.dataValues.difficulty,
                                            file_url_view: result.dataValues.file_url_view,
                                            answer: result.dataValues.answer,
                                            create_time: create_time,
                                            contribute: result.dataValues.contribute,
                                            file_url: result.dataValues.file_url,

                                            maintenanceNumber: result2,
                                            relationCount: result1
                                        }
                                        var resultJsonArray = [];
                                        resultJsonArray.push(item);
                                        res.json({ errorCode: '0', msg: resultJsonArray })
                                    }
                                })
                        }
                    })
            }
        })
}
function resource2Detail_v1_1(req, res) {
    const r_id = req.param('r_id');
    Resource2.findOne({
        attributes: ['r_name', 'r_desc', 'rtype', 'r_key', 'contribute', 'create_time', 'file_size', 'grade', 'subject', 'field', 'difficulty', 'answer', 'file_url'],
        where: {
            r_id: r_id
        }
    })
        .then(result => {
            if (result == null) {
                res.json({ errorCode: '1', msg: '资源id不存在' })
            } else {
                var date = new Date(result.dataValues.create_time * 1000);
                var create_time = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                let item = {
                    r_id: r_id,
                    r_name: result.dataValues.r_name,
                    r_desc: result.dataValues.r_desc,
                    r_key: result.dataValues.r_key,
                    rtype: result.dataValues.rtype,
                    grade: result.dataValues.grade,
                    subject: result.dataValues.subject,
                    field: result.dataValues.field,
                    difficulty: result.dataValues.difficulty,
                    file_url_view: result.dataValues.file_url_view,
                    answer: result.dataValues.answer,
                    create_time: create_time,
                    contribute: result.dataValues.contribute,
                    file_url: result.dataValues.file_url,
                }
                var resultJsonArray = [];
                resultJsonArray.push(item);
                res.json({ errorCode: '0', msg: resultJsonArray })
        }
        })
}
//根据r_id 编辑资源，
//r_id,r_name,r_desc,rtype,r_key,grade,subject,field,difficulty
function resourceEdit_v1_1(req, res) {
    const r_id = req.body.r_id;

    const r_name = req.body.r_name;
    const r_desc = req.body.r_desc;
    const rtype = req.body.rtype;
    const r_key = req.body.r_key;
    const grade = req.body.grade;
    const subject = req.body.subject;
    const field = req.body.field;
    const difficulty = req.body.difficulty;

    Resource.update({
        r_name: r_name,
        r_desc: r_desc,
        r_key: r_key,
        rtype: rtype,
        grade: grade,
        subject: subject,
        field: field,
        difficulty: difficulty
    }, {
            where: {
                r_id: r_id
            }
        })
        .then(result => {
            if (result == null) {
                res.json({ errorCode: '1', msg: 'edit faliure' })
            } else {
                res.json({ errorCode: '0', msg: 'edit success' })
            }
        })
}

//编辑关联权重，输入：r_id,knowid,weight,uid
function weightEdit_v1_1(req, res) {
    var knowid = req.param('knowid');
    var r_id = req.param('r_id');
    var uid = req.param('uid');
    var weight = req.param('weight');

    User_mark_knowres.findOne({
        attributes: ['weight'],
        where: {
            knowid: knowid,
            r_id: r_id,
            uid: uid
        }
    })
        .then(result => {
            if (result != null) {
                User_mark_knowres.update({
                    weight: weight,
                    update_time: time,
                }, {
                        where: {
                            knowid: knowid,
                            r_id: r_id,
                            uid: uid
                        }
                    })
                let rs0 = {
                    errorCode: 0,
                    msg: "找到资源与知识点的关联，更新成功"
                }
                res.send(rs0);
            } else {
                User_mark_knowres.create({
                    knowid: knowid,
                    r_id: r_id,
                    weight: weight,
                    add_time: time,
                    update_time: time,
                    uid: uid
                })
                let rs1 = {
                    errorCode: 1,
                    msg: "没有找到资源与知识点的关联，创建一条记录"
                }
                res.send(rs1);
            }
        })
}

//查看众智详情，输入knowid,r_id
User_mark_knowres.belongsTo(User, { foreignKey: 'uid' })
User_mark_knowres.belongsTo(Resource, { foreignKey: 'r_id' });
function peopleMarkDetail_v1_1(req, res) {
    const knowid = req.param('knowid');
    const r_id = req.param('r_id');

    User_mark_knowres.findAll({
        attributes: ['uid', 'weight','update_time'],
        where: {
            knowid: knowid,
            r_id: r_id
        }, include: [{
            model: User,
            attributes: ['username', 'user_weight','user_credit','user_mark_accuracy'],
            where: {
                uid: Sequelize.col('user_mark_knowres.uid')
            }
        }, {
            model: Resource,
            attributes: ['file_url', 'r_desc', 'r_name'],
            where: {
                r_id: Sequelize.col('user_mark_knowres.r_id')
            }
        }]
    })
        .then(result => {
            //console.log(result[0].dataValues.user.user_weight);
            if (result == null) {
                res.json({
                    errorCode: '1',
                    msg: '没有用户标注该关联,或用户信息不存在,或资源链接不存在'
                })
            } else {
                Knowledge_res_relation.findOne({
                    attributes: ['people_mark_weight'],
                    where: {
                        knowid: knowid,
                        r_id: r_id
                    }
                })
                    .then(result1 => {
                        if (result1 == null) {
                            res.json({ errorCode: '1', msg: '该资源与知识点之间的众智标注权重不存在' })
                        } else {
                            var resultJsonArray = [];
                            for (let i = 0; i < result.length; i++) {
                                let item = {
                                    file_url: result[i].dataValues.resource.file_url,
                                    r_desc: result[i].dataValues.resource.r_desc,
                                    r_name: result[i].dataValues.resource.r_name,
                                    weight: result[i].dataValues.weight,
                                    update_time: result[i].dataValues.update_time,
                                    username: result[i].dataValues.user.username,
                                    user_weight: result[i].dataValues.user.user_weight,
                                    user_credit: result[i].dataValues.user.user_credit,
                                    user_mark_accuracy: result[i].dataValues.user.user_mark_accuracy,
                                    people_mark_weight: result1.dataValues.people_mark_weight
                                };
                                resultJsonArray.push(item);
                            }
                            res.json({
                                errorCode: '0',
                                msg: resultJsonArray
                            })
                        }
                    })
            }
        })
}

//删除资源关联的知识点，输入knowid，r_id
function resourceRelationDelete_v1_1(req, res) {
    const knowid = req.param('knowid');
    const r_id = req.param('r_id');

    Knowledge_res_relation.destroy({
        where: {
            knowid: knowid,
            r_id: r_id
        }
    })
        .then(result => {
            if (result != 0) {
                let rs0 = {
                    errorCode: '0',
                    msg: "delete success"
                }
                res.send(rs0);
            } else {
                let rs1 = {
                    errorCode: '1',
                    msg: "delete failure"
                }
                res.send(rs1);
            }
        })
    //删除资源数
    Knowledge.findOne({
        where:{
            knowid:knowid
        }
    }).then(result =>{
        if(result!=null&&result.dataValues.res_count>0){
            Knowledge.update({
                res_count:result.dataValues.res_count-1
            },{
                where:{
                    knowid: knowid,
                }
            })
        }
    })
}

//根据每个id获取题目详情页面
function getResourceDetails(req,res){
    const r_id = req.param.id

    Resource.findAll({
        where:{r_id:r_id}
    })
    .then(result=>{
        if(result.length!=0){



        }else{

        }
    })
}

async function updateFileSize(req,res){
    result = await Resource.findAll({
        attributes: ['r_id','r_desc'],
        where:{
            r_desc:{
                $ne: null
            }
        }
    })
    if(result.length != 0 || result != null){
        for(let i = 0 ;i < result.length ;i++){
            await Resource.update({
                file_size: strlen(result[i].dataValues.r_desc)},{
                
                    where:{
                        r_id: result[i].dataValues.r_id
                    }
                
            })
        }
        res.json({errorCode:'0',msg:'success'})
    }
    
}
function strlen(str){
    var len = 0;
    for (var i=0; i<str.length; i++) { 
     var c = str.charCodeAt(i); 
    //单字节加1 
     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
       len++; 
     } 
     else { 
      len+=2; 
     } 
    } 
    return len;
}



module.exports = {
    knowidResource_v1_1: knowidResource_v1_1,
    resourceSelect_v1_1: resourceSelect_v1_1,
    resourceDetail_v1_1: resourceDetail_v1_1,
    resourceEdit_v1_1: resourceEdit_v1_1,
    weightEdit_v1_1: weightEdit_v1_1,
    peopleMarkDetail_v1_1: peopleMarkDetail_v1_1,
    resourceRelationDelete_v1_1: resourceRelationDelete_v1_1,
    structidResource: structidResource,
    resourceSelectStruct: resourceSelectStruct,
    updateFileSize: updateFileSize,
    resource2Detail_v1_1: resource2Detail_v1_1

}