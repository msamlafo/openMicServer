const validateSession = require("../middleware/validateSession");
const {Comment} = require("../db");
const router = require('express').Router();

//create comment
//poemId and userId not working
router.post('/create', validateSession, (req, res) =>{
    const commentLine = {
        comment: req.body.comment,
        poemId: req.body.poetryId,
        userId: req.user.id
    }
    Comment.create(commentLine)
    .then(comment => res.status(200).json(comment))
    .catch(err => res.status(200).json({ error: err }))
})

//get all comments
router.get("/", (req,res) => {
    Comment.findAll()
    .then(comment => res.status(200).json(comment))
    .catch(err => res.status(500).json({ error:err }))
})

// get comment by id
//testing not successful
router.get('/:id', validateSession, function(req, res){
    let comment = req.params.id;
    Comment.findAll({
        where: { comment: comment }
    })
    .then(comment => res.status(200).json(comment))
    .catch(err => res.status(500).json({ error: err}))

})


//update individual's comment
//Testing not successful
router.put("/:id", validateSession, function (req, res){
    const updateComment = {
        comment: req.body.comment,
        poetryId: req.body.poetryId, 
        userId: req.body.userId
    }
    const query = { where: { id: req.params.id, userId: req.user.id } }

    Comment.update(updateComment, query)
    .then((comment) => res.status(200).json(comment))
    .catch((err) => res.status(500).json({error:err}));
});

//delete individual's conment
//Testing not successful
router.delete("/:id", validateSession, function (req, res){
    const query = {
        where: { id: req.params.id, userId: req.user.id }
    };
    Comment.destroy(query)
    .then(() => res.status(200).json({ message: "Comment entry removed"}))
    .catch((err) => res.status(500).json({ error: err }));
})

module.exports =router;