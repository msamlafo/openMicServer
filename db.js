const Sequelize = require('sequelize');

//create a new instance of sequelize, connecting us to the database
const database = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: !process.env.DATABASE_URL.includes('postgres')
    ? {
        ssl: {
          rejectUnauthorized: false,
          require: true,
        },
      }
    : {},
});

//authenticate that the username and password match, then log into database
database
  .authenticate()
  .then(() => console.log('postgres db is connected!'))
  .catch((err) => console.log(err));

const User = database.import('./models/user');
const Profile = database.import('./models/profile');
const Poetry = database.import('./models/poetry');
const Comment = database.import('./models/comment');
const Publishing = database.import('./models/publishing');
const IssueFlagging = database.import('./models/issue');
const Like = database.import('./models/like');
const Reply = database.import('./models/reply');

User.hasOne(Profile);
Profile.belongsTo(User);

User.hasMany(Poetry);
Poetry.belongsTo(User);

Poetry.hasMany(Comment);
Comment.belongsTo(Poetry);

User.hasMany(Comment);
Comment.belongsTo(User);

User.hasMany(Publishing);
Publishing.belongsTo(User);

Poetry.hasMany(Publishing);
Publishing.belongsTo(Poetry);

Comment.hasMany(Reply);
Reply.belongsTo(Comment);

User.hasMany(Reply);
Reply.belongsTo(User);

User.hasMany(IssueFlagging);
IssueFlagging.belongsTo(User);

Poetry.hasMany(IssueFlagging);
IssueFlagging.belongsTo(Poetry);

User.hasMany(Like);
Like.belongsTo(User);

Poetry.hasMany(Like);
Like.belongsTo(Poetry);

module.exports = {
  database,
  User,
  Comment,
  Profile,
  Publishing,
  Reply,
  Poetry,
  IssueFlagging,
  Like,
};
