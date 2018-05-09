module.exports = function(sequelize, DataTypes) {
  return sequelize.define('knowledge_struct_rela_know_view', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    structid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    mapid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    knowid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    preknowid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    contain_child: {
      type: DataTypes.ENUM('是','否'),
      allowNull: true
    },
  }, {
    tableName: 'knowledge_struct_rela_know_view',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};