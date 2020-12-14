const validateSession = require("../middleware/validateSession");
var Sequelize = require('sequelize');
const Profile = require('../db').import('../models/profile');
const router = require('express').Router();
const Op=Sequelize.Op;

//create user profile
router.post('/create', validateSession, (req, res) =>{
    const existingProfile = Profile.findOne({"userId": req.user.id});
    if (existingProfile){
        res.status(400).json({error: 'Profile already exists.'})
    } else {
        const profilePage = {
            picUrl: req.body.picUrl,
            req: req.body.picUrl,
            about: req.body.about,
            hobbies: req.body.hobbies,
            poemWriterSince: req.body.poemWriterSince,
            funFact: req.body.funFact,
            dreamJob: req.body.dreamJob,
            resumeUpload: req.body.resumeUpload
        };
        Profile.create(profilePage)
        .then((profile)=> res.status(200).json(profile))
        .catch(() => res.status(500).json({error: err}));
    }
});

//Get '/' get individual profile by id
router.get('/mine', validateSession, (req, res) =>{
    let userid = req.user.id;
    Profile.findAll({
        where: { owner: userid }
    })
    .then(profile => res.status(200).json(profile))
    .catch(err => res.status(500).json({ error: err}))
})

//get all profiles
router.get('/all', validateSession, (req, res) =>{
    if(req.user.isAdmin){
        Profile.findAll()
        .then(profile => res.status(200).json(profile))
        .catch(err => res.status(500).json({ error: err }))
    }
})

//get one user
router.get('/', validateSession, (req, res) =>{
        Profile.findAll({
            where: {id: req.user.id}
        })
        .then(profile => res.status(200).json(profile))
        .catch(err => res.status(500).json({ error: err }))
})

//get individual profile for update
router.put('/update/:id', validateSession, (req, res) =>{
    const existingProfile = Profile.findOne({ where : {"userId": req.user.id}});
    if (existingProfile){
        const updateProfile = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            req: req.body.picUrl,
            about: req.body.about,
            hobbies: req.body.hobbies,
            poemWriterSince: req.body.poemWriterSince,
            funFact: req.body.funFact,
            dreamJob: req.body.dreamJob,
            resumeUpload: req.body.resumeUpload
        };
        const query = { 
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        }
        Profile.update(updateProfile, query)
        .then((profile) => res.status(200).json(profile)
        )
        .catch((err) => res.status(500).json({ error: err }));
            
    }
    else {
        //respond with error saying profile already exists
        res.status(404).json({ message: "Profile not found." })
    }
})

//allow individual profiles to be deleted
router.delete('/delete', validateSession, (req, res) =>{
    const query = {
        where: {
            userId: req.user.id
        }
    }
    Profile.destroy(query)
    .then(() => res.status(200).json({ message: 'Profile entry removed'}))
    .catch((err) => res.status(200).json({ error: err }));
})
module.exports = router;