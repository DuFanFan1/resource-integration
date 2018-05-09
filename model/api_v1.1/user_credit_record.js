module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user_credit_record', {
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
      uid: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      weight: {
        type: "DOUBLE(11,2)",
        allowNull: false
      },
      user_credit: {
        type: "DOUBLE(11,2)",
        allowNull: false
      },
      mark_result: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      mark_time: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      }
    }, {
      tableName: 'user_credit_record',
      timestamps:false,
      paranoid:true,
      underscored:false,
      version:false
    });
  };