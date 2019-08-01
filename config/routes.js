const bcrypt = require('bcryptjs');
const data = require('./data-model');
const jwt = require('jsonwebtoken');
const secrets = require('./secrets.js');
// const { fetch_verb } = require('./middleware.js');

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.get('/api/admin/users', user_list);
  server.get('/api/admin/tenses', get_tense);
  server.get('/api/verbs/:id', verb_constraints, fetch_verb, fetch_pronoun, get_verb);
  server.post('/api/register', register);
  server.post('/api/login', login);
};

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


function register(req, res) {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  data.add(user)
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
function randomProperty (obj) {

  // const randoHandler = (obj) => {

  // }

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


  // Use the key to get the corresponding name from the "names" object
  constraint = randoPicker(obj)
  if (constraint) {
    return constraint
  }

  // var keys = Object.keys(obj)
  // console.log(keys)
  // return obj[keys[ keys.length * Math.random() << 0]];
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
      res.word.pronoun = pronoun[0].english
      next();
      })
      .catch(error => {
        console.log(error)
        res.status(500).json('No Bueno!');
      }) 
  }

