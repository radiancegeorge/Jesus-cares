module.exports = (sequelize, DataTypes) =>
  sequelize.define("video_upload", {
    heading: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    video_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    document_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
