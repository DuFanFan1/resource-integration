const Sequelize = require('sequelize');
var nodejieba = require('nodejieba');
//var fs = require('fs')
const Op = Sequelize.Op;
var logger = require('../../logconf');
var data = require('../../database/db');
var resource = require('../../model/api_v1.1/resource');
var knowledge = require('../../model/api_v1.1/knowledge');
var knowledge_res_relation = require('../../model/api_v1.1/knowledge_res_relation');
var user_class = require('../../model/api_v1.1/user_class');
var resource2 = require('../../model/api_v1.1/resource2');

const Resource = resource(data.testdb, Sequelize);
const Knowledge = knowledge(data.testdb, Sequelize);
const Knowledge_res_relation = knowledge_res_relation(data.testdb, Sequelize);
const User_class = user_class(data.testdb, Sequelize);
const Resource2 = resource2(data.testdb, Sequelize)

async function ResourceAndKnowledgeNodes(req, res) {

    const field = req.query.field;
    const subject = req.query.subject;
    const grade = req.query.grade;
    //在knowledge表中是keywords，在resource表中是r_key
    const keywordStr = req.query.keyword;
    //在knowledge表中是title，在resource表中是r_name
    const nameStr = req.query.name;
    //在knowledge表中是descritption，在resource表中是r_desc
    const descriptionStr = req.query.description;
    //知识点一页的个数count和总页数page
    const knowledgecount = req.query.knowledgecount;
    const knowledgepage = req.query.knowledgepage;
    //资源一页的个数count和总页数page
    const resourcecount = req.query.resourcecount;
    const resourcepage = req.query.resourcepage;

    const uid = req.query.uid;

    
    
    //const limit = req.query.count;
    //const page = req.query.page;
 
    var resultKnowledgeArray = [];
    var resultResourceArray = [];

    var resultResourceOrder = []
    console.log('================='+keywordStr)

    if (keywordStr == '' && nameStr == '' ) {
        console.log("关键词，名称，描述为空")
        resultNull = await Knowledge.findAndCountAll({
            where: {
                field: field,
                subject: subject,
                grade: grade,
                res_count:{[Op.ne]:0}          
            },
        })

        for (let i = 0; i < resultNull.rows.length; i++) {

            isLeafResult = await Knowledge.findAll({
                where: { pre_knowid: resultNull.rows[i].dataValues.knowid }
            })
            if (isLeafResult.length != 0) {
                console.log("返回false");
                isLeaf = false;

            } else {
                console.log("返回true");
                isLeaf = true;

            }
       
            let item = {
                knowid: resultNull.rows[i].dataValues.knowid,
                title: resultNull.rows[i].dataValues.title + '(' +resultNull.rows[i].dataValues.res_count +')',
                res_count: resultNull.rows[i].dataValues.res_count,
                isLeaf: isLeaf
            }
            await resultKnowledgeArray.push(item);
        }

        result1Null = await Resource.findAndCountAll({

            where: {
                field: field,
                subject: subject,
                grade: grade
            },
        })
        result2Null = await Resource2.findAndCountAll({

            where: {
                field: field,
                subject: subject,
                grade: grade
            },
        })


        for (let j = 0; j < result1Null.rows.length; j++) {

            let item = {
                r_id: result1Null.rows[j].dataValues.r_id,
                r_name: result1Null.rows[j].dataValues.r_name,
                r_from: '华师大'
            };
            await resultResourceArray.push(item);
        }
        for (let k = 0; k < result2Null.rows.length; k++) {

            let item = {
                r_id: 'zyk' + result2Null.rows[k].dataValues.r_id,
                r_name: result2Null.rows[k].dataValues.r_name,
                r_from: '人教社'
            };
            await resultResourceArray.push(item);
        }
        userInfo = await User_class.findOne({
            where:{
                uid: uid
            }
        })
        console.log('...............'+ userInfo.dataValues.ability)
        if(userInfo != null || userInfo.length != 0){
            if(userInfo.dataValues.ability != null && userInfo.dataValues.sense != null){
                if(userInfo.dataValues.ability == 0){
                    if(userInfo.dataValues.sense == 0){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'简单','试题')
                    }
                    else if(userInfo.dataValues.sense == 1){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'简单','试卷')
                    }
                }
                else if(userInfo.dataValues.ability == 1){
                    if(userInfo.dataValues.sense == 0){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'中等','试题')
                    }
                    else if(userInfo.dataValues.sense == 1){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'中等','试卷')
                    }
                }
                else if(userInfo.dataValues.ability == 2){
                    if(userInfo.dataValues.sense == 0){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'困难','试题')
                    }
                    else if(userInfo.dataValues.sense == 1){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'困难','试卷')
                    }
                }
            }
            /* if(userInfo.dataValues.sense != null){
                if(userInfo.dataValues.sense == 0){
                    resultResourceOrder = arrayOrderBy(resultResourceArray,'rtype','试题')
                }
                else if(userInfo.dataValues.sense == 1){
                    resultResourceOrder = arrayOrderBy(resultResourceArray,'rtype','试卷')
                }
            } */
        }

    }else if (keywordStr == '' && nameStr != '' ) {
        console.log("关键词为空,name 不为空")
        resultNull = await Knowledge.findAndCountAll({
            where: {
                field: field,
                subject: subject,
                grade: grade,
                res_count:{[Op.ne]:0}          
            },
        })

        for (let i = 0; i < resultNull.rows.length; i++) {

            isLeafResult = await Knowledge.findAll({
                where: { pre_knowid: resultNull.rows[i].dataValues.knowid }
            })
            if (isLeafResult.length != 0) {
                console.log("返回false");
                isLeaf = false;

            } else {
                console.log("返回true");
                isLeaf = true;

            }
       
            let item = {
                knowid: resultNull.rows[i].dataValues.knowid,
                title: resultNull.rows[i].dataValues.title + '('+resultNull.rows[i].dataValues.res_count+')',
                res_count: resultNull.rows[i].dataValues.res_count,
                isLeaf: isLeaf
            }
            await resultKnowledgeArray.push(item);
        }
        var nameCutArray = nodejieba.cut(nameStr);
        var nameCutLength = nameCutArray.length;
        for(let k = 0 ;k < nameCutLength; k++){
            result1Null = await Resource.findAndCountAll({

                where: {
                    field: field,
                    subject: subject,
                    grade: grade,
                    r_name: {
                        [Op.like]: '%' + nameCutArray[k] + '%'
                    }
                },
            })
            for (let j = 0; j < result1Null.rows.length; j++) {

                let item = {
                    r_id: result1Null.rows[j].dataValues.r_id,
                    r_name: result1Null.rows[j].dataValues.r_name,
                    r_from: '华师大'
                };
                await resultResourceArray.push(item);
            }
            result2Null = await Resource2.findAndCountAll({

                where: {
                    field: field,
                    subject: subject,
                    grade: grade,
                    r_name: {
                        [Op.like]: '%' + nameCutArray[k] + '%'
                    }
                },
            })
            for (let l = 0; l < result2Null.rows.length; l++) {

                let item = {
                    r_id: 'zyk' + result1Null.rows[l].dataValues.r_id,
                    r_name: result1Null.rows[l].dataValues.r_name,
                    r_from: '人教社'
                };
                await resultResourceArray.push(item);
            }
        }
       
        userInfo = await User_class.findOne({
            where:{
                uid: uid
            }
        })
        console.log('...............'+ userInfo.dataValues.ability)
        if(userInfo != null || userInfo.length != 0){
            if(userInfo.dataValues.ability != null && userInfo.dataValues.sense != null){
                if(userInfo.dataValues.ability == 0){
                    if(userInfo.dataValues.sense == 0){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'简单','试题')
                    }
                    else if(userInfo.dataValues.sense == 1){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'简单','试卷')
                    }
                }
                else if(userInfo.dataValues.ability == 1){
                    if(userInfo.dataValues.sense == 0){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'中等','试题')
                    }
                    else if(userInfo.dataValues.sense == 1){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'中等','试卷')
                    }
                }
                else if(userInfo.dataValues.ability == 2){
                    if(userInfo.dataValues.sense == 0){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'困难','试题')
                    }
                    else if(userInfo.dataValues.sense == 1){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'困难','试卷')
                    }
                }
            }
            /* if(userInfo.dataValues.sense != null){
                if(userInfo.dataValues.sense == 0){
                    resultResourceOrder = arrayOrderBy(resultResourceArray,'rtype','试题')
                }
                else if(userInfo.dataValues.sense == 1){
                    resultResourceOrder = arrayOrderBy(resultResourceArray,'rtype','试卷')
                }
            } */
        }

    } else if (keywordStr != '' && nameStr == '' ) {
        console.log("关键词不为空，名称为空")
        var keywordCutArray = nodejieba.cut(keywordStr);
        var keywordCutLength = keywordCutArray.length;
        for(let k = 0;k < keywordCutLength ;k++){
            resultNull = await Knowledge.findAndCountAll({
                where: {
                    field: field,
                    subject: subject,
                    grade: grade,
                    res_count:{[Op.ne]:0},
                    keywords: {
                        [Op.like]: '%' + keywordCutArray[k] + '%'
                    }
                },
            })
            for (let i = 0; i < resultNull.rows.length; i++) {

                isLeafResult = await Knowledge.findAll({
                    where: { pre_knowid: resultNull.rows[i].dataValues.knowid }
                })
                if (isLeafResult.length != 0) {
                    console.log("返回false");
                    isLeaf = false;
    
                } else {
                    console.log("返回true");
                    isLeaf = true;
    
                }
           
                let item = {
                    knowid: resultNull.rows[i].dataValues.knowid,
                    title: resultNull.rows[i].dataValues.title + '('+resultNull.rows[i].dataValues.res_count+')',
                    res_count: resultNull.rows[i].dataValues.res_count,
                    isLeaf: isLeaf
                }
                await resultKnowledgeArray.push(item);
            }
    
        }
        

        
        result1Null = await Resource.findAndCountAll({

            where: {
                field: field,
                subject: subject,
                grade: grade
            },
        })


        for (let j = 0; j < result1Null.rows.length; j++) {

            let item = {
                r_id: result1Null.rows[j].dataValues.r_id,
                r_name: result1Null.rows[j].dataValues.r_name,
                r_from: '华师大'
            };
            await resultResourceArray.push(item);
        }
        result2Null = await Resource2.findAndCountAll({

            where: {
                field: field,
                subject: subject,
                grade: grade
            },
        })


        for (let k = 0; k < result2Null.rows.length; k++) {

            let item = {
                r_id: 'zyk' + result2Null.rows[k].dataValues.r_id,
                r_name: result2Null.rows[k].dataValues.r_name,
                r_from: '人教社'
            };
            await resultResourceArray.push(item);
        }
        userInfo = await User_class.findOne({
            where:{
                uid: uid
            }
        })
        console.log('...............'+ userInfo.dataValues.ability)
        if(userInfo != null || userInfo.length != 0){
            if(userInfo.dataValues.ability != null && userInfo.dataValues.sense != null){
                if(userInfo.dataValues.ability == 0){
                    if(userInfo.dataValues.sense == 0){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'简单','试题')
                    }
                    else if(userInfo.dataValues.sense == 1){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'简单','试卷')
                    }
                }
                else if(userInfo.dataValues.ability == 1){
                    if(userInfo.dataValues.sense == 0){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'中等','试题')
                    }
                    else if(userInfo.dataValues.sense == 1){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'中等','试卷')
                    }
                }
                else if(userInfo.dataValues.ability == 2){
                    if(userInfo.dataValues.sense == 0){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'困难','试题')
                    }
                    else if(userInfo.dataValues.sense == 1){
                        resultResourceOrder = arrayOrderBy(resultResourceArray,'困难','试卷')
                    }
                }
            }
            /* if(userInfo.dataValues.sense != null){
                if(userInfo.dataValues.sense == 0){
                    resultResourceOrder = arrayOrderBy(resultResourceArray,'rtype','试题')
                }
                else if(userInfo.dataValues.sense == 1){
                    resultResourceOrder = arrayOrderBy(resultResourceArray,'rtype','试卷')
                }
            } */
        }

    }
    else {
        var keywordArray = keywordStr.split(",");
        var nameArray = nameStr.split(",");
        //var descriptionArray = descriptionStr.split(",");
        var keywordLength = keywordArray.length;
        var nameLength = nameArray.length;
       // var descriptionLength = descriptionArray.length; 
    console.log("keywordArray.length", keywordArray.length)
    console.log("keywordArray", keywordArray)
        
        //限制循环次数，因为前端会默认传递null值给我
        for (let i = 0; i < keywordLength; i++) {
            var keywordCutArray = nodejieba.cut(keywordArray[i]);
            var keywordCutLength = keywordCutArray.length;

            var nameCutArray = nodejieba.cut(nameArray[i]);
            var nameCutLength = nameCutArray.length;
            if(keywordCutLength != 0){
                for(let j = 0; j < keywordCutLength; j++ ){
                    result = await Knowledge.findAndCountAll({
    
                        where: {
                            field: field,
                            subject: subject,
                            grade: grade,
                            res_count:{[Op.ne]:0},
                                    keywords: {
                                        [Op.like]: '%' + keywordCutArray[j] + '%'
                                    }
                        },
                    })
                    if(result.count != 0){
                        for (let k = 0; k < result.rows.length; k++) {
    
                            isLeafResult = await Knowledge.findAll({
                                where: { pre_knowid: result.rows[k].dataValues.knowid }
                            })
                            if (isLeafResult.length != 0) {
                                console.log("返回false");
                                isLeaf = false;
            
                            } else {
                                console.log("返回true");
                                isLeaf = true;
            
                            }
                            var knowid = result.rows[k].dataValues.knowid;
                            let item = {
                                knowid: knowid,
                                title: result.rows[k].dataValues.title + '('+result.rows[k].dataValues.res_count+')',
                                isLeaf: isLeaf
                            };
                            var tag = 0;
                            for(let l = 0 ; l < resultKnowledgeArray.length ;l++){
                                if(item.knowid == resultKnowledgeArray[l]['knowid']){
                                    tag =1
                                }
                            }
                            if(tag == 0){
                                await resultKnowledgeArray.push(item);
                            }
                        }
                    }
                }
            }
            
            //console.log(resultKnowledgeArray)
                
            if(nameCutLength != 0 ){
                for(let j = 0; j < nameCutLength; j++ ){
                    result1 = await Resource.findAndCountAll({
    
                        where: {
                            field: field,
                            subject: subject,
                            grade: grade,
                            r_name: {
                                [Op.like]: '%' + nameCutArray[j] + '%'
                            }
                        },
                    })
                    if(result1.count != 0){
                        for (let k = 0; k < result1.rows.length; k++) {
                            let item = {
                                r_id: result1.rows[k].dataValues.r_id,
                                r_name: result1.rows[k].dataValues.r_name,
                                rtype: result1.rows[k].dataValues.rtype,
                                difficulty: result1.rows[k].dataValues.difficulty,
                                r_from: '华师大'
                            };
                            var tag = 0;
                            for(let l = 0 ; l < resultResourceArray.length ;l++){
                                if(item.r_id == resultResourceArray[l]['r_id']){
                                    tag =1
                                }
                            }
                            if(tag == 0){
                                await resultResourceArray.push(item);
                            }
                        }
                    }
                    result2 = await Resource2.findAndCountAll({
    
                        where: {
                            field: field,
                            subject: subject,
                            grade: grade,
                            r_name: {
                                [Op.like]: '%' + nameCutArray[j] + '%'
                            }
                        },
                    })
                    if(result2.count != 0){
                        for (let k2 = 0; k2 < result2.rows.length; k2++) {
                            let item = {
                                r_id: 'zyk' + result2.rows[k2].dataValues.r_id,
                                r_name: result2.rows[k2].dataValues.r_name,
                                rtype: result2.rows[k2].dataValues.rtype,
                                difficulty: result2.rows[k2].dataValues.difficulty,
                                r_from: '人教社'
                            };
                            var tag = 0;
                            for(let l2 = 0 ; l2 < resultResourceArray.length ;l2++){
                                if(item.r_id == resultResourceArray[l2]['r_id']){
                                    tag =1
                                }
                            }
                            if(tag == 0){
                                await resultResourceArray.push(item);
                            }
                        }
                    }
                }
                // console.log('======================='+resultResourceArray.length)
                // fs.writeFile('./public/test1.json', JSON.stringify(resultResourceArray) , {flag: 'w+', encoding: 'utf8'}, function (err) {
                //     if(err) {
                //      console.error(err);
                //      } else {
                //         console.log('写入成功');
                //      }
                //  });
                userInfo = await User_class.findOne({
                    where:{
                        uid: uid
                    }
                })
                console.log('...............'+ userInfo.dataValues.ability)
                if(userInfo != null || userInfo.length != 0){
                    if(userInfo.dataValues.ability != null && userInfo.dataValues.sense != null){
                        if(userInfo.dataValues.ability == 0){
                            if(userInfo.dataValues.sense == 0){
                                resultResourceOrder = arrayOrderBy(resultResourceArray,'简单','试题')
                            }
                            else if(userInfo.dataValues.sense == 1){
                                resultResourceOrder = arrayOrderBy(resultResourceArray,'简单','试卷')
                            }
                        }
                        else if(userInfo.dataValues.ability == 1){
                            if(userInfo.dataValues.sense == 0){
                                resultResourceOrder = arrayOrderBy(resultResourceArray,'中等','试题')
                            }
                            else if(userInfo.dataValues.sense == 1){
                                resultResourceOrder = arrayOrderBy(resultResourceArray,'中等','试卷')
                            }
                        }
                        else if(userInfo.dataValues.ability == 2){
                            if(userInfo.dataValues.sense == 0){
                                resultResourceOrder = arrayOrderBy(resultResourceArray,'困难','试题')
                            }
                            else if(userInfo.dataValues.sense == 1){
                                resultResourceOrder = arrayOrderBy(resultResourceArray,'困难','试卷')
                            }
                        }
                    }
                    /* if(userInfo.dataValues.sense != null){
                        if(userInfo.dataValues.sense == 0){
                            resultResourceOrder = arrayOrderBy(resultResourceArray,'rtype','试题')
                        }
                        else if(userInfo.dataValues.sense == 1){
                            resultResourceOrder = arrayOrderBy(resultResourceArray,'rtype','试卷')
                        }
                    } */
                }
            }
        
        }
    }
    
    var knowledgeLen = resultKnowledgeArray.length;
    var resourceLen = resultResourceArray.length;
    console.log('----------------'+resourceLen)
    var knowledgeAllpages = Math.ceil(knowledgeLen / knowledgecount);
    var resourceAllpages = Math.ceil(resourceLen / resourcecount);
    if (knowledgeLen == 0 || resourceLen == 0){
        res.json({ errorCode: '1', msg: 'knowledge or resource no data' });
    }else{
        res.json({errorCode: '0',knowledgeAllpages: knowledgeAllpages, knowledge:arrayCut(resultKnowledgeArray,knowledgecount,knowledgepage),resourceAllpages: resourceAllpages, resource:arrayCut(resultResourceOrder,resourcecount,resourcepage)})
    }  
    
    
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
/* function arrayOrderBy(array,key,value){
    var len = array.length;
    var result = [];
    for(let i = 0 ; i < len ;i++){
        if(array[i][key] == value){
            result.unshift(array[i])
        }
        else{
            result.push(array[i])
        }
    }
    return result;
} */
function arrayOrderBy(array,difficulty,rtype){
    var len = array.length;
    var result = [];
    var result1 = [];
    if(len != 0){
        for(let i = 0 ; i < len ;i++){
            if(array[i]['difficulty'] == difficulty || array[i]['rtype'] == rtype){
                result.unshift(array[i])
            }
            else{
                result.push(array[i])
            }
        }
        var len1 = result.length
    console.log(len1)
    if (len1 !=0 ){
        for(let j = 0 ; j<len1 ;j++){
            if(result[j]['difficulty'] == difficulty && result[j]['rtype'] == rtype){
                result1.unshift(result[j])
                //delete result[j]
            }else{
                result1.push(result[j])
            }
        }
    }
    }
    

    return result1;
}
async function AllResources(req,res){
    const limit = req.query.count;
    const page = req.query.page;
    result = await Resource.findAndCountAll({
        attributes: ['r_id','r_name'],

        limit: limit * 1,
        offset: (page - 1) * limit
    })
    var resultJsonArray = []
    if(result){
        for(let i = 0 ; i < result.rows.length; i++){
            let item = {
                r_id: result.rows[i].dataValues.r_id,
                r_name: result.rows[i].dataValues.r_name
            }
            await resultJsonArray.push(item)
        }
        res.json({ errorCode: '0', allpages: Math.ceil(result.count / limit), msg: resultJsonArray })
    }else{
        res.json({ errorCode: '1', msg: 'error'});
    }
}
module.exports = {
    ResourceAndKnowledgeNodes: ResourceAndKnowledgeNodes,
    AllResources: AllResources
}