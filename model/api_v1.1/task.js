/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('task', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    taskid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    knowid: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'knowledge',
        key: 'knowid'
      }
    },
    r_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'resource',
        key: 'r_id'
      }
    },
    weight: {
      type: "DOUBLE(11,4)",
      allowNull: true
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('表示已标注','表示未标注'),
      allowNull: true
    }
  }, {
    tableName: 'task',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
