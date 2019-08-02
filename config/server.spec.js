const request = require('supertest'); // << install this as -D

const server = require('../api/server.js'); // << the System Under Test (SUT)

describe('server', () => {
  it('db environment set to testing', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  describe('GET /', function() {
    it('responds with json', function(done) {
      request(server)
        .get('/')
        .expect(200, done);
    });
  });

  describe('GET /', () => {
    it('should return { api: "Conjugator API Status: UP!" } as the body', () => {
      return request(server)
        .get('/')
        .then(res => {
          expect(res.body).toEqual({ api: "Conjugator API Status: UP!" });
          expect(res.body.api).toBe('Conjugator API Status: UP!');
        });
    });
  });
});
