const bcrypt = require('bcryptjs');
const data = require('./data-model');
const jwt = require('jsonwebtoken');
const secrets = require('./secrets.js');
const ref = require('./constants.js');
// const { fetch_verb } = require('./middleware.js');

const { authenticate } = require('../auth/auth-middleware');

module.exports = server => {
  server.post('/api/register', register, newSettings);
  server.post('/api/login', login);
  server.post('/api/user/settings', settings);

  server.get('/api/user', authenticate, get_user);
  server.get('/api/user/settings', authenticate, fetch_settings);
  server.get('/api/admin/users', user_list);
  server.get('/api/admin/tenses', get_tense);
  server.get('/api/admin/util', admin_util);
  server.get('/api/verbs/:id', verb_constraints, fetch_verb, fetch_pronoun, get_verb);

  server.put('/api/user/settings', authenticate, update_settings);

};

function get_user(req, res){
  let id = { id: req.decoded.subject }
  data.findById(id)
  .then(u => {
    console.log(u)
    res.status(200).json(u);
  })
  .catch(error => {
    console.log(error)
    res.status(500).json(error);
  });
}

function get_tense(req, res) {
  data.getTense()
    .then(saved => {
      res.status(200).json(saved);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
}
function settings(req, res) {
  const userSettings = ref.defaultSettings
  res.status(200).json(userSettings);
  // data.createSettings(userSettings)
  //   .then(settings => {
  //     res.status(200).json(settings);
  //   })
  //   .catch(error => {
  //     console.log(error)
  //     res.status(500).json(error);
  //   });
}

function admin_util(req, res) {
  data.adminUtil()
  .then(r => {
    res.status(200).json(r);
  })
}

async function get_verb(req, res) {
  const word = res.word
    if (word) {
        res.status(200).json(word);
    } else  {
      res.status(404).json({ message: 'Could not fetch verb' })
    } 

}
function user_list(req, res) {
  data.getUsers()
    .then(saved => {
      res.status(200).json(saved);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
}


function register(req, res, next) {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  data.add(user)
    .then(newUser => {
      newUser.settings = ref.defaultSettings;
      res.newUser = newUser;
      next();
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
}

function newSettings(req, res) {
  console.log(res.newUser)
  data.createSettings(res.newUser)
  .then(regRes => {
    res.status(201).json(res.newUser);
  })
}

function fetch_settings(req, res) {
  id = req.decoded.subject
  console.log(id)
  data.getSettings(id)
  .then(s => {
    const settings = {
      id: id,
      settings: JSON.parse(s[0].settings)
    }
    console.log(settings)

    res.status(201).json(settings);
  })
}

function login(req, res) {
  let { email, password } = req.body;
  data.findBy({ email })
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

function update_settings(req, res){
  const changes = req.body;
  let id = { id: req.decoded.subject }

    data.findById(id)
      .then(user => {
        if (user){
        req.user = user
        processUpdate(req, res, user);
        }
    })
    .catch(err => {
      res.status(500).json({ error: err, message: 'No bueno hombre!' });
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

//middleware
function processUpdate (req, res, user){
  let id = req.user.id
  let changes = req.body

  console.log(id, changes)

  data.updateSettings(id, changes)
    .then(updatedSettings => {
      console.log('foo')
      res.status(200).json({
        success: true,
        records_updated: updatedSettings,
        message: 'Hurra! Bueno! ' + user.first_name + ', your settings have been updated.'
      });
    })
    .catch(err => {
      res.status(500).json({ err: err, message: 'Ay dios mio!' });
    });

}

function randomProperty (obj) {
  function randoPicker(obj){
    let flag = false

    let keys = Object.keys(obj)
    let randIndex = Math.floor(Math.random() * keys.length)
    let randKey = keys[randIndex]
    let settingVal = obj[randKey]
    flag = randoChecker(randKey, settingVal)
    if (!flag){
      randomProperty(obj)
    } else {
      let constraint = randKey
      return constraint
    }

    function randoChecker (randKey, settingVal){
      if (settingVal === true) {
        return true
      } else if (settingVal === false) {
        return false
      }
    }
  }

  constraint = randoPicker(obj)
  if (constraint) {
    return constraint
  }

};

async function verb_constraints(req, res, next) {
  const userSettings = {
  'mood': {
    'Indicative': true,
    'Subjunctive': true,
    'Imperative Affirmative': false,
    'Imperative Negative': false
  },
  'tense': {
    'Present': true,
    'Future': true,
    'Imperfect': true,
    'Preterite': true,
    'Conditional': true,
    'Present Perfect': true,
    'Future Perfect': true,
    'Past Perfect': true,
    'Preterite (Archaic)': true,
    'Conditional Perfect': false
  },
  "vosotros" : false
}

const verb_forms = [
  'form_1s', 
  'form_2s',
  'form_3s',
  'form_1p',
  'form_2p',
  'form_3p'
]

  var selected_verb_form = verb_forms[Math.floor(Math.random()*verb_forms.length)];
  req.verb_form = selected_verb_form
  const constraint = () => {
    const result = randomProperty(userSettings.mood)
    if (result){
      req.constraints = result
      next();
    } else {
      constraint();
    }
  }
  constraint();
}



async function fetch_verb(req, res, next) {
console.log(req.verb_form)
  const { id } = req.params;
  const verb_form = req.verb_form
  data.getVerb(id, verb_form)
  .then(word => {
    res.word = word
    next();
    })
    .catch(error => {
      console.log(error)
      res.status(500).json('No Bueno!');
    }) 
}

async function fetch_pronoun(req, res, next) {
    const verb_form = req.verb_form
    data.getPronoun(verb_form)
    .then(pronoun => {
      res.word.pronoun_spanish = pronoun[0].spanish
      res.word.pronoun_english = pronoun[0].english
      next();
      })
      .catch(error => {
        console.log(error)
        res.status(500).json('No Bueno!');
      }) 
  }

