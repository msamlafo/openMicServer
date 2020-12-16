const validateSession = require("../middleware/validateSession");
const {Request, Poetry, User} = require("../db");
const router = require('express').Router();

//create request
router.post('/create', validateSession, (req, res) =>{
    //get poem
    if(poetryId){
        poetryId=req.body.poetryId;
        console.log("Poem exists!");
    }
    //does poem exist
    //does poem belong to current user

    //is poem public
    //if poem is already public return poem is already public
    //if poem is not public has publication been requested?
    //if it has already been requested res.send(publication already requested)

    const requestPublication = {
        poetryId: req.body.poetryId
    };
    
    Request.create(requestPublication)
    .then(request => {
        //if request creation is successful, update isPublicationRequested to true
        res.status(200).json(request)
    })
    .catch(err => res.status(200).json({ error: err }));
})

//get all requests
router.get("/all", (req, res) =>{
    Request.findAll({include: [{ model:User, as: 'user', attributes: ['name']}]})
    .then(request => res.status(200).json(request))
    .catch(err => res.status(500).json({ error:err }))
})

router.put('/update/:id', validateSession, (req, res) =>{
    const updateRequest = {
        publishRequestId: req.body.publishRequestId,
        requestDate: req.body.requestDate,
        poemId: req.body.poemId,
        hasOriginalContent: req.body.hasOriginalContent,
        noVulgarLanguage: req.body.noVulgarLanguage,
        noGrammaticalError: req.body.noVulgarLanguage,
        editorName: req.body.editorName,
        editorComment: req.body.editorComment,
        publicationApproved,
        decisionDate: req.body.decisionDate
    }
    const query = { where: { publishRequestId: req.params.id, userId: req.user.id } }

    Poetry.update(updateRequest, query)
    .then((updateRequest) => res.status(200).json(updateRequest))
    .catch(err => res.status(500).json({ error:err }));
})

module.exports = router;