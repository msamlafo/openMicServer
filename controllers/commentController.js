const validateSession = require("../middleware/validate-session");
const Comment = require('..db/').import('../models/comment');
const router = require('express').Router();

//create comment
router.post('/create', validateSession, (req, res) =>{
    const commentLine = {
        include : [{
        userComment: req.body.userComment,
        poemId: req.body.poem
        }]
    }
    Comment.create(commentLine)
    .then(comment => res.status(200).json(comment))
    .catch(err => res.status(200).json({ error: err }))
})

// get comment by id
router.get('/:id', validateSession, function(req, res){
    let comment = req.params.id;
    Comment.findAll({
        where: { comment: comment }
    })
    .then(comment => res.status(200).json(comment))
    .catch(err => res.status(500).json({ error: err}))

})

//get all comments
router.get("/all", (req,res) => {
    Comment.findAll()
    .then(comment => res.status(200).json(comment))
    .catch(err => res.status(500).json({ error:err }))
})

//update individual's comment
router.put("/update/:id", validateSession, function (req, res){
    const updateComment = {
        userComment: req.body.userComment
    }
    const query = { where: { id: req.params.id, userId: req.user.id } }

    Comment.update(updateComment, query)
    .then((comment) => res.status(200).json(comment))
    .catch((err) => res.status(500).json({error:err}));
});

//delete individual's conment
router.delete("/delete/:id", validateSession, function (req, res){
    const query = {
        where: { id: req.params.id, userId: req.user.id }
    };
    Comment.destroy(query)
    .then(() => res.status(200).json({ message: "Comment entry removed"}))
    .catch((err) => res.status(500).json({ error: err }));
})

module.exports =router;