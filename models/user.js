module.exports = (sequelize, DataTypes) =>{
    const User = sequelize.define('user', {
        email: {
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        isAdmin: {
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        password: {
            type:DataTypes.STRING,
            allowNull: false
        }
    });
    return User
};