const jwt = require('jsonwebtoken');
const { User } = require('../db');

const validateSession = (req, res, next) => {
  const token = req.headers.authorization;
  console.log('token -->', token);
  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided' });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodeToken) => {
      if (!err && decodeToken) {
        User.findOne({
          where: { id: decodeToken.id },
        })
          .then((user) => {
            //console.log('user -->', user);
            if (!user) throw err;
            console.log('req body-->', req.body);
            console.log('req params-->', req.params);
            req.user = user;
            return next();
          })
          .catch((err) => next(err));
      } else {
        req.errors = err;
        console.log(err);
        return res.status(500).send('Not Authorized');
      }
    });
  }
};
module.exports = validateSession;
