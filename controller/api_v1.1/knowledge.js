
var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Promise = require('bluebird').Promise

var data = require('../../database/db');

var knowledge = require('../../model/api_v1.1/knowledge')
var knowledgestorage = require('../../model/api_v1.1/knowledgestorage')
var knowledge_struct_rela_know = require('../../model/api_v1.1/knowledge_struct_rela_know');
var knowledge_res_relation = require('../../model/api_v1.1/knowledge_res_relation');

var Knowledge = knowledge(data.testdb, Sequelize);
var Knowledgestorage = knowledgestorage(data.testdb, Sequelize);
var Knowledge_struct_rela_know = knowledge_struct_rela_know(data.testdb, Sequelize);
var Knowledge_res_relation = knowledge_res_relation(data.testdb, Sequelize);

var time = new Date();

//通过knowid查询知识地图的结构
//查询

async function getKnowledgeRelationStructNextbyKnowid(req, res) {

    //就是需要查询pre_knowid的记录
    const pre_knowid = req.query.pre_knowid;

    result0 = await Knowledge_struct_rela_know.findAll({
        where: { preknowid: pre_knowid }
    })

    if (result0.length != 0) {
        let isLeaf = false;
        var resultJsonArray = [];
        for (let i = 0; i < result0.length; i++) {

            result1 = await Knowledge.findOne({

                attributes: ['title', 'knowid'],
                where: { knowid: result0[i].dataValues.knowid }
            })
            if (result1.length != 0) {

                let item = {

                    knowid: result1.dataValues.knowid,
                    title: result1.dataValues.title,
                    isLeaf: true

                }
                resultJsonArray.push(item);
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
            msg: "no data"
        }
        res.send(rs1);
    }
}




//根据关键字模糊检索知识点 bymyf
function getKnowledgeByKeywords_v1_1(req, res) {
    var keywords = req.query.keywords;
    //var applicability = req.query.applicability;
    var subject = req.query.subject;
    Knowledge.findAll({
        where: {
            subject: subject,
            //applicability:applicability,
            keywords: {
                [Op.like]: '%' + keywords + '%',
            }
        }
    })
        .then(result => {
            if (result.length == 0) {
                res.json({ errorcode: '1', msg: 'no data' });
            } else {
                //声明JSON数组变量
                var resultJsonArray = [];
                for (let i = 0; i < result.length; i++) {
                    let item = {
                        knowid: result[i].dataValues.knowid,
                        title: result[i].dataValues.title,
                        addtime: result[i].dataValues.addtime,
                    };
                    resultJsonArray.push(item);
                }
                let rs0 = {
                    errorCode: 0,
                    msg: resultJsonArray
                }
                res.send(rs0);
            }
        });
}

//通过知识点knowid编辑知识点详情
function editKnowledgeNodeInformations(req, res) {

    const knowid = req.body.knowid;

    const title = req.body.title;
    const description = req.body.description;
    const contribute = req.body.contribute;
    const keywords = req.body.keywords;
    const language = req.body.language;
    const importance = req.body.importance;
    const field = req.body.field;
    const grade = req.body.grade;
    const subject = req.body.subject;

    Knowledge.update({

        title: title,
        description: description,
        contribute: contribute,
        keywords: keywords,
        language: language,
        importance: importance,
        grade: grade,
        field: field,
        subject: subject,
        updatetime: time

    }, {
            where: { knowid: knowid }
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

//通过知识点knowid获取知识点详情
function getKnowledgeNodeInformations(req, res) {

    const knowid = req.query.knowid;

    Knowledge.findOne({

        where: { knowid: knowid }

    })
        .then(result => {
            if (result != 0) {
                let rs0 = {
                    errorCode: 0,
                    msg: result
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
//添加知识点
async function addKnowledgeNode(req, res) {

    const title = req.body.title;
    const pre_knowid = req.body.pre_knowid;
    const description = req.body.description;
    const contribute = req.body.contribute;
    const keywords = req.body.keywords;
    const language = req.body.language;
    const importance = req.body.importance;
    const is_knowledge = req.body.is_knowledge;
    const grade = req.body.grade;
    const field = req.body.field;
    const subject = req.body.subject;


    leastid = await Knowledge.findAll({
        order:
            [
                ['knowid', 'DESC']
            ]
    })
    console.log(leastid[0].dataValues.knowid);

    if (pre_knowid == 0) {
        let knowpathid = leastid[0].dataValues.knowid + 1;
        result0 = await Knowledge.create({
            title: title,
            pre_knowid: pre_knowid,
            description: description,
            contribute: contribute,
            keywords: keywords,
            language: language,
            importance: importance,
            is_knowledge: "是",
            grade: grade,
            field: field,
            subject: subject,
            addtime: time,
            updatetime: time,
            knowpath: knowpathid + ',',
            level: 1,
            res_count: 0
        })
        .then(result => {
            if (result.length != 0) {

                Knowledge.findAll({
                    order:[
                        ['knowid','DESC']
                    ],
                    limit:1
                })
                .then(result=>{
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


    } else {
    
    result1 = await Knowledge.findOne({
        where:{knowid:pre_knowid}
    })
    console.log("knowidpath",result1.dataValues.knowpath);

    Knowledge.create({

        title: title,
        pre_knowid: pre_knowid,
        description: description,
        contribute: contribute,
        keywords: keywords,
        language: language,
        importance: importance,
        is_knowledge: "是",
        grade: grade,
        field: field,
        subject: subject,
        addtime: time,
        updatetime: time,
        knowpath:result1.dataValues.knowpath+leastid[0].dataValues.knowid+',',
        level:result1.dataValues.knowpath.split(',').length,
        res_count:0
    })
        .then(result => {
            if (result.length != 0) {

                Knowledge.findAll({
                    order:[
                        ['knowid','DESC']
                    ],
                    limit:1
                })
                .then(result=>{
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


//通过学段和学科获取知识库第一层层级结构
function getKnowledgeStorageFirstLayer(req, res) {

    const subject = req.query.subject;
    const grade = req.query.grade;

    const pre_knowid = 0;

    Knowledge.findAll({

        where: { subject: subject, grade: grade, pre_knowid: pre_knowid }

    })
        .then(async result => {
            if (result.length != 0) {
                let isLeaf = true;
                var resultJsonArray = [];

                for (let i = 0; i < result.length; i++) {
                    let item = {
                        knowid: result[i].dataValues.knowid,
                        title: result[i].dataValues.title,
                        pre_knowid: result[i].dataValues.pre_knowid,
                        description: result[i].dataValues.description,
                        contribute: result[i].dataValues.contribute,
                        keywords: result[i].dataValues.keywords,
                        language: result[i].dataValues.language,
                        importance: result[i].dataValues.importance,
                        is_knowledge: result[i].dataValues.is_knowledge,
                        field: result[i].dataValues.field,
                        grade: result[i].dataValues.grade,
                        subject: result[i].dataValues.subject,
                        addtime: result[i].dataValues.addtime,
                        updatetime: result[i].dataValues.updatetime,
                        key: "" + i + "",
                        isLeaf: isLeaf,
                        is_knowledge: "是"
                    }
                    resultJsonArray.push(item);
                    try {
                        await Knowledge.findAll({
                            where: { pre_knowid: result[i].dataValues.knowid }
                        }).then(async result1 => {
                            if (result1.length != 0) {
                                resultJsonArray[i].isLeaf = false;
                                console.log(resultJsonArray[i].isLeaf);
                            } else {
                                resultJsonArray[i].isLeaf = true;
                            }
                        });
                    } catch (err) {
                        console.log(err);
                    }
                    await Knowledge.findOne({
                        attributes:[[Sequelize.fn('SUM', Sequelize.col('res_count')),'res_num']],
                        where:{
                            knowpath:{
                                [Op.like]: result[i].dataValues.knowpath/* + '%'*/,
                            }
                        }
                    }).then(async result2 => {
                        if (result2.length != 0) {
                            resultJsonArray[i].title = resultJsonArray[i].title +'('+ result2.dataValues.res_num+')';
                            console.log(resultJsonArray[i].isLeaf);
                        } else {
                            resultJsonArray[i].title = resultJsonArray[i].title + '(0)';
                        }
                    });
                }
                let rs0 = {
                    errorCode: 0,
                    msg: resultJsonArray
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
//通过知识点knowid获取知识点下一层层级结构
function getKnowledgeStorageNextLayer(req, res) {
    var starttime = (new Date()).valueOf();
    const knowid = req.query.knowid;

    Knowledge.findAll({

        where: { pre_knowid: knowid }

    })
        .then(async result => {
            if (result.length != 0) {
                let isLeaf = true;
                var resultJsonArray = [];
                for (let i = 0; i < result.length; i++) {
                    let item = {
                        knowid: result[i].dataValues.knowid,
                        title: result[i].dataValues.title,
                        pre_knowid: result[i].dataValues.pre_knowid,
                        description: result[i].dataValues.description,
                        contribute: result[i].dataValues.contribute,
                        keywords: result[i].dataValues.keywords,
                        language: result[i].dataValues.language,
                        importance: result[i].dataValues.importance,
                        is_knowledge: result[i].dataValues.is_knowledge,
                        field: result[i].dataValues.field,
                        grade: result[i].dataValues.grade,
                        subject: result[i].dataValues.subject,
                        addtime: result[i].dataValues.addtime,
                        updatetime: result[i].dataValues.updatetime,
                        isLeaf: isLeaf,
                        is_knowledge: "是"
                    }
                    resultJsonArray.push(item);
                    try {
                        //let com= await testAsync();
                        await Knowledge.findAll({
                            where: { pre_knowid: result[i].dataValues.knowid }
                        }).then(async result1 => {
                            if (result1.length != 0) {
                                resultJsonArray[i].isLeaf = false;
                                console.log(resultJsonArray[i].isLeaf);
                            } else {
                                resultJsonArray[i].isLeaf = true;
                            }
                        });
                    } catch (err) {
                        console.log(err);
                    }
                    await Knowledge.findOne({
                        attributes:[[Sequelize.fn('SUM', Sequelize.col('knowledge.res_count')),'res_num']],
                        where:{
                            knowpath:{
                                [Op.like]: result[i].dataValues.knowpath/* + '%'*/,
                            }
                        }
                    }).then(async result2 => {
                        if (result2.length != 0) {
                            resultJsonArray[i].title = resultJsonArray[i].title +'('+ result2.dataValues.res_num+')';
                            console.log(resultJsonArray[i].isLeaf);
                        } else {
                            resultJsonArray[i].title = resultJsonArray[i].title + '(0)';
                        }
                    });
                }
                let rs0 = {
                    errorCode: 0,
                    msg: resultJsonArray
                }
                res.send(rs0);
                console.log((new Date()).valueOf()-starttime);
            } else {
                let rs1 = {
                    errorCode: 1,
                    msg: "no data"
                }
                res.send(rs1);
            }
        })
}

Knowledge.hasMany(Knowledge_res_relation, { foreignKey: 'knowid' });
//通过学段、学科知识库获取echart结构
//添加资源数后的接口
async function getKonwldedgeStorageStruct1(req, res){

    var starttime = (new Date()).valueOf();

    const subject = req.query.subject;
    const grade = req.query.grade;

    var data = [];
    var datas = [];
    var links = [];

    result = await Knowledge.findAll({
        attributes:{include:[['res_count','count']/*,[Sequelize.fn('SUM', Sequelize.col('Knowledge.res_count')),'allcount']*/]},
        where: { subject: subject, grade: grade },
        // group:Sequelize.col('Knowledge.knowid'),
        // include:{
        //     model: Knowledge_res_relation,
        //     /*attributes:[[Sequelize.fn('COUNT', Sequelize.col('knowledge_res_relations.knowid')),'count']],*/
        //
        //     /*where: { knowid: Sequelize.col('Knowledge.knowid') }*/
        // }
    });
    console.log((new Date()).valueOf()-starttime);
    // console.log(result[0].dataValues);
    // console.log(result.length);
    var map1 = new Map();
    var allcount = 0;

    if(result.length != 0){
        for (let i = 0; i < result.length; i++) {
            var count = 0;
            /*for(let j = 0; j < result.length; j++ ){
                var patt =new RegExp(result[i].dataValues.knowpath+'[0-9].$')
                if(patt.test(result[j].dataValues.knowpath)){
                    count += result[j].dataValues.count;
                }
            }*/
            count = result[i].dataValues.count;
            /*if(result[i].dataValues.count == 1){
                count = result[i].dataValues.count - 1;
            }else {
                count = result[i].dataValues.count;
            }*/
            var knowobj = {
              knowid:result[i].dataValues.knowid,
              title:result[i].dataValues.title,
              pre_knowid:result[i].dataValues.pre_knowid,
              count:count,
            };
            map1[result[i].dataValues.knowid] = knowobj;
            let dataitem = {
                knowid: result[i].dataValues.knowid,
                name: result[i].dataValues.knowid + result[i].dataValues.title + knowobj.count,
                pre_knowid: result[i].dataValues.pre_knowid,
                is_knowledge: '是',
                category:3,
                level:result[i].dataValues.level,
                value:result[i].dataValues.title + '('+knowobj.count+')',
                reletedResCount:knowobj.count
            }
            let datasitem = {
                pre_knowid: result[i].dataValues.pre_knowid,
                name: result[i].dataValues.knowid + result[i].dataValues.title + knowobj.count,
                knowid: result[i].dataValues.knowid,
                is_knowledge: '是',
                category: 3,
                value:result[i].dataValues.title + '('+knowobj.count+')',
                reletedResCount:knowobj.count
            }
            if(result[i].dataValues.level == 1){
                allcount = allcount + map1[result[i].dataValues.knowid].count;
            }
            data.push(dataitem);
            datas.push(datasitem);
        }
    }else{
        let rs1 = {
            errorCode: 1,
            msg: "no data"
        }
        res.send(rs1);
    }

    var links = [];
    var linksFirstitem = [];
    for (let j = 0; j < datas.length; j++){

        var result1 = map1[datas[j].pre_knowid];
        if (result1 != null){
            //console.log(result1.dataValues.title);

            let linksitem = {
                source: result1.knowid + result1.title + result1.count,
                target: datas[j].name,
            }
            links.push(linksitem);
        //    console.log("linksitem--",linksitem);
        }
        if(datas[j].pre_knowid == 0){
            let item = {
                source: result[0].dataValues.knowid - 1 + subject + allcount,
                target: datas[j].name,
            }
            links.unshift(item);
        }
    }

    //添加学科根节点数据
    let dataFirstitem = {
        knowid: result[0].dataValues.knowid - 1,
        name: result[0].dataValues.knowid - 1 + result[0].dataValues.subject + allcount,
        category: 1,
        level:0,
        value:result[0].dataValues.subject + '('+allcount+')',
        reletedResCount:allcount
    }
    data.unshift(dataFirstitem);
    resultJson = {
        "data": data,
        "links": links
    }

    let rs0 = {
        errorCode: 0,
        msg: resultJson
    }
    res.send(rs0);
    var endtime = (new Date()).valueOf();
    console.log(endtime-starttime);
    /*//先拿到基本data中的内容
    if (result.length != 0) {
        for (let i = 0; i < result.length; i++) {

            resultData0 = await Knowledge_res_relation.findAndCountAll({
                where:{knowid:result[i].dataValues.knowid}
            })
            console.log('resultData0',resultData0.count);

            let dataitem = {
                knowid: result[i].dataValues.knowid,
                name: result[i].dataValues.knowid + result[i].dataValues.title+resultData0.count,
                pre_knowid: result[i].dataValues.pre_knowid,
                is_knowledge: '是',
                category: 2
            }       
                       
            let datasitem = {
                pre_knowid: result[i].dataValues.pre_knowid,
                name: result[i].dataValues.knowid + result[i].dataValues.title+resultData0.count,
                knowid: result[i].dataValues.knowid,
                is_knowledge: '是',
                category: 2
            }        
            
            data.push(dataitem);
            datas.push(datasitem);
        }

    }else{
        let rs1 = {
            errorCode: 1,
            msg: "no data"
        }
        res.send(rs1);
    }


     //利用方法异步处理拿取links中的关系
     console.log("进入links");

     var links = [];

     for (let j = 1; j < datas.length; j++){

        //通过第一遍查询结果带过来的pre_knowid查询其详细的title详细和knowid来构建source和target之间的关系
        result1 = await Knowledge.findOne({

            attributes: ['title', 'knowid'],
            where: { knowid: datas[j].pre_knowid }

        })


        if (result1 != null){
            //console.log(result1.dataValues.title);

            resultData1 = await Knowledge_res_relation.findAndCountAll({
                where:{knowid:result1.dataValues.knowid}
            })
            console.log('resultData1',resultData1.count);

            let linksitem = {
                source: result1.dataValues.knowid + result1.dataValues.title+resultData1.count,
                target: datas[j].name
            }
            links.push(linksitem);
            console.log("linksitem--",linksitem);
        }
    }

    //独立添加根节点的与与第一层级的关联关系
    result2 = await Knowledge.findAll({

        where: { pre_knowid: 0, subject: subject, grade: grade }

    })

    if (result2.length != 0) {

        resultData2 = await Knowledge_res_relation.findAndCountAll({
            where:{knowid:result2[0].dataValues.knowid - 1}
        })
        console.log('resultData2',resultData2.count);

        
       
        for (let i = 0; i < result2.length; i++) {

            resultData3 = await Knowledge_res_relation.findAndCountAll({
                where:{knowid:result2[i].dataValues.knowid}
            })
            console.log('resultData3',resultData3.count);

            let item = {
                source: result2[0].dataValues.knowid - 1 + result2[i].dataValues.subject+resultData2.count,
                target: result2[i].dataValues.knowid + result2[i].dataValues.title+resultData3.count,
            }
            links.unshift(item);
        }
    }

    console.log("出links");


    resultData4 = await Knowledge_res_relation.findAndCountAll({
        where:{knowid:result[0].dataValues.knowid - 1}
    })
    console.log('resultData3',resultData4.count);
    //添加学科根节点数据
    let dataFirstitem = {
        knowid: result[0].dataValues.knowid - 1,
        name: result[0].dataValues.knowid - 1 + result[0].dataValues.subject+resultData4.count,
        category: 1
    }
    data.unshift(dataFirstitem);


    resultJson = {
        "data": data,
        "links": links
    }

    let rs0 = {
        errorCode: 0,
        msg: resultJson
    }
    res.send(rs0);*/
}



//查询一层级与根节点的关联关系
async function getFirstRelation(subject, grade) {

    var links1 = [];

    result2 = await Knowledge.findAll({

        where: { pre_knowid: 0, subject: subject, grade: grade }

    })

    if (result2.length != 0) {

        for (let i = 0; i < result2.length; i++) {

            let item = {
                source: result2[i].dataValues.knowid - 1 + result2[i].dataValues.subject,
                target: result2[i].dataValues.knowid + result2[i].dataValues.title,
            }
            links.unshift(item);
        }
    }
    return links;
}





//将arr2中的数据元素添加到arr1中
async function mergeArray(arr1, arr2) {

    await arr2.forEach(element => {

        arr1.push(element);

    });
    readList(arr1);
}


//通过关键字搜索关联知识点第一层级关系
/*
--knowledge
1.模糊检索关键字like,得到一层节结构的structid数组,返回结果pre_knowid对应为0
*/
async function queryFirstLayerRelation(req, res) {

    const keywords = req.query.keywords;
    const subject = req.query.subject;

    //模糊查询第一层级的结果
    result = await Knowledge.findAll({
        where: {
            //因出现结果和需要返回的结果不同
            subject:subject,
            [Op.or]: [
                {
                    title: {
                        [Op.like]: '%' + keywords + '%'
                    }
                },
                {
                    description: {
                        [Op.like]: '%' + keywords + '%'
                    }
                },
                {
                    keywords: {
                        [Op.like]: '%' + keywords + '%'
                    }
                }
            ]
        }
    })

    //封装有结果的数据
    if (result.length != 0) {
        //声明JSON数组变量
        var resultJsonArray = [];
        let isLeaf = false;
        for (let i = 0; i < result.length; i++) {
            let item = {
                knowid: result[i].dataValues.knowid,
                pre_knowid: 0,
                title: result[i].dataValues.title,
                isLeaf: await isLeafMethod(result[i].dataValues.knowid),
                checked: true,
            };
            resultJsonArray.push(item);
            //console.log(isLeafMethod(result[i].dataValues.knowid));
        }
        let rs0 = {
            errorCode: 0,
            msg: resultJsonArray
        }
        res.send(rs0);
    } else {
        let rs1 = {
            errorCode: 1,
            msg: "no data"
        }
        res.send(rs1);
    }
}

//通过knowid判断是否是叶子节点
async function isLeafMethod(knowid) {

    console.log("进入isLeafMethod");
    result = await Knowledge.findAll({
        where: { pre_knowid: knowid }
    })
    if (result.length != 0) {
        console.log("返回false");
        return false;

    } else {
        console.log("返回true");
        return true;

    }
}


//通过knowid判断是否是叶子节点
function isLeafMethod1(knowid) {

    console.log("进入isLeafMethod");
    Knowledge.findAll({
        where: { pre_knowid: knowid }
    })
        .then(result => {

            if (result.length != 0) {
                console.log("返回false");
                return false;

            } else {
                console.log("返回true");
                return true;

            }
        })

}

//通过知识点knowid搜索关联知识点第二层级关系
async function querySecondLayerRelation(req, res) {

    const knowid = req.query.knowid

    result = await Knowledge.findAll({

        where: { pre_knowid: knowid }

    })
    var resultJsonArray = [];
    console.log("result.length");
    console.log(result.length);
    if (result.length != 0) {

        for (let i = 0; i < result.length; i++) {

            let item = {
                knowid: result[i].dataValues.knowid,
                pre_knowid: knowid,
                title: result[i].dataValues.title,
                isLeaf: true,
                // isLeaf: await isLeafMethod1(result[i].dataValues.knowid),
                checked: true,
            }
            resultJsonArray.push(item);
            console.log(item)
        }

        let rs0 = {
            errorCode: 0,
            msg: resultJsonArray
        }
        res.send(rs0);

    } else {

        let rs1 = {
            errorCode: 1,
            msg: "no data"
        }
        res.send(rs1);
    }

}
//通过知识点knowid删除知识点
async function deleteknowid(req, res) {

    const knowid = req.query.knowid;
    const pre_knowid = req.query.pre_knowid;
    //1.先删除关系
    result0 = await Knowledge_res_relation.findAll({
        where:{knowid:knowid}
    })

    if(result0.length!=0){
        Knowledge_res_relation.destroy({
            where:{knowid:knowid}
        })
    }
    //2.查出具体知识点
    result = await Knowledge.findAll({
        where: { pre_knowid: knowid }
    })

    if (result.length != 0) {

        result1 = await Knowledge.update({

            pre_knowid: pre_knowid

        }, {
                where: {
                    pre_knowid: knowid
                }
            })

        if (result1 != 0) {

            Knowledge.destroy({

                where: { knowid: knowid }
            })
                .then(result2 => {
                    if (result2 != 0) {
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
    } else {
        Knowledge.destroy({

            where: { knowid: knowid }
        })
            .then(result2 => {
                if (result2 != 0) {
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
}


module.exports = {
    getKnowledgeRelationStructNextbyKnowid: getKnowledgeRelationStructNextbyKnowid,
    getKnowledgeByKeywords_v1_1: getKnowledgeByKeywords_v1_1,
    getKnowledgeRelationStructNextbyKnowid: getKnowledgeRelationStructNextbyKnowid,
    editKnowledgeNodeInformations: editKnowledgeNodeInformations,
    getKnowledgeNodeInformations: getKnowledgeNodeInformations,
    addKnowledgeNode: addKnowledgeNode,
    getKnowledgeStorageFirstLayer: getKnowledgeStorageFirstLayer,
    getKnowledgeStorageNextLayer: getKnowledgeStorageNextLayer,
    getKonwldedgeStorageStruct1: getKonwldedgeStorageStruct1,
    queryFirstLayerRelation: queryFirstLayerRelation,
    querySecondLayerRelation: querySecondLayerRelation,
    deleteknowid: deleteknowid
}