/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('knowledge_struct_rela_know', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    structid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    mapid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    knowid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    preknowid: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    contain_child: {
      type: DataTypes.ENUM('否','是'),
      allowNull: true,
      defaultValue: '否'
    }
  }, {
    tableName: 'knowledge_struct_rela_know',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
