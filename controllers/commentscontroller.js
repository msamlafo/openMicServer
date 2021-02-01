const validateSession = require("../middleware/validatesessions");
const {Comment} = require("../db");
const router = require('express').Router();

//create comment
//poemId and userId not working
router.post('/', validateSession, (req, res) =>{
    try {
        const commentLine = {
            comment: req.body.comment,
            poetryId: req.body.poetryId,
            userId: req.user.id
        }
        Comment.create(commentLine)
        .then(comment => res.status(200).json({
            data:comment,
            status:200,
            message:'Success'
        }))
        .catch(err => res.status(500).json({
            data:[],
            status:500,
            message: err.message
        }))
    } catch (error) {
        console.log(error);
        res.status(500).json({
            data:[],
            status:500, 
            message:'An error occured.'
        })
    }
})

//get all comments
router.get("/", (req,res) => {
    try {
        Comment.findAll()
        .then(comment => res.status(200).json({
            data:comment,
            status:200,
            message:'Sucess'
        }))
        .catch(err => res.status(500).json({
            data:[],
            status:500,
            message: err.message
        }))
    } catch (error){
        console.log(error);
        res.status(500).json({
            data:[],
            status:500, 
            message:'An error occured.'
        })
    }
})

// get comment by id
//testing not successful
router.get('/:id', validateSession, function(req, res){
    try {
        let comment = req.params.id;
        Comment.findAll({
            where: { comment: comment }
        })
        .then(comment => res.status(200).json({
            data:comment,
                status:200,
                message:'Sucess'
        }))
        .catch(err => res.status(500).json({
                data:[],
                status:500,
                message: err.message
        }))
    } catch (error){
        console.log(error);
        res.status(500).json({
            data:[],
            status:500, 
            message:'An error occured.'
        })
    }
})


//update individual's comment
//Testing not successful
router.put("/:id", validateSession, function (req, res){
    try {
        const updateComment = {
            comment: req.body.comment,
        }
        const query = { where: { id: req.params.id, userId: req.user.id } }
    
        Comment.update(updateComment, query)
        .then((comment) => res.status(200).json({
            data:comment,
            status:200,
            message:'Sucess'
        }))
        .catch((err) => res.status(500).json({
            data:{},
            status:500,
            message: err.message
        }));
    } catch(error){
        console.log(error);
        res.status(500).json({
            data:{},
            status:500, 
            message:'An error occured.'
        })
    }
});

//delete issure by id
router.delete("/:id", validateSession, function (req, res){
    try{
        const query = {
            where: { id: req.params.id, userId: req.user.id }
        };
        Comment.destroy(query)
        .then(() => res.status(200).json({  
            status:200,
            message: "Comment entry removed"}))
        .catch((err) => res.status(500).json({
            data:{},
            status:500,
            message: err.message
        }));
    } catch(error){
        console.log(error);
        res.status(500).json({
            data:{},
            status:500, 
            message:'An error occured.'
        })
    }
})

module.exports =router;