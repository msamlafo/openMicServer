const router = require('express').Router();
const validateSession = require('../middleware/validatesession');
const { Publishing, Poetry, User } = require('../db');

//create request
router.post('/', validateSession, (req, res) => {
  try {
    //get poem
    Poetry.findOne({
      where: {
        id: req.body.poetryId,
      },
    }).then((poem) => {
      //does poem exist
      if (!poem) {
        console.log('Poem does not exist!');
        res.status(404).json({ message: 'The poem was not found' });
      }
      //does poem belong to current user
      if (poem.userId !== req.user.id) {
        console.log('Poem does not belong to this user');
        res
          .status(401)
          .json({ message: 'You do not have the rights to this poem' });
      }
      //is poem public
      //if poem is already public return poem is already public
      if (poem.isPublic) {
        console.log('Poem is already public to openMic app');
        res.status(200).json({ message: 'Your poem is already public.' });
      } else {
        // Poem is not public
        if (poem.isPublicationRequested) {
          console.log('Publication already requested');
          res.status(200).json({ message: 'Publication already requested' });
        } else {
          // publication is not requested for this poem
          // if no pending request exists for this poem, then create one
          PublishRequest.findOne({ where: { poetryId: poem.id } })
            .then((foundRequest) => {
              // To Do
              // update poetry.isPublicationRequested = true

              if (foundRequest && foundRequest.status === 'pending') {
                updateIsPublicationRequested(poem, res, foundRequest);
              } else {
                // no pending publication exists
                const requestPublication = {
                  poetryId: req.body.poetryId,
                };

                PublishRequest.create(requestPublication)
                  .then((request) => {
                    //if request creation is successful, update isPublicationRequested to true
                    updateIsPublicationRequested(poem, res, request);
                  })
                  .catch((err) => {
                    console.log(
                      'Error occured while updating poetry in publish Request Controller:',
                      err
                    );
                    res.status(500).json({
                      data: [],
                      status: 500,
                      message: 'An error occurred. Please try again later.',
                    });
                  });
              }
            })
            .catch((err) =>
              res.status(500).json({
                data: [],
                status: 500,
                message: 'something went wrong',
              })
            );
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: [],
      status: 500,
      message: 'An error occured.',
    });
  }
});

//get all requests
router.get('/all', (req, res) => {
  try {
    Publishing.findAll({ include: [{ model: User, attributes: ['name'] }] })
      .then((request) =>
        res.status(200).json({
          data: request,
          status: 200,
          message: 'success',
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

//update requestPublication
router.put('/update/:id', validateSession, (req, res) => {
  try {
    const updateRequest = {
      id: req.body.publishRequestId,
      poemId: req.body.poemId,
      hasOriginalContent: req.body.hasOriginalContent,
      noVulgarLanguage: req.body.noVulgarLanguage,
      noGrammaticalError: req.body.noGrammaticalError,
      editorName: req.body.editorName,
      editorComment: req.body.editorComment,
      publicationApproved: req.body.publicationApproved,
      decisionDate: req.body.decisionDate,
    };
    const query = {
      where: { publishRequestId: req.params.id, userId: req.user.id },
    };

    Publishing.update(updateRequest, query)
      .then((request) => {
        res.status(200).json({
          data: request,
          status: 200,
          message: 'success',
        });
      })
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

function updateIsPublicationRequested(poem, res, request) {
  const updatePoem = {
    isPublicationRequested: true,
  };
  const query = { where: { id: poem.id } };

  Poetry.update(updatePoem, query)
    .then((affectedRows) => {
      console.log('affected rows:' + affectedRows);
      if (affectedRows > 0) return res.status(200).json(request);
      res
        .status(500)
        .json({ error: 'Request was created but poetry was not updated' });
    })
    .catch((err) => res.status(500).json({ error: err }));
}

module.exports = router;
