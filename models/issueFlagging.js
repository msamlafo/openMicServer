module.exports=(sequelize, DataTypes) =>{
    const IssueFlagging= (sequelize.define('issueFlagging', {
        issue: {
            type: DataTypes.STRING,
            allowNull:true
        }
    }))
    return IssueFlagging;
}