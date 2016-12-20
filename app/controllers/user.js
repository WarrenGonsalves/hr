var User = require('../models/User');
var request_send = require('request');
var jwt = require('jsonwebtoken');
var config = require('../../config/secrets');
var tokenSecret = config.tokenSecret;

function createJwtToken(user) {
  var data = {
    _id: user._id,
    email: user.email,
    name: user.name,
    type: user.type
  };
  console.log("tokenSecret:",tokenSecret)
  return jwt.sign(data, tokenSecret, { expiresIn: '7 days' });
};

exports.googleAuth = function(req, res) {
  var peopleApiUrl = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + req.body.accessToken;
  var accessToken = req.body.accessToken;
  
  // Step 2. Retrieve profile information about the current user.
  request_send.get({ url: peopleApiUrl, json: true }, function(err, response, profile) {
    if (response.statusCode != 200) {
      return res.status(400).send({message: profile.error_description});
    }
    console.log(profile)
    

    // Step 3a. Link user accounts.
    if (req.headers.authorization) {
      var token = req.headers.authorization.split(' ')[1];

      try {
        payload = jwt.decode(token, config.tokenSecret);
      }
      catch (err) {
        return res.status(400).send({message: "Invalid token"});
      }

      return res.status(202).send({message:"Already logged in"})

    } else {
      // Step 3b. Create a new user account or return an existing one.
      var query_param = {
        $or: [
          {"googleId": profile.sub},
          {"email": profile.email}
        ]
        
      };
      User.findOne(query_param, '+type', function(err, existingUser) {
        if (err) {
          return res.status(400).send({message: err});
        }
        if (existingUser) {
          return res.status(200).send({token: createJwtToken(existingUser)});
        } else {
          var newUser = new User({
            googleId: profile.sub,
            name: profile.name,
            email: profile.email,
            picture: profile.picture
          });
          newUser.save(function(err, newUser) {
            if (err) {
              return res.status(400).send({message: err});
            }
            return res.status(200).send({token: createJwtToken(newUser)});
          });
        }
      });
    }
  });
  // });
}