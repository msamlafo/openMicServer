const router = require('express').Router();
const validateSession = require("../middleware/validateSession");
const {Poetry, User, Profile, Comment, PublishRequest} = require("../db");


//create poem
router.post('/create', validateSession, (req, res) =>{
    const poetryPage = {
        title: req.body.title,
        dateCreated: req.body.dateCreated,
        category: req.body.category,
        writeUp: req.body.writeUp,
        poemWriterComment: req.body.poemWriterComment,
        isExternal:req.body.isExternal,
        isPublic: req.body.isPublic,
        publicationRequested: req.body.publicationRequested,
        userId: req.user.id
    };
    console.log(poetryPage);
    
    Poetry.create(poetryPage)
    .then(poetry => res.status(200).json(poetry))
    .catch(err => res.status(200).json({ error: err }))
});

//get all poems
router.get("/", (req,res) => {
    Poetry.findAll()
    .then(poetry => res.status(200).json(poetry))
    .catch(err => res.status(500).json({ error:err }))
});

// get individual poem log by title
router.get('/mine', validateSession, function(req, res){
    Poetry.findAll({
        where: {
            userId: req.user.id }
    })
    .then(poetry => res.status(200).json(poetry))
    .catch(err => res.status(500).json({ error: err}))

});

// get a random poem 
// router.get('/random', function(req, res){
//     Poetry.findAll({
//         where: {
//             userId: req.user.id }
//     })
//     .then(poetry => {
//         if (poetry.length > 0){
//             let poemNum = (poetry.length);
//             let randomPoem = (Math.floor( Math.random() * poemNum ) -1);
//             return res.status(200).json(randomPoem);
//         }
//         else{
//             res.status(200).json([]);
//         }
//     })
//     .catch(err => res.status(500).json({ error: err}))

// });

// router.post("/poemapi", (req, res) =>{
//     fetch("https://poetrydb.org/title/Ozymandias/lines.json", {
//         method: "get",
//         body: JSON.stringify(),
//         headers: new Headers({
//             'Content-Type': 'application/json'
//         })
//         .then(poemapi => res.status(200).json(poemapi))

//     })
//     console.log(res.statusCode);

//     // res.on('data', (data)=>{
//     //     res.status(200).json(data);
//     // })
// })
        

//get poem by id
//not successfully tested
router.get("/:poetryId", (req,res) => {
Poetry.findAll({
    where: {
        id : req.params.poetryId
    },
    include:[
        {
            model:PublishRequest,
            attributes:['publicationApproved']
        },
        { 
            model: User, 
            attributes: ['email'],
            include:[
                {
                    model: Profile,
                    attributes: ['firstName','lastName']
                }
            ]
        }, 
        { 
            model: Comment 
        }
    ]
})
.then(poetry => res.status(200).json(poetry))
.catch(err => res.status(500).json({ error:err }))
});


//update individual's poem
router.put("/:poetryId", validateSession, function (req, res){
    const updatePoetry = {
        title: req.body.title,
        dateCreated: req.body.dateCreated,
        author: req.body.author,
        category: req.body.category,
        writeUp: req.body.writeUp,
        poemWriterComment: req.body.poemWriterComment,
        isExternal:req.body.isExternal,
        isPublic: req.body.isPublic,
        publicationRequested: req.body.publicationRequested,
        userId: req.body.userId
    }
    const query = { where: { id: req.params.poetryId, userId: req.user.id } }

    Poetry.update(updatePoetry, query)
    .then((poetry) => res.status(200).json(poetry))
    .catch((err) => res.status(500).json({error:err}));
});

//delete individual's poem
//testing not successful
router.delete("/:poetryId", validateSession, function (req, res){
    const query = {
        where: { id: req.params.poetryId, userId: req.user.id }
    };
    Poem.destroy(query)
    .then(() => res.status(200).json({ message: "Poem entry removed"}))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;