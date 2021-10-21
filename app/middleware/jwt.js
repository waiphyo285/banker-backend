let jwt = require('jsonwebtoken');

let checkToken = (req, res, next) => {
  // Express headers are auto converted to lowercase
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    if (token) {
      jwt.verify(token, "secret123", (err, decoded) => {
        if (err) {
          return res.json({
            status: "FAIL",
            message: 'Token is not valid'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        status: "FAIL",
        message: 'Auth token is not supplied'
      });
    }
  }
  else {
    return res.json({
      status: "FAIL",
      message: 'Auth token is exactly required'
    });
  }
};

module.exports = {
  checkToken: checkToken
}