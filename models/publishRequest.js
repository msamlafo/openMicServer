module.exports = (sequelize, DataTypes) =>{
    const PublishRequestProcessing = sequelize.define('publishrequest', {
        requestDate: {
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:DataTypes.NOW
        },
        status: {
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue:'pending'
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
            allowNull:false,
            defaultValue: '',
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