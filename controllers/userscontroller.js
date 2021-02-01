const router = require('express').Router();
const { User, Profile } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateSession = require('../middleware/validatesessions');

//POST: '/signup' creates a account
router.post('/signup', (req, res) => {
  try {
    console.log('checking request', req.body);
    User.create({
      password: bcrypt.hashSync(req.body.password, 13),
      isAdmin: req.body.isAdmin,
      email: req.body.email,
    })
      //create Profile
      .then((user) =>
        Profile.create({
          userId: user.id,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        })
          .then(() => user)
          .catch((err) =>
            res.status(500).json({
              data: {},
              status: 500,
              message: err.message,
            })
          )
      )
      //log in user
      .then((user) => {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        });
        res.status(200).json({
          data: { 
            user, 
            sessionToken: token 
        },
        status: 200,
        message: 'user was created successfully!',
        });
      })
      .catch((err) =>
        res.status(500).json({
          data: {},
          status: 500,
          message: err.message,
        })
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: {},
      status: 500,
      message: 'An error occured.',
    });
  }
  //create user record
});

//POST 'login' to login user
router.post('/login', (req, res) => {
  try {
    User.findOne({
      where: { email: req.body.email },
    })
      .then((user) => {
        if (user) {
          bcrypt.compare(req.body.password, user.password, (err, matches) => {
            if (matches) {
              const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '7d',
              });
              res.status(200).json({
                data: {
                  user,
                  sessionToken: token,
                },
                status: 200,
                message: 'successfully authenticated',
              });
            } else {
              res.status(502).json({
                data: { error: 'password mismatch' },
                status: 502,
                message: 'password mismatch',
              });
            }
          });
        } else {
          res.status(400).json({
            data: { error: 'Incorrect login credentials' },
            status: 400,
            message: 'Incorrect login credentials',
          });
        }
      })
      .catch((err) =>
        res.status(500).json({
          data: {},
          status: 500,
          message: err.message,
        })
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: {},
      status: 500,
      message: 'An error occured.',
    });
  }
});

//delete user by id
router.delete('/delete', validateSession, (req, res) => {
  try {
    const query = { where: { id: req.user.id } };
    User.destroy(query)
      .then(() =>
        res.status(200).json({
          data: {},
          status: 200,
          message: 'User is removed',
        })
      )
      .catch((err) =>
        res.status(200).json({
          data: {},
          status: 500,
          message: err.message,
        })
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: {},
      status: 500,
      message: 'An error occured. Please try again later',
    });
  }
});

//get one user
router.get('/', validateSession, (req, res) => {
  try {
    User.findAll({
      where: { id: req.user.id },
    })
      .then((user) =>
        res.status(200).json({
          data: user,
          status: 200,
          message: 'success',
        })
      )
      .catch((err) =>
        res.status(500).json({
          data: {},
          status: 500,
          message: err.message,
        })
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: {},
      status: 500,
      message: 'An error occured.',
    });
  }
});

//get all user for admin only
router.get('/all', validateSession, (req, res) => {
  try {
    if (req.user.isAdmin) {
      User.findAll()
        .then((user) =>
          res.status(200).json({
            data: user,
            status: 200,
            message: 'success',
          })
        )
        .catch((err) =>
          res.status(500).json({
            data: {},
            status: 500,
            message: err.message,
          })
        );
    } else {
      res.status(401).json({ error: 'Not Authorized' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: {},
      status: 500,
      message: 'An error occured.',
    });
  }
});

//permit admin to delete user

module.exports = router;
