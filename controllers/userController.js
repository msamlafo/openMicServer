const router = require('express').Router();
const User = require('../db').import('../models/user');
const Profile = require('../db').import('../models/profile');
const jwt= require('jsonwebtoken');
const bcrypt= require('bcryptjs');
const validateSession = require('../middleware/validateSession');

//POST: '/signup' creates a account
router.post('/signup', (req, res) =>{
    //create user record
    User.create({
        password: bcrypt.hashSync(req.body.password, 13),
        isAdmin: req.body.isAdmin,
        email: req.body.email
    })
    //create Profile
    .then(user => Profile.create({
            userId: user.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })
        .then(() => user)
        .catch(err => res.status(500).json(err))
    )
    //log in user
    .then(user =>{
        const token = jwt.sign({id: user.id},
        process.env.JWT_SECRET, {expiresIn:"7d"})
        res.json({
            user:user,
            message:"user was created successfully!",
            sessionToken: token
        })
    })
    .catch(err => res.status(500).json(err))
})

//POST 'login' to login user
router.post('/login', (req, res) =>{
    User.findOne({
        where:{email: req.body.email}
    })
    .then(user =>{
        if(user){
            bcrypt.compare(req.body.password, user.password, (err, matches) =>{
                if(matches){
                    const token= jwt.sign({id: user.id},
                    process.env.JWT_SECRET, {expiresIn:"7d"})
                    res.status(200).json({
                        user:user,
                        message: "successfully authenticated",
                        sessionToken:token
                    })
                    }else {
                        res.status(502).json({error: 'password missmatch'})
                }
            })
        } else {
            res.status(500).json({error: 'user not found'});
        }
    })
    .catch(err=> res.status(500).json({error:err}))
})

//delete user by id
router.delete('/delete/', validateSession, (req, res) =>{
    const query = { where: { id: req.user.id } };
    User.destroy(query)
    .then(() => res.status(200).json({ message: 'user is removed' }))
    .catch((err) => res.status(200).json({ error: err }));
})

//get one user
router.get('/', validateSession, (req, res) =>{
    //console.log(req);
    User.findAll({
        where: { id: req.user.id }
    })
    .then((user) => res.status(200).json(user))
    .catch(err => res.status(500).json({ error: err }));
})

//get all usertes
router.get('/all', validateSession, (req, res ) =>{
    if(req.user.isAdmin){
        User.findAll()
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json({ error: err }));
    }
    else{
        res.status(401).json({ error: 'Not Authorized' })
    }
    
})

module.exports= router;