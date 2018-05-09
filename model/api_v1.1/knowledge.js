/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('knowledge', {
    knowid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pre_knowid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    contribute: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: '新兰永恒'
    },
    keywords: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: '中文'
    },
    importance: {
      type: DataTypes.ENUM('不重要','低等重要','中等重要','高等重要','非常重要'),
      allowNull: true,
      defaultValue: '中等重要'
    },
    is_knowledge: {
      type: DataTypes.STRING(11),
      allowNull: true,
      defaultValue: '是'
    },
    field: {
      type: DataTypes.ENUM('基础教育','高等教育','成人教育'),
      allowNull: true,
      defaultValue: '基础教育'
    },
    grade: {
      type: DataTypes.ENUM('高中','初中','小学'),
      allowNull: true,
      defaultValue: '小学'
    },
    subject: {
      type: DataTypes.ENUM('数学','语文','物理','化学','生物'),
      allowNull: true,
      defaultValue: '化学'
    },
    addtime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '2017-11-23 10:02:44'
    },
    updatetime: {
      type: DataTypes.DATE,
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
    level: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'knowledge',
      timestamps:false,
      paranoid:true,
      underscored:false,
      version:false
  });
};
