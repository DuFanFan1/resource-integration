/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('structid_res_resource_view', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    structid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    mapid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    knowid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    r_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    r_name: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      defaultValue: ''
    },
    r_desc: {
      type: DataTypes.STRING(3000),
      allowNull: false,
      defaultValue: ''
    },
    r_key: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: ''
    },
    r_language: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: ''
    },
    r_thumb: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: ''
    },
    r_ext: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ''
    },
    field: {
      type: DataTypes.ENUM('基础教育','高等教育','成人教育'),
      allowNull: true,
      defaultValue: '基础教育'
    },
    grade: {
      type: DataTypes.ENUM('高中','初中','小学'),
      allowNull: true,
      defaultValue: '初中'
    },
    subject: {
      type: DataTypes.ENUM('数学','物理','化学','生物'),
      allowNull: true,
      defaultValue: '生物'
    },
    rtype: {
      type: DataTypes.ENUM('网络课程','目录索引','常见问题解答','文献','案例','课件','试卷','试题','素材'),
      allowNull: true,
      defaultValue: '试题'
    },
    difficulty: {
      type: DataTypes.ENUM('困难','中等','简单'),
      allowNull: true,
      defaultValue: '简单'
    },
    version: {
      type: DataTypes.ENUM('全部','苏教版','人教版'),
      allowNull: true,
      defaultValue: '人教版'
    },
    answer: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    purpose: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    annotation: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contribute: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ''
    },
    create_time: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    r_status: {
      type: DataTypes.INTEGER(1).UNSIGNED.ZEROFILL,
      allowNull: true,
      defaultValue: '5'
    },
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    file_url: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    file_oname: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    file_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    file_extension: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    file_url_view_deal: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    file_url_view: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    file_transcoded: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    view_url: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    structpath: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    struct_res_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    knowpath: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    res_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    weight: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    auto_weight: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    expert_mark_weight: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    people_mark_weight: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    people_mark_credit: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    pre_structid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'structid_res_resource_view',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
