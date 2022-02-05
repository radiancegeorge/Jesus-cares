module.exports = (sequelize, DataTypes) =>
  sequelize.define("admin", {
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: { allowNull: false, type: DataTypes.STRING },
    mail_token: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    exp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
