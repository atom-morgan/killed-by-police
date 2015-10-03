var bodyParser = require('body-parser');
    User = require('../models/user'),
    Killing = require('../models/killing'),
    jwt = require('jsonwebtoken'),
    config = require('../../config');

var superSecret = config.secret;

module.exports = function(app, express) {

  //API ROUTES
  var apiRouter = express.Router();

  //Authentication routes
  apiRouter.post('/authenticate', function(req, res) {
    User.findOne({
      username: req.body.username
    }).select('name username password').exec(function(err, user) {
      if (err) { throw err; }

      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User was not found.'
        });
      } else if (user) {
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {
          var token = jwt.sign({
            name: user.name,
            username: user.username
          }, superSecret, {
            expiresInMinutes: 1440 //expires in 24 hours
          });

          res.json({
            success: true,
            message: 'Enjoy your token',
            token: token
          });
        }
      }
    });
  });

  apiRouter.route('/users')
    .post(function(req, res) {
      var user = new User();

      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;

      user.save(function(err) {
        if (err) {
          if (err.code == 11000) {
            return res.json({ success: false, message: 'A user with that username already exists '});
          } else {
            return res.send(err);
          }
        }
        res.json({ message: 'User created!' });
      });
    });


  //middleware for all requests
  //apiRouter.use(function(req, res, next) {
    //console.log('Somebody just came to our app!');
    //next();
  //});

  //middleware to verify a token
  apiRouter.use(function(req, res, next) {
    //check header or url params or post params for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    //var token = req.body.token || req.params.token || req.headers['x-access-token'];

    if (token) {
      //verifies secret and checks expiration
      jwt.verify(token, superSecret, function(err, decoded) {
        if (err) {
          return res.status(403).send({
            success: false,
            message: 'Failed to authenticate token.'  });
        } else {
          //save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
      //no token - 403 (access forbidden)
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });

  //test route
  apiRouter.get('/', function(req, res) {
    res.json({ message: 'Welcome to our API!' });
  });

  apiRouter.route('/users')
    .get(function(req, res) {
      User.find({}, function(err, users) {
        if (err) { res.send(err); }
        res.json(users);
      });
    });

  apiRouter.route('/users/:user_id')
    .get(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) { res.send(err); }
        res.json(user);
      });
    })

    .put(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) { res.send(err); }

        if (req.body.name) { user.name = req.body.name; }
        if (req.body.username) { user.username = req.body.username; }
        if (req.body.password) { user.password = req.body.password; }

        user.save(function(err) {
          if (err) { res.send(err); }
          res.json({ message: 'User updated!' });
        });
      });
    })

    .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) { return res.send(err); }
        res.json({ message: 'Successfully deleted!' });
      });
    });

  apiRouter.route('/killings')
    .get(function(req, res) {
      Killing.find({}, function(err, killings) {
        if (err) { res.send(err); }
        res.json(killings);
      });
    });

  apiRouter.route('/killing')
    .post(function(req, res) {
      var killing = new Killing();

      killing.reported_date   = req.body.reported_date;
      killing.geo_state       = req.body.geo_state;
      killing.gender          = req.body.gender;
      killing.race            = req.body.race;
      killing.name            = req.body.name;
      killing.age             = req.body.age;
      killing.source_of_death = req.body.source_of_death;
      killing.kbp_link        = req.body.kbp_link;
      killing.news_link       = req.body.news_link;

      killing.save(function(err) {
        if (err) { res.send(err); }
        res.json({ message: 'Report created!' });
      });
    });

  apiRouter.route('/killing/:id')
    .get(function(req, res) {
      Killing.findById(req.params.id, function(err, killing) {
        if (err) { res.send(err); }
        res.json(killing);
      });
    })

    .put(function(req, res) {
      Killing.findById(req.params.id, function(err, killing) {
        killing.reported_date = req.body.reported_date;
        killing.geo_state = req.body.geo_state;
        killing.gender = req.body.gender;
        killing.race = req.body.race;
        killing.name = req.body.name;
        killing.age = req.body.age;
        killing.source_of_death = req.body.source_of_death;
        killing.kbp_link = req.body.kbp_link;
        killing.news_link = req.body.news_link;

        killing.save(function(err) {
          if (err) { res.send(err); }
          res.json({ success: true, message: 'Report updated!' });
        });
      });
    })

    .delete(function(req, res) {
      Killing.remove({
        _id: req.params.id
      }, function(err, killing) {
        if (err) { return res.send(err); }
        res.json({ success: true, message: 'Successfully deleted!' });
      });
    });

  //endpoint to get a user's information
  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

  return apiRouter;

};
