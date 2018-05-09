/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_action_term', {
    ua_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    kmapid: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'knowledge_struct_index',
        key: 'mapid'
      }
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
      allowNull: true
    },
    device: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    connettype: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    addtime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    collection: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    download: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    browseTime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'user_action_term',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
