/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('knowledgestorage', {
    knowid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      defaultValue: '0'
    },
    pre_knowid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    contribute: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    keywords: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: '中文'
    },
    importance: {
      type: DataTypes.ENUM('不重要','低等重要','中等重要','高等重要','非常重要'),
      allowNull: true
    },
    field: {
      type: DataTypes.ENUM('基础教育','高等教育','成人教育'),
      allowNull: true
    },
    is_knowledge: {
      type: DataTypes.STRING(11),
      allowNull: true,
      defaultValue: '是'
    },
    subject: {
      type: DataTypes.ENUM('数学','语文','物理','生物'),
      allowNull: true
    },
    addtime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    title_0: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'knowledgestorage',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
