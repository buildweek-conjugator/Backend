
exports.seed = function(knex) {
  return knex('users').insert([
    {email: 'gkando@lambda.com', password: 'test1', first_name: 'George', last_name: 'Kando'},
    {email: 'lzhou@lambda.com', password: 'test1', first_name: 'Lily', last_name: 'Zhou'},
    {email: 'cdelfaus@lambda.com', password: 'test1', first_name: 'Chris', last_name: 'Delfaus'},
    {email: 'kli@lambda.com', password: 'test1', first_name: 'Karen', last_name: 'Li'},

  ]);
};