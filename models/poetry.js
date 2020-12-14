module.exports=(sequelize, DataTypes) =>{
    const Poetry= sequelize.define('poetry', {
        title: {
            type: DataTypes.STRING
        },
        dateCreated :{
            type: DataTypes.DATE
        },
        author: {
            type: DataTypes.STRING
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
            type:DataTypes.BOOLEAN
        },
        isPublic:{
            type:DataTypes.BOOLEAN
        },
        publicationRequested: {
            type:DataTypes.BOOLEAN
        }
    })
    return Poetry;
}