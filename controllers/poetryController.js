const validateSession = require("../middleware/validate-session");
const User = require("../models/user");
const Poetry = require('..db/').import('../models/poetry');
const Comment = require('../models/comment');
const router = require('express').Router();
// const Op=Sequelize.Op;

//create poem
router.post('/create', validateSession, (req, res) =>{
    const poetryPage = {
        title: req.body.title,
        dateCreated: req.body.dateCreated,
        author: req.body.author,
        category: req.body.category,
        writeUp: req.body.writeUp,
        poemWriterComment: req.body.poemWriterComment,
        isExternal:req.body.isExternal,
        isPublic: req.body.isPublic,
        publicationRequested: req.body.publicationRequested,
        userId: req.body.poetry.id
    }
    Poetry.create(poetryPage)
    .then(poetry => res.status(200).json(poetry))
    .catch(err => res.status(200).json({ error: err }))
})

// get individual poem log by title
router.get('/mine', validateSession, function(req, res){
    let title = req.params.title;
    Poetry.findAll({
        where: { title: title }
    })
    .then(poetry => res.status(200).json(poetry))
    .catch(err => res.status(500).json({ error: err}))

})

//get poem by id
router.get("/:id", (req,res) => {
    let id = req.params.poemId;
Poetry.findAll({
    where: {
        id = poemId
    },
    include:['comments','user']
})
.then(poetry => res.status(200).json(poetry))
.catch(err => res.status(500).json({ error:err }))
})

//get all poems
router.get("/all", (req,res) => {
    Poetry.findAll({ include: [ { model:Comment, as:'comment', attributes: ['name']}, { model:User, as: 'user', attributes: ['name']} ]})
    .then(poetry => res.status(200).json(poetry))
    .catch(err => res.status(500).json({ error:err }))
})

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
        userId: req.body.id
    }
    const query = { where: { id: req.params.id, userId: req.user.id } }

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
})

module.exports = router;