const router = require('express').Router();
const validateSession = require('../middleware/validatesessions');
const { Like } = require('../db');

// get /poetry /:poetryId all likes for a single poem
router.get('/:poetryId', (req, res) => {
  try {
    Like.findAll({
      where: {
        poetryId: req.params.poetryId,
      },
    })
      .then((like) =>
        res.status(200).json({
          data: like,
          status: 200,
          message: 'Success',
        })
      )
      .catch((err) =>
        res.status(500).json({
          data: [],
          status: 500,
          message: err.message,
        })
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: [],
      status: 500,
      message: 'An error occured.',
    });
  }
});

//get / to get all

//post / to add a like
router.post('/', validateSession, (req, res) => {
  try {
    const likeRequest = {
      like: true,
      poetryId: req.body.poetryId,
      userId: req.user.id,
    };

    Like.create(likeRequest)
      .then((like) =>
        res.status(200).json({
          data: like,
          status: 200,
          messgae: 'success',
        })
      )
      .catch((error) =>
        res.status(500).json({
          data: [],
          status: 500,
          message: error.message,
        })
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: [],
      status: 500,
      message: 'An error occured.',
    });
  }
});

//delete /:id to unlike the record with this id
router.delete('/:poetryId', validateSession, (req, res) => {
  try {
    const query = {
      where: {
        poetryId: req.params.poetryId,
        userId: req.user.id,
      },
    };
    
    Like.destroy(query)
      .then(() =>
        res.status(200).json({
          status: 200,
          message: 'Poetry was unliked',
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
      data: [],
      status: 500,
      message: 'An error occured.',
    });
  }
});

module.exports = router;
