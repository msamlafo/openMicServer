module.exports = (sequelize, DataTypes) => {
  const Issue = sequelize.define('issue', {
    issue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Issue;
};
