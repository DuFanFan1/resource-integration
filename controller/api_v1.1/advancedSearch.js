const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var logger = require('../../logconf');
var data = require('../../database/db');
var resource = require('../../model/api_v1.1/resource');
var knowledge = require('../../model/api_v1.1/knowledge');
var knowledge_res_relation = require('../../model/api_v1.1/knowledge_res_relation');

const Resource = resource(data.testdb, Sequelize);
const Knowledge = knowledge(data.testdb, Sequelize);
const Knowledge_res_relation = knowledge_res_relation(data.testdb, Sequelize);


//通过知识点id获取资源
/* 主要操作 
1.拆分数组内容，获取knowid；
2.通过knowid查询knowledge_res_relation表中是否有记录，有获取其中的r_id；
3.通过上一步获取的r_id查询resource表中的详细详细进行返回，并做计数处理进行分页。
*/
Knowledge_res_relation.belongsTo(Resource, { foreignKey: 'r_id' });
async function getQueryResourceDetails(req, res) {

    const knowidString = req.query.knowidString;
    const limit = req.query.count;
    const page = req.query.page;

    var knowidArray = knowidString.split(",");
    var resultJsonArray = [];


    for (let i = 0; i < knowidArray.length; i++) {

        result = await Knowledge_res_relation.findAndCountAll({

            where: { knowid: knowidArray[i] },

            include: [{
                model: Resource,
                where: { r_id: Sequelize.col('knowledge_res_relation.r_id') }
            }],
            limit: limit * 1,
            offset: (page - 1) * limit


        })
        if (result.count == 0) {
            res.json({ errorCode: '1', msg: 'no data' });
        } else {
            for (let i = 0; i < result.rows.length; i++) {
                let item = {

                    r_id: result.rows[i].dataValues.resource.r_id,
                    r_name: result.rows[i].dataValues.resource.r_name,
                    r_from: '华师大'

                };
                resultJsonArray.push(item);
            }
        }

    }
    let rs0 = {
        errorCode: 0,
        allpages: Math.ceil(result.count / limit),
        msg: resultJsonArray
    }
    res.send(rs0);
    //res.send(resultJsonArray);

}

//通过选中字段检索资源与知识点
async function queryResourceAndKnowledgeNodes(req, res) {

    const field = req.query.field;
    const subject = req.query.subject;
    const grade = req.query.grade;

    //在knowledge表中是keywords，在resource表中是r_key
    const r_keyKeywordStr = req.query.r_keyKeyword;
    //在knowledge表中是title，在resource表中是r_name
    const nameTitleStr = req.query.nameTitle;
    //在knowledge表中是descritption，在resource表中是r_desc
    const descriptionStr = req.query.description;

    var r_keyKeywordArray = r_keyKeywordStr.split(",");
    var nameTitleArray = nameTitleStr.split(",");
    var descriptionArray = descriptionStr.split(",");

    /* minLength = await minLength(r_keyKeywordArray.length,nameTitleArray.length,descriptionArray.length);
    console.log(minLength); */
    const limit = req.query.count;
    const page = req.query.page;
    var isLeaf = false;
    var returnFlag1 = false;
    var returnFlag2 = true;
    //声明JSON数组变量
    var resultJsonArray = [];
    var resultJsonArray1 = [];

    console.log("descriptionArray.length", descriptionArray.length)
    console.log("descriptionArray", descriptionArray)

    if (descriptionArray == '' && r_keyKeywordArray == '' && nameTitleArray == '') {
        console.log("111111")
        resultNull = await Knowledge.findAndCountAll({
            where: {
                field: field,
                subject: subject,
                grade: grade,
                res_count:{[Op.ne]:0}          
            },
            limit: limit * 1,
            offset: (page - 1) * limit
        })
        console.log("resultNull.count", resultNull.count)
        if (resultNull.count == 0) {
            returnFlag1 = true;
        }

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
                title: resultNull.rows[i].dataValues.title,
                res_count: resultNull.rows[i].dataValues.res_count,
                isLeaf: isLeaf
            }
            resultJsonArray.push(item);
        }
      

        var rs01 = {
            allpages: Math.ceil(resultNull.count / limit),
            knowledge: resultJsonArray
        }

        result1Null = await Resource.findAndCountAll({

            where: {
                field: field,
                subject: subject,
                grade: grade
            },
            limit: limit * 1,
            offset: (page - 1) * limit
        })

        if (result1Null.count == 0) {
            returnFlag2 = true
        }
        console.log("rsLast--");
        console.log(result1Null.rows.length);
        logger.log('info', 'result1.rows.length', result1Null.rows.length);

        for (let j = 0; j < result1Null.rows.length; j++) {

            let item = {
                r_id: result1Null.rows[j].dataValues.r_id,
                r_name: result1Null.rows[j].dataValues.r_name,
            };
            resultJsonArray1.push(item);
        }
        var rs11 = {
            allpages: Math.ceil(result1Null.count / limit),
            resource: resultJsonArray1
        }
        console.log("result1Null.rows.length",result1Null.rows.length)
        console.log("resultJsonArray1.length",resultJsonArray1.length)
        console.log("rs11",rs11)

    } else {


        //限制循环次数，因为前端会默认传递null值给我
        for (let n = 0; n < r_keyKeywordArray.length; n++) {

            //查询Knowledge
            result = await Knowledge.findAndCountAll({

                where: {
                    field: field,
                    subject: subject,
                    grade: grade,
                    res_count:{[Op.ne]:0},
                    [Op.or]: [
                        {
                            title: {
                                [Op.like]: '%' + nameTitleArray[n] + '%'
                            }
                        },
                        {
                            description: {
                                [Op.like]: '%' + descriptionArray[n] + '%'
                            }
                        },
                        {
                            keywords: {
                                [Op.like]: '%' + r_keyKeywordArray[n] + '%'
                            }
                        }
                    ]

                },
                limit: limit * 1,
                offset: (page - 1) * limit
            })

            console.log("result.count", result.count)
            if (result.count == 0) {
                returnFlag1 = true;
            }

            for (let i = 0; i < result.rows.length; i++) {

                isLeafResult = await Knowledge.findAll({
                    where: { pre_knowid: result.rows[i].dataValues.knowid }
                })
                if (isLeafResult.length != 0) {
                    console.log("返回false");
                    isLeaf = false;

                } else {
                    console.log("返回true");
                    isLeaf = true;

                }

                let item = {
                    knowid: result.rows[i].dataValues.knowid,
                    title: result.rows[i].dataValues.title + '('+result.rows[i].dataValues.res_count+')',
                    isLeaf: isLeaf
                };
                resultJsonArray.push(item); 
            }
                var rs0 = {
                    allpages: Math.ceil(result.count / limit),
                    knowledge: resultJsonArray
                }

    


            //查询resource
            result1 = await Resource.findAndCountAll({

                where: {
                    field: field,
                    subject: subject,
                    grade: grade,
                    [Op.or]: [
                        {
                            r_name: {
                                [Op.like]: '%' + nameTitleArray[n] + '%'
                            }
                        },
                        {
                            r_desc: {
                                [Op.like]: '%' + descriptionArray[n] + '%'
                            }
                        },
                        {
                            r_key: {
                                [Op.like]: '%' + r_keyKeywordArray[n] + '%'
                            }
                        }
                    ]

                },
                limit: limit * 1,
                offset: (page - 1) * limit
            })

            if (result1.count == 0) {
                returnFlag2 = true
            }
            console.log("rsLast--");
            console.log(result1.rows.length);
            logger.log('info', 'result1.rows.length', result1.rows.length);

            for (let j = 0; j < result1.rows.length; j++) {

                let item = {
                    r_id: result1.rows[j].dataValues.r_id,
                    r_name: result1.rows[j].dataValues.r_name,
                };
                resultJsonArray1.push(item);
            }
            var rs1 = {
                allpages: Math.ceil(result1.count / limit),
                resource: resultJsonArray1
            }
            console.log("n--");
            console.log(n);
        }
    }


    if (returnFlag1 == true && returnFlag2 == true) {
        res.json({ errorCode: '1', msg: 'no data' });
    } else if (descriptionArray == '' && r_keyKeywordArray == '' && nameTitleArray == '') {
        rsLast = await resultSend(rs01, rs11);

        console.log(rsLast);

        res.send(rsLast);
    } else {
        rsLast = await resultSend(rs0, rs1);

        console.log(rsLast);

        res.send(rsLast);
    }
}


function resultSend(knowledge, resource) {

    let rs2 = {
        errorCode: 0,
        knowledge, resource
    }

    return rs2;
}

function maxLength(a, b, c) {

    var max = a;

    if (max < b) max = b;
    if (max < c) max = c;
    return max;

}
function minLength(a, b, c) {

    var min = a;

    if (min > b) min = b;
    if (min > c) min = c;
    return min;

}

/* async function checkArray(resultJsonArray){

    var ResArr = []
    for(let j=0; j<resultJsonArray.length;j++){
        if(resultJsonArray[j].res_count!=0){
           await ResArr.push(resultJsonArray[i])
        }
        console.log("j",j)
    }
    return ResArr
} */

async function testDetail(req, res) {

    const keys = req.query.keys;

    result = await Resource.update({
        r_thumb: null
    }, {
        where:
            { r_id: { [Op.gt]: 0 } }
        })
    res.send(result)

}


module.exports = {
    getQueryResourceDetails: getQueryResourceDetails,
    queryResourceAndKnowledgeNodes: queryResourceAndKnowledgeNodes,
    testDetail: testDetail
}