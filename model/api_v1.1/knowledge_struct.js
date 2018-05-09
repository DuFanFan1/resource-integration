/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('knowledge_struct', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    structid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    mapid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'knowledge_struct_index',
        key: 'mapid'
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    pre_structid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    keywords: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_knowledge: {
      type: DataTypes.STRING(11),
      allowNull: true,
      defaultValue: '否'
    },
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
    },
    addtime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '2017-10-24 19:54:27'
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    structpath: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    level: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    struct_res_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'knowledge_struct',
      timestamps:false,
      paranoid:true,
      underscored:false,
      version:false
  });
};
