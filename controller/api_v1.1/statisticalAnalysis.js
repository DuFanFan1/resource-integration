var express = require('express');
var router = express.Router();
var data = require('../../database/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var resource = require('../../model/api_v1.1/resource');
var knowledge = require('../../model/api_v1.1/knowledge');
var knowledge_struct_index = require('../../model/api_v1.1/knowledge_struct_index');

const Resource = resource(data.testdb, Sequelize);
const Knowledge = knowledge(data.testdb, Sequelize);
const Knowledge_struct_index = knowledge_struct_index(data.testdb, Sequelize);

function subjectCount(req, res) {
    //tag=1 --resource ,tag=2 --knowledge,tag=3 --knowledge_struct_index
    const tag = req.query.tag;

    if (tag == 1) {
        Resource.findAll({
            attributes: ['subject', [Sequelize.fn('COUNT', Sequelize.col('r_id')), 'count']],
            group: 'subject',
        })
            .then(result => {
                if (result == null || result.length == 0) {
                    res.json({ erroCode: '1', msg: 'group by failure' })
                } else {
                    //console.log(result)
                    var resultJsonArray = [];
                    for (let i = 0; i < result.length; i++) {
                        let item = {
                            name: result[i].dataValues.subject,
                            value: result[i].dataValues.count
                        }
                        resultJsonArray.push(item)
                    }
                    res.json({ erroCode: '1', msg: resultJsonArray })
                }
            })
    } else if (tag == 2) {
        Knowledge.findAll({
            attributes: ['subject', [Sequelize.fn('COUNT', Sequelize.col('knowid')), 'count']],
            group: 'subject',
        })
            .then(result => {
                if (result == null || result.length == 0) {
                    res.json({ erroCode: '1', msg: 'group by failure' })
                } else {
                    //console.log(result)
                    var resultJsonArray = [];
                    for (let i = 0; i < result.length; i++) {
                        let item = {
                            name: result[i].dataValues.subject,
                            value: result[i].dataValues.count
                        }
                        resultJsonArray.push(item)
                    }
                    res.json({ erroCode: '0', msg: resultJsonArray })
                }
            })
    } else if (tag == 3) {
        Knowledge_struct_index.findAll({
            attributes: ['subject', [Sequelize.fn('COUNT', Sequelize.col('mapid')), 'count']],
            group: 'subject',
        })
            .then(result => {
                if (result == null || result.length == 0) {
                    res.json({ erroCode: '0', msg: 'group by failure' })
                } else {
                    //console.log(result)
                    var resultJsonArray = [];
                    for (let i = 0; i < result.length; i++) {
                        let item = {
                            name: result[i].dataValues.subject,
                            value: result[i].dataValues.count
                        }
                        resultJsonArray.push(item)
                    }
                    res.json({ erroCode: '0', msg: resultJsonArray })
                }
            })
    } else {
        res.json({ erroCode: '1', msg: 'tag传参错误' })
    }
}

function gradeCount(req, res) {
    const tag = req.query.tag;

    if (tag == 1) {
        Resource.findAll({
            attributes: ['grade', [Sequelize.fn('COUNT', Sequelize.col('r_id')), 'count']],
            group: 'grade',
        })
            .then(result => {
                if (result == null || result.length == 0) {
                    res.json({ erroCode: '1', msg: 'group by failure' })
                } else {
                    //console.log(result)
                    var resultJsonArray = [];
                    for (let i = 0; i < result.length; i++) {
                        let item = {
                            name: result[i].dataValues.grade,
                            value: result[i].dataValues.count
                        }
                        resultJsonArray.push(item)
                    }
                    res.json({ erroCode: '1', msg: resultJsonArray })
                }
            })
    } else if (tag == 2) {
        Knowledge.findAll({
            attributes: ['grade', [Sequelize.fn('COUNT', Sequelize.col('knowid')), 'count']],
            group: 'grade',
        })
            .then(result => {
                if (result == null || result.length == 0) {
                    res.json({ erroCode: '1', msg: 'group by failure' })
                } else {
                    //console.log(result)
                    var resultJsonArray = [];
                    for (let i = 0; i < result.length; i++) {
                        let item = {
                            name: result[i].dataValues.grade,
                            value: result[i].dataValues.count
                        }
                        resultJsonArray.push(item)
                    }
                    res.json({ erroCode: '0', msg: resultJsonArray })
                }
            })
    } else if (tag == 3) {
        Knowledge_struct_index.findAll({
            attributes: ['grade', [Sequelize.fn('COUNT', Sequelize.col('mapid')), 'count']],
            group: 'grade',
        })
            .then(result => {
                if (result == null || result.length == 0) {
                    res.json({ erroCode: '0', msg: 'group by failure' })
                } else {
                    //console.log(result)
                    var resultJsonArray = [];
                    for (let i = 0; i < result.length; i++) {
                        let item = {
                            name: result[i].dataValues.grade,
                            value: result[i].dataValues.count
                        }
                        resultJsonArray.push(item)
                    }
                    res.json({ erroCode: '0', msg: resultJsonArray })
                }
            })
    } else {
        res.json({ erroCode: '1', msg: 'tag传参错误' })
    }
}

function rtypeCount(req, res) {
    Resource.findAll({
        attributes: ['rtype', [Sequelize.fn('COUNT', Sequelize.col('r_id')), 'count']],
        group: 'rtype',
    })
        .then(result => {
            if (result == null || result.length == 0) {
                res.json({ erroCode: '1', msg: 'group by failure' })
            } else {
                //console.log(result)
                var resultJsonArray = [];
                for (let i = 0; i < result.length; i++) {
                    let item = {
                        name: result[i].dataValues.rtype,
                        value: result[i].dataValues.count
                    }
                    resultJsonArray.push(item)
                }
                res.json({ erroCode: '1', msg: resultJsonArray })
            }
        })
}

function versionCount(req, res) {
    Knowledge_struct_index.findAll({
        attributes: ['version', [Sequelize.fn('COUNT', Sequelize.col('mapid')), 'count']],
        group: 'version',
    })
        .then(result => {
            if (result == null || result.length == 0) {
                res.json({ erroCode: '1', msg: 'group by failure' })
            } else {
                //console.log(result)
                var resultJsonArray = [];
                for (let i = 0; i < result.length; i++) {
                    let item = {
                        name: result[i].dataValues.version,
                        value: result[i].dataValues.count
                    }
                    resultJsonArray.push(item)
                }
                res.json({ erroCode: '1', msg: resultJsonArray })
            }
        })
}

function selectCount(req, res) {

    const tag = req.query.tag;
    const type = req.query.type;

    if (tag == 1) {
        Resource.findAll({
            attributes: [type, [Sequelize.fn('COUNT', Sequelize.col('r_id')), 'count']],
            group: type,
        })
            .then(result => {
                if (result == null || result.length == 0) {
                    res.json({ erroCode: '1', msg: 'group by failure' })
                } else {
                    //console.log(result)
                    var resultJsonArray = [];
                    if (type == 'subject') {
                        for (let i = 0; i < result.length; i++) {
                            let item = {
                                name: result[i].dataValues.subject,
                                value: result[i].dataValues.count
                            }
                            resultJsonArray.push(item)
                        }
                        res.json({ erroCode: '0', msg: resultJsonArray })
                    } else if (type == 'grade') {
                        for (let i = 0; i < result.length; i++) {
                            let item = {
                                name: result[i].dataValues.grade,
                                value: result[i].dataValues.count
                            }
                            resultJsonArray.push(item)
                        }
                        res.json({ erroCode: '0', msg: resultJsonArray })
                    } else if (type == 'rtype') {
                        for (let i = 0; i < result.length; i++) {
                            let item = {
                                name: result[i].dataValues.rtype,
                                value: result[i].dataValues.count
                            }
                            resultJsonArray.push(item)
                        }
                        res.json({ erroCode: '0', msg: resultJsonArray })
                    } else {
                        res.json({ erroCode: '1', msg: 'rtype传参错误' })
                    }
                }
            })
    } else if (tag == 2) {
        Knowledge.findAll({
            attributes: [type, [Sequelize.fn('COUNT', Sequelize.col('knowid')), 'count']],
            group: type,
        })
            .then(result => {
                if (result == null || result.length == 0) {
                    res.json({ erroCode: '1', msg: 'group by failure' })
                } else {
                    var resultJsonArray = [];
                    if (type == 'subject') {
                        for (let i = 0; i < result.length; i++) {
                            let item = {
                                name: result[i].dataValues.subject,
                                value: result[i].dataValues.count
                            }
                            resultJsonArray.push(item)
                        }
                        res.json({ erroCode: '0', msg: resultJsonArray })
                    } else if (type == 'grade') {
                        for (let i = 0; i < result.length; i++) {
                            let item = {
                                name: result[i].dataValues.grade,
                                value: result[i].dataValues.count
                            }
                            resultJsonArray.push(item)
                        }
                        res.json({ erroCode: '0', msg: resultJsonArray })
                    } else {
                        res.json({ erroCode: '1', msg: 'rtype传参错误' })
                    }
                }
            })
    } else if (tag == 3) {
        Knowledge_struct_index.findAll({
            attributes: [type, [Sequelize.fn('COUNT', Sequelize.col('mapid')), 'count']],
            group: type,
        })
            .then(result => {
                if (result == null || result.length == 0) {
                    res.json({ erroCode: '1', msg: 'group by failure' })
                } else {
                    //console.log(result)
                    var resultJsonArray = [];
                    if (type == 'subject') {
                        for (let i = 0; i < result.length; i++) {
                            let item = {
                                name: result[i].dataValues.subject,
                                value: result[i].dataValues.count
                            }
                            resultJsonArray.push(item)
                        }
                        res.json({ erroCode: '0', msg: resultJsonArray })
                    } else if (type == 'grade') {
                        for (let i = 0; i < result.length; i++) {
                            let item = {
                                name: result[i].dataValues.grade,
                                value: result[i].dataValues.count
                            }
                            resultJsonArray.push(item)
                        }
                        res.json({ erroCode: '0', msg: resultJsonArray })
                    } else if (type == 'version') {
                        for (let i = 0; i < result.length; i++) {
                            let item = {
                                name: result[i].dataValues.version,
                                value: result[i].dataValues.count
                            }
                            resultJsonArray.push(item)
                        }
                        res.json({ erroCode: '0', msg: resultJsonArray })
                    } else {
                        res.json({ erroCode: '1', msg: 'rtype传参错误' })
                    }
                }
            })
    } else {
        res.json({ erroCode: '1', msg: 'tag传参错误' })
    }
}

function allCount(req, res) {
    const tag = req.query.tag;

    if (tag == 1) {
        Resource.count({
            attributes: ['r_id']
        })
            .then(result => {
                res.json({ erroCode: '0', msg: result })
            })
    } else if (tag == 2) {
        Knowledge.count({
            attributes: ['knowid']
        })
            .then(result => {
                res.json({ erroCode: '0', msg: result })
            })
    } else if (tag == 3) {
        Knowledge_struct_index.count({
            attributes: ['mapid']
        })
            .then(result => {
                res.json({ erroCode: '0', msg: result })
            })
    } else {
        res.json({ erroCode: '1', msg: 'tag传参错误' })
    }

}

module.exports = {
    subjectCount: subjectCount,
    gradeCount: gradeCount,
    rtypeCount: rtypeCount,
    versionCount: versionCount,
    allCount: allCount,
    selectCount: selectCount
};