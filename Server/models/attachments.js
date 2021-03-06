'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attachments.belongsTo(models.Accounts, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
      // hasMany - Deletedmessage
      Attachments.hasMany(models.Deletedmessage, {
        foreignKey: 'att_id',
        as: 'Deletedmessage'
      })
    }
  };
  Attachments.init({
    // user_id: DataTypes.INTEGER,
    data: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    file_url: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Attachments',
    tableName: 'attachments'
  });
  return Attachments;
};