const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var data = require('../../database/db');
var user = require('../../model/api_v1.1/user');
const User = user(data.testdb, Sequelize);

function login_v1_1(req, res) {
    var userName = req.query.username;
    var passWord = req.query.password;
    User.findOne({
        where: {
            username: userName,
        }
    }).then(result => {
        if (result == null) {
            res.json({ errorcode: '1', msg: 'user no exist' });
        } else {
            if (result.dataValues.password == passWord) {
                res.json({
                    errorcode: '0',
                    uid: result.dataValues.uid,
                    msg: 'login success'
                });
            } else {
                res.json({ errorcode: '1', msg: 'password error' });
            }
        }
    });

};
function getUserInfo_v1_1(req, res) {
    var userName = req.param('username');
    User.findOne({
        where: {
            username: userName,
        }
    }).then(result => {
        if (result == null) {
            res.json({ errorcode: '1', msg: 'user no exist' });
        } else {
            //  console.log(result.dataValues);
            let msg = result.dataValues;
            let hashmap = {};
            hashmap["errorcode"] = "0";
            hashmap["msg"] = msg;
            res.json(hashmap);
        }
    });
};
function updateUserInfo_v1_1(req, res) {
    var userName = req.body.username;
    var email = req.body.email;
    var phoneNum = req.body.mobile_phone;
    var birthday = req.body.birthday;
    var sex = req.body.sex;
    var scope = req.body.scope;
    var grade = req.body.grade;
    var course = req.body.course;
    //判断邮箱是否绑定
    User.findOne({
        where: {
            email: email,
            username: {
                [Op.ne]: userName
            }
        }
    }).then(result => {
        if (result == null) {
            //判断手机号
            User.findOne({
                where: {
                    mobile_phone: phoneNum,
                    username: {
                        [Op.ne]: userName
                    }
                }
            }).then(result => {
                if (result == null) {
                    User.update({
                        email: email,
                        mobile_phone: phoneNum,
                        birthday: birthday,
                        sex: sex,
                        scope: scope,
                        grade: grade,
                        course: course,
                    },
                        {
                            where: {
                                username: userName,
                            }
                        }).then(result => {
                            // console.log(result);
                            if (result == 0) {
                                res.json({ errorcode: '0', msg: 'the same update' });
                            } else {
                                res.json({ errorcode: '0', msg: 'update success' });
                            }
                        });
                } else {
                    res.json({ errorcode: '1', msg: 'phonenum is already used' });
                }
            });

        } else {
            res.json({ errorcode: '1', msg: 'email is already used' });
        }
    });

};
function updateUserPassword_v1_1(req, res) {
    var userName = req.body.username;
    var password = req.body.password;
    var newPassword = req.body.newpassword;
    //查询密码是否正确
    User.findOne({
        where: {
            username: userName,
        }
    }).then(result => {
        if (result == null) {
            res.json({ errorcode: '1', msg: 'user no exist' });
        } else {
            if (result.dataValues.password == password) {
                //修改密码
                User.update({
                    password: newPassword,
                }, {
                        where: {
                            username: userName,
                        }
                    }).then(result => {
                        if(result == null){
                            res.json({ errorcode: '1', msg: 'update fail' });
                        }else if (result == 0) {
                            res.json({ errorcode: '0', msg: 'the same password' });
                        } else {
                            res.json({ errorcode: '0', msg: 'update success' });
                        }
                    })
            } else {
                res.json({ errorcode: '1', msg: 'current password error' });
            }
        }
    });
};

module.exports = {
    login_v1_1: login_v1_1,
    getUserInfo_v1_1: getUserInfo_v1_1,
    updateUserInfo_v1_1: updateUserInfo_v1_1,
    updateUserPassword_v1_1: updateUserPassword_v1_1,
}