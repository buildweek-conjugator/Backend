const db = require('../data/dbConfig.js');

module.exports = {
  add,
  getUsers,
  findBy,
  findById
};

function getUsers() {
  return db('users');
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
