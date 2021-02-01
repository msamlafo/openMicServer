const router = require('express').Router();
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validateSession = require('../middleware/validatesessions');
const { Profile, User } = require('../db');
const cloudinary = require('cloudinary');

//get image
router.get('/cloudsign', validateSession, async (req, res) => {
  try {
    const ts = Math.floor(new Date().getTime() / 1000).toString();

    const sig = cloudinary.utils.api_sign_request(
      {
        timestamp: ts,
        upload_preset: 'openMic',
      },
      process.env.CLOUDINARY_SECRET
    );
    res.status(200).json({
      data: { sig, ts },
      status: 200,
      message: 'Signature obtained successfully!',
    });
  } catch (err) {
    console.log('failed to sign', err);
    res.status(500).json({
      data: {},
      status: 500,
      message: 'failed to sign',
    });
  }
});

//update image
router.put('/imageset', validateSession, async (req, res) => {
  try {
    const userProfile = await Profile.findOne({
      where: { userId: req.user.id },
    });
    const result = await userProfile.update({
      picUrl: req.body.url,
    });
    res.status(200).json({
      data: result,
      status: 200,
      message: 'avatar url saved',
    });
  } catch (err) {
    res.status(500).json({
      data: '',
      status: 500,
      message: 'failed to set image',
    });
  }
});

//update resumeUpload
router.put('/resumeset', validateSession, async (req, res) => {
    try {
      const userProfile = await Profile.findOne({
        where: { userId: req.user.id },
      });
      const result = await userProfile.update({
        resumeUpload: req.body.url,
      });
      res.status(200).json({
        data: result,
        status: 200,
        message: 'Resume url saved',
      });
    } catch (err) {
      res.status(500).json({
        data: '',
        status: 500,
        message: 'failed to set resume',
      });
    }
  });



//create user profile
router.post('/', validateSession, (req, res) => {
  try {
    const existingProfile = Profile.findOne({ userId: req.user.id });
    if (existingProfile) {
      res.status(400).json({ error: 'Profile already exists.' });
    } else {
      const profilePage = {
        picUrl: req.body.picUrl,
        about: req.body.about,
        hobbies: req.body.hobbies,
        poemWriterSince: req.body.poemWriterSince,
        funFact: req.body.funFact,
        dreamJob: req.body.dreamJob,
        resumeUpload: req.body.resumeUpload,
      };
      Profile.create(profilePage)
        .then((profile) =>
          res.status(200).json({
            data: profile,
            status: 200,
            message: 'success',
          })
        )
        .catch(() =>
          res.status(500).json({
            data: {},
            status: 500,
            message: err.message,
          })
        );
    }
  } catch (error) {
    // exception handling
    console.log(error);
    res.status(500).json({
      data: {},
      status: 500,
      message: 'An error occured',
    });
  }
});

//Get '/' get individual profile by id
router.get('/mine', validateSession, (req, res) => {
  try {
    let userid = req.user.id;
    Profile.findOne({
      where: { userId: userid },
    })
      .then((profile) =>
        res.status(200).json({
          data: profile,
          status: 200,
          message: 'success',
        })
      )
      .catch((err) =>
        res.status(500).json({
          data: {},
          message: err.message,
          status: 500,
        })
      );
  } catch (error) {
    // exception handling
    console.log(error);
    res.status(500).json({
      data: {},
      message: 'An error occured',
      status: 500,
    });
  }
});

//get all profiles
router.get('/all', validateSession, (req, res) => {
  try {
    if (req.user.isAdmin) {
      Profile.findAll()
        .then((profiles) =>
          res.status(200).json({
            data: profiles,
            message: 'success',
            status: 200,
          })
        )
        .catch((err) =>
          res.status(500).json({
            data: [],
            message: err.message,
            status: 500,
          })
        );
    } else {
      console.log('User is not an admin');
      res.status(401).json({
        data: [],
        status: 401,
        message: 'Not authorized',
      });
    }
  } catch (error) {
    // exception handling
    console.log(error);
    res.status(500).json({
      data: [],
      status: 500,
      message: 'An error occured',
    });
  }
});

//get individual profile for update
router.put('/', validateSession, (req, res) => {
  try {
    console.log('rrerercaacae', req.body);
    const existingProfile = Profile.findOne({
      where: { userId: req.user.id },
    });
    if (existingProfile) {
      const updateProfile = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        about: req.body.about,
        hobbies: req.body.hobbies,
        poemWriterSince: req.body.poemWriterSince || null,
        funFact: req.body.funFact,
        dreamJob: req.body.dreamJob,
      };
      const query = {
        where: {
          userId: req.user.id,
        },
      };
      Profile.update(updateProfile, query)
        .then((profile) =>
          res.status(200).json({
            data: profile,
            status: 200,
            message: 'success',
          })
        )
        .catch((err) =>
          res.status(500).json({
            data: [],
            message: err.message,
            status: 500,
          })
        );
    } else {
      //respond with error saying profile already exists
      console.log('oooooooooo - not found?', req.body);
      res.status(404).json({
        data: [],
        message: 'Profile not found.',
        status: 404,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: [],
      status: 500,
      message: 'An error occured.',
    });
  }
});

//allow individual profiles to be deleted
router.delete('/delete', validateSession, (req, res) => {
  try {
    const query = {
      where: {
        userId: req.user.id,
      },
    };
    Profile.destroy(query)
      .then(() => res.status(200).json({ message: 'Profile entry removed' }))
      .catch((err) =>
        res.status(200).json({
          data: [],
          status: 500,
          message: err.message,
        })
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: [],
      staus: 500,
      message: 'An error occured',
    });
  }
});

// permit admin to delete profile

module.exports = router;
