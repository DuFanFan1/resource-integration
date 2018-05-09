const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var data = require('../../database/db');
var knowledge = require('../../model/api_v1.1/knowledge')
var knowledge_res_relation = require('../../model/api_v1.1/knowledge_res_relation');
var knowledge_struct = require('../../model/api_v1.1/knowledge_struct')
var knowledge_struct_rela_know = require('../../model/api_v1.1/knowledge_struct_rela_know')
var Knowledge = knowledge(data.testdb, Sequelize);
var Knowledge_res_relation = knowledge_res_relation(data.testdb, Sequelize);
var Knowledge_struct = knowledge_struct(data.testdb, Sequelize);
var Knowledge_struct_rela_know = knowledge_struct_rela_know(data.testdb, Sequelize);


function getsubjectbypage_v1_1(req, res) {
    var subject = req.query.subject;
    var limit = req.query.count;
    var page = req.query.page;
    //console.log(subject+' '+limit+' '+page);
    Knowledge.findAndCountAll({
        where: { subject: subject },
        limit: limit * 1,
        offset: (page - 1) * limit
    }).then(result => {
        if (result == null) {
            res.json({ errorcode: '1', msg: 'failure' });
        } else {
            //console.log(result.count);
            // console.log(result.rows)
            var lores = [];
            for (var i = 0; i < result.rows.length; i++) {
                lore = result.rows[i].dataValues;
                lores.push(lore);
            }
            res.json({
                errorcode: '0',
                allpages: Math.ceil(result.count / limit),
                msg: lores
            });
        }
    });
}

//
async function tianjiapath(req, res) {
    result = await Knowledge.findAll();
    var map = new Map();
    for(var i=0;i<result.length;i++){
        map[result[i].dataValues.knowid] = result[i].dataValues;
    }
    var flag = true;
    while(flag){
        flag = false;
        for(var i=0;i<result.length;i++){
            //console.log(map[result[i].dataValues.knowid].pre_knowid);
            if(map[result[i].dataValues.knowid].pre_knowid == 0){
                await Knowledge.update({
                    knowpath:result[i].dataValues.knowid+','
                },{
                    where:{knowid:result[i].dataValues.knowid}
                }).then(num => {
                    if (num != 0) {
                        flag = true;
                    }
                })
            }else{
                result1 = await Knowledge.findOne({
                    where:{knowid:map[result[i].dataValues.knowid].pre_knowid}
                });
                if(result1 != null){
                    await Knowledge.update({
                        knowpath:result1.dataValues.knowpath+result[i].dataValues.knowid+','
                    },{
                        where:{knowid:result[i].dataValues.knowid}
                    }).then(num => {
                        if (num != 0) {
                            flag = true;
                        }
                    })
                }
            }
        }
    }

    res.json({errorcode:0});
}


Knowledge.hasMany(Knowledge_res_relation, { foreignKey: 'knowid' });
async function tianjiaziyuan(req,res) {
    /*result = await Knowledge.findAll({
        attributes:{include:[[Sequelize.fn('COUNT', Sequelize.col('knowledge.knowid')),'count']]},
        group:Sequelize.col('knowledge.knowid'),
        include:{

            model: Knowledge_res_relation,
            where: {knowid:Sequelize.col('knowledge.knowid')},

        }
    });*/
    result = await Knowledge_res_relation.findAll({
        attributes:['knowid',[Sequelize.fn('COUNT', Sequelize.col('r_id')),'count']],
        group:'knowid'
    });
    /*for(var i=0; i<result.length;i++){
        console.log(result[i].dataValues);
    }*/

    for(var i=0; i<result.length;i++){
        count = result[i].dataValues.count;

        await Knowledge.update({
            res_count:count
        },{
            where:{knowid:result[i].dataValues.knowid}
        })
    }
    res.json({errorcode:0});
}


async function tianjialevel(req,res) {
    result = await Knowledge.findAll();
    for(var i=0; i<result.length;i++){
        if(result[i].dataValues.knowpath != null){
            var level = result[i].dataValues.knowpath.split(',').length-1;
        }else{
            var level =0;
        }
        await Knowledge.update({
            level:level
        },{
            where:{knowid:result[i].dataValues.knowid}
        })
    }
    res.json({errorcode:0});
}

/**
 * 可能运行多次以克服子节点位于父节点之前而无法添加路径的问题
 * 或者添加一个while循环，当update返回为0时终止
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
//初始化Knowledge_struct相应的字段
async function tianjiapath1(req, res) {
    result = await Knowledge_struct.findAll();
    var map = new Map();
    for(var i=0;i<result.length;i++){
        map[result[i].dataValues.structid] = result[i].dataValues;
    }
    var flag = true;
    while (flag){
        flag = false;
        for(var i=0;i<result.length;i++) {
            //console.log(map[result[i].dataValues.knowid].pre_knowid);
            if (map[result[i].dataValues.structid].pre_structid == 0) {
                await Knowledge_struct.update({
                    structpath: result[i].dataValues.structid + ','
                }, {
                    where: {structid: result[i].dataValues.structid}
                }).then(num => {
                    if (num != 0) {
                        flag = true;
                    }
                })
            } else {
                result1 = await Knowledge_struct.findOne({
                    where: {structid: map[result[i].dataValues.structid].pre_structid}
                });
                //.log(map[result[i].dataValues.structid]);
                if (result1 != null) {
                    await Knowledge_struct.update({
                        structpath: result1.dataValues.structpath + result[i].dataValues.structid + ','
                    }, {
                        where: {structid: result[i].dataValues.structid}
                    }).then(num => {
                        if (num != 0) {
                            flag = true;
                        }
                    })
                }
            }
        }
    }
    res.json({errorcode:0});
}

async function tianjialevel1(req,res) {
    result = await Knowledge_struct.findAll();
    for(var i=0; i<result.length;i++){
        if(result[i].dataValues.structpath != null){
            var level = result[i].dataValues.structpath.split(',').length-1;
        }else{
            var level = 0;
        }
        await Knowledge_struct.update({
            level:level
        },{
            where:{structid:result[i].dataValues.structid}
        })
    }
    res.json({errorcode:0});
}


Knowledge_struct_rela_know.belongsTo(Knowledge, { foreignKey: 'knowid' });
async function tianjiaziyuan1(req,res) {

    result = await Knowledge_struct_rela_know.findAll({
        attributes:['id','structid'],
        include:{
            model: Knowledge,
            where:{knowid:Sequelize.col('knowledge_struct_rela_know.knowid')}
        }
    });
    var map = new Map();
    for(var i=0; i<result.length;i++){

        var result1 = await Knowledge.findOne({
            attributes:[[Sequelize.fn('SUM', Sequelize.col('knowledge.res_count')),'res_num']],
            where:{
                knowpath:{
                    [Op.like]: result[i].dataValues.knowledge.knowpath + '%',
                }
            }
        });
        if(map[result[i].dataValues.structid] == null){
            map[result[i].dataValues.structid] = result1.dataValues.res_num*1;
        }else{
            map[result[i].dataValues.structid] += result1.dataValues.res_num*1;
        }
    }
    result2 = await Knowledge_struct.findAll();
    for(var j = 0;j<result2.length;j++){
        var num;
        if(map[result2[j].dataValues.structid] == null){
            num = 0;
        }else {
            num = map[result2[j].dataValues.structid];
        }
        await Knowledge_struct.update({
            struct_res_count:num
        },{
            where:{structid:result2[j].dataValues.structid}
        })
    }
    //console.log(map);
    res.json({errorcode:0});
}
module.exports = {
    getsubjectbypage_v1_1: getsubjectbypage_v1_1,
    tianjiapath:tianjiapath,
    tianjiaziyuan:tianjiaziyuan,
    tianjialevel:tianjialevel,
    tianjiapath1:tianjiapath1,
    tianjialevel1:tianjialevel1,
    tianjiaziyuan1:tianjiaziyuan1
}