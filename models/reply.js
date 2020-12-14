module.exports=(sequelize, DataTypes) => {
    const Reply= (sequelize.define('reply', {
        reply: {
            type: DataTypes.STRING,
            allowNull:true
        }    
    }))
    return Reply;
}