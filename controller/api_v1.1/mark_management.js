var express = require('express');
var router = express.Router();
var data = require('../../database/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var time = new Date();
var fs = require('fs');
var path = require('path')

var knowledge_res_relation = require('../../model/api_v1.1/knowledge_res_relation');
var resource = require('../../model/api_v1.1/resource');
var knowledge = require('../../model/api_v1.1/knowledge');
var user = require('../../model/api_v1.1/user');
var user_mark_knowres = require('../../model/api_v1.1/user_mark_knowres');
var user_credit_record = require('../../model/api_v1.1/user_credit_record');

const Knowledge_res_relation = knowledge_res_relation(data.testdb, Sequelize);
const Resource = resource(data.testdb, Sequelize);
const Knowledge = knowledge(data.testdb, Sequelize);
const User = user(data.testdb, Sequelize);
const User_mark_knowres = user_mark_knowres(data.testdb, Sequelize);
const User_credit_record = user_credit_record(data.testdb, Sequelize);

//通过r_id knowid 呈现所有众智标注结果
Knowledge_res_relation.belongsTo(Knowledge, { foreignKey: 'knowid' });
Knowledge_res_relation.belongsTo(Resource, { foreignKey: 'r_id' });
//router.put('/select',(req,res) => {
function allMarkDetail(req, res) {
    var r_id = req.param('r_id');
    var knowid = req.param('knowid');
    Knowledge_res_relation.findOne({
        attributes: ['people_mark_weight'],
        where: {
            r_id: r_id,
            knowid: knowid
        }, include: [{
            model: Resource,
            attributes: ['r_desc'],
            where: {
                r_id: Sequelize.col('knowledge_res_relation.r_id')
            }
        }, {
            model: Knowledge,
            attributes: ['title'],
            where: {
                knowid: Sequelize.col('knowledge_res_relation.knowid')
            }
        }]
    })
        .then(result => {
            if (result == null) {
                res.json({ errorCode: '1', msg: '不存在这样的资源关联' });
            } else {
                var resultJsonArray = [];
               
                    let item = {
                        title: result.dataValues.knowledge.title,
                        r_desc: result.dataValues.resource.r_desc,
                        people_mark_weight: result.dataValues.people_mark_weight,
                    }
                    resultJsonArray.push(item);
                
                res.json({
                    errorCode: '0',
                    msg: resultJsonArray
                })
            }
        })
}

//用户等级 完成一次任务，经验值加10，user_experience,
//并根据经验值确定用户等级，用户置信度
function experienceUpdate(req, res) {
    var uid = req.param('uid');
    User.findOne({
        attributes: ['user_experience'],
        where: {
            uid: uid
        }
    })
        .then(result => {
            if (result == null) {
                res.json({ errorCode: '1', msg: '用户不存在' });
            } else {
                if (result.dataValues.user_experience == null) {
                    User.update({
                        user_experience: 1
                    }, {
                            where: {
                                uid: uid
                            }
                        })
                        .then(result1 => {
                            if (result1 != null) {
                                res.json({ errorCode: '0', msg: '创建经验成功' })
                            } else {
                                res.json({ errorCode: '1', msg: '创建经验失败' })
                            }
                        })
                } else {
                    User.update({
                        user_experience: result.dataValues.user_experience + 1
                    }, {
                            where: {
                                uid: uid
                            }
                        })
                        .then(async result2 => {
                            if (result2 != null) {
                                res.json({ errorCode: '0', msg: '更新经验成功' })
                                await User.findOne({
                                    attributes: ['user_experience'],
                                    where: {
                                        uid: uid
                                    }
                                })
                                    .then(result3 => {
                                        if (0 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 50) {
                                            User.update({
                                                user_rank: 1
                                            }, {
                                                    where: {
                                                        uid: uid
                                                    }
                                                })
                                        } else if (50 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 200) {
                                            User.update({
                                                user_rank: 2
                                            }, {
                                                    where: {
                                                        uid: uid
                                                    }
                                                })
                                        } else if (200 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 500) {
                                            User.update({
                                                user_rank: 3
                                            }, {
                                                    where: {
                                                        uid: uid
                                                    }
                                                })
                                        } else if (500 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 1000) {
                                            User.update({
                                                user_rank: 4
                                            }, {
                                                    where: {
                                                        uid: uid
                                                    }
                                                })
                                        } else if (1000 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 2000) {
                                            User.update({
                                                user_rank: 5
                                            }, {
                                                    where: {
                                                        uid: uid
                                                    }
                                                })
                                        } else if (2000 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 5000) {
                                            User.update({
                                                user_rank: 6
                                            }, {
                                                    where: {
                                                        uid: uid
                                                    }
                                                })
                                        } else if (5000 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 8000) {
                                            User.update({
                                                user_rank: 7
                                            }, {
                                                    where: {
                                                        uid: uid
                                                    }
                                                })
                                        } else if (8000 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 12000) {
                                            User.update({
                                                user_rank: 8
                                            }, {
                                                    where: {
                                                        uid: uid
                                                    }
                                                })
                                        } else if (12000 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 16000) {
                                            User.update({
                                                user_rank: 9
                                            }, {
                                                    where: {
                                                        uid: uid
                                                    }
                                                })
                                        } else {
                                            User.update({
                                                user_rank: 10
                                            }, {
                                                    where: {
                                                        uid: uid
                                                    }
                                                })
                                        }
                                    })
                                // await User.findOne({
                                //     attributes: ['user_rank', 'user_identity'],
                                //     where: {
                                //         uid: uid
                                //     }
                                // })
                                //     .then(result4 => {
                                //         if (result4.dataValues.user_rank != null && result4.dataValues.user_identity != null) {
                                //             var user_identity = 0;
                                //             if (result4.dataValues.user_identity == '专家') {
                                //                 user_identity = 0.9
                                //             } else if (result4.dataValues.user_identity == '教师') {
                                //                 user_identity = 0.5
                                //             } else if (result4.dataValues.user_identity == '学生') {
                                //                 user_identity = 0.2
                                //             } else {
                                //                 user_identity = 0
                                //             }
                                //             var user_credit = 0.3 * result4.dataValues.user_rank / 10 + 0.7 * user_identity;
                                //             User.update({
                                //                 user_credit: user_credit
                                //             }, {
                                //                     where: {
                                //                         uid: uid
                                //                     }
                                //                 })
                                //         }
                                //     })
                            } else {
                                res.json({ errorCode: '1', msg: '更新经验失败' })
                            }
                        })
                }
            }
        })
}
//用户标注user_mark_knowres中weight更新：resou：editweight，knowledge_res_relation中peopl_mark_weight更新
function people_mark_weightUpdate(req, res) {
    var knowid = req.param('knowid');
    var r_id = req.param('r_id');

    User_mark_knowres.findAll({
        attributes: ['uid', 'weight'],
        where: {
            knowid: knowid,
            r_id: r_id
        }, include: [{
            model: User,
            attributes: ['user_credit'],
            where: {
                uid: Sequelize.col('user_mark_knowres.uid')
            }
        }]
    })
        .then(result => {
            if (result == null) {
                res.json({ errorCode: '1', msg: '不存在这样的资源关联' });
            } else {
                var sumCredit = 0;
                for (let j = 0; j < result.length; j++) {
                    if (result[j].dataValues.user.user_credit != null) {
                        sumCredit += result[j].dataValues.user.user_credit
                    }
                }
                var sum = 0;
                for (let i = 0; i < result.length; i++) {

                    if (result[i].dataValues.user.user_credit != null) {
                        sum += result[i].dataValues.weight * result[i].dataValues.user.user_credit / sumCredit
                    }
                }
                Knowledge_res_relation.update({
                    people_mark_weight: sum
                }, {
                        where: {
                            knowid: knowid,
                            r_id: r_id
                        }
                    })
                    .then(result1 => {
                        if (result1 == null) {
                            res.json({ errorCode: '1', msg: '关联资源people_mark_weight失败' })
                        } else {
                            res.json({ errorCode: '0', msg: '关联资源people_mark_weight成功' })
                        }
                    })
            }
        })
}

//题目推送基于用户置信度和换一批，tag为0时push前10条，tag为1跳过前十条继续push
//对关键字进行排序
function keysort(key, sortType) {
    return function (a, b) {
        return sortType ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
    }
}
async function allTask(req,res){
    result = await Knowledge_res_relation.findAll({
        attributes: ['r_id', 'knowid', 'people_mark_weight','people_mark_credit'],
        where: {
            people_mark_credit: {
                $ne: null
            }
        },
        order: [['people_mark_credit', 'ASC']],
        // limit: 8,
        // offset: tag * 8
        include: [{
            model: Resource,
            attributes: ['r_desc', 'r_name'],
            where: {
                r_id: Sequelize.col('knowledge_res_relation.r_id')
            }
        }, {
            model: Knowledge,
            attributes: ['title'],
            where: {
                knowid: Sequelize.col('knowledge_res_relation.knowid')
            }
        }]
    })
    var resultJsonArray = [];
    for (let i = 0; i < result.length; i++) {
         let item = {
                         knowid: result[i].dataValues.knowid,
                         r_id: result[i].dataValues.r_id,
                         title: result[i].dataValues.knowledge.title,
                         r_desc: result[i].dataValues.resource.r_desc,
                         r_name: result[i].dataValues.resource.r_name,
                         people_mark_weight: result[i].dataValues.people_mark_weight,
                         people_mark_credit: result[i].dataValues.people_mark_credit
                     }
                   
                    resultJsonArray.push(item);
                }
                //console.log(__dirname)
                fs.writeFile('./public/test.json', JSON.stringify(resultJsonArray) , {flag: 'w+', encoding: 'utf8'}, function (err) {
                    if(err) {
                     console.error(err);
                     } else {
                        console.log('写入成功');
                     }
                 });
                res.json({errorCode:'0',msg:'全部存入文件'})
}
function resourcePush(req, res) {
    const tag = req.query.tag;
    var resultJsonArray = [];
    fs.readFile('./public/test.json', {flag: 'r+', encoding: 'utf8'}, async function (err, data) {
        if(err) {
         console.error(err);
         return;
        }
        resultJsonArray = JSON.parse(data)
        console.log(resultJsonArray.length);
        var len = resultJsonArray.length;

        if(len != 0){
            var pushArray = [];
            //resultJsonArray = resultJsonArray.sort(keysort('people_mark_credit', false));
            var left = tag * 8,right = (add(tag,1)) * 8
            console.log(left,right)
            if(right <= len ){
                for(let j = left; j < right  ;j ++){
                    
                        console.log(j)
                        result = await Knowledge_res_relation.findOne({
                            attributes: ['people_mark_weight'],
                            where: {
                                knowid: resultJsonArray[j].knowid,
                                r_id: resultJsonArray[j].r_id
                            }
                        })
                            if(result != null){
                                resultJsonArray[j].people_mark_weight = result.dataValues.people_mark_weight
                                await pushArray.push(resultJsonArray[j])
                            }
                    
                   
        
                }
            }else if(right > len && right <= (len + 8)){
                for(let j = left; j < len  ;j ++){
                    
                    console.log(j)
                    result = await Knowledge_res_relation.findOne({
                        attributes: ['people_mark_weight'],
                        where: {
                            knowid: resultJsonArray[j].knowid,
                            r_id: resultJsonArray[j].r_id
                        }
                    })
                        if(result != null){
                            resultJsonArray[j].people_mark_weight = result.dataValues.people_mark_weight
                            await pushArray.push(resultJsonArray[j])
                        }
                
               
    
            }
            }
            res.json({ errorCode: '0', msg: pushArray})     
        }
    })
                
}
/* function resourcePush(req, res) {
    const tag = req.query.tag;
    Knowledge_res_relation.findAll({
        attributes: ['r_id', 'knowid', 'people_mark_weight'],
        where: {
            people_mark_credit: {
                $ne: null
            }
        },
        order: [['people_mark_credit', 'ASC']],
        limit: 8,
        offset: tag * 8
        , include: [{
            model: Resource,
            attributes: ['r_desc', 'r_name'],
            where: {
                r_id: Sequelize.col('Knowledge_res_relation.r_id')
            }
        }, {
            model: Knowledge,
            attributes: ['title'],
            where: {
                knowid: Sequelize.col('Knowledge_res_relation.knowid')
            }
        }]
    })
        .then(result => {
            if (result == null) {
                res.json({ errorCode: '1', msg: '推送失败' })
            } else {
                var resultJsonArray = [];
                for (let i = 0; i < result.length; i++) {
                    let item = {
                        knowid: result[i].dataValues.knowid,
                        r_id: result[i].dataValues.r_id,
                        title: result[i].dataValues.knowledge.title,
                        r_desc: result[i].dataValues.resource.r_desc,
                        r_name: result[i].dataValues.resource.r_name,
                        people_mark_weight: result[i].dataValues.people_mark_weight
                    }
                    resultJsonArray.push(item);
                }
                res.json({ errorCode: '0', msg: resultJsonArray })
            }
        })
} */

//user_mark_knowres中weight的存储
function add(arg1, arg2) {
    // 数字化
    var num1 = parseFloat(arg1);
    var num2 = parseFloat(arg2);

    var r1, r2, m;
    try {
        r1 = num1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }

    try {
        r2 = num2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }

    m = Math.pow(10, Math.max(r1, r2));

    return (num1 * m + num2 * m) / m;
};


function sub(arg1, arg2) {
    // 数字化
    var num1 = parseFloat(arg1);
    var num2 = parseFloat(arg2);

    var r1, r2, m, n;
    try {
        r1 = num1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }

    m = Math.pow(10, Math.max(r1, r2));

    return ((num1 * m - num2 * m) / m);
};


function mul(arg1, arg2) {
    // 数字化
    var num1 = parseFloat(arg1);
    var num2 = parseFloat(arg2);

    var m = 0, s1 = num1.toString(), s2 = num2.toString();
    try {
        m += s1.split('.')[1].length;
    } catch (e) {
    }
    try {
        m += s2.split('.')[1].length;
    } catch (e) {
    }
    return Number(s1.replace('.,')) * Number(s2.replace('., ')) / Math.pow(10, m);
};


function p(arg1, arg2) {
    // 数字化
    var num1 = parseFloat(arg1);
    var num2 = parseFloat(arg2);

    var t1 = 0, t2 = 0, r1, r2;

    try {
        t1 = num1.toString().split('.')[1].length;
    } catch (e) {
    }

    try {
        t2 = num2.toString().split('.')[1].length;
    } catch (e) {
    }

    r1 = Number(num1.toString().replace('., '));
    r2 = Number(num2.toString().replace('., '));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}

async function user_mark_knowresWeight(req,res){
    const knowid = req.query.knowid;
    const r_id = req.query.r_id;
    const uid = req.query.uid;
    const weight = req.query.weight;
//经验值更新
await User.findOne({
    attributes: ['user_experience'],
    where: {
        uid: uid
    }
})
    .then(result => {
        if (result == null) {
            res.json({ errorCode: '1', msg: '用户不存在' });
        } else {
            if (result.dataValues.user_experience == null) {
                User.update({
                    user_experience: 1
                }, {
                        where: {
                            uid: uid
                        }
                    })
            } else {
                User.update({
                    user_experience: result.dataValues.user_experience + 1
                }, {
                        where: {
                            uid: uid
                        }
                    })
                    .then(async result2 => {
                        if (result2 != null) {
                            await User.findOne({
                                attributes: ['user_experience'],
                                where: {
                                    uid: uid
                                }
                            })
                                .then(result3 => {
                                    if (0 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 50) {
                                        User.update({
                                            user_rank: 1
                                        }, {
                                                where: {
                                                    uid: uid
                                                }
                                            })
                                    } else if (50 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 200) {
                                        User.update({
                                            user_rank: 2
                                        }, {
                                                where: {
                                                    uid: uid
                                                }
                                            })
                                    } else if (200 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 500) {
                                        User.update({
                                            user_rank: 3
                                        }, {
                                                where: {
                                                    uid: uid
                                                }
                                            })
                                    } else if (500 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 1000) {
                                        User.update({
                                            user_rank: 4
                                        }, {
                                                where: {
                                                    uid: uid
                                                }
                                            })
                                    } else if (1000 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 2000) {
                                        User.update({
                                            user_rank: 5
                                        }, {
                                                where: {
                                                    uid: uid
                                                }
                                            })
                                    } else if (2000 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 5000) {
                                        User.update({
                                            user_rank: 6
                                        }, {
                                                where: {
                                                    uid: uid
                                                }
                                            })
                                    } else if (5000 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 8000) {
                                        User.update({
                                            user_rank: 7
                                        }, {
                                                where: {
                                                    uid: uid
                                                }
                                            })
                                    } else if (8000 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 12000) {
                                        User.update({
                                            user_rank: 8
                                        }, {
                                                where: {
                                                    uid: uid
                                                }
                                            })
                                    } else if (12000 < result3.dataValues.user_experience && result3.dataValues.user_experience <= 16000) {
                                        User.update({
                                            user_rank: 9
                                        }, {
                                                where: {
                                                    uid: uid
                                                }
                                            })
                                    } else {
                                        User.update({
                                            user_rank: 10
                                        }, {
                                                where: {
                                                    uid: uid
                                                }
                                            })
                                    }
                                })
    
                        } 
                    })
            }
        }
    })

    await User.findOne({
        attributes: ['user_credit'],
        where:{
            uid: uid
        }
    })
    .then(async result7 =>{
        //新用户进行标注
        if(result7.dataValues.user_credit == null){
            await User_mark_knowres.create({
                knowid: knowid,
                r_id: r_id,
                uid: uid,
                weight: weight,
                add_time: time,
                update_time: time
            })
            await User.update({
                user_credit: 0.2
            },{
                where:{
                    uid: uid
                }
            })
            //判断该资源关联是否为第一次标注，更新knowledge_res_relation
            await Knowledge_res_relation.findOne({
                attributes: ['people_mark_weight'],
                where:{
                    knowid: knowid,
                    r_id: r_id
                }
            }).then(async result0 =>{
                if(result0 == null || result0.length == 0){
                    await Knowledge_res_relation.create({
                        people_mark_weight: weight,
                        weight: weight,
                        knowid: knowid,
                        r_id: r_id
                    })
                    await User_credit_record.create({
                        uid: uid,
                        knowid: knowid,
                        r_id: r_id,
                        weight: weight,
                        user_credit: 0.2,
                        mark_result: 0,
                        mark_time: time,
                    })
                    .then(result6 =>{
                        if(result6 != null || result6.length != 0){
                            res.json({errorCode:'0',msg:'success'})
                        }else{
                            res.json({errorCode:'0',msg:'false'})
                        }
                    })
                }else{
                    if(result0.dataValues.people_mark_weight == null){
                        await Knowledge_res_relation.update({
                            people_mark_weight: weight
                        },{       
                            where:{
                                knowid: knowid,
                                r_id: r_id
                            }
                        })
                        await User_credit_record.create({
                            uid: uid,
                            knowid: knowid,
                            r_id: r_id,
                            weight: weight,
                            user_credit: 0.2,
                            mark_result: 0,
                            mark_time: time,
                        }).then(result6 =>{
                            if(result6 != null || result6.length != 0){
                                res.json({errorCode:'0',msg:'success'})
                            }else{
                                res.json({errorCode:'0',msg:'false'})
                            }
                        })
                    }else{
                        //计算
                        result2 = await Knowledge_res_relation.findOne({
                            attributes: ['people_mark_weight'],
                                where: {
                                    knowid: knowid,
                                    r_id: r_id
                                }
                        })
                        totle = await User_mark_knowres.count({
                            where:{
                                uid:uid
                            }
                        })
                        if(result2 != null && result2.length !=0 && totle != 0 && totle != null){
                            if(Math.abs(sub(result2.dataValues.people_mark_weight,weight)) < 0.2){
                                
                                var new_credit = add(0.2 * totle/(totle+1),(1 / (totle+1)));
                                await User_credit_record.create({
                                    uid: uid,
                                    knowid: knowid,
                                    r_id: r_id,
                                    weight: weight,
                                    user_credit: new_credit,
                                    mark_result: 0,
                                    mark_time: time,
                                })
                                await User.update({
                                    user_credit: new_credit
                                },{
                                    where:{
                                        uid: uid
                                    }
                                })
                                .then(result6 =>{
                                    if(result6 != null || result6.length != 0){
                                        res.json({errorCode:'0',msg:'success'})
                                    }else{
                                        res.json({errorCode:'0',msg:'false'})
                                    }
                                })
                                    
                            }else{
                                var new_credit = 0.2 * totle/(totle+1);
                                await User_credit_record.create({
                                    uid: uid,
                                    knowid: knowid,
                                    r_id: r_id,
                                    weight: weight,
                                    user_credit: new_credit,
                                    mark_result: 1,
                                    mark_time: time,
                                })
                                await User.update({
                                    user_credit: new_credit
                                },{
                                    where:{
                                        uid: uid
                                    }
                                })
                            }
                            
                            //计算people_mark_weight
                            
                                
                                    await User_mark_knowres.findAll({
                                        attributes: ['uid', 'weight'],
                                        where: {
                                            knowid: knowid,
                                            r_id: r_id
                                        }, include: [{
                                            model: User,
                                            attributes: ['user_credit'],
                                            where: {
                                                uid: Sequelize.col('user_mark_knowres.uid')
                                            }
                                        }]
                                    })
                                        .then(async result4 => {
                                            if (result4 != null && result4.length != 0) {
                    
                                                var sumCredit = 0;
                                                for (let j = 0; j < result4.length; j++) {
                                                    if (result4[j].dataValues.user.user_credit != null) {
                                                        sumCredit += result4[j].dataValues.user.user_credit
                                                    }
                                                }
                                                //console.log('用户置信度之和为：' + sumCredit)
                                                if (sumCredit != 0) {
                                                    var sum = 0;
                                                    for (let i = 0; i < result4.length; i++) {
                    
                                                        if (result4[i].dataValues.user.user_credit != null) {
                                                            sum += result4[i].dataValues.weight * result4[i].dataValues.user.user_credit
                                                        }
                                                        sum = sum /sumCredit
                                                    }
                                                    console.log('计算所得people_mark_weight为：' + sum)
                                                } else {
                                                    console.log('用户置信度之和为零，检查user_identity是否都为空')
                                                }
                                                //更新knowledge_res_relation中相关的值
                                                await Knowledge_res_relation.findOne({
                                                    attributes: ['people_mark_weight', 'auto_weight', 'expert_mark_weight'],
                                                    where: {
                                                        knowid: knowid,
                                                        r_id: r_id
                                                    }
                                                })
                                                    .then(async result5 => {
                                                        if (result5 != null && result5.length != 0) {
                                                            if (result5.dataValues.auto_weight == null) {
                                                                if (result5.dataValues.expert_mark_weight == null) {
                                                                    await Knowledge_res_relation.update({
                                                                        people_mark_weight: sum,
                                                                        weight: sum
                                                                    }, {
                                                                            where: {
                                                                                knowid: knowid,
                                                                                r_id: r_id
                                                                            }
                                                                        })
                                                                        .then(result6 =>{
                                                                            if(result6 != null || result6.length != 0){
                                                                                res.json({errorCode:'0',msg:'success'})
                                                                            }else{
                                                                                res.json({errorCode:'0',msg:'false'})
                                                                            }
                                                                        })
                                                                } else {
                                                                    await Knowledge_res_relation.update({
                                                                        people_mark_weight: sum,
                                                                        weight: add(sum, result5.dataValues.expert_mark_weight) / 2
                                                                        //weight: (sum + result4.dataValues.expert_mark_weight)/2
                                                                    }, {
                                                                            where: {
                                                                                knowid: knowid,
                                                                                r_id: r_id
                                                                            }
                                                                        })
                                                                        .then(result6 =>{
                                                                            if(result6 != null || result6.length != 0){
                                                                                res.json({errorCode:'0',msg:'success'})
                                                                            }else{
                                                                                res.json({errorCode:'0',msg:'false'})
                                                                            }
                                                                        })
                                                                }
                                                            } else {
                                                                if (result5.dataValues.expert_mark_weight == null) {
                                                                    await Knowledge_res_relation.update({
                                                                        people_mark_weight: sum,
                                                                        weight: add(sum, result5.dataValues.auto_weight) / 2
                                                                        //weight: (sum + result4.dataValues.auto_weight)/2 
                                                                    }, {
                                                                            where: {
                                                                                knowid: knowid,
                                                                                r_id: r_id
                                                                            }
                                                                        })
                                                                        .then(result6 =>{
                                                                            if(result6 != null || result6.length != 0){
                                                                                res.json({errorCode:'0',msg:'success'})
                                                                            }else{
                                                                                res.json({errorCode:'0',msg:'false'})
                                                                            }
                                                                        })
                                                                } else {
                                                                    await Knowledge_res_relation.update({
                                                                        people_mark_weight: sum,
                                                                        weight: add(add(sum, result5.dataValues.expert_mark_weight), result5.dataValues.auto_weight) / 3
                                                                        //weight: (sum + result4.dataValues.expert_mark_weight + result4.dataValues.auto_weight)/3
                                                                    }, {
                                                                            where: {
                                                                                knowid: knowid,
                                                                                r_id: r_id
                                                                            }
                                                                        })
                                                                        .then(result6 =>{
                                                                            if(result6 != null || result6.length != 0){
                                                                                res.json({errorCode:'0',msg:'success'})
                                                                            }else{
                                                                                res.json({errorCode:'0',msg:'false'})
                                                                            }
                                                                        })
                                                                }
                                                            }
                    
                                                        } 
                                                    })
                                            }
                                        })
                                
                            
                        }  
                    }
                }   
            })
      
        }else{
            await User_mark_knowres.findOne({
                where:{
                    knowid: knowid,
                    r_id: r_id,
                    uid: uid
                }
            })
            .then(async result10 =>{
                //老用户第一次对该关联资源进行标注
                if(result10 == null || result10.length == 0){
                    await User_mark_knowres.create({
                        knowid: knowid,
                        r_id: r_id,
                        uid: uid,
                        weight: weight,
                        add_time: time,
                        update_time: time
                    })
                     //判断该资源是否为第一次标注，更新knowledge_res_relation
                     await Knowledge_res_relation.findOne({
                        attributes: ['people_mark_weight'],
                        where:{
                            knowid: knowid,
                            r_id: r_id
                        }
                    }).then(async result0 =>{
                        if(result0 == null || result0.length == 0){
                            await Knowledge_res_relation.create({
                                people_mark_weight: weight,
                                weight: weight,
                                knowid: knowid,
                                r_id: r_id
                            })
                            result3 = await User.findOne({
                                attributes:['user_credit'],
                                where:{
                                    uid:uid
                                }
                            })
                            totle = await User_mark_knowres.count({
                                where:{
                                    uid:uid
                                }
                            })
                            if( result3 != null && result3.length != 0 && totle != 0 && totle != null){
                                var new_credit = 0;
                                var previous_credit = result3.dataValues.user_credit;
                                console.log(totle);
                                
                                new_credit = add(previous_credit * totle/(totle+1),(1 / (totle+1)));
                                    await User_credit_record.create({
                                        uid: uid,
                                        knowid: knowid,
                                        r_id: r_id,
                                        weight: weight,
                                        user_credit: new_credit,
                                        mark_result: 0,
                                        mark_time: time,
                                    })
                                    console.log('用户新的置信度为：'+new_credit)
                                    await User.update({
                                        user_credit: new_credit
                                    },{
                                        where:{
                                            uid: uid
                                        }
                                    }).then(result6 =>{
                                        if(result6 != null || result6.length != 0){
                                            res.json({errorCode:'0',msg:'success'})
                                        }else{
                                            res.json({errorCode:'0',msg:'false'})
                                        }
                                    })
                                }
                        }else{
                            if(result0.dataValues.people_mark_weight == null){
                                await Knowledge_res_relation.update({
                                    people_mark_weight: weight
                                },{       
                                    where:{
                                        knowid: knowid,
                                        r_id: r_id
                                    }
                                })
                                result3 = await User.findOne({
                                    attributes:['user_credit'],
                                    where:{
                                        uid:uid
                                    }
                                })
                                totle = await User_mark_knowres.count({
                                    where:{
                                        uid:uid
                                    }
                                })
                                if( result3 != null && result3.length != 0 && totle != 0 && totle != null){
                                    var new_credit = 0;
                                    var previous_credit = result3.dataValues.user_credit;
                                    console.log(totle);
                                    
                                    new_credit = add(previous_credit * totle/(totle+1),(1 / (totle+1)));
                                        await User_credit_record.create({
                                            uid: uid,
                                            knowid: knowid,
                                            r_id: r_id,
                                            weight: weight,
                                            user_credit: new_credit,
                                            mark_result: 0,
                                            mark_time: time,
                                        })
                                        console.log('用户新的置信度为：'+new_credit)
                                    await User.update({
                                        user_credit: new_credit
                                    },{
                                        where:{
                                            uid: uid
                                        }
                                    }).then(result6 =>{
                                        if(result6 != null || result6.length != 0){
                                            res.json({errorCode:'0',msg:'success'})
                                        }else{
                                            res.json({errorCode:'0',msg:'false'})
                                        }
                                    })
                                    }

                            }else{
                                //计算
                                result2 = await Knowledge_res_relation.findOne({
                                    attributes: ['people_mark_weight'],
                                        where: {
                                            knowid: knowid,
                                            r_id: r_id
                                        }
                                })
                                result3 = await User.findOne({
                                    attributes:['user_credit'],
                                    where:{
                                        uid:uid
                                    }
                                })
                                totle = await User_mark_knowres.count({
                                    where:{
                                        uid:uid
                                    }
                                })
                                if(result2 != null && result2.length !=0 && result3 != null && result3.length != 0 && totle != 0 && totle != null){
                                    var new_credit = 0;
                                    var previous_credit = result3.dataValues.user_credit;
                                    console.log(totle);
                                    if(Math.abs(sub(result2.dataValues.people_mark_weight,weight)) < 0.2){
                                        new_credit = add(previous_credit * totle/(totle+1),(1 / (totle+1)));
                                        await User_credit_record.create({
                                            uid: uid,
                                            knowid: knowid,
                                            r_id: r_id,
                                            weight: weight,
                                            user_credit: new_credit,
                                            mark_result: 0,
                                            mark_time: time,
                                        })
                                        console.log('用户新的置信度为：'+new_credit)
                                    await User.update({
                                        user_credit: new_credit
                                    },{
                                        where:{
                                            uid: uid
                                        }
                                    })
                                    }else{
                                        new_credit = previous_credit * totle/(totle+1);
                                        await User_credit_record.create({
                                            uid: uid,
                                            knowid: knowid,
                                            r_id: r_id,
                                            weight: weight,
                                            user_credit: new_credit,
                                            mark_result: 1,
                                            mark_time: time,
                                        })
                                        console.log('用户新的置信度为：'+new_credit)
                                    await User.update({
                                        user_credit: new_credit
                                    },{
                                        where:{
                                            uid: uid
                                        }
                                    })
                                    }
                                  
                                    //计算people_mark_weight
                                            await User_mark_knowres.findAll({
                                                attributes: ['uid', 'weight'],
                                                where: {
                                                    knowid: knowid,
                                                    r_id: r_id
                                                }, include: [{
                                                    model: User,
                                                    attributes: ['user_credit'],
                                                    where: {
                                                        uid: Sequelize.col('user_mark_knowres.uid')
                                                    }
                                                }]
                                            })
                                                .then(async result4 => {
                                                    if (result4 != null && result4.length != 0) {
                            
                                                        var sumCredit = 0;
                                                        for (let j = 0; j < result4.length; j++) {
                                                            if (result4[j].dataValues.user.user_credit != null) {
                                                                sumCredit += result4[j].dataValues.user.user_credit
                                                            }
                                                        }
                                                        //console.log('用户置信度之和为：' + sumCredit)
                                                        if (sumCredit != 0) {
                                                            var sum = 0;
                                                            for (let i = 0; i < result4.length; i++) {
                            
                                                                if (result4[i].dataValues.user.user_credit != null) {
                                                                    sum += result4[i].dataValues.weight * result4[i].dataValues.user.user_credit 
                                                                }
                                                                sum = sum / sumCredit
                                                            }
                                                            console.log('计算所得people_mark_weight为：' + sum)
                                                        } else {
                                                            console.log('用户置信度之和为零，检查user_identity是否都为空')
                                                        }
                                                        //更新knowledge_res_relation中相关的值
                                                        await Knowledge_res_relation.findOne({
                                                            attributes: ['people_mark_weight', 'auto_weight', 'expert_mark_weight'],
                                                            where: {
                                                                knowid: knowid,
                                                                r_id: r_id
                                                            }
                                                        })
                                                            .then(async result5 => {
                                                                if (result5 != null && result5.length != 0) {
                                                                    if (result5.dataValues.auto_weight == null) {
                                                                        if (result5.dataValues.expert_mark_weight == null) {
                                                                            await Knowledge_res_relation.update({
                                                                                people_mark_weight: sum,
                                                                                weight: sum
                                                                            }, {
                                                                                    where: {
                                                                                        knowid: knowid,
                                                                                        r_id: r_id
                                                                                    }
                                                                                })
                                                                                .then(result6 =>{
                                                                                    if(result6 != null || result6.length != 0){
                                                                                        res.json({errorCode:'0',msg:'success'})
                                                                                    }else{
                                                                                        res.json({errorCode:'0',msg:'false'})
                                                                                    }
                                                                                })
                                                                        } else {
                                                                            await Knowledge_res_relation.update({
                                                                                people_mark_weight: sum,
                                                                                weight: add(sum, result5.dataValues.expert_mark_weight) / 2
                                                                                //weight: (sum + result4.dataValues.expert_mark_weight)/2
                                                                            }, {
                                                                                    where: {
                                                                                        knowid: knowid,
                                                                                        r_id: r_id
                                                                                    }
                                                                                })
                                                                                .then(result6 =>{
                                                                                    if(result6 != null || result6.length != 0){
                                                                                        res.json({errorCode:'0',msg:'success'})
                                                                                    }else{
                                                                                        res.json({errorCode:'0',msg:'false'})
                                                                                    }
                                                                                })
                                                                        }
                                                                    } else {
                                                                        if (result5.dataValues.expert_mark_weight == null) {
                                                                            await Knowledge_res_relation.update({
                                                                                people_mark_weight: sum,
                                                                                weight: add(sum, result5.dataValues.auto_weight) / 2
                                                                                //weight: (sum + result4.dataValues.auto_weight)/2 
                                                                            }, {
                                                                                    where: {
                                                                                        knowid: knowid,
                                                                                        r_id: r_id
                                                                                    }
                                                                                })
                                                                                .then(result6 =>{
                                                                                    if(result6 != null || result6.length != 0){
                                                                                        res.json({errorCode:'0',msg:'success'})
                                                                                    }else{
                                                                                        res.json({errorCode:'0',msg:'false'})
                                                                                    }
                                                                                })
                                                                        } else {
                                                                            await Knowledge_res_relation.update({
                                                                                people_mark_weight: sum,
                                                                                weight: add(add(sum, result5.dataValues.expert_mark_weight), result5.dataValues.auto_weight) / 3
                                                                                //weight: (sum + result4.dataValues.expert_mark_weight + result4.dataValues.auto_weight)/3
                                                                            }, {
                                                                                    where: {
                                                                                        knowid: knowid,
                                                                                        r_id: r_id
                                                                                    }
                                                                                })
                                                                                .then(result6 =>{
                                                                                    if(result6 != null || result6.length != 0){
                                                                                        res.json({errorCode:'0',msg:'success'})
                                                                                    }else{
                                                                                        res.json({errorCode:'0',msg:'false'})
                                                                                    }
                                                                                })
                                                                        }
                                                                    }
                            
                                                                } 
                                                            })
                                                    }
                                                })
                                   
                                }  
                    
                            }
                        }   
                    })
           
                }else{
                    await User_mark_knowres.update({
                        weight:weight,
                        update_time: time
                    },{
                        where:{
                        knowid: knowid,
                        r_id: r_id,
                        uid: uid
                    }
                })
                 //判断该资源是否为第一次标注，更新knowledge_res_relation
                 await Knowledge_res_relation.findOne({
                    attributes: ['people_mark_weight'],
                    where:{
                        knowid: knowid,
                        r_id: r_id
                    }
                }).then(async result0 =>{
                    if(result0 == null || result0.length == 0){
                        await Knowledge_res_relation.create({
                            people_mark_weight: weight,
                            weight: weight,
                            knowid: knowid,
                            r_id: r_id
                        })
                        result3 = await User.findOne({
                            attributes:['user_credit'],
                            where:{
                                uid:uid
                            }
                        })
                        totle = await User_mark_knowres.count({
                            where:{
                                uid:uid
                            }
                        })
                        if( result3 != null && result3.length != 0 && totle != 0 && totle != null){
                            var new_credit = 0;
                            var previous_credit = result3.dataValues.user_credit;
                            console.log(totle);
                            
                            new_credit = add(previous_credit * totle/(totle+1),(1 / (totle+1)));
                                await User_credit_record.create({
                                    uid: uid,
                                    knowid: knowid,
                                    r_id: r_id,
                                    weight: weight,
                                    user_credit: new_credit,
                                    mark_result: 0,
                                    mark_time: time,
                                })
                                console.log('用户新的置信度为：'+new_credit)
                                    await User.update({
                                        user_credit: new_credit
                                    },{
                                        where:{
                                            uid: uid
                                        }
                                    })
                                    .then(result6 =>{
                                        if(result6 != null || result6.length != 0){
                                            res.json({errorCode:'0',msg:'success'})
                                        }else{
                                            res.json({errorCode:'0',msg:'false'})
                                        }
                                    })
                            }
                    }else{
                        if(result0.dataValues.people_mark_weight == null){
                            await Knowledge_res_relation.update({
                                people_mark_weight: weight
                            },{       
                                where:{
                                    knowid: knowid,
                                    r_id: r_id
                                }
                            })
                            result3 = await User.findOne({
                                attributes:['user_credit'],
                                where:{
                                    uid:uid
                                }
                            })
                            totle = await User_mark_knowres.count({
                                where:{
                                    uid:uid
                                }
                            })
                            if( result3 != null && result3.length != 0 && totle != 0 && totle != null){
                                var new_credit = 0;
                                var previous_credit = result3.dataValues.user_credit;
                                console.log(totle);
                                
                                new_credit = add(previous_credit * totle/(totle+1),(1 / (totle+1)));
                                    await User_credit_record.create({
                                        uid: uid,
                                        knowid: knowid,
                                        r_id: r_id,
                                        weight: weight,
                                        user_credit: new_credit,
                                        mark_result: 0,
                                        mark_time: time,
                                    })
                                    console.log('用户新的置信度为：'+new_credit)
                                    await User.update({
                                        user_credit: new_credit
                                    },{
                                        where:{
                                            uid: uid
                                        }
                                    })
                                    .then(result6 =>{
                                        if(result6 != null || result6.length != 0){
                                            res.json({errorCode:'0',msg:'success'})
                                        }else{
                                            res.json({errorCode:'0',msg:'false'})
                                        }
                                    })
                                }
                        }else{
                            //计算
                            result2 = await Knowledge_res_relation.findOne({
                                attributes: ['people_mark_weight'],
                                    where: {
                                        knowid: knowid,
                                        r_id: r_id
                                    }
                            })
                            result3 = await User.findOne({
                                attributes:['user_credit'],
                                where:{
                                    uid:uid
                                }
                            })
                            totle = await User_mark_knowres.count({
                                where:{
                                    uid:uid
                                }
                            })
                            if(result2 != null && result2.length !=0 && result3 != null && result3.length != 0 && totle != 0 && totle != null){
                                var new_credit = 0;
                                var previous_credit = result3.dataValues.user_credit;
                                console.log(totle);
                                if(Math.abs(sub(result2.dataValues.people_mark_weight,weight)) < 0.2){
                                    new_credit = add(previous_credit * totle/(totle+1),(1 / (totle+1)));
                                    await User_credit_record.create({
                                        uid: uid,
                                        knowid: knowid,
                                        r_id: r_id,
                                        weight: weight,
                                        user_credit: new_credit,
                                        mark_result: 0,
                                        mark_time: time,
                                    })
                                    console.log('用户新的置信度为：'+new_credit)
                                    await User.update({
                                        user_credit: new_credit
                                    },{
                                        where:{
                                            uid: uid
                                        }
                                    })
                                    .then(result6 =>{
                                        if(result6 != null || result6.length != 0){
                                            res.json({errorCode:'0',msg:'success'})
                                        }else{
                                            res.json({errorCode:'0',msg:'false'})
                                        }
                                    })
                                }else{
                                    new_credit = previous_credit * totle/(totle+1);
                                    await User_credit_record.create({
                                        uid: uid,
                                        knowid: knowid,
                                        r_id: r_id,
                                        weight: weight,
                                        user_credit: new_credit,
                                        mark_result: 1,
                                        mark_time: time,
                                    })
                                    console.log('用户新的置信度为：'+new_credit)
                                    await User.update({
                                        user_credit: new_credit
                                    },{
                                        where:{
                                            uid: uid
                                        }
                                    })
                                }
                               
                                //计算people_mark_weight
                                        await User_mark_knowres.findAll({
                                            attributes: ['uid', 'weight'],
                                            where: {
                                                knowid: knowid,
                                                r_id: r_id
                                            }, include: [{
                                                model: User,
                                                attributes: ['user_credit'],
                                                where: {
                                                    uid: Sequelize.col(' user_mark_knowres.uid')
                                                }
                                            }]
                                        })
                                            .then(async result4 => {
                                                if (result4 != null && result4.length != 0) {
                        
                                                    var sumCredit = 0;
                                                    for (let j = 0; j < result4.length; j++) {
                                                        if (result4[j].dataValues.user.user_credit != null) {
                                                            sumCredit += result4[j].dataValues.user.user_credit
                                                        }
                                                    }
                                                    //console.log('用户置信度之和为：' + sumCredit)
                                                    if (sumCredit != 0) {
                                                        var sum = 0;
                                                        for (let i = 0; i < result4.length; i++) {
                        
                                                            if (result4[i].dataValues.user.user_credit != null) {
                                                                sum += result4[i].dataValues.weight * result4[i].dataValues.user.user_credit 
                                                            }
                                                            sum = sum /sumCredit
                                                        }
                                                        console.log('计算所得people_mark_weight为：' + sum)
                                                    } else {
                                                        console.log('用户置信度之和为零，检查user_identity是否都为空')
                                                    }
                                                    //更新knowledge_res_relation中相关的值
                                                    await Knowledge_res_relation.findOne({
                                                        attributes: ['people_mark_weight', 'auto_weight', 'expert_mark_weight'],
                                                        where: {
                                                            knowid: knowid,
                                                            r_id: r_id
                                                        }
                                                    })
                                                        .then(async result5 => {
                                                            if (result5 != null && result5.length != 0) {
                                                                if (result5.dataValues.auto_weight == null) {
                                                                    if (result5.dataValues.expert_mark_weight == null) {
                                                                        await Knowledge_res_relation.update({
                                                                            people_mark_weight: sum,
                                                                            weight: sum
                                                                        }, {
                                                                                where: {
                                                                                    knowid: knowid,
                                                                                    r_id: r_id
                                                                                }
                                                                            })
                                                                            .then(result6 =>{
                                                                                if(result6 != null || result6.length != 0){
                                                                                    res.json({errorCode:'0',msg:'success'})
                                                                                }else{
                                                                                    res.json({errorCode:'0',msg:'false'})
                                                                                }
                                                                            })
                                                                    } else {
                                                                        await Knowledge_res_relation.update({
                                                                            people_mark_weight: sum,
                                                                            weight: add(sum, result5.dataValues.expert_mark_weight) / 2
                                                                            //weight: (sum + result4.dataValues.expert_mark_weight)/2
                                                                        }, {
                                                                                where: {
                                                                                    knowid: knowid,
                                                                                    r_id: r_id
                                                                                }
                                                                            })
                                                                            .then(result6 =>{
                                                                                if(result6 != null || result6.length != 0){
                                                                                    res.json({errorCode:'0',msg:'success'})
                                                                                }else{
                                                                                    res.json({errorCode:'0',msg:'false'})
                                                                                }
                                                                            })
                                                                    }
                                                                } else {
                                                                    if (result5.dataValues.expert_mark_weight == null) {
                                                                        await Knowledge_res_relation.update({
                                                                            people_mark_weight: sum,
                                                                            weight: add(sum, result5.dataValues.auto_weight) / 2
                                                                            //weight: (sum + result4.dataValues.auto_weight)/2 
                                                                        }, {
                                                                                where: {
                                                                                    knowid: knowid,
                                                                                    r_id: r_id
                                                                                }
                                                                            })
                                                                            .then(result6 =>{
                                                                                if(result6 != null || result6.length != 0){
                                                                                    res.json({errorCode:'0',msg:'success'})
                                                                                }else{
                                                                                    res.json({errorCode:'0',msg:'false'})
                                                                                }
                                                                            })
                                                                    } else {
                                                                        await Knowledge_res_relation.update({
                                                                            people_mark_weight: sum,
                                                                            weight: add(add(sum, result5.dataValues.expert_mark_weight), result5.dataValues.auto_weight) / 3
                                                                            //weight: (sum + result4.dataValues.expert_mark_weight + result4.dataValues.auto_weight)/3
                                                                        }, {
                                                                                where: {
                                                                                    knowid: knowid,
                                                                                    r_id: r_id
                                                                                }
                                                                            })
                                                                            .then(result6 =>{
                                                                                if(result6 != null || result6.length != 0){
                                                                                    res.json({errorCode:'0',msg:'success'})
                                                                                }else{
                                                                                    res.json({errorCode:'0',msg:'false'})
                                                                                }
                                                                            })
                                                                    }
                                                                }
                        
                                                            } 
                                                        })
                                                }
                                            })
                                
                            }  
                
                        }
                    }   
                })
                }
            }) 
        }
    })
    //更新准确率
    resultCorrect = await User_credit_record.count({
        where:{
            uid: uid,
            mark_result: 0,
        }
    })
    console.log(resultCorrect)
    resultTotle = await User_credit_record.count({
        where:{
            uid:uid
        }
    })
    console.log(resultTotle)
    await User.update({
        user_mark_accuracy: resultCorrect/resultTotle
    },{
        where:{
            uid:uid
        }
    })
    //更新众智置信度
    await User_mark_knowres.findAll({
        attributes: ['uid'],
        where: {
            knowid: knowid,
            r_id: r_id
        }, include: [{
            model: User,
            attributes: ['user_credit'],
            where: {
                uid: Sequelize.col('user_mark_knowres.uid')
            }
        }]
    })
        .then(async result11 => {
            if (result11 == null) {
                res.json({ errorCode: '1', msg: '不存在这样的资源关联' });
            } else {
                var tmp = 1;
                for (let i = 0; i < result11.length; i++) {
                    if (result11[i].dataValues.user.user_credit != null) {
                        tmp *= 1 - result11[i].dataValues.user.user_credit
                    }
                }
                var people_mark_credit = 1 - tmp;
                await Knowledge_res_relation.update({
                    people_mark_credit: people_mark_credit
                }, {
                        where: {
                            knowid: knowid,
                            r_id: r_id
                        }
                    })
            }
        })
    
    //更新user_mark_knowres
    /* await User_mark_knowres.findOne({
        attributes: ['weight'],
        where:{
            knowid: knowid,
            r_id: r_id
        }
    }).then(async result1 =>{
        if(result1 == null || result1.length == 0){
            await User_mark_knowres.create({
                knowid: knowid,
                r_id: r_id,
                uid: uid,
                weight: weight,
                add_time: time,
                update_time: time
            })
        }else{
            await User_mark_knowres.update({
                weight: weight,
                update_time: time
            }, {
                where: {
                    knowid: knowid,
                    r_id: r_id,
                    uid: uid
                }
            })
        }
    }) */


}



//置信度更新知识点id、资源id众智标注置信度people_mark_credit
User_mark_knowres.belongsTo(User, { foreignKey: 'uid' })
function people_mark_creditUpdate(req, res) {
    var knowid = req.param('knowid');
    var r_id = req.param('r_id');

    User_mark_knowres.findAll({
        attributes: ['uid'],
        where: {
            knowid: knowid,
            r_id: r_id
        }, include: [{
            model: User,
            attributes: ['user_credit'],
            where: {
                uid: Sequelize.col('user_mark_knowres.uid')
            }
        }]
    })
        .then(result => {
            if (result == null) {
                res.json({ errorCode: '1', msg: '不存在这样的资源关联' });
            } else {
                var tmp = 1;
                for (let i = 0; i < result.length; i++) {
                    if (result[i].dataValues.user.user_credit != null) {
                        tmp *= 1 - result[i].dataValues.user.user_credit
                    }
                }
                var people_mark_credit = 1 - tmp;
                Knowledge_res_relation.update({
                    people_mark_credit: people_mark_credit
                }, {
                        where: {
                            knowid: knowid,
                            r_id: r_id
                        }
                    })
                    .then(result1 => {
                        if (result1 == null) {
                            res.json({ errorCode: '1', msg: '关联资源people_mark_credit失败' })
                        } else {
                            res.json({ errorCode: '0', msg: '关联资源people_mark_credit成功' })
                        }
                    })
            }
        })
}

//我的任务输入uid返回title,r_desc,knowres.weight,relation.weight
function myTask(req, res) {
    const uid = req.query.uid;
    var limit = req.query.count;
    var page = req.query.page;

    User_mark_knowres.findAndCountAll({
        attributes: ['knowid', 'r_id', 'weight','update_time'],
        where: {
            uid: uid
        },
        limit: limit * 1,
        offset: (page - 1) * limit,
        order:[['update_time','desc']]
    })
        .then(async result => {
            if (result == null || result.count == 0) {
                res.json({ errorCode: '1', msg: '用户当前未标注任何关联权重' })
            } else {
                var resultJsonArray = [];
                for (let i = 0; i < result.rows.length; i++) {
                    await Knowledge_res_relation.findOne({
                        attributes: ['weight'],
                        where: {
                            knowid: result.rows[i].dataValues.knowid,
                            r_id: result.rows[i].dataValues.r_id
                        },
                        include: [{
                            model: Resource,
                            attributes: ['r_desc', 'r_name'],
                            where: {
                                r_id: Sequelize.col('knowledge_res_relation.r_id')
                            }
                        }, {
                            model: Knowledge,
                            attributes: ['title'],
                            where: {
                                knowid: Sequelize.col('knowledge_res_relation.knowid')
                            }
                        }]
                    })
                        .then(async result1 => {
                            if (result1 == null || result1.length == 0) {
                                let item = {
                                    knowid: result.rows[i].dataValues.knowid,
                                    r_id: result.rows[i].dataValues.r_id,
                                    errorInfo: '关联表中没有这样的关联'
                                }
                                await resultJsonArray.push(item);
                            } else {
                                let item = {
                                    knowid: result.rows[i].dataValues.knowid,
                                    r_id: result.rows[i].dataValues.r_id,
                                    usermarkweight: result.rows[i].dataValues.weight,
                                    relationweight: result1.dataValues.weight,
                                    title: result1.dataValues.knowledge.title,
                                    r_desc: result1.dataValues.resource.r_desc,
                                    r_name: result1.dataValues.resource.r_name,
                                    update_time: result.rows[i].dataValues.update_time
                                }
                                await resultJsonArray.push(item);
                            }
                        })
                }
                res.json({ errorCode: '0', allpages: Math.ceil(result.count / limit), msg: resultJsonArray })
            }
        })
}
function myTaskClassify(req,res){
    const uid = req.query.uid;
    var limit = req.query.count;
    var page = req.query.page;
    User_mark_knowres.findAndCountAll({
        attributes: ['knowid', 'r_id', 'weight','update_time'],
        where: {
            uid: uid
        },
        //limit: limit * 1,
        //offset: (page - 1) * limit,
        order:[['update_time','desc']]
    }).then(async result => {
        if (result == null || result.count == 0) {
            res.json({ errorCode: '1', msg: '用户当前未标注任何关联权重' })
        } else {
            var resultJsonArray1 = [];
            var resultJsonArray2 = [];
            for (let i = 0; i < result.rows.length; i++) {
                result2 = await User_mark_knowres.count({
                    attributes: ['uid'],
                    where:{
                        knowid: result.rows[i].dataValues.knowid,
                        r_id: result.rows[i].dataValues.r_id
                    }
                })
                await Knowledge_res_relation.findOne({
                    attributes: ['weight'],
                    where: {
                        knowid: result.rows[i].dataValues.knowid,
                        r_id: result.rows[i].dataValues.r_id
                    },
                    include: [{
                        model: Resource,
                        attributes: ['r_desc', 'r_name'],
                        where: {
                            r_id: Sequelize.col('knowledge_res_relation.r_id')
                        }
                    }, {
                        model: Knowledge,
                        attributes: ['title'],
                        where: {
                            knowid: Sequelize.col('knowledge_res_relation.knowid')
                        }
                    }]
                })
                    .then(async result1 => {
                        if (result1 != null || result1.length != 0) {
                            if(result2 < 5){
                                let item = {
                                    knowid: result.rows[i].dataValues.knowid,
                                    r_id: result.rows[i].dataValues.r_id,
                                    usermarkweight: result.rows[i].dataValues.weight,
                                    relationweight: result1.dataValues.weight,
                                    title: result1.dataValues.knowledge.title,
                                    r_desc: result1.dataValues.resource.r_desc,
                                    r_name: result1.dataValues.resource.r_name,
                                    update_time: result.rows[i].dataValues.update_time
                                }
                                await resultJsonArray1.push(item);
                            }else{
                                let item = {
                                    knowid: result.rows[i].dataValues.knowid,
                                    r_id: result.rows[i].dataValues.r_id,
                                    usermarkweight: result.rows[i].dataValues.weight,
                                    relationweight: result1.dataValues.weight,
                                    title: result1.dataValues.knowledge.title,
                                    r_desc: result1.dataValues.resource.r_desc,
                                    r_name: result1.dataValues.resource.r_name,
                                    update_time: result.rows[i].dataValues.update_time
                                }
                                await resultJsonArray2.push(item);
                            }
                            
                        }
                    })
            }
            res.json({ 
                errorCode: '0',
                msg1pages: Math.ceil(resultJsonArray1.length / limit),
                msg1: arrayCut(resultJsonArray1,limit,page),
                msg2pages:Math.ceil(resultJsonArray2.length / limit), 
                msg2:arrayCut(resultJsonArray2,limit,page )
            })
        }
    })
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

//计算用户置信度的走势
function userCreditRecord(req,res){
    const uid = req.query.uid;
    User_credit_record.findAll({
        attributes:['mark_time','user_credit'],
        where:{
            uid: uid
        }
    })
    .then(result =>{
        if(result == null || result.length == 0){
            res.json({errorCode:'1',msg:'用户相关记录不存在'})
        }else{
            var mark_timeArray = [];
            var user_creditArray = [];
            for(let i = 0; i < result.length ; i++){
                //let item = {
                    mark_timeArray.push(result[i].dataValues.mark_time);
                    user_creditArray.push(result[i].dataValues.user_credit);                
                //}
                
            }
            res.json({errorCode:'0',msg:[mark_timeArray,user_creditArray]})
        }
    })
}

//计算用户标注准确率
User_mark_knowres.belongsTo(User, { foreignKey: 'uid' });
function userMarkAccuracy(req,res){

    const knowid = req.query.knowid;
    const r_id = req.query.r_id;

    User_mark_knowres.findAll({
        attributes:['uid'],
        where:{
            knowid: knowid,
            r_id: r_id
        },include:[{
            model:User,
            attributes: ['username','user_mark_accuracy'],
            where: {
                uid: Sequelize.col('user_mark_knowres.uid')
            }
        }]
    })
    .then(result =>{
        if(result == null || result.length == 0){
            res.json({errorCode:'1',msg:'出错'})
        }else{
            var mark_nameArray = [];
            var user_mark_accuracyArray = [];
            for(let i = 0; i < result.length ; i++){
                //let item = {
                    mark_nameArray.push(result[i].dataValues.user.username);
                    user_mark_accuracyArray.push(result[i].dataValues.user.user_mark_accuracy);                
                //}
                
            }
            res.json({errorCode:'0',msg:[mark_nameArray,user_mark_accuracyArray]})
        }
    })
} 
module.exports = {
    allMarkDetail: allMarkDetail,
    experienceUpdate: experienceUpdate,
    people_mark_weightUpdate: people_mark_weightUpdate,
    allTask: allTask,
    resourcePush: resourcePush,
    user_mark_knowresWeight: user_mark_knowresWeight,
    people_mark_creditUpdate: people_mark_creditUpdate,
    myTask: myTask,
    userCreditRecord:userCreditRecord,
    userMarkAccuracy:userMarkAccuracy,
    myTaskClassify: myTaskClassify
}