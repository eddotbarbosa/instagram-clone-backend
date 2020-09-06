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

    describe('followers tests', () => {
      let fisrtUserToken, secondUserToken;

      before(async () => {
        await request(server)
          .post('/users')
          .send({
            name: 'first user',
            username: 'firstuser',
            email: 'firstuser@email.com',
            password: 'firstuserkey'
          });

        await request(server)
          .post('/users')
          .send({
            name: 'second user',
            username: 'seconduser',
            email: 'seconduser@email.com',
            password: 'seconduserkey'
          });

        const firstUser = await request(server)
          .post('/auth/signin')
          .send({
            email: 'firstuser@email.com',
            password: 'firstuserkey'
          });

        const secondUser = await request(server)
          .post('/auth/signin')
          .send({
            email: 'seconduser@email.com',
            password: 'seconduserkey'
          });

        fisrtUserToken = firstUser.body.token;
        secondUserToken = secondUser.body.token;
      });

      after(async () => {
        await request(server)
          .del('/users')
          .set('Authorization', fisrtUserToken);

        await request(server)
          .del('/users')
          .set('Authorization', secondUserToken);
      });

      it('should follow a user when all fields are corrects', async () => {
        const user = await request(server)
          .post('/users/follow')
          .set('Authorization', fisrtUserToken)
          .send({
            username: 'seconduser'
          });

        assert.equal(user.body.result, 'user successfully followed!');
      });

      it('should unfollow a user when all fields are corrects', async () => {
        const user = await request(server)
          .post('/users/unfollow')
          .set('Authorization', fisrtUserToken)
          .send({
            username: 'seconduser'
          });

        assert.equal(user.body.result, 'user successfully unfollowed!');
      });

      it('should read followers when all fields are corrects', async () => {
        const user = await request(server)
          .get('/users/seconduser/followers');

        assert.exists(user.body.followers);
      });

      it('should read following when all fields are corrects', async () => {
        const user = await request(server)
          .get('/users/firstuser/following');

        assert.exists(user.body.following);
      });
    });
  });
  run();
}, 2500);
