module.exports = (sequelize, DataTypes) => {
  return sequelize.define("blog_post", {
    heading: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
