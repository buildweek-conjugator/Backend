
exports.seed = function(knex) {
  return knex('users').insert([
    {username: 'gkando', password: 'test1'},
    {username: 'lzhou', password: 'test1'},
    {username: 'cdelfaus', password: 'test1'},
    {username: 'kli', password: 'test1'}
  ]);
};
