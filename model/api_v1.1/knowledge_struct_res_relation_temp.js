/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('knowledge_struct_res_relation_temp', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    mapid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    structid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    r_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    addtime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'knowledge_struct_res_relation_temp',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
