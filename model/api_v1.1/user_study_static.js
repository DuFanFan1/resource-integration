/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_study_static', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    knowid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    addtime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'user_study_static',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
