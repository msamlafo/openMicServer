module.exports=(sequelize, DataTypes) => {
    return sequelize.define('profile', {
        firstName: {
            type:DataTypes.STRING,
            allowNull:true
        },
        lastName: {
            type:DataTypes.STRING,
            allowNull:true
        },
        picUrl: {
            type : DataTypes.STRING
        },
        about: {
            type:DataTypes.STRING
        },
        hobbies: {
            type:DataTypes.STRING
        },
        poemWriterSince: {
            type:DataTypes.DATEONLY
        },
        funFact: {
            type:DataTypes.STRING
        },
        dreamJob: {
            type:DataTypes.STRING
        },
        resumeUpload:{
            type:DataTypes.STRING
        }
    })
};