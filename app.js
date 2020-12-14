require('dotenv').config();
const Express = require ('express');
const database = require('./db');
const controllers = require('./controllers');
const app = Express();

// app.use(Express.static(__dirname + '/public'));
// app.get('/', (req, res)=>{
//     res.render('index');
// })

database.sync();
// database.sync({force:true});
app.use(require('./middleware/headers'))

app.use(Express.json());  //brings in JSON parser for backend

app.use('/user', controllers.UserController);
app.use('/profile', controllers.ProfileController);
// app.use('/poetry', controllers.PoetryController);
// app.use('/comment', controllers.CommentController);
// app.use('/publish', controllers.PublishRequestProcessingController);



app.listen(process.env.PORT, ()=>{
    console.log(`app is listening on ${process.env.PORT}`);
} )