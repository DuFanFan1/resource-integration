var express = require('express');
var router = express.Router();
var data = require('../database/db');

const Sequelize = require('sequelize');

var knowledge_struct_index = require('../controller/api_v1.1/knowledge_struct_index');
var knowledge_struct = require('../controller/api_v1.1/knowledge_struct');
var knowledge = require('../controller/api_v1.1/knowledge');
var user = require('../controller/api_v1.1/user');
var upload = require('../controller/api_v1.1/upload');
var knowledge_res_relation = require('../controller/api_v1.1/knowledge_res_relation');
var pagequery = require('../controller/api_v1.1/pagequery');
var knowledge_struct_rela_know = require('../controller/api_v1.1/knowledge_struct_rela_know');
var advancedSearch = require('../controller/api_v1.1/advancedSearch');
var outPuter = require('../controller/api_v1.1/outPuter');
var higherSearch = require('../controller/api_v1.1/higherSearch');

var knowledge_resource = require('../controller/api_v1.1/knowledge_resource');
var mark_management = require('../controller/api_v1.1/mark_management');
var apiPackage = require('../http/apiPackage');
var statisticalAnalysis = require('../controller/api_v1.1/statisticalAnalysis')

data.testdb.authenticate().then(() => {
    console.log('data.testdb Connected successfully.');   
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

/**
 * 上传文件的定义
 */
var multer  = require('multer');
var diskstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file != null){
            cb(null, 'public/uploads/')
        }
    },
    filename: function (req, file, cb) {
        if(file != null) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    }
});
var disk = multer({storage:diskstorage});
var memorystorage = multer.memoryStorage();
var memory = multer({ storage: memorystorage });

/**
* @swagger
* definitions:
*   addKnowledgeMap:
*     properties:
*       map_name:
*         type: string
*       field:
*         type: integer
*       grade:
*         type: integer
*       subject:
*         type: integer
*       version:
*         type: integer
*       kmap_type:
*         type: integer
*       is_shared:
*         type: integer
*       uid:
*         type: integer
*/
/**
 * @swagger
 * /api_v1.1/knowledge_struct_index/addKnowledgeMaps:
 *   post:
 *     tags:
 *       - knowledge_struct_index-v1.1
 *     description: 添加知识地图-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: KnowledgeMap
 *         description: KnowledgeMap
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/addKnowledgeMap'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.post('/knowledge_struct_index/addKnowledgeMaps',knowledge_struct_index.addKnowledgeMaps);

/**
 * @swagger
 * /api_v1.1/knowledge_struct_index/deleteKnowledgeMaps:
 *   get:
 *     tags:
 *       - knowledge_struct_index-v1.1
 *     description: 通过mapid删除知识地图-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: mapid
 *        description: mapid
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct_index/deleteKnowledgeMaps',knowledge_struct_index.deleteKnowledgeMaps);

/**
 * @swagger
 * /api_v1.1/knowledge_struct_index/getKnowledgeMap:
 *   get:
 *     tags:
 *       - knowledge_struct_index-v1.1
 *     description: 通过mapid获取知识地图描述信息详情-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: mapid
 *        description: mapid
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct_index/getKnowledgeMap',knowledge_struct_index.getKnowledgeMap);
/**
* @swagger
* definitions:
*   editKnowledgeMap:
*     properties:
*       mapid:
*         type: integer
*       map_name:
*         type: string
*       field:
*         type: integer
*       grade:
*         type: integer
*       subject:
*         type: integer
*       version:
*         type: integer
*       kmap_type:
*         type: integer
*       is_shared:
*         type: integer
*       uid:
*         type: integer
*/
/**
 * @swagger
 * /api_v1.1/knowledge_struct_index/editKnowledgeMapDescriptions:
 *   put:
 *     tags:
 *       - knowledge_struct_index-v1.1
 *     description: 通过mapid编辑知识地图--by bing
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowledge
 *         description: knowledge object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/editKnowledgeMap'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.put('/knowledge_struct_index/editKnowledgeMapDescriptions', knowledge_struct_index.editKnowledgeMapDescriptions);

/**
 * @swagger
 * /api_v1.1/knowledge_struct_index/queryKnowledgeMapbySFVT:
 *   get:
 *     tags:
 *       - knowledge_struct_index-v1.1
 *     description: 通过学科，学段，版本，类型获取知识地图列表-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: subject
 *        description: 学科
 *        in: query
 *        required: true
 *        type: string
 *      - name: grade
 *        description: 年级
 *        in: query
 *        required: true
 *        type: string
 *      - name: version
 *        description: 版本
 *        in: query
 *        required: true
 *        type: string
 *      - name: kmap_type
 *        description: 类型
 *        in: query
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct_index/queryKnowledgeMapbySFVT',knowledge_struct_index.queryKnowledgeMapbySFVT);
/**
 * @swagger
 * /api_v1.1/knowledge_struct/getKnowledgeRelationStruct:
 *   get:
 *     tags:
 *       - knowledge_struct-v1.1
 *     description: 通过mapid获取知识地图列表形式第一层级结构-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: mapid
 *        description: 知识地图的id
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct/getKnowledgeRelationStruct',knowledge_struct.getKnowledgeRelationStruct);
/**
 * @swagger
 * /api_v1.1/knowledge_struct/presentViewKnowledgeStructResNodeDetail:
 *   get:
 *     tags:
 *       - knowledge_struct-v1.1
 *     description: 通过mapid获取知识地图列表形式第一层级结构-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: structid
 *        description: structid
 *        in: query
 *        required: true
 *        type: integer
 *      - name: mapid
 *        description: 知识地图的id
 *        in: query
 *        required: true
 *        type: integer
 *      - name: count
 *        description: count
 *        in: query
 *        required: true
 *        type: integer
 *      - name: page
 *        description: page
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct/presentViewKnowledgeStructResNodeDetail',knowledge_struct.presentViewKnowledgeStructResNodeDetail);
/**
 * @swagger
 * /api_v1.1/knowledge_struct/KnowledgeStructResNodeDetail:
 *   get:
 *     tags:
 *       - knowledge_struct-v1.1
 *     description: 查询知识地图父节点关联资源信息-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: structid
 *        description: structid
 *        in: query
 *        required: true
 *        type: integer
 *      - name: count
 *        description: count
 *        in: query
 *        required: true
 *        type: integer
 *      - name: page
 *        description: page
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct/KnowledgeStructResNodeDetail',knowledge_struct.KnowledgeStructResNodeDetail);

/**
 * @swagger
 * /api_v1.1/knowledge_struct/countKnowledgeStructResResouces:
 *   get:
 *     tags:
 *       - knowledge_struct-v1.1
 *     description: 查询知识地图父节点关联资源信息-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: structid
 *        description: structid
 *        in: query
 *        required: true
 *        type: integer
 *      - name: mapid
 *        description: mapid
 *        in: query
 *        required: true
 *        type: integer
 *      - name: count
 *        description: count
 *        in: query
 *        required: true
 *        type: integer
 *      - name: page
 *        description: page
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct/countKnowledgeStructResResouces',knowledge_struct.countKnowledgeStructResResouces);
/**
 * @swagger
 * /api_v1.1/knowledge_struct/getKnowledgeRelationStruct1:
 *   get:
 *     tags:
 *       - knowledge_struct-v1.1
 *     description: 通过mapid获取知识地图列表形式第一层级结构-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: mapid
 *        description: 知识地图的id
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct/getKnowledgeRelationStruct1',knowledge_struct.getKnowledgeRelationStruct1);

/**
 * @swagger
 * /api_v1.1/knowledge/queryFirstLayerRelation:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: 通过关键字搜索关联知识点第一层级关系-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: keywords
 *        description: 关键字
 *        in: query
 *        required: true
 *        type: string
 *      - name: subject
 *        description: 学科
 *        in: query
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge/queryFirstLayerRelation',knowledge.queryFirstLayerRelation);

/**
 * @swagger
 * /api_v1.1/knowledge/querySecondLayerRelation:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: 通过知识点knowid搜索关联知识点第二层级关系-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: knowid
 *        description: 关键字
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge/querySecondLayerRelation',knowledge.querySecondLayerRelation);
/**
 * @swagger
 * /api_v1.1/knowledge_struct/getKnowledgeRelationStructNextbyStructid:
 *   get:
 *     tags:
 *       - knowledge_struct-v1.1
 *     description: 通过structid查询知识地图的结构-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: structid
 *        description: 知识点id
 *        in: query
 *        required: true
 *        type: integer
 *      - name: mapid
 *        description: 知识地图id
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */

router.get('/knowledge_struct/getKnowledgeRelationStructNextbyStructid',knowledge_struct.getKnowledgeRelationStructNextbyStructid);
/**
 * @swagger
 * /api_v1.1/knowledge/getKnowledgeRelationStructNextbyKnowid:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: 通过knowid查询知识地图的结构-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: pre_knowid
 *        description: 知识点id
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge/getKnowledgeRelationStructNextbyKnowid',knowledge.getKnowledgeRelationStructNextbyKnowid);
/**
 * @swagger
 * /api_v1.1/knowledge/getKnowledgeNodeInformations:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: 通过知识点knowid获取知识点详情-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: knowid
 *        description: 知识元id
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge/getKnowledgeNodeInformations',knowledge.getKnowledgeNodeInformations);
/**
 * @swagger
 * /api_v1.1/knowledge/getKnowledgeStorageFirstLayer:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: 通过学科获取知识库第一层层级结构--by bing
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: subject
 *         description: subject
 *         in: query
 *         required: true
 *         type: string
 *       - name: grade
 *         description: grade
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully
 *        
 */
router.get('/knowledge/getKnowledgeStorageFirstLayer',knowledge.getKnowledgeStorageFirstLayer);
/**
 * @swagger
 * /api_v1.1/knowledge/getKnowledgeStorageNextLayer:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: 通过学科获取知识库下一层层级结构--by bing
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowid
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *        
 */
router.get('/knowledge/getKnowledgeStorageNextLayer',knowledge.getKnowledgeStorageNextLayer);
/**
 * @swagger
 * /api_v1.1/knowledge_struct/getKnowledgeStructDetails:
 *   get:
 *     tags:
 *       - knowledge_struct-v1.1
 *     description: 通过层级structid获取节点详情-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: structid
 *        description: 知识点id
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct/getKnowledgeStructDetails',knowledge_struct.getKnowledgeStructDetails);
/**
 * @swagger
 * /api_v1.1/knowledge_struct/deleteStructNode:
 *   get:
 *     tags:
 *       - knowledge_struct-v1.1
 *     description: 通过structid删除节点信息-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: structid
 *        description: 知识点id
 *        in: query
 *        required: true
 *        type: integer
 *      - name: pre_structid
 *        description: 知识点id
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct/deleteStructNode',knowledge_struct.deleteStructNode);


/**
 * @swagger
 * /api_v1.1/knowledge_struct/doublequeryTestDemo:
 *   get:
 *     tags:
 *       - knowledge_struct-v1.1
 *     description: 通过structid删除节点信息-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: id1
 *        description: 知识点id
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct/doublequeryTestDemo',knowledge_struct.doublequeryTestDemo);


/**
* @swagger
* definitions:
*   NodeInfoDetails:
*     properties:
*       mapid:
*         type: integer
*       title:
*         type: string
*       pre_structid:
*         type: integer
*       description:
*         type: string
*       keywords:
*         type: string
*       uid:
*         type: integer
*/
/**
 * @swagger
 * /api_v1.1/knowledge_struct/addKnowledgeNodeInfoDetails:
 *   post:
 *     tags:
 *       - knowledge_struct-v1.1
 *     description: 添加知识地图-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: KnowledgeMap
 *         description: KnowledgeMap
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/NodeInfoDetails'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.post('/knowledge_struct/addKnowledgeNodeInfoDetails',knowledge_struct.addKnowledgeNodeInfoDetails);

/**
* @swagger
* definitions:
*   updateKnowledgeNodeInfoDetails:
*     properties:
*       structid:
*         type: integer
*       title:
*         type: string
*       description:
*         type: string
*       keywords:
*         type: string
*/
/**
 * @swagger
 * /api_v1.1/knowledge_struct/updateKnowledgeNodeInfoDetails:
 *   put:
 *     tags:
 *       - knowledge_struct-v1.1
 *     description: 通过structid修改节点信息--by bing
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowledge
 *         description: knowledge object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/updateKnowledgeNodeInfoDetails'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.put('/knowledge_struct/updateKnowledgeNodeInfoDetails', knowledge_struct.updateKnowledgeNodeInfoDetails);

/**
 * @swagger
 * /api_v1.1/knowledge_struct/presentKnowledgeStructResNodeDetail:
 *   get:
 *     tags:
 *       - knowledge_struct-v1.1
 *     description: 通过structid查询知识地图的结构-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: structid
 *        description: 知识点id
 *        in: query
 *        required: true
 *        type: integer
 *      - name: mapid
 *        description: 知识地图id
 *        in: query
 *        required: true
 *        type: integer
 *      - name: level
 *        description: 层级
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 */
router.get('/knowledge_struct/presentKnowledgeStructResNodeDetail',knowledge_struct.presentKnowledgeStructResNodeDetail);

/**
* @swagger
* definitions:
*   KnowledgeNode:
*     properties:
*       knowid:
*         type: integer
*       title:
*         type: string
*       description:
*         type: string
*       contribute:
*         type: string
*       keywords:
*         type: string
*       language:
*         type: string
*       importance:
*         type: integer
*       field:
*         type: integer
*       grade:
*         type: integer
*       subject:
*         type: integer
*/
/**
 * @swagger
 * /api_v1.1/knowledge/editKnowledgeNodeInformations:
 *   put:
 *     tags:
 *       - knowledge-v1.1
 *     description: 通过知识点knowid编辑知识点详情--by bing
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowledge
 *         description: knowledge object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/KnowledgeNode'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.put('/knowledge/editKnowledgeNodeInformations', knowledge.editKnowledgeNodeInformations);

/**
* @swagger
* definitions:
*   KnowledgeNodes:
*     properties:
*       title:
*         type: string
*       pre_knowid:
*         type: integer
*       description:
*         type: string
*       contribute:
*         type: string
*       keywords:
*         type: string
*       language:
*         type: string
*       importance:
*         type: integer
*       grade:
*         type: integer
*       field:
*         type: integer
*       subject:
*         type: integer
*/
/**
 * @swagger
 * /api_v1.1/knowledge/addKnowledgeNode:
 *   post:
 *     tags:
 *       - knowledge-v1.1
 *     description: 添加知识点--by bing
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowledge
 *         description: knowledge object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/KnowledgeNodes'
 *     responses:
 *       200:
 *         description: Successfully 
 */
router.post('/knowledge/addKnowledgeNode', knowledge.addKnowledgeNode);
/**
 * @swagger
 * /api_v1.1/knowledge_struct_rela_know/deleteRelationKnowid:
 *   get:
 *     tags:
 *       - knowledge_struct_rela_know-v1.1
 *     description: 通过知识点knowid删除知识地图中与知识点的关联关系-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: knowid
 *        description: knowid
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct_rela_know/deleteRelationKnowid',knowledge_struct_rela_know.deleteRelationKnowid);
/**
 * @swagger
 * definition:
 *   userinfo:
 *     properties:
 *       username:
 *         type: string
 *       mobile_phone:
 *         type: string
 *       email:
 *         type: string
 *       birthday:
 *         type: string
 *       sex:
 *         type: integer
 *       status:
 *         type: integer
 *       role:
 *         type: integer
 *       scope:
 *         type: string
 *       grade:
 *         type: string
 *       course:
 *         type: string
 *       created_at:
 *         type: datetime
 *       updated_at:
 *         type: datetime
 *   updatepwd:
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       newpassword:
 *         type: string
 *   updateUserinfo:
 *     properties:
 *       username:
 *         type: string
 *       mobile_phone:
 *         type: string
 *       email:
 *         type: string
 *       birthday:
 *         type: string
 *       sex:
 *         type: integer
 *       scope:
 *         type: string
 *       grade:
 *         type: string
 *       course:
 *         type: string
 *       created_at:
 *         type: datetime
 *       updated_at:
 *         type: datetime
 *
 */
/**
 * @swagger
 * /api_v1.1/user/login_v1_1:
 *   get:
 *     tags:
 *       - user-v1.1
 *     description: User login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: username
 *         in: query
 *         required: true
 *         type: string
 *       - name: password
 *         description: password
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully
 *         schema:
 *           $ref: '#/definitions/userinfo'
 */
router.get('/user/login_v1_1',user.login_v1_1);
/**
 * @swagger
 * /api_v1.1/user/getUserInfo_v1_1:
 *   get:
 *     tags:
 *       - user-v1.1
 *     description: get user information
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: username
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully
 *         schema:
 *           $ref: '#/definitions/userinfo'
 */
router.get('/user/getUserInfo_v1_1',user.getUserInfo_v1_1);
/**
 * @swagger
 * /api_v1.1/user/updateUserInfo_v1_1:
 *   put:
 *     tags:
 *       - user-v1.1
 *     description: update user information
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user_info
 *         description: user_info object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/updateUserinfo'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.put('/user/updateUserInfo_v1_1',user.updateUserInfo_v1_1);
/**
 * @swagger
 * /api_v1.1/user/updateUserPassword_v1_1:
 *   put:
 *     tags:
 *       - user-v1.1
 *     description: update user password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user_pwd
 *         description: user_pwd object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/updatepwd'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.put('/user/updateUserPassword_v1_1',user.updateUserPassword_v1_1);


/**
 * @swagger
 * /api_v1.1/upload/addResource_v1_1:
 *   post:
 *     tags:
 *       - upload-v1.1
 *     description: swagger不可用，请用RESTClient测试
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: resource_info
 *         description: 不支持调用！！！
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.post('/upload/addResource_v1_1',disk.single('file'),upload.addResource_v1_1);
/**
 * @swagger
 * /api_v1.1/upload/batchImportResource_v1_1:
 *   post:
 *     tags:
 *       - upload-v1.1
 *     description: swagger不可用，请用RESTClient测试
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: zip
 *         description: 不支持调用！！！
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.post('/upload/batchImportResource_v1_1',memory.single('zip'),upload.batchImportResource_v1_1);
/**
 * @swagger
 * /api_v1.1/upload/batchImportKnowledge_v1_1:
 *   post:
 *     tags:
 *       - upload-v1.1
 *     description: swagger不可用，请用RESTClient测试
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: file
 *         description: 导入文件
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.post('/upload/batchImportKnowledge_v1_1',memory.single('file'),upload.batchImportKnowledge_v1_1);
/**
 * @swagger
 * /api_v1.1/upload/batchImportMapStruct_v1_1:
 *   post:
 *     tags:
 *       - upload-v1.1
 *     description: swagger不可用，请用RESTClient测试
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: file
 *         description: 导入文件
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.post('/upload/batchImportMapStruct_v1_1',memory.single('file'),upload.batchImportMapStruct_v1_1);
/**
 * @swagger
 * definition:
 *   know_res_relation:
 *     properties:
 *       weight:
 *         type: integer
 *       title:
 *         type: string
 *       file_url:
 *         type: string
 *   know_res_detail:
 *     properties:
 *       weight:
 *         type: integer
 *       expert_mark_weight:
 *         type: integer
 *       auto_weight:
 *         type: integer
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       field:
 *         type: string
 *       addtime:
 *         type: string
 *       file_url:
 *         type: string
 *   addrelateknowledge:
 *     properties:
 *       r_id:
 *         type: integer
 *       knowid:
 *         type: integer
 *       expert_mark_weight:
 *         type: integer
 *   addrelateknowledgeexpertweight:
 *     properties:
 *       r_id:
 *         type: integer
 *       knowid:
 *         type: integer
 *       expert_mark_weight:
 *         type: integer
 *   addrelateknowledgeautoweight:
 *     properties:
 *       r_id:
 *         type: integer
 *       knowid:
 *         type: integer
 *       auto_weight:
 *         type: integer
 */
/**
 * @swagger
 * /api_v1.1/knowledge_res_relation/getRelationKnowledge_v1_1:
 *   get:
 *     tags:
 *       - knowledge_res_relation-v1.1
 *     description: 查看资源关联的知识点
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: r_id
 *         description: resource id
 *         in: query
 *         required: true
 *         type: integer
 *       - name: count
 *         description: 项数
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: 页码
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *         schema:
 *           $ref: '#/definitions/know_res_relation'
 */
router.get('/knowledge_res_relation/getRelationKnowledge_v1_1',knowledge_res_relation.getRelationKnowledge_v1_1);
/**
 * @swagger
 * /api_v1.1/knowledge_res_relation/getRelatedDetailOfKnowAndRes_v1_1:
 *   get:
 *     tags:
 *       - knowledge_res_relation-v1.1
 *     description: 知识点和资源的关联详情
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: r_id
 *         description: resource id
 *         in: query
 *         required: true
 *         type: integer
 *       - name: knowid
 *         description: knowledge id
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *         schema:
 *           $ref: '#/definitions/know_res_detail'
 */
router.get('/knowledge_res_relation/getRelatedDetailOfKnowAndRes_v1_1',knowledge_res_relation.getRelatedDetailOfKnowAndRes_v1_1);
/**
 * @swagger
 * /api_v1.1/knowledge_res_relation/addRelateKnowledgeWeight_v1_1:
 *   post:
 *     tags:
 *       - knowledge_res_relation-v1.1
 *     description: 添加关联知识点及expertweight
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: addrelateknowledgeexpertweight
 *         description: 添加关联知识点及expertweight object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/addrelateknowledgeexpertweight'
 *     responses:
 *       200:
 *         description: Successfully
 */
router.post('/knowledge_res_relation/addRelateKnowledgeWeight_v1_1',knowledge_res_relation.addRelateKnowledgeWeight_v1_1);
/**
 * @swagger
 * /api_v1.1/knowledge_res_relation/addRelateKnowledge_autoweight_v1_1:
 *   post:
 *     tags:
 *       - knowledge_res_relation-v1.1
 *     description: 添加关联知识点及autoweight
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: addrelateknowledgeautoweight
 *         description: 添加关联知识点及autoweight object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/addrelateknowledgeautoweight'
 *     responses:
 *       200:
 *         description: Successfully
 */
router.post('/knowledge_res_relation/addRelateKnowledge_autoweight_v1_1',knowledge_res_relation.addRelateKnowledge_autoweight_v1_1);

/**
 * @swagger
 * /api_v1.1/knowledge/getKnowledgeByKeywords_v1_1:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: Return details of resource
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: subject
 *         description: 学科
 *         in: query
 *         required: true
 *         type: integer
 *       - name: keywords
 *         description: 关键字
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: An array of resource
 */
router.get('/knowledge/getKnowledgeByKeywords_v1_1',knowledge.getKnowledgeByKeywords_v1_1);
/**
 * @swagger
 * /api_v1.1/pagequery/getsubjectbypage_v1_1:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: Return details of resource
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: subject
 *         description: 学科
 *         in: query
 *         required: true
 *         type: string
 *       - name: count
 *         description: 项数
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: 页码
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: An array of knowledge
 */
router.get('/pagequery/getsubjectbypage_v1_1',pagequery.getsubjectbypage_v1_1);
/**
 * @swagger
 * /api_v1.1/pagequery/tianjiapath:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: Return details of resource
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of knowledge
 */
router.get('/pagequery/tianjiapath',pagequery.tianjiapath);
/**
 * @swagger
 * /api_v1.1/pagequery/tianjiaziyuan:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: Return details of resource
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of knowledge
 */
router.get('/pagequery/tianjiaziyuan',pagequery.tianjiaziyuan);
/**
 * @swagger
 * /api_v1.1/pagequery/tianjialevel:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: Return details of resource
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of knowledge
 */
router.get('/pagequery/tianjialevel',pagequery.tianjialevel);
/**
 * @swagger
 * /api_v1.1/pagequery/tianjiapath1:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: Return details of resource
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of knowledge
 */
router.get('/pagequery/tianjiapath1',pagequery.tianjiapath1);
/**
 * @swagger
 * /api_v1.1/pagequery/tianjialevel1:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: Return details of resource
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of knowledge
 */
router.get('/pagequery/tianjialevel1',pagequery.tianjialevel1);
/**
 * @swagger
 * /api_v1.1/pagequery/tianjiaziyuan1:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: Return details of resource
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of knowledge
 */
router.get('/pagequery/tianjiaziyuan1',pagequery.tianjiaziyuan1);

/**
 * @swagger
 * /api_v1.1/knowledge_resource/knowidResource_v1_1:
 *   get:
 *     tags:
 *       - knowledge_resource-v1.1
 *     description: 输入knowid   输出title、r_id、r_name、r_type、r_desc、file_url、answer、difficulty、create_time、contribute、r_size、weight
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowid
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: count
 *         description: count
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: page
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           $ref: '#/definitions/knowidResource_v1_1'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_resource/knowidResource_v1_1',knowledge_resource.knowidResource_v1_1);

/**
 * @swagger
 * /api_v1.1/knowledge_resource/resourceSelect_v1_1:
 *   get:
 *     tags:
 *       - knowledge_resource-v1.1
 *     description: 输入knowid  根据rtype，version筛选资源，分别对weight，difficulty，create_time排序
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowid
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: rtype
 *         description: 资源类型
 *         in: query
 *         required: false
 *         type: string
 *       - name: version
 *         description: 资源版本
 *         in: query
 *         required: false
 *         type: string
 *       - name: tag
 *         description: tag=1，weight降序；tag=2，difficulty升序；tag=3，create_time降序
 *         in: query
 *         required: false
 *         type: integer
 *       - name: count
 *         description: 一页呈现数据的条数
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: 第几页呈现的数据
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           $ref: '#/definitions/resourceSelect_v1_1'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_resource/resourceSelect_v1_1',knowledge_resource.resourceSelect_v1_1);


/**
 * @swagger
 * /api_v1.1/knowledge_resource/resourceDetail_v1_1:
 *   get:
 *     tags:
 *       - knowledge_resource-v1.1
 *     description: 输入r_id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: r_id
 *         description: r_id
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           $ref: '#/definitions/resourceDetail_v1_1'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_resource/resourceDetail_v1_1',knowledge_resource.resourceDetail_v1_1);

/**
 * @swagger
 * /api_v1.1/knowledge_resource/resource2Detail_v1_1:
 *   get:
 *     tags:
 *       - knowledge_resource-v1.1
 *     description: 输入r_id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: r_id
 *         description: r_id
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           $ref: '#/definitions/resource2Detail_v1_1'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_resource/resource2Detail_v1_1',knowledge_resource.resource2Detail_v1_1);


/**
* @swagger
* definitions:
*   resourceEdit_v1_1:
*     properties:
*       r_id:
*         type: integer
*       r_name:
*         type: string
*       r_desc:
*         type: string
*       rtype:
*         type: string
*       r_key:
*         type: string
*       field:
*         type: string
*       grade:
*         type: string
*       subject:
*         type: string
*       difficulty:
*          type: string
*/
/**
 * @swagger
 * /api_v1.1/knowledge_resource/resourceEdit_v1_1:
 *   put:
 *     tags:
 *       - knowledge_resource-v1.1
 *     description: 根据r_id 编辑资源，r_id,r_name,r_desc,rtype,r_key,grade,subject,field,difficulty
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: resourceEdit
 *         description: resourceEdit
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/resourceEdit_v1_1'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.put('/knowledge_resource/resourceEdit_v1_1',knowledge_resource.resourceEdit_v1_1);

/**
 * @swagger
 * /api_v1.1/knowledge_resource/weightEdit_v1_1:
 *   get:
 *     tags:
 *       - knowledge_resource-v1.1
 *     description: 输入r_id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowid
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: r_id
 *         description: r_id
 *         in: query
 *         required: true
 *         type: integer
 *       - name: uid
 *         description: uid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: weight
 *         description: weight
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           $ref: '#/definitions/weightEdit_v1_1'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_resource/weightEdit_v1_1',knowledge_resource.weightEdit_v1_1);

/**
 * @swagger
 * /api_v1.1/knowledge_resource/peopleMarkDetail_v1_1:
 *   get:
 *     tags:
 *       - knowledge_resource-v1.1
 *     description: 输入knowid,r_id众智详情
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowid
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: r_id
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           $ref: '#/definitions/peopleMarkDetail_v1_1'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_resource/peopleMarkDetail_v1_1',knowledge_resource.peopleMarkDetail_v1_1);

/**
 * @swagger
 * /api_v1.1/knowledge_resource/resourceRelationDelete_v1_1:
 *   delete:
 *     tags:
 *       - knowledge_resource-v1.1
 *     description: 输入knowid,r_id删除关联
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowid
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: r_id
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           $ref: '#/definitions/resourceRelationDelete_v1_1'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.delete('/knowledge_resource/resourceRelationDelete_v1_1',knowledge_resource.resourceRelationDelete_v1_1);

/**
 * @swagger
 * /api_v1.1/knowledge_resource/structidResource:
 *   get:
 *     tags:
 *       - knowledge_resource-v1.1
 *     description: 输入knowid   输出title、r_id、r_name、r_type、r_desc、file_url、answer、difficulty、create_time、contribute、r_size、weight
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: structid
 *         description: structid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: count
 *         description: count
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: page
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           $ref: '#/definitions/structidResource'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_resource/structidResource',knowledge_resource.structidResource);

/**
 * @swagger
 * /api_v1.1/knowledge_resource/resourceSelectStruct:
 *   get:
 *     tags:
 *       - knowledge_resource-v1.1
 *     description: 输入knowid  根据rtype，version筛选资源，分别对weight，difficulty，create_time排序
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: structid
 *         description: structid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: rtype
 *         description: 资源类型
 *         in: query
 *         required: false
 *         type: string
 *       - name: version
 *         description: 资源版本
 *         in: query
 *         required: false
 *         type: string
 *       - name: tag
 *         description: tag=1，weight降序；tag=2，difficulty升序；tag=3，create_time降序
 *         in: query
 *         required: false
 *         type: integer
 *       - name: count
 *         description: 一页呈现数据的条数
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: 第几页呈现的数据
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           $ref: '#/definitions/resourceSelectStruct'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_resource/resourceSelectStruct',knowledge_resource.resourceSelectStruct);

/**
 * @swagger
 * /api_v1.1/mark_management/allMarkDetail:
 *   get:
 *     tags:
 *       - mark_management-v1.1
 *     description: 手动添加知识点--by bing
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowid
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: r_id
 *         description: r_id
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/allMarkDetail'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/mark_management/allMarkDetail',mark_management.allMarkDetail);

/**
 * @swagger
 * /api_v1.1/mark_management/experienceUpdate:
 *   get:
 *     tags:
 *       - mark_management-v1.1
 *     description: 经验提升
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: uid
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/experienceUpdate'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/mark_management/experienceUpdate',mark_management.experienceUpdate);

/**
 * @swagger
 * /api_v1.1/mark_management/people_mark_weightUpdate:
 *   get:
 *     tags:
 *       - mark_management-v1.1
 *     description: 众智权重更新
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowid
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: r_id
 *         description: r_id
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/people_mark_weightUpdate'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/mark_management/people_mark_weightUpdate',mark_management.people_mark_weightUpdate)

/**
 * @swagger
 * /api_v1.1/mark_management/allTask:
 *   get:
 *     tags:
 *       - mark_management-v1.1
 *     description: 任务推送
 *     produces:
 *       - application/json
 *     parameters:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/allTask'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/mark_management/allTask',mark_management.allTask);

/**
 * @swagger
 * /api_v1.1/mark_management/resourcePush:
 *   get:
 *     tags:
 *       - mark_management-v1.1
 *     description: 任务推送
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tag
 *         description: tag
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/resourcePush'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/mark_management/resourcePush',mark_management.resourcePush);

/**
 * @swagger
 * /api_v1.1/mark_management/user_mark_knowresWeight:
 *   get:
 *     tags:
 *       - mark_management-v1.1
 *     description: 任务推送
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowid
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: r_id
 *         description: r_id
 *         in: query
 *         required: true
 *         type: integer
 *       - name: uid
 *         description: uid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: weight
 *         description: weight
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/resourcePush'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/mark_management/user_mark_knowresWeight',mark_management.user_mark_knowresWeight);

/**
 * @swagger
 * /api_v1.1/mark_management/people_mark_creditUpdate:
 *   get:
 *     tags:
 *       - mark_management-v1.1
 *     description: 众智置信度更新
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowid
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: r_id
 *         description: r_id
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/people_mark_creditUpdate'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/mark_management/people_mark_creditUpdate',mark_management.people_mark_creditUpdate);

/**
 * @swagger
 * /api_v1.1/mark_management/myTask:
 *   get:
 *     tags:
 *       - mark_management-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: uid
 *         description: uid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: count
 *         description: 项数
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: 页码
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/myTask'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/mark_management/myTask',mark_management.myTask)

/**
 * @swagger
 * /api_v1.1/mark_management/myTaskClassify:
 *   get:
 *     tags:
 *       - mark_management-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: uid
 *         description: uid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: count
 *         description: 项数
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: 页码
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/myTask'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/mark_management/myTaskClassify',mark_management.myTaskClassify)

/**
 * @swagger
 * /api_v1.1/mark_management/userCreditRecord:
 *   get:
 *     tags:
 *       - mark_management-v1.1
 *     description: 用户置信度变化
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: uid
 *         description: uid
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/userCreditRecord'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/mark_management/userCreditRecord',mark_management.userCreditRecord)

/**
 * @swagger
 * /api_v1.1/mark_management/userMarkAccuracy:
 *   get:
 *     tags:
 *       - mark_management-v1.1
 *     description: 用户置信度变化
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowid
 *         description: uid
 *         in: query
 *         required: true
 *         type: integer
 *       - name: r_id
 *         description: uid
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/userMarkAccuracy'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/mark_management/userMarkAccuracy',mark_management.userMarkAccuracy)

/**
 * @swagger
 * /api_v1.1/apiPackage/knowKeyWord:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowcontent
 *         description: knowcontent
 *         in: query
 *         required: true
 *         type: string
 *         schema:
 *           type: object
 *           $ref: '#/definitions/knowKeyWord'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/knowKeyWord',apiPackage.knowKeyWord)

/**
 * @swagger
 * /api_v1.1/apiPackage/knowResWeight:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: rcontent
 *         description: rcontent
 *         in: query
 *         required: true
 *         type: string
 *         schema:
 *           type: object
 *           $ref: '#/definitions/knowResWeight'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/knowResWeight',apiPackage.knowResWeight)

/**
 * @swagger
 * /api_v1.1/apiPackage/knowledgeRelationSelect:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: keyword
 *         description: 
 *         in: query
 *         required: true
 *         type: string
 *       - name: field
 *         description: 
 *         in: query
 *         required: true
 *         type: string
 *       - name: pagek
 *         description: 
 *         in: query
 *         required: true
 *         type: integer
 *       - name: countk
 *         description: 
 *         in: query
 *         required: true
 *         type: integer
 *       - name: subject
 *         description: 
 *         in: query
 *         required: true
 *         type: string
 *       - name: name
 *         description: 
 *         in: query
 *         required: true
 *         type: string
 *       - name: grade
 *         description: 
 *         in: query
 *         required: true
 *         type: string
 *       - name: description
 *         description: 
 *         in: query
 *         required: true
 *         type: string
 *       - name: count
 *         description: count
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: page
 *         in: query
 *         required: true
 *         type: integer
 *       - name: uid
 *         description: uid
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/knowledgeRelationSelect'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/knowledgeRelationSelect',apiPackage.knowledgeRelationSelect)

/**
 * @swagger
 * /api_v1.1/apiPackage/getMultisourceInfo:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowid
 *         description: knowid
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/getMultisourceInfo'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/getMultisourceInfo',apiPackage.getMultisourceInfo)

/**
 * @swagger
 * /api_v1.1/apiPackage/yangzhen:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowledgeInfo
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: string
 *       - name: count
 *         description: count
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: page
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/yangzhen'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/yangzhen',apiPackage.yangzhen)

/**
* @swagger
* definitions:
*   liujiamin:
*     properties:
*       keyWord:
*         type: string
*       scope:
*         type: string
*       field:
*         type: string
*       r_grade:
*         type: string
*       subject:
*         type: string
*       name:
*         type: string
*       description:
*         type: string
*       
*/
/**
 * @swagger
 * /api_v1.1/apiPackage/liujiamin:
 *   put:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           $ref: '#/definitions/liujiamin'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.put('/apiPackage/liujiamin',apiPackage.liujiamin);

/**
 * @swagger
 * /api_v1.1/apiPackage/getRecommendByKnow:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowId
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: k
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: IsKnowId
 *         description: 0代表structid，1代表knowid
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/getRecommendByKnow'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/getRecommendByKnow',apiPackage.getRecommendByKnow)

/**
 * @swagger
 * /api_v1.1/apiPackage/getRecommendByRid:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Rid
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: k
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/getRecommendByRid'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/getRecommendByRid',apiPackage.getRecommendByRid)

/**
 * @swagger
 * /api_v1.1/apiPackage/getRecommendByKnowForV:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: KnowId
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: Version
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: string
 *       - name: k
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: IsKnowId
 *         description: 0代表structid，1代表knowid
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/getRecommendByKnowForV'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/getRecommendByKnowForV',apiPackage.getRecommendByKnowForV)


/**
 * @swagger
 * /api_v1.1/apiPackage/getRecommendByRidForV:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Rid
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: Version
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: string
 *       - name: k
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/getRecommendByRidForV'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/getRecommendByRidForV',apiPackage.getRecommendByRidForV)
/**
 * @swagger
 * /api_v1.1/apiPackage/sendRequestforRenJiaoPublish:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: username
 *         in: query
 *         required: true
 *         type: string
 *       - name: password
 *         description: password
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/sendRequestforRenJiaoPublish',apiPackage.sendRequestforRenJiaoPublish)
/**
 * @swagger
 * /api_v1.1/apiPackage/getRecommendByKnowForUser:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: UserId
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: KnowId
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: k
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: IsKnowId
 *         description: 0代表structid，1代表knowid
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/getRecommendByKnowForUser'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/getRecommendByKnowForUser',apiPackage.getRecommendByKnowForUser)

/**
 * @swagger
 * /api_v1.1/apiPackage/getRecommendByRidForUser:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: UserId
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: Rid
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: k
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/getRecommendByKnowForUser'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/getRecommendByRidForUser',apiPackage.getRecommendByRidForUser)

/**
 * @swagger
 * /api_v1.1/apiPackage/getRecommendForUserInSearch:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: UserId
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: subject
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: string
 *       - name: field
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: string
 *       - name: grade
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: string
 *       - name: k
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/getRecommendByKnowForUser'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/getRecommendForUserInSearch',apiPackage.getRecommendForUserInSearch)
/**
 * @swagger
 * /api_v1.1/apiPackage/getRelationK:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: KnowId
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: IsKnowId
 *         description: 0代表structid，1代表knowid
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/getRecommendByKnow'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/getRelationK',apiPackage.getRelationK)
/**
 * @swagger
 * /api_v1.1/apiPackage/getRelationKByRid:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Rid
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/getRecommendByKnow'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/getRelationKByRid',apiPackage.getRelationKByRid)
/**
 * @swagger
 * /api_v1.1/apiPackage/getRelationKWithUser:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: UserId
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: KnowId
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: IsKnowId
 *         description: 0代表structid，1代表knowid
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/getRecommendByKnowForUser'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/getRelationKWithUser',apiPackage.getRelationKWithUser)
/**
 * @swagger
 * /api_v1.1/apiPackage/getRelationKByRidWithUser:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: UserId
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *       - name: Rid
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/getRecommendByKnowForUser'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/getRelationKByRidWithUser',apiPackage.getRelationKByRidWithUser)
/**
 * @swagger
 * /api_v1.1/apiPackage/getSimUser:
 *   get:
 *     tags:
 *       - apiPackage-v1.1
 *     description: 我的任务
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: UserId
 *         description: knowledgeInfo
 *         in: query
 *         required: true
 *         type: integer
 *         schema:
 *           type: object
 *           $ref: '#/definitions/getRecommendByKnowForUser'
 *     responses:
 *       200:
 *         description: An array of relation_res
 */
router.get('/apiPackage/getSimUser',apiPackage.getSimUser)
/**
* @swagger
* definitions:
*   KnowledgeRelation:
*     properties:
*       knowid:
*         type: integer
*       structid:
*         type: integer
*       contain_child:
*         type: string
*/
/**
 * @swagger
 * /api_v1.1/knowledge_struct_rela_know/addKnowledgeRelations:
 *   post:
 *     tags:
 *       - knowledge_struct_rela_know-v1.1
 *     description: 通过知识点knowid和节点structid建立节点和知识点关联关系（即节点关联知识点）--by bing
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: JsonArray
 *         description: knowledge object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/KnowledgeRelation'
 *     responses:
 *       200:
 *         description: Successfully 
 */
router.post('/knowledge_struct_rela_know/addKnowledgeRelations', knowledge_struct_rela_know.addKnowledgeRelations);

/**
 * @swagger
 * /api_v1.1/knowledge_struct_rela_know/deleteKnowledgeRelations:
 *   get:
 *     tags:
 *       - knowledge_struct_rela_know-v1.1
 *     description: 通过mapid删除知识地图-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: knowid
 *        description: knowid
 *        in: query
 *        required: true
 *        type: integer
 *      - name: structid
 *        description: structid
 *        in: query
 *        required: true
 *        type: integer     
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct_rela_know/deleteKnowledgeRelations',knowledge_struct_rela_know.deleteKnowledgeRelations);


/**
 * @swagger
 * /api_v1.1/knowledge/getKonwldedgeStorageStruct1:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: 通过学科知识库获取echart结构-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: subject
 *        description: subject
 *        in: query
 *        required: true
 *        type: string
 *      - name: grade
 *        description: grade
 *        in: query
 *        required: true
 *        type: string   
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge/getKonwldedgeStorageStruct1',knowledge.getKonwldedgeStorageStruct1);

/**
 * @swagger
 * /api_v1.1/knowledge/deleteknowid:
 *   get:
 *     tags:
 *       - knowledge-v1.1
 *     description: 通过知识点knowid删除知识点-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: knowid
 *        description: knowid
 *        in: query
 *        required: true
 *        type: integer
 *      - name: pre_knowid
 *        description: pre_knowid
 *        in: query
 *        required: true
 *        type: integer   
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge/deleteknowid',knowledge.deleteknowid);

/**
 * @swagger
 * /api_v1.1/knowledge_struct_index/queryKnowledgeMapbyTVU:
 *   get:
 *     tags:
 *       - knowledge_struct_index-v1.1
 *     description: 通过地图类型，地图版本，用户uid获取我的地图列表（即用户另存为后的地图列表）-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: kmap_type
 *        description: 类型
 *        in: query
 *        required: true
 *        type: string
 *      - name: version
 *        description: 版本
 *        in: query
 *        required: true
 *        type: string
 *      - name: uid
 *        description: 用户
 *        in: query
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct_index/queryKnowledgeMapbyTVU',knowledge_struct_index.queryKnowledgeMapbyTVU);

/**
 * @swagger
 * /api_v1.1/knowledge_struct_index/saveAsAnOtherMaps:
 *   get:
 *     tags:
 *       - knowledge_struct_index-v1.1
 *     description: 通过地图类型，地图版本，用户uid获取我的地图列表（即用户另存为后的地图列表）-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: mapid
 *        description: 地图id
 *        in: query
 *        required: true
 *        type: integer
 *      - name: map_name
 *        description: 地图名称
 *        in: query
 *        required: true
 *        type: string
 *      - name: uid
 *        description: 用户id
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct_index/saveAsAnOtherMaps',knowledge_struct_index.saveAsAnOtherMaps);
/**
 * @swagger
 * /api_v1.1/statisticalAnalysis/subjectCount:
 *   get:
 *     tags:
 *       - statisticalAnalysis-v1.1
 *     description: 统计分析
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: tag
 *        description: tag=1 --resource ,tag=2 --knowledge,tag=3 --knowledge_struct_index
 *        in: query
 *        required: true
 *        type: integer 
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/statisticalAnalysis/subjectCount',statisticalAnalysis.subjectCount);

/**
 * @swagger
 * /api_v1.1/statisticalAnalysis/gradeCount:
 *   get:
 *     tags:
 *       - statisticalAnalysis-v1.1
 *     description: 统计分析
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: tag
 *        description: tag=1 --resource ,tag=2 --knowledge,tag=3 --knowledge_struct_index
 *        in: query
 *        required: true
 *        type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/statisticalAnalysis/gradeCount',statisticalAnalysis.gradeCount);

/**
 * @swagger
 * /api_v1.1/statisticalAnalysis/rtypeCount:
 *   get:
 *     tags:
 *       - statisticalAnalysis-v1.1
 *     description: 统计分析
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/statisticalAnalysis/rtypeCount',statisticalAnalysis.rtypeCount);

/**
 * @swagger
 * /api_v1.1/statisticalAnalysis/versionCount:
 *   get:
 *     tags:
 *       - statisticalAnalysis-v1.1
 *     description: 统计分析
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/statisticalAnalysis/versionCount',statisticalAnalysis.versionCount);

/**
 * @swagger
 * /api_v1.1/statisticalAnalysis/allCount:
 *   get:
 *     tags:
 *       - statisticalAnalysis-v1.1
 *     description: 统计分析
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tag
 *         description: //tag=1 --resource ,tag=2 --knowledge,tag=3 --knowledge_struct_index
 *         in: query
 *         required: true
 *         type: integer 
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/statisticalAnalysis/allCount',statisticalAnalysis.allCount);

/**
 * @swagger
 * /api_v1.1/statisticalAnalysis/selectCount:
 *   get:
 *     tags:
 *       - statisticalAnalysis-v1.1
 *     description: 统计分析
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tag
 *         description: //tag=1 --resource ,tag=2 --knowledge,tag=3 --knowledge_struct_index
 *         in: query
 *         required: true
 *         type: integer
 *       - name: type
 *         description: subject,grade,rtype,version
 *         in: query
 *         required: true
 *         type: string 
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/statisticalAnalysis/selectCount',statisticalAnalysis.selectCount);


/**
 * @swagger
 * /api_v1.1/knowledge_struct_rela_know/getKonwldedgeMapStruct:
 *   get:
 *     tags:
 *       - knowledge_struct_rela_know-v1.1
 *     description: knowledge_struct_rela_know
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mapid
 *         description: 通过mapid获取知识地图echarts层级结构
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct_rela_know/getKonwldedgeMapStruct',knowledge_struct_rela_know.getKonwldedgeMapStruct)

/**
 * @swagger
 * /api_v1.1/knowledge_struct_rela_know/updatemapid:
 *   get:
 *     tags:
 *       - knowledge_struct_rela_know-v1.1
 *     description: update数据
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct_rela_know/updatemapid',knowledge_struct_rela_know.updatemapid)
/**
 * @swagger
 * /api_v1.1/knowledge_struct_rela_know/updateView_url:
 *   get:
 *     tags:
 *       - knowledge_struct_rela_know-v1.1
 *     description: update数据
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct_rela_know/updateView_url',knowledge_struct_rela_know.updateView_url)

/**
 * @swagger
 * /api_v1.1/knowledge_struct_rela_know/updateFileSize:
 *   get:
 *     tags:
 *       - knowledge_struct_rela_know-v1.1
 *     description: update数据
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/knowledge_struct_rela_know/updateFileSize',knowledge_struct_rela_know.updateFileSize)

/**
 * @swagger
 * /api_v1.1/advancedSearch/getQueryResourceDetails:
 *   get:
 *     tags:
 *       - advancedSearch-v1.1
 *     description: 通过知识点id获取资源
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: knowidString
 *         description: 知识点id数组
 *         in: query
 *         required: true
 *         type: string
 *       - name: count
 *         description: 
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: 
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/advancedSearch/getQueryResourceDetails',advancedSearch.getQueryResourceDetails)

/**
 * @swagger
 * /api_v1.1/advancedSearch/queryResourceAndKnowledgeNodes:
 *   get:
 *     tags:
 *       - advancedSearch-v1.1
 *     description: 通过知识点id获取资源
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: field
 *         description: 领域
 *         in: query
 *         required: true
 *         type: string
 *       - name: subject
 *         description: 学科
 *         in: query
 *         required: true
 *         type: string
 *       - name: grade
 *         description: 年级
 *         in: query
 *         required: true
 *         type: string
 *       - name: r_keyKeyword
 *         description: 关键词
 *         in: query
 *         required: true
 *         type: string
 *       - name: nameTitle
 *         description: 名称
 *         in: query
 *         required: true
 *         type: string
 *       - name: description
 *         description: 描述
 *         in: query
 *         required: true
 *         type: string
 *       - name: count
 *         description: 数量
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: 当前页
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/advancedSearch/queryResourceAndKnowledgeNodes',advancedSearch.queryResourceAndKnowledgeNodes);
/**
 * @swagger
 * /api_v1.1/advancedSearch/testDetail:
 *   get:
 *     tags:
 *       - advancedSearch-v1.1
 *     description: 通过知识点id获取资源
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: keys
 *         description: keys
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/advancedSearch/testDetail',advancedSearch.testDetail);

/**
 * @swagger
 * /api_v1.1/outPuter/resourceDetails:
 *   get:
 *     tags:
 *       - outPuter-v1.1
 *     description: 对接人教社的资源接口
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: rtype
 *         description: 资源类型：'网络课程','目录索引','常见问题解答','文献','案例','课件','试卷','试题','素材'
 *         in: query
 *         required: true
 *         type: string
 *       - name: field
 *         description: 领域：'基础教育','高等教育','成人教育'
 *         in: query
 *         required: true
 *         type: string
 *       - name: grade
 *         description: 年级：'高中','初中','小学'
 *         in: query
 *         required: true
 *         type: string
 *       - name: subject
 *         description: 学科：'英语','生物','物理','语文','数学'
 *         in: query
 *         required: true
 *         type: string
 *       - name: count
 *         description: 单页显示的条数
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: 当前页的数
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully
 */
router.get('/outPuter/resourceDetails',outPuter.resourceDetails);

/**
 * @swagger
 * /api_v1.1/outPuter/resourceList:
 *   get:
 *     tags:
 *       - outPuter-v1.1
 *     description: 对接人教社的资源接口目录
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: grade
 *         description: 年级：'高中','初中','小学'
 *         in: query
 *         required: true
 *         type: string
 *       - name: subject
 *         description: 学科：'英语','生物','物理','语文','数学'
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully
 */
router.get('/outPuter/resourceList',outPuter.resourceList);

/**
 * @swagger
 * /api_v1.1/higherSearch/ResourceAndKnowledgeNodes:
 *   get:
 *     tags:
 *       - higherSearch
 *     description: 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: grade
 *         description: 年级：'高中','初中','小学'
 *         in: query
 *         required: true
 *         type: string
 *       - name: subject
 *         description: 学科：'英语','生物','物理','语文','数学'
 *         in: query
 *         required: true
 *         type: string
 *       - name: field
 *         description: 领域：'基础教育','初等教育','高等教育'
 *         in: query
 *         required: true
 *         type: string
 *       - name: keyword
 *         description: 知识点关键词
 *         in: query
 *         required: false
 *         type: string
 *       - name: name
 *         description: 资源名称
 *         in: query
 *         required: false
 *         type: string
 *       - name: description
 *         description: 资源描述
 *         in: query
 *         required: false
 *         type: string
 *       - name: knowledgecount
 *         description: 知识点一页的数量    
 *         in: query
 *         required: true
 *         type: integer
 *       - name: knowledgepage
 *         description: 知识点的页数  
 *         in: query
 *         required: true
 *         type: integer
 *       - name: resourcecount
 *         description: 资源一页的数量 
 *         in: query
 *         required: true
 *         type: integer
 *       - name: resourcepage
 *         description: 资源的页数
 *         in: query
 *         required: true
 *         type: integer
 *       - name: uid
 *         description: 用户id
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully
 */
router.get('/higherSearch/ResourceAndKnowledgeNodes',higherSearch.ResourceAndKnowledgeNodes)
/**
 * @swagger
 * /api_v1.1/knowledge_resource/updateFileSize:
 *   get:
 *     tags:
 *       - updateFileSize
 *     description: 对接人教社的资源接口目录
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: Successfully
 */
router.get('/knowledge_resource/updateFileSize',knowledge_resource.updateFileSize);
/**
 * @swagger
 * /api_v1.1/higherSearch/AllResources:
 *   get:
 *     tags:
 *       - higherSearch
 *     description: 所有数据
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: count
 *         description: 一页显示条数
 *         in: query
 *         required: true
 *         type: integer
 *       - name: page
 *         description: 页数
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully
 */
router.get('/higherSearch/AllResources',higherSearch.AllResources)
module.exports = router;