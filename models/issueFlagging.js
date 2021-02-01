module.exports=(sequelize, DataTypes) =>{
    const IssueFlagging= (sequelize.define('issueflagging', {
        issue: {
            type: DataTypes.STRING,
            allowNull:true
        }
    }))
    return IssueFlagging;
}