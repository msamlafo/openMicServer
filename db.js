const Sequelize = require('sequelize');

//create a new instance of sequelize, connecting us to the database
// const database = new Sequelize(process.env.CONNECTION_STRING);
const database = new Sequelize('openMicServer', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres'
});

//authenticate that the username and password match, then log into database
database.authenticate()
.then(()=> console.log('postgress db is connected!'))
.catch(err=> console.log(err));

const User = database.import('./models/user');
const Profile = database.import('./models/profile');
const Poetry = database.import('./models/poetry');
const Comment = database.import('./models/comment');
const PublishRequest = database.import('./models/publishrequest');
const Reply = database.import('./models/reply');

User.hasOne(Profile);
Profile.belongsTo(User);

User.hasMany(Poetry);
Poetry.belongsTo(User);

Poetry.hasMany(Comment);
Comment.belongsTo(Poetry);

User.hasMany(Comment);
Comment.belongsTo(User);

User.hasMany(PublishRequest)
PublishRequest.belongsTo(User);

Poetry.hasMany(PublishRequest);
PublishRequest.belongsTo(Poetry);

Comment.hasMany(Reply);
Reply.belongsTo(Comment);

User.hasMany(Reply);
Reply.belongsTo(User);

module.exports = {database,User,Comment,Profile,PublishRequest,Reply,Poetry};