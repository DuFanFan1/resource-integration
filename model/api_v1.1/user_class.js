module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user_class', {
      uid: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      grade: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      ability: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      sense: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
    }, {
      tableName: 'user_class',
      timestamps:false,
      paranoid:true,
      underscored:false,
      version:false
    });
  };