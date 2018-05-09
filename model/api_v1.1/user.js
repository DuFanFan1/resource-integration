/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    mobile_phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    birthday: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sex: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    scope: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ''
    },
    grade: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    course: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    created_at: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    updated_at: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    user_identity: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    user_weight: {
      type: "DOUBLE(11,4)",
      allowNull: true
    },
    user_credit: {
      type: "DOUBLE(11,4)",
      allowNull: true
    },
    user_rank: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    user_experience: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    user_mark_accuracy: {
      type: "DOUBLE(11,4)",
      allowNull: true
    }
  }, {
    tableName: 'user',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
