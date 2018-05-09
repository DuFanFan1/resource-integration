/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('resknowledgenodedetail', {
    structid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    knowid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      defaultValue: '0'
    },
    structpath: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mapid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'resknowledgenodedetail',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
