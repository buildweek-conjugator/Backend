const data = require('./data-model');

module.exports = {fetch_verb};

function fetch_verb(req, res, next) {
  const id = req.params; 

  data.getVerb(id)
    .then(verb => {
      console.log(verb);
      next();
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
}

