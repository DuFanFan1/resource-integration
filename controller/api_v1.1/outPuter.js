
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var data = require('../../database/db');

var resource = require('../../model/api_v1.1/resource');
var knowledge = require('../../model/api_v1.1/knowledge');

const Resource = resource(data.testdb, Sequelize);
const Knowledge = knowledge(data.testdb, Sequelize);

async function resourceDetails(req,res){
      
    //1.'网络课程','目录索引','常见问题解答','文献','案例','课件','试卷','试题','素材'
      const rtype = req.query.rtype;
    //2.'基础教育','高等教育','成人教育'
      const field = req.query.field;
    //3.'高中','初中','小学'
      const grade = req.query.grade;
    //4.'英语','生物','物理','语文','数学'
      const subject = req.query.subject;
    //5.单页显示数
      const limit = req.query.count;
    //6.当前页的数
      const page = req.query.page;

      var resultJsonArray = [];
      var items = [];
      result = await Resource.findAndCountAll({

        where:{
            rtype:rtype,
            field:field,
            grade:grade,
            subject:subject
        },
        limit: limit * 1,
        offset: (page - 1) * limit
      })
      //console.log(result.rows[i].dataValues.r_id);
     if(result.count==0){
        res.json({ errorCode: '1', msg: 'no data' });
      }else{

        for (let i = 0; i < result.rows.length; i++) {       
          let  items = {
            r_id:result.rows[i].dataValues.r_id,
            r_name:result.rows[i].dataValues.r_name,
            r_desc:result.rows[i].dataValues.r_desc,
            r_key:result.rows[i].dataValues.r_key,
            field:result.rows[i].dataValues.field,
            grade:result.rows[i].dataValues.grade,
            subject:result.rows[i].dataValues.subject,
            rtype:result.rows[i].dataValues.rtype,
            difficulty:result.rows[i].dataValues.difficulty,
            version:result.rows[i].dataValues.version,
            r_status:result.rows[i].dataValues.r_status,
            uid:result.rows[i].dataValues.uid,
            view_url:result.rows[i].dataValues.view_url
       }
            resultJsonArray.push(items);
        }
      } 
      let rs0 = {
        errorCode: 0,
        allpages: Math.ceil(result.count /limit),
        msg: resultJsonArray
    }
    //console.log(result);
    res.send(rs0);
}

async function resourceList(req, res) {

    //const field = req.query.field;
    const grade = req.query.grade;
    const subject = req.query.subject;

    const key = grade + subject;
    console.log('key', key);

    var listMap = new Map();
    var listidMap = new Map();

    var listSer =[['小学数学',1],['初中数学',2],['初中物理',3],['初中化学',4],['初中生物',5]];
    var List = [['小学数学', 'XD00101/XK00201'], ['初中数学', 'XD00201/XK00201'], ['初中物理', 'XD00201/XK00701'], ['初中化学', 'XD00201/XK00801'], ['初中生物', 'XD00201/XK00901']];
    
    List.forEach(([key, value]) => listMap.set(key, value));
    listSer.forEach(([key, value])=>listidMap.set(key,value));
    
    for (let [key, val] of listMap.entries()) {
         console.log(key, val);
      }
    id = listidMap.get(key);
    console.log("id",id);
    category_id = listMap.get(key);
    console.log("category_id", category_id);

    result = await Knowledge.findAll({
        where: {
            grade: grade,
            subject: subject,
            pre_knowid: 0
        }
    })

  if (result.length == 0) {
    res.json({ errorcode: '1', msg: 'no data' });
  } else {
    //声明JSON数组变量
    var resultJsonArray = [];
    for (let i = 0; i < result.length; i++) {
        let item = {
            knowid: result[i].dataValues.knowid,
            title:result[i].dataValues.title,
            pre_knowid: result[i].dataValues.pre_knowid
        };
        resultJsonArray.push(item);
    }

    let list ={
      id: id,
      name: key,
      category_id: category_id,
      chapters:resultJsonArray
    }

    let rs0 = {
        errorCode: 0,
        msg: list
    }
    res.send(rs0);
}

}

module.exports = {
    resourceDetails:resourceDetails,
    resourceList:resourceList
}