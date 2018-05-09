/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('knowledge_struct_index', {
    mapid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    map_name: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    field: {
      type: DataTypes.ENUM('成人教育','高等教育','基础教育'),
      allowNull: false
    },
    grade: {
      type: DataTypes.ENUM('高中','初中','小学'),
      allowNull: false
    },
    subject: {
      type: DataTypes.ENUM('生物','物理','语文','化学','数学'),
      allowNull: false
    },
    version: {
      type: DataTypes.ENUM('主题图','苏教版','自定义地图','人教版'),
      allowNull: true,
      defaultValue: '自定义地图'
    },
    kmap_type: {
      type: DataTypes.ENUM('自定义地图','标准地图'),
      allowNull: false
    },
    is_shared: {
      type: DataTypes.ENUM('不分享','分享'),
      allowNull: false
    },
    is_del: {
      type: DataTypes.ENUM('不删除','删除'),
      allowNull: true,
      defaultValue: '不删除'
    },
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
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
    click_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    edit_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'knowledge_struct_index',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
