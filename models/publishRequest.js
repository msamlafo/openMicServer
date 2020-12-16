module.exports = (sequelize, DataTypes) =>{
    const PublishRequestProcessing = sequelize.define('publishRequest', {
        requestDate: {
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:DataTypes.NOW
        },
        hasOriginalContent: {
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        noVulgarLanguage: {
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        noGrammaticalError: {
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        editorName: {
            type:DataTypes.STRING,
            allowNull:false
        },
        editorComment: {
            type:DataTypes.STRING,
            allowNull:true
        },
        isPublicationApproved: {
            type:DataTypes.BOOLEAN,
            defaultValue:false,
            allowNull:false
        },
        decisionDate: {
            type:DataTypes.DATE,
            allowNull:true
        }
    })
    return PublishRequestProcessing;
}