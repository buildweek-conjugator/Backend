const bcrypt = require('bcryptjs');
const Users = require('./data-model');
const jwt = require('jsonwebtoken');
const secrets = require('./secrets.js');

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.get('/api/admin/users', user_list);
  server.get('/api/admin/tenses', get_tense);
  server.get('/api/verbs/:id', get_verb);
  server.post('/api/register', register);
  server.post('/api/login', login);
};

function get_tense(req, res) {

  Users.getTense()
    .then(saved => {
      res.status(200).json(saved);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
}

function get_verb(req, res) {
  const { id } = req.params; 
  Users.getVerb(id)
    .then(verb => {
      res.status(200).json(verb);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
}
function user_list(req, res) {
  Users.getUsers()
    .then(saved => {
      res.status(200).json(saved);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
}


function register(req, res) {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
}

function login(req, res) {
  let { email, password } = req.body;
  Users.findBy({ email })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.first_name}!`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
}

function generateToken(user) {
  const jwtPayload = {
    subject: user.id,
    username: user.username
  };

  const jwtOptions = {
    expiresIn: '1d',
  };
  return jwt.sign(jwtPayload, secrets.jwtSecret, jwtOptions);
}
