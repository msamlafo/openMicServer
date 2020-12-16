module.exports=(sequelize, DataTypes) =>{
    return sequelize.define('poetry', {
        title: {
            type: DataTypes.STRING
        },
        dateCreated :{
            type: DataTypes.DATE
        },
        category: {
            type: DataTypes.STRING
        },
        writeUp: {
            type: DataTypes.STRING
        },
        poemWriterComment: {
            type: DataTypes.STRING
        },
        isExternal:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        isPublic:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        isPublicationRequested: {
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
    });
}