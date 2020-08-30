const chai = require('chai');
const request = require('supertest');

const server = require('../src/server.js');

const assert = chai.assert;

setTimeout(function () {
  describe('user tests', () => {
    describe('user CRUD', () => {
      it('should create a user when all fields are corrects', async () => {
        const user = await request(server)
          .post('/users')
          .send({
            name: 'crud user',
            username: 'cruduser',
            email: 'cruduser@email.com',
            password: 'cruduserkey'
          });

        assert.equal(user.body.username, 'cruduser');
      });

      it('should read a user when all fields are corrects', async () => {
        const user = await request(server)
          .get('/users/cruduser');

        assert.equal(user.body.username, 'cruduser');
      });

      it('should update a user when all fields are corrects', async () => {
        const signIn = await request(server)
          .post('/auth/signin')
          .send({
            email: 'cruduser@email.com',
            password: 'cruduserkey'
          });

        const user = await request(server)
          .put('/users')
          .set('Authorization', signIn.body.token)
          .send({
            username: 'updatedcruduser'
          });

        assert.equal(user.body.username, 'updatedcruduser');
      });

      it('should delete a user when all fields are corrects', async () => {
        const signIn = await request(server)
          .post('/auth/signin')
          .send({
            email: 'cruduser@email.com',
            password: 'cruduserkey'
          });

        const user = await request(server)
          .del('/users')
          .set('Authorization', signIn.body.token);

        assert.equal(user.body.result, 'user successfully deleted!');
      });
    });
  });
  run();
}, 2500);
