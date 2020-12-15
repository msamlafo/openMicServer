const router = require('express').Router();
const validateSession = require("../middleware/validateSession");
const {Poetry, User, Comment} = require("../db");

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

// get individual poem log by title
router.get('/mine', validateSession, function(req, res){
    Poetry.findAll({
        where: {
            userId: req.user.id }
    })
    .then(poetry => res.status(200).json(poetry))
    .catch(err => res.status(500).json({ error: err}))

});

//get poem by id
//not successfully tested
router.get("/:id", (req,res) => {
Poetry.findAll({
    where: {
        id : req.params.poemId
    },
    // include:[{ model: User, attributes: ['fistName'] }, { model: Comment }]
})
.then(poetry => res.status(200).json(poetry))
.catch(err => res.status(500).json({ error:err }))
});

//get all poems
router.get("/all", (req,res) => {
    Poetry.findAll()
    .then(poetry => res.status(200).json(poetry))
    .catch(err => res.status(500).json({ error:err }))
});

// { include: [ { model:Comment }, { model:User, attributes: ['firstName']} ]}

//update individual's poem
router.put("/update/:id", validateSession, function (req, res){
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
    const query = { where: { id: req.params.id, userId: req.user.userId } }

    Poetry.update(updatePoetry, query)
    .then((poetry) => res.status(200).json(poetry))
    .catch((err) => res.status(500).json({error:err}));
});

//delete individual's poem
router.delete("/delete/:id", validateSession, function (req, res){
    const query = {
        where: { id: req.params.id, userId: req.user.id }
    };
    Poem.destroy(query)
    .then(() => res.status(200).json({ message: "Poem entry removed"}))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;