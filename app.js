require('dotenv').config();
const Express = require ('express');
const {database} = require('./db');
const controllers = require('./controllers');
const app = Express();

database.sync();
// database.sync({force:true});

app.use(require('./middleware/headers'));

app.use(Express.json());  //brings in JSON parser for backend

app.use('/user', controllers.UserController);
app.use('/profile', controllers.ProfileController);
app.use('/poetry', controllers.PoetryController);
app.use('/comment', controllers.CommentController);
app.use('/publish', controllers.PublishingController);
app.use('/issueflagging', controllers.IssueFlaggingController);
app.use('/like', controllers.LikeController);



app.listen(process.env.PORT, ()=>{
    console.log(`app is listening on ${process.env.PORT}`);
} )