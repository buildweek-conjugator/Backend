const db = require('../data/dbConfig.js');
const ref = require('./constants.js');

module.exports = {
  add,
  createSettings,
  getUsers,
  getSettings,
  getTense,
  getVerb,
  getPronoun,
  getObjVerb,
  findBy,
  findById,
  adminUtil,
  updateSettings
};

function adminUtil(){
  return db('user_settings').update({settings: JSON.stringify(ref.defaultSettings)}).where({user_id: 1})
  
}

async function add(user) {
  const id = await db('users').insert(user)
  return id
  // return findById(id)
}

function findById(id) {

return db('users')
  .select('id', 'email', 'first_name', 'last_name')
  .where( { id } ).orWhere({id: id}).orWhere(id)
  .first()
}

function createSettings(newUser){
  return newUser, db('user_settings').insert({ 
    user_id: newUser.id,
    settings: JSON.stringify(ref.defaultSettings)
  })

}

function getSettings(id) {
  return db('user_settings').where( { user_id: id } )
}

function updateSettings(id, changes) {
  console.log(changes)
  return db('user_settings')
    .where({ user_id: id })
    .update({settings: JSON.stringify(changes)});
}

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




