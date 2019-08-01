const data = require('./data-model');

module.exports = { fetch_verb };

function fetch_verb(id) {
  console.log(id)
  data.getVerb(id)
    .then(verb => {
      console.log(verb);
      return(verb);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
}

