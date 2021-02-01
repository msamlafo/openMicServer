const router = require('express').Router();
const validateSession = require('../middleware/validatesession');
const { IssueFlagging, User, Profile, Poetry } = require('../db');

//create issue
router.post('/', validateSession, (req, res) => {
  try {
    const issueLine = {
      issue: req.body.issue,
      poetryId: req.body.poetryId,
      userId: req.user.id,
    };
    IssueFlagging.create(issueLine)
      .then((issueFlagging) =>
        res.status(200).json({
          data: issueFlagging,
          status: 200,
          message: 'Success',
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

//get all issue
router.get('/',validateSession, (req, res) => {
  try {
      if (req.user.isAdmin) {
          IssueFlagging.findAll({
              include: [
                  {
                      model: User,
                      attributes: ['email', 'id'],
                      include: [
                          {
                            model: Profile,
                            attributes: ['firstName', 'lastName', 'picUrl'],
                          },
                      ],
                  },
                  {
                      model: Poetry,
                      include: [
                          {
                              model: User,
                              attributes: ['email'],
                              include: [
                                  {
                                      model: Profile,
                                      attributes: ['firstName', 'lastName'],
                                  }
                              ]
                          }
                      ]
                  }
              ]
          })
            .then((issueFlagging) =>
              res.status(200).json({
                data: issueFlagging,
                status: 200,
                message: 'Success',
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
          console.log('User is not an admin');
          res.status(401).json({
              data: [],
              status: 401,
              message: 'Not Authorized',
          });
      }
  } catch (error) {
      //exception handling
    console.log(error),
      res.status(500).json({
        data: [],
        status: 500,
        message: 'An error occured.',
      });
  }
});

//get issue by poetryId
router.get('/:poetryId',validateSession,(req,res)=>{
  try {
    IssueFlagging.findAll({
      where:{poetryId: req.params.poetryId}
    })
    .then(issues => res.status(200).json({
      data:issues,
      status:200,
      message:"success"
    }))
    .catch(error => res.status(500).json({
      data:error,
      status:500,
      message:'failed'
    }));
  } catch (error) {
      //exception handling
      console.log(error),
      res.status(500).json({
        data: [],
        status: 500,
        message: 'An error occured.',
      });
  }
});

// update issue
router.put('/:id', validateSession, function (req, res) {
  try {
    const updateIssue = {
      issue: req.body.issue,
    };
    const query = { where: { id: req.params.id, userId: req.user.id } };

    IssueFlagging.update(updateIssue, query)
      .then((issueFlagging) =>
        res.status(200).json({
          data: issueFlagging,
          status: 200,
          message: 'Success',
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
      message: 'An error occured',
    });
  }
});

//delete issue by id
router.delete('/:issueId', validateSession, function (req, res) {
  try {
    const query = {
      where: { 
          id: req.params.issueId, 
          userId: req.user.id 
        },
    };
    IssueFlagging.destroy(query)
      .then(() =>
        res.status(200).json({
          status: 200,
          message: 'Issue entry removed',
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

module.exports = router;
