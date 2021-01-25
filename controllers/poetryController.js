const router = require('express').Router();
const validateSession = require('../middleware/validateSession');
const { Poetry, User, Profile, Comment, PublishRequest,Like } = require('../db');

//create poem
router.post('/', validateSession, (req, res) => {
  try {
    const poetryPage = {
      title: req.body.title,
      category: req.body.category,
      writeUp: req.body.writeUp,
      poemWriterComment: req.body.poemWriterComment,
      userId: req.user.id,
    };
    console.log(poetryPage);

    Poetry.create(poetryPage)
      .then((poetry) =>
        res.status(200).json({
          data: poetry,
          status:200,
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

//get all poems
router.get('/', (req, res) => {
  try {
    Poetry.findAll({
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
      ],
      order: [
          ['title','ASC']
      ]
    })
      .then((poetry) =>
        res.status(200).json({
          data: poetry,
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
  } catch {
    console.log(error);
    res.status(500).json({
      data: [],
      status: 500,
      message: 'An error occured.',
    });
  }
});

// get individual poem log by title
router.get('/mine', validateSession, function (req, res) {
  try {
    Poetry.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: User,
          attributes: ['email'],
          include: [
            {
              model: Profile,
              attributes: ['firstName', 'lastName'],
            },
          ],
        },
      ],
    })
      .then((poetry) =>
        res.status(200).json({
          data: poetry,
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

// get a random poem
// router.get('/random', function(req, res){
//     Poetry.findAll({
//         where: {
//             userId: req.user.id }
//     })
//     .then(poetry => {
//         if (poetry.length > 0){
//             let poemNum = (poetry.length);
//             let randomPoem = (Math.floor( Math.random() * poemNum ) -1);
//             return res.status(200).json(randomPoem);
//         }
//         else{
//             res.status(200).json([]);
//         }
//     })
//     .catch(err => res.status(500).json({ error: err}))

// });

router.get('/poemapi', (req, res) => {
  fetch('https://poetrydb.org/author,title/Shakespeare;Sonnet', {
    method: 'GET',
    //body: JSON.stringify(),
    // headers: new Headers({
    //     'Content-Type': 'application/json'
    // })
    Accept: 'application/json',
    redirect: 'follow',
  })
    .then((result) => result.json())
    .then((externalPoem) => {
      res.status(200).json(externalPoem);
    })
    .catch((error) => console.log('error', error));

  console.log(res.statusCode);

  // res.on('data', (data)=>{
  //     res.status(200).json(data);
  // })
});

//Get poem by title

//get poem by id
router.get('/:poetryId', (req, res) => {
  try {
    Poetry.findOne({
      where: {
        id: req.params.poetryId,
      },
      include: [
        {
          model: PublishRequest,
          attributes: ['isPublicationApproved'],
        },
        {
          model: User,
          attributes: ['email','id'],
          include: [
            {
              model: Profile,
              attributes: ['firstName', 'lastName','picUrl'],
            },
          ],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['email'],
              include: [
                {
                  model: Profile,
                  attributes: ['firstName', 'lastName','picUrl'],
                },
              ],
            },
          ],
        },
        {model: Like}
      ],
      order: [
          [Comment, 'updatedAt', 'DESC']
      ]
    })
      .then((poetry) =>
        res.status(200).json({
          data: poetry,
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

//update individual's poem
// testing not successful
router.put('/:poetryId', validateSession, function (req, res) {
  try {
    //get poem
    Poetry.findOne({
      where: { id: req.params.poetryId },
    })
      .then((poem) => {
        console.log(poem);
        // does poem exist
        if (!poem) {
          console.log('Poem does not exist!');
          res.status(404).json({
            data: {},
            status: 404,
            message: 'Poem not found!',
          });
        }

        //does poem belong to current user
        else if (poem.userId !== req.user.id) {
          console.log(poem, 'I want to see poem');
          console.log('Poem does not belong to user');
          res.status(401).json({
            data: poem,
            status: 401,
            message: 'You do not have the rights to this poem',
          });
        }
        //poem belongs to current user
        else {
          const updatePoetry = {
            title: req.body.title,
            dateCreated: req.body.dateCreated,
            author: req.body.author,
            category: req.body.category,
            writeUp: req.body.writeUp,
            poemWriterComment: req.body.poemWriterComment,
            isExternal: req.body.isExternal,
            isPublic: req.body.isPublic,
            ispublicationRequested: req.body.ispublicationRequested,
          };

          const query = {
            where: { id: req.params.poetryId, userId: req.user.id },
          };

          Poetry.update(updatePoetry, query)
            .then((poetry) =>
              res.status(200).json({
                data: poetry,
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
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          data: {},
          status: 500,
          message: 'An error occured. Please try again later',
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: {},
      status: 500,
      message: 'An error occured.',
    });
  }
});

//delete individual's poem
router.delete('/:poetryId', validateSession, function (req, res) {
  try {
    const query = {
      where: { id: req.params.poetryId, userId: req.user.id },
    };
    Poetry.destroy(query)
      .then(() =>
        res.status(200).json({
          status: 200,
          message: 'Poem entry removed',
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
