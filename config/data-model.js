const db = require('../data/dbConfig.js');

module.exports = {
  add,
  getUsers,
  getTense,
  getVerb,
  getPronoun,
  getObjVerb,
  findBy,
  findById
};

function getUsers() {
  return db('users');
}

function getTense() {
  return db('tense');
}

function getVerb(id, verb_form) {
  return db('verb_list')
  .select('spanish_verb')
  .where( 'verb_id', id )
  .then((verb) => {
    verb = Object.values(verb)[0].spanish_verb
    const word = getObjVerb(verb, verb_form);
    return word
  })
}

function getPronoun(verb_form) {
  return db('pronouns as p')
    .select('p.english', 'p.spanish')
    .where({'p.form_ref': verb_form,})
}

function getObjVerb(verb, verb_form)  {
  let vform = 'v.' + verb_form
  return db('verbs')
    .from('verbs as v')
    .select({answer: vform}, 'v.infinitive', 'v.mood_english', 'v.tense_english', 'v.verb_english', 'v.short_english_verb' )
    .where({ 'v.infinitive': verb, 'v.mood_english': 'Indicative'})
    .first() 
}

function findBy(filter) {
  return db('users').where(filter);
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}

async function add(user) {
  const [id] = await db('users').insert(user);

  return findById(id);
}
