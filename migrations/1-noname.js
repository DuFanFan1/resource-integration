'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "resource_type", deps: []
 * createTable "deleteview", deps: []
 * createTable "knowledge_category", deps: []
 * createTable "knowledge_map", deps: []
 * createTable "knowledge_relation", deps: []
 * createTable "knowledge_res_relation", deps: []
 * createTable "knowledge_struct", deps: []
 * createTable "knowledge_struct_ different", deps: []
 * createTable "user_role", deps: []
 * createTable "resource", deps: []
 * createTable "resource_answer", deps: []
 * createTable "knowledge", deps: []
 * createTable "role", deps: []
 * createTable "user_resource_grade", deps: []
 * createTable "user", deps: []
 * createTable "user_action_term", deps: []
 * createTable "user_knowledge_grade", deps: []
 * createTable "user_mark_knowres", deps: []
 * createTable "user_now_study_static", deps: []
 * createTable "user_study_static", deps: []
 * createTable "privilege", deps: [knowledge_category]
 * createTable "role_privilege", deps: [privilege]
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2017-11-16T15:58:41.598Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "resource_type",
            {
                "rtypeid1": {
                    "type": Sequelize.INTEGER(11),
                    "primaryKey": true,
                    "allowNull": false
                },
                "rtype_name": {
                    "type": Sequelize.STRING(100),
                    "allowNull": false
                },
                "parent_id": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "rtype_corder": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "rtype_status": {
                    "type": Sequelize.INTEGER(1),
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "deleteview",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "kmapid": {
                    "type": Sequelize.INTEGER(11),
                    "defaultValue": "0",
                    "allowNull": false
                },
                "kstruct_id": {
                    "type": Sequelize.INTEGER(11),
                    "defaultValue": "0",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "knowledge_category",
            {
                "kcid": {
                    "type": Sequelize.INTEGER(11),
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "kcname": {
                    "type": Sequelize.STRING(255),
                    "allowNull": false
                },
                "parent_id": {
                    "type": Sequelize.INTEGER(11),
                    "unique": true,
                    "allowNull": false
                },
                "kclevel": {
                    "type": Sequelize.INTEGER(2),
                    "allowNull": false
                },
                "kcorder": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "is_del": {
                    "type": Sequelize.INTEGER(1),
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "knowledge_map",
            {
                "kmapid": {
                    "type": Sequelize.INTEGER(11),
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "kmap_name": {
                    "type": Sequelize.STRING(300),
                    "allowNull": false
                },
                "kmap_desc": {
                    "type": Sequelize.STRING(2000),
                    "allowNull": false
                },
                "kmap_people": {
                    "type": Sequelize.STRING(30),
                    "allowNull": false
                },
                "kcid1": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "kcid2": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "kcid3": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "version": {
                    "type": Sequelize.INTEGER(1),
                    "allowNull": false
                },
                "kmap_type": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "is_shared": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "uid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "addtime": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "update_time": {
                    "type": Sequelize.DATE,
                    "allowNull": true
                },
                "click_count": {
                    "type": Sequelize.INTEGER(11),
                    "defaultValue": "0",
                    "allowNull": true
                },
                "edit_count": {
                    "type": Sequelize.INTEGER(11),
                    "defaultValue": "0",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "knowledge_relation",
            {
                "krid": {
                    "type": Sequelize.INTEGER(11),
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "kstruct_id": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "knowid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "knowledge_res_relation",
            {
                "id": {
                    "type": Sequelize.INTEGER(11),
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "kstruct_id": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "knowid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "r_id": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "weight": {
                    "type": Sequelize.DECIMAL,
                    "allowNull": true
                },
                "auto_weight": {
                    "type": Sequelize.DECIMAL,
                    "allowNull": true
                },
                "expert_mark_weight": {
                    "type": Sequelize.DECIMAL,
                    "allowNull": true
                },
                "people_mark_weight": {
                    "type": Sequelize.DECIMAL,
                    "allowNull": true
                },
                "add_time": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "update_time": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "knowledge_struct",
            {
                "kstruct_id": {
                    "type": Sequelize.INTEGER(11),
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "kmap_id": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "title": {
                    "type": Sequelize.STRING(100),
                    "allowNull": false
                },
                "content": {
                    "type": Sequelize.STRING(300),
                    "allowNull": false
                },
                "contribute": {
                    "type": Sequelize.STRING(30),
                    "allowNull": false
                },
                "keywords": {
                    "type": Sequelize.STRING(300),
                    "allowNull": false
                },
                "pre_kstruct_id": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "addtime": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "updatetime": {
                    "type": Sequelize.DATE,
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "knowledge_struct_ different",
            {
                "ksd_id": {
                    "type": Sequelize.INTEGER(11),
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "kmapid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "kmap_extend_id": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "kdel_id": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "kadd_id": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "kedit_id": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "uid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "user_role",
            {
                "id": {
                    "type": Sequelize.INTEGER(11),
                    "primaryKey": true,
                    "allowNull": false
                },
                "userid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "roleid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "resource",
            {
                "r_id": {
                    "type": Sequelize.INTEGER(11),
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "r_name": {
                    "type": Sequelize.STRING(200),
                    "allowNull": false
                },
                "r_desc": {
                    "type": Sequelize.STRING(2000),
                    "allowNull": false
                },
                "r_content": {
                    "type": Sequelize.STRING(200),
                    "allowNull": false
                },
                "r_language": {
                    "type": Sequelize.STRING(100),
                    "allowNull": false
                },
                "r_keyword": {
                    "type": Sequelize.STRING(30),
                    "allowNull": false
                },
                "kcid1": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "kcid2": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "kcid3": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "rtypeid1": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "difficulty": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "contribute": {
                    "type": Sequelize.STRING(100),
                    "allowNull": true
                },
                "purpose": {
                    "type": Sequelize.STRING(100),
                    "allowNull": true
                },
                "size": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "copyright": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "annotation": {
                    "type": Sequelize.STRING(100),
                    "allowNull": true
                },
                "createtime": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "r_status": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "uid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "r_grade": {
                    "type": Sequelize.STRING(30),
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "resource_answer",
            {
                "id": {
                    "type": Sequelize.INTEGER(10),
                    "primaryKey": true,
                    "allowNull": false
                },
                "answer": {
                    "type": Sequelize.STRING(30),
                    "allowNull": false
                },
                "r_id": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "knowledge",
            {
                "knowid": {
                    "type": Sequelize.INTEGER(11),
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "title": {
                    "type": Sequelize.STRING(100),
                    "allowNull": false
                },
                "knowcontent": {
                    "type": Sequelize.STRING(300),
                    "allowNull": false
                },
                "description": {
                    "type": Sequelize.STRING(300),
                    "allowNull": false
                },
                "contribute": {
                    "type": Sequelize.STRING(30),
                    "allowNull": false
                },
                "keywords": {
                    "type": Sequelize.STRING(300),
                    "allowNull": false
                },
                "language": {
                    "type": Sequelize.STRING(11),
                    "allowNull": false
                },
                "applicability": {
                    "type": Sequelize.STRING(11),
                    "allowNull": false
                },
                "importance": {
                    "type": Sequelize.INTEGER(1),
                    "allowNull": false
                },
                "difficulty": {
                    "type": Sequelize.INTEGER(1),
                    "allowNull": false
                },
                "kcid1": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "kcid2": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "kcid3": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "addtime": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "role",
            {
                "id": {
                    "type": Sequelize.INTEGER(11),
                    "primaryKey": true,
                    "allowNull": false
                },
                "name": {
                    "type": Sequelize.STRING(20),
                    "allowNull": false
                },
                "description": {
                    "type": Sequelize.STRING(255),
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "user_resource_grade",
            {
                "id": {
                    "type": Sequelize.INTEGER(255),
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "useid": {
                    "type": Sequelize.INTEGER(23),
                    "allowNull": true
                },
                "resourceid": {
                    "type": Sequelize.INTEGER(23),
                    "allowNull": true
                },
                "grade": {
                    "type": Sequelize.INTEGER(255),
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "user",
            {
                "uid": {
                    "type": Sequelize.INTEGER(11),
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "username": {
                    "type": Sequelize.STRING(20),
                    "allowNull": false
                },
                "password": {
                    "type": Sequelize.STRING(50),
                    "allowNull": false
                },
                "mobile_phone": {
                    "type": Sequelize.STRING(50),
                    "allowNull": true
                },
                "email": {
                    "type": Sequelize.STRING(50),
                    "allowNull": false
                },
                "birthday": {
                    "type": Sequelize.STRING(50),
                    "allowNull": true
                },
                "sex": {
                    "type": Sequelize.INTEGER(1),
                    "allowNull": true
                },
                "status": {
                    "type": Sequelize.INTEGER(1),
                    "allowNull": true
                },
                "role": {
                    "type": Sequelize.INTEGER(1),
                    "allowNull": true
                },
                "scope": {
                    "type": Sequelize.STRING(20),
                    "allowNull": true
                },
                "grade": {
                    "type": Sequelize.STRING(20),
                    "allowNull": true
                },
                "course": {
                    "type": Sequelize.STRING(20),
                    "allowNull": true
                },
                "created_at": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "updated_at": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "user_weight": {
                    "type": Sequelize.DOUBLE(1, 0),
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "user_action_term",
            {
                "Ua_id": {
                    "type": Sequelize.INTEGER(11),
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "uid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "kmapid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "knowid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "r_id": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "device": {
                    "type": Sequelize.STRING(20),
                    "allowNull": true
                },
                "location": {
                    "type": Sequelize.STRING(20),
                    "allowNull": true
                },
                "connettype": {
                    "type": Sequelize.STRING(20),
                    "allowNull": true
                },
                "addtime": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                },
                "collection": {
                    "type": Sequelize.INTEGER(1),
                    "allowNull": true
                },
                "download": {
                    "type": Sequelize.INTEGER(1),
                    "allowNull": true
                },
                "browseTime": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "user_knowledge_grade",
            {
                "id": {
                    "type": Sequelize.INTEGER(255),
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "useid": {
                    "type": Sequelize.INTEGER(23),
                    "allowNull": true
                },
                "resourceid": {
                    "type": Sequelize.INTEGER(23),
                    "allowNull": true
                },
                "grade": {
                    "type": Sequelize.INTEGER(255),
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "user_mark_knowres",
            {
                "id": {
                    "type": Sequelize.INTEGER(11),
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "knowid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "r_id": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "weight": {
                    "type": Sequelize.DOUBLE(11, 0),
                    "allowNull": false
                },
                "add_time": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "update_time": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "uid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "Status": {
                    "type": Sequelize.INTEGER(1),
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "user_now_study_static",
            {
                "id": {
                    "type": Sequelize.INTEGER(11),
                    "primaryKey": true,
                    "allowNull": false
                },
                "uid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "knowid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "user_study_static",
            {
                "id": {
                    "type": Sequelize.INTEGER(11),
                    "primaryKey": true,
                    "allowNull": false
                },
                "uid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "knowid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "score": {
                    "type": Sequelize.DOUBLE(11, 0),
                    "allowNull": false
                },
                "state": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "privilege",
            {
                "id": {
                    "type": Sequelize.INTEGER(11),
                    "primaryKey": true,
                    "allowNull": false
                },
                "name": {
                    "type": Sequelize.STRING(20),
                    "allowNull": false
                },
                "parentId": {
                    "type": Sequelize.INTEGER(11),
                    "references": {
                        "model": "knowledge_category",
                        "key": "parent_id"
                    },
                    "allowNull": false
                },
                "description": {
                    "type": Sequelize.STRING(255),
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "role_privilege",
            {
                "id": {
                    "type": Sequelize.INTEGER(11),
                    "primaryKey": true,
                    "allowNull": false
                },
                "roleid": {
                    "type": Sequelize.INTEGER(11),
                    "allowNull": false
                },
                "privilegeid": {
                    "type": Sequelize.INTEGER(11),
                    "references": {
                        "model": "privilege",
                        "key": "id"
                    },
                    "allowNull": false
                }
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
