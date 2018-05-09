const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var data = require('../../database/db');
var resource = require('../../model/api_v1.1/resource');
var knowledge = require('../../model/api_v1.1/knowledge');
var knowledge_res_relation = require('../../model/api_v1.1/knowledge_res_relation');

const Resource = resource(data.testdb, Sequelize);
const Knowledge = knowledge(data.testdb, Sequelize);
const Knowledge_res_relation = knowledge_res_relation(data.testdb, Sequelize);

//资源关联知识点
Knowledge_res_relation.belongsTo(Knowledge, { foreignKey: 'knowid' });
Knowledge_res_relation.belongsTo(Resource, { foreignKey: 'r_id' });
//按地图显示
function getRelationKnowledge_v1_1(req, res) {
    var rid = req.query.r_id;
    var limit = req.query.count;
    var page = req.query.page;
    Knowledge_res_relation.findAndCountAll({
        attributes: ['weight'],
        where: {
            r_id: rid,
        },
        include: [{
            model: Knowledge,
            attributes: ['title', 'knowid'],
            where: { knowid: Sequelize.col('knowledge_res_relation.knowid') }
        }, {
            model: Resource,
            attributes: ['file_url', 'rtype'],
            where: { r_id: Sequelize.col('knowledge_res_relation.r_id') }
        }],
        limit: limit * 1,
        offset: (page - 1) * limit
    }).then(result => {
        if (result.count == 0) {
            res.json({ errorcode: '1', msg: '不存在' });
        } else {
            //声明JSON数组变量
            var resultJsonArray = [];
            for (let i = 0; i < result.rows.length; i++) {
                let item = {
                    weight: result.rows[i].dataValues.weight,
                    title: result.rows[i].dataValues.knowledge.title,
                    value: result.rows[i].dataValues.knowledge.title,
                    name: result.rows[i].dataValues.knowledge.knowid+result.rows[i].dataValues.knowledge.title,
                    knowid: result.rows[i].dataValues.knowledge.knowid,
                    file_url: result.rows[i].dataValues.resource.file_url,
                    rtype: result.rows[i].dataValues.resource.rtype,
                    category: "1",
                };
                resultJsonArray.push(item);
            }
            let rs0 = {
                errorCode: 0,
                allpages: Math.ceil(result.count / limit),
                msg: resultJsonArray
            }
            res.send(rs0);
        }
    });
};
//根据知识点id和资源id查看关联详情
function getRelatedDetailOfKnowAndRes_v1_1(req, res) {
    var rid = req.param('r_id');
    var knowid = req.param('knowid');
    Knowledge_res_relation.findOne({
        attributes: ['weight', 'expert_mark_weight', 'auto_weight', 'people_mark_weight'],
        where: {
            r_id: rid,
            knowid: knowid,
        },
        include: [{
            model: Knowledge,
            attributes: ['title', 'description', 'field', 'addtime'],
            where: { knowid: Sequelize.col('knowledge_res_relation.knowid') }
        }, {
            model: Resource,
            attributes: ['file_url'],
            where: { r_id: Sequelize.col('knowledge_res_relation.r_id') }
        }]
    }).then(result => {
        if (result == null) {
            res.json({ errorcode: '1', msg: '不存在' });
        } else {
            let item = {
                weight: result.dataValues.weight,
                expert_mark_weight: result.dataValues.expert_mark_weight,
                auto_weight: result.dataValues.auto_weight,
                people_mark_weight: result.dataValues.people_mark_credit,
                title: result.dataValues.knowledge.title,
                description: result.dataValues.knowledge.description,
                field: result.dataValues.knowledge.field,
                addtime: result.dataValues.knowledge.addtime,
                file_url: result.dataValues.resource.file_url
            };
            let rs0 = {
                errorCode: 0,
                msg: item
            }
            res.send(rs0);
        }
    });
}
//添加resource关联knowledge以及专家标记权重 bymyf
async function addRelateKnowledgeWeight_v1_1(req,res){
    console.log("输出的body"+req.body.expert_mark_weight);
    var knowid = JSON.parse(req.body.knowid);
    var rid = req.body.r_id;
    var expertmarkweight = JSON.parse(req.body.expert_mark_weight);
    //console.log("输出的body"+expertmarkweight[0]);
    var addtime = new Date();
    var weight;
    for(var i=0;i<knowid.length;i++){
        await Knowledge_res_relation.findOne({
            where:{
                knowid:knowid[i].id,
                r_id:rid,
            }
        }).then(async result =>{
            if(result!=null){
                weight = parseFloat(result.dataValues.weight);
                if(result.dataValues.expert_mark_weight != expertmarkweight[i]){
                    weight=(weight+expertmarkweight[i])/2;
                    await Knowledge_res_relation.update({
                        expert_mark_weight:expertmarkweight[i],
                        weight:weight,
                        add_time:addtime,
                        update_time:addtime,
                    },{
                        where:{
                            knowid:knowid[i].id,
                            r_id:rid,
                        }
                    })
                        .then(result1 =>{
                            if(result1==null){
                                res.json({errorcode:'1',msg: 'failure'});
                            }
                        })
                }
            }else{
                await Knowledge_res_relation.create({
                    knowid:knowid[i].id,
                    r_id:rid,
                    expert_mark_weight:expertmarkweight[i],
                    weight:expertmarkweight[i],
                    add_time:addtime,
                    update_time:addtime,
                }).then(result2 =>{
                    if(result2 == null){
                        res.json({errorcode:'1',msg: 'failure'});
                    }
                })
                var result = await Knowledge.findOne({
                    where:{
                        knowid:knowid[i].id
                    }
                });
                await Knowledge.update({
                    res_count:result.dataValues.res_count+1
                },{
                    where:{
                        knowid:knowid[i].id
                    }
                })
            }

        })
    }
    res.json({errorcode:'0',msg: 'success'});
}
//添加resource关联knowledge以及auto标记权重
async function addRelateKnowledge_autoweight_v1_1(req,res){
    console.log("输出的body"+req.body.auto_weight);
    var knowid = JSON.parse(req.body.knowid);
    var rid = req.body.r_id;
    var autoweight = JSON.parse(req.body.auto_weight);
    var addtime = new Date();
    var bulkunit = [];
    var weight;
    for(var i=0;i<knowid.length;i++){
        await Knowledge_res_relation.findOne({
            where:{
                knowid:knowid[i].id,
                r_id:rid,
            }
        }).then(async result =>{
            if(result!=null){
                weight = parseFloat(result.dataValues.weight);
                if(result.dataValues.auto_weight != autoweight[i]){
                    weight=(weight+autoweight[i])/2;
                    await Knowledge_res_relation.update({
                        auto_weight:autoweight[i],
                        weight:weight,
                        add_time:addtime,
                        update_time:addtime,
                    },{
                        where:{
                            knowid:knowid[i].id,
                            r_id:rid,
                        }
                    })
                        .then(result1 =>{
                            if(result1==null){
                                res.json({errorcode:'1',msg: 'failure'});
                            }
                        })
                }
            }else{
                await Knowledge_res_relation.create({
                    knowid:knowid[i].id,
                    r_id:rid,
                    auto_weight:autoweight[i],
                    weight:autoweight[i],
                    add_time:addtime,
                    update_time:addtime,
                }).then(result2 =>{
                    if(result2 == null){
                        res.json({errorcode:'1',msg: 'failure'});
                    }
                });
                var result = await Knowledge.findOne({
                    where:{
                        knowid:knowid[i].id
                    }
                });
                await Knowledge.update({
                    res_count:result.dataValues.res_count+1
                },{
                    where:{
                        knowid:knowid[i].id
                    }
                })
            }
        })
    }
    res.json({errorcode:'0',msg: 'success'});
    /*for(var i=0;i<knowid.length;i++){
        unit = {
            knowid: knowid[i].id,
            r_id: rid,
            auto_weight: autoweight[i],
            add_time: addtime,
            update_time: addtime,
        }
        bulkunit.push(unit);
    }
    Knowledge_res_relation.bulkCreate(bulkunit)
        .then(result => {
        if(result == null){
            res.json({errorcode:'1',msg: 'failure'});
        }else{
            res.json({errorcode:'0',msg: 'success'});
        }
    });*/
}

module.exports = {
    getRelationKnowledge_v1_1: getRelationKnowledge_v1_1,
    getRelatedDetailOfKnowAndRes_v1_1: getRelatedDetailOfKnowAndRes_v1_1,
    addRelateKnowledgeWeight_v1_1: addRelateKnowledgeWeight_v1_1,
    addRelateKnowledge_autoweight_v1_1: addRelateKnowledge_autoweight_v1_1
}