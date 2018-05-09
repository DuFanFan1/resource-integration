/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('knowledge_res_relation', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    knowid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    r_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
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
    add_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'knowledge_res_relation',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
