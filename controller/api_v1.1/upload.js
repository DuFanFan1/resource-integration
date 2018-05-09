const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var data = require('../../database/db');
var conf = require('../../configure');
var resource = require('../../model/api_v1.1/resource');
const Resource = resource(data.testdb, Sequelize);
var knowledge = require('../../model/api_v1.1/knowledge');
const Knowledge = knowledge(data.testdb, Sequelize);
var knowledge_struct_index = require('../../model/api_v1.1/knowledge_struct_index');
const Knowledge_struct_index = knowledge_struct_index(data.testdb,Sequelize);
var knowledge_struct = require('../../model/api_v1.1/knowledge_struct');
const Knowledge_struct = knowledge_struct(data.testdb,Sequelize);

//添加资源bymyf
function addResource_v1_1(req, res) {
    var r_name = req.body.r_name;
    var r_desc = req.body.r_desc;
    var grade = req.body.grade;
    var r_key = req.body.r_key;
    var rtype = req.body.rtype;
    var field = req.body.field;
    var difficulty = req.body.difficulty;
    var r_language = req.body.r_language;
    var subject = req.body.subject;
    var purpose = req.body.purpose;
    var annotation = req.body.annotation;

    //这里的file_url需要迁移到配置文件中，方便以后不再使用localhost和3000端口
    if(req.file != null) {
        var file_url = conf.path.single_url + req.file.filename;
    }else{
        var file_url = "";
    }
    console.log(file_url);
    Resource.create({
        r_name: r_name,
        r_desc: r_desc,
        grade: grade,
        r_key: r_key,
        rtype: rtype,
        field: field,
        difficulty: difficulty,
        r_language: r_language,
        subject: subject,
        purpose: purpose,
        annotation: annotation,
        file_url: file_url
    }).then(result => {
        if (result == null) {
            res.json({ errorcode: '1', msg: 'failure' });
        } else {
            res.json({ errorcode: '0', r_id: result.dataValues.r_id });
        }
    });
}

var JSZip = require("jszip");
var XLSX = require("xlsx");
var fs = require("fs");
function batchImportResource_v1_1(req, res) {
    var patt1 = new RegExp("resource_model.xls");
    var xlsx_path = null;
    var xlsx_json = null;
    //console.log(req.file);
    JSZip.loadAsync(req.file.buffer).then(async function (zip) {
        zip.forEach(function (relativePath, zipEntry) {
            if (patt1.test(zipEntry.name)) {
                xlsx_path = zipEntry.name;
            }
        });
        await zip.file(xlsx_path).async("uint8array").then(function (data) {
            var workbook = XLSX.read(data, { type: 'buffer' });
            // 获取 Excel 中所有表名
            const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
            // 根据表名获取对应某张表
            const worksheet = workbook.Sheets[sheetNames[0]];
            xlsx_json = XLSX.utils.sheet_to_json(worksheet);
        });

        console.log(xlsx_json);
        var bulkres = [];
        for (var i = 1; i < xlsx_json.length; i++) {
            var resunit = {
                r_name: xlsx_json[i]['资源名称'], r_desc: xlsx_json[i]['资源描述'], r_key: xlsx_json[i]['关键字'],
                r_language: xlsx_json[i]['语言（1=CH，2=EN）'], r_thumb: xlsx_json[i]['资源缩略图'],
                r_ext: xlsx_json[i]['资源扩展名'], field: xlsx_json[i]['领域,enum'], grade: xlsx_json[i]['年级（学段）,enum'],
                subject: xlsx_json[i]['学科'], rtype: xlsx_json[i]['资源类型,enum'], difficulty: xlsx_json[i]['难度,1=简单，2=中等；3=困难'],
                answer: xlsx_json[i]['答案，若是试题，则由答案；否则无'], purpose: xlsx_json[i]['目的，对监狱资源进行分类的依据"'],
                annotation: xlsx_json[i]['评注'], contribute: xlsx_json[i]['贡献，著作权人'], create_time: xlsx_json[i]['添加时间'],
                file_url: xlsx_json[i]['上传后文件路径']
            };
            bulkres.push(resunit);
        }
        console.log(bulkres);
        for (var i = 0; i < bulkres.length; i++) {
            /*console.log('resource_model/thumb/'+xlsx_json[i].r_thumb);*/
            let pngname = bulkres[i].r_thumb;
            await zip.file('resource_model/thumb/' + bulkres[i].r_thumb).async("uint8array").then(function (data) {
                fs.writeFile('public/thumb/' + pngname, data, function (err) {
                    if (err) res.json({ errorcode: '1', msg: 'write thumb fail' });
                })

            });
            bulkres[i].r_thumb = conf.path.batch_url + pngname;
            console.log('resource_model/file/' + bulkres[i].file_url);
            let filename = bulkres[i].file_url;
            await zip.file('resource_model/file/' + bulkres[i].file_url).async("uint8array").then(function (data) {
                fs.writeFile('public/file/' + filename, data, function (err) {
                    if (err) res.send('fs fail')
                })
            });
            bulkres[i].file_url = 'public/file/' + filename;
        }
        // console.log(bulkres);
        Resource.bulkCreate(bulkres).then(result => {
            if (result == null) {
                res.json({ errorcode: '1', msg: 'insert failure' });
            } else {
                res.json({ errorcode: '0', msg: 'insert success' });
            }
        });
    }, function (e) {
        if (e) {
            res.json({ errorcode: '1', msg: 'decompression fail' });
        }
    });
}
async function batchImportKnowledge_v1_1(req, res) {
    // 获取 Excel 中所有表名
    try {
        var workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    } catch (err) {
        //console.log(err);
        res.json({ errorcode: '1', msg: 'read excel failure' });
    }
    const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
    // 根据表名获取对应某张表
    const worksheet = workbook.Sheets[sheetNames[0]];
    xlsx_json = XLSX.utils.sheet_to_json(worksheet);
    //console.log(xlsx_json);
    //保存那些有父知识点的知识点
    var bulklore = [];
    //保存那些没有找到父知识点的知识点
    var bulklore_norm = [];
    for (var i = 1; i < xlsx_json.length; i++) {
        var lore = {
            title: xlsx_json[i]['节点名称'], pre_title: xlsx_json[i]['前驱节点名称']
        };
        var lore_norm = {
            title: xlsx_json[i]['节点名称'], pre_knowid: '0',
            description: xlsx_json[i]['节点描述'], contribute: xlsx_json[i]['添加者'],
            keywords: xlsx_json[i]['关键字'], language: xlsx_json[i]['语言'],
            importance: xlsx_json[i]['重要程度'], is_knowledge: xlsx_json[i]['是否是知识点'],
            field: xlsx_json[i]['领域'], grade: xlsx_json[i]['学段'], subject: xlsx_json[i]['学科'], addtime: new Date(),
            knowpath:'',level:'0',res_count:'0'
        };
        //过滤掉\r\n,减少人为输入数据导致的错误
        lore.title=lore.title.replace(/[\r\n]/g, "");
        lore.pre_title=lore.pre_title.replace(/[\r\n]/g, "");
        lore_norm.title=lore_norm.title.replace(/[\r\n]/g, "");
        //查找导入的知识点是否已经存在，若存在就不再添加
        await Knowledge.findOne({
            where: {
                title: lore.title
            }
        }).then(async result => {
            //数据库中不存在，添加知识点
            if (result == null) {
                bulklore.push(lore);
                bulklore_norm.push(lore_norm);
            }
        });
    }
    console.log(bulklore_norm);
    if (bulklore.length < 1 ) {
        res.json({ errorcode: '0', msg: 'insert data exist' });
    } else {
        //先把bulklore的插入
        await Knowledge.bulkCreate(bulklore_norm).then(async result => {
            //console.log(result);
            if (result == null) {
                res.json({ errorcode: '1', msg: 'insert fail' });
            }
        });
        //迭代求路径
        var flag = true;
        while(flag){
            for(let i=0;i<bulklore.length;i++){
                flag = false;
                console.log(bulklore[i].pre_title);
                await Knowledge.findOne({
                    where:{
                        title:bulklore[i].pre_title
                    }
                }).then(async result =>{
                    if(result!=null){
                        let resultKnowid = await Knowledge.findOne({where:{title:bulklore[i].title}});
                        await Knowledge.update({
                            pre_knowid:result.dataValues.knowid,
                            knowpath:result.dataValues.knowpath+resultKnowid.dataValues.knowid+',',
                            level:result.dataValues.knowpath.split(',').length
                        },{
                            where:{
                                title:bulklore[i].title
                            }
                        }).then(num =>{
                            if (num == null) {
                                res.json({ errorcode: '1', msg: 'update fail' });
                            }
                            if(num != 0){
                                flag = true;
                            }
                        })
                    }
                })
            }
        }

        res.json({ errorcode: '0', msg: 'insert success' });
    }
}
async function batchImportMapStruct_v1_1(req,res){
    var mapid = req.body.mapid;
    // 获取 Excel 中所有表名
    try {
        var workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    } catch (err) {
        //console.log(err);
        res.json({ errorcode: '1', msg: 'read excel failure' });
    }
    const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
    // 根据表名获取对应某张表
    const worksheet = workbook.Sheets[sheetNames[0]];
    xlsx_json = XLSX.utils.sheet_to_json(worksheet);
    var bulklore = [];
    var bulklore_norm = [];
    for (var i = 1; i < xlsx_json.length; i++) {
        var lore = {
            map: xlsx_json[i]['知识地图名称'], title: xlsx_json[i]['节点名称'],
            pre_title: xlsx_json[i]['前驱节点名称']
        };
        var lore_norm = {
            structid:'0',mapid:'0',pre_structid:'0',
            title: xlsx_json[i]['节点名称'],description: xlsx_json[i]['节点描述'],
            contribute: xlsx_json[i]['添加者'], keywords: xlsx_json[i]['关键字'],
            is_knowledge: xlsx_json[i]['是否是知识点'], addtime: new Date(),
            structpath:'',level:'0',struct_res_count:'0'
        }
        //过滤掉\r\n,减少人为输入数据导致的错误
        lore.title=lore.title.replace(/[\r\n]/g, "");
        lore.pre_title=lore.pre_title.replace(/[\r\n]/g, "");
        lore_norm.title=lore_norm.title.replace(/[\r\n]/g, "");
        bulklore.push(lore);
        bulklore_norm.push(lore_norm);
    }
    var resultMapIndex = await Knowledge_struct_index.findOne({
        where:{
            mapid:mapid
        }
    });
    console.log(bulklore[0].map + resultMapIndex.dataValues.map_name );
    if(resultMapIndex!=null){
        if(bulklore[0].map != resultMapIndex.dataValues.map_name){
            res.json({ errorcode: '1', msg: 'map_name fail' });
            return;
        }
    }else{
        res.json({ errorcode: '1', msg: 'no map' });
        return;
    }
    console.log("插入数据");
    for(let i=0;i<bulklore_norm.length;i++){
        bulklore_norm[i].mapid = mapid;
        let structid = 0;
        //获取Knowledge_struct中的最大值
        await Knowledge_struct.max('structid').then(max =>{
            // console.log('max:'+max);
            structid = max+1;
        });
        bulklore_norm[i].structid = structid;
        await Knowledge_struct.create(bulklore_norm[i]).then(result =>{
            if (result == null) {
                res.json({ errorcode: '1', msg: 'insert fail' });
            }
        })
    }
    //迭代路径求解
    var flag = true;
    while (flag){
        flag = false;
        for(let i=0;i<bulklore_norm.length;i++){
            if(bulklore[i].pre_title == bulklore[i].map){
                await Knowledge_struct.update({
                    structpath:bulklore_norm[i].structid+',',
                    level:'1'
                },{
                    where:{
                        structid:bulklore_norm[i].structid,
                        mapid:mapid
                    }
                })
                continue;
            }

            await Knowledge_struct.findOne({
                where:{
                    title:bulklore[i].pre_title,
                    mapid:mapid
                }
            }).then(async result =>{
                //console.log(bulklore[i].pre_title+':'+result);
                if(result!=null){
                    await Knowledge_struct.update({
                        pre_structid:result.dataValues.structid,
                        structpath:result.dataValues.structpath+bulklore_norm[i].structid+',',
                        level:result.dataValues.structpath.split(',').length
                    },{
                        where:{
                            structid:bulklore_norm[i].structid,
                            mapid:mapid
                        }
                    }).then(num =>{
                        console.log('num:'+num);
                        if (num == null) {
                            res.json({ errorcode: '1', msg: 'update fail' });
                        }
                        if(num != 0){
                            flag = true;
                        }
                    })
                }
            })
        }
    }

    res.json({ errorcode: '0', msg: 'insert success' });
}
module.exports = {
    addResource_v1_1: addResource_v1_1,
    batchImportResource_v1_1: batchImportResource_v1_1,
    batchImportKnowledge_v1_1: batchImportKnowledge_v1_1,
    batchImportMapStruct_v1_1:batchImportMapStruct_v1_1,
}