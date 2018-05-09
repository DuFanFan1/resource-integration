/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_mark_knowres', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    knowid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'knowledge',
        key: 'knowid'
      }
    },
    r_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    weight: {
      type: "DOUBLE(11,2)",
      allowNull: false
    },
    add_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'user_mark_knowres',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
