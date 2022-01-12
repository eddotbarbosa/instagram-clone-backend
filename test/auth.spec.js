const chai = require('chai');
const request = require('supertest');

const server = require('../src/server.js');

const assert = chai.assert;

setTimeout(function () {
  describe('authentication tests', () => {
    let token;

    before(async () => {
      await request(server)
        .post('/users')
        .send({
          name: 'auth user',
          username: 'authuser',
          email: 'authuser@email.com',
          password: 'authuserkey',
          phone: '',
          avatar: '/img/default-avatar.png',
          biography: '',
          externalUrl: '',
          gender: 'not informed',
          posts: [],
          followers: [],
          following: []
        });

      const signIn = await request(server)
        .post('/auth/signin')
        .send({
          email: 'authuser@email.com',
          password: 'authuserkey'
        });

      token = signIn.body.token;
    });

    after(async() => {
      await request(server)
        .del('/users')
        .set('Authorization', token);
    });

    describe('sign in and sign out', () => {
      it('should sign in user when all fields are corrects', async () => {
        const signIn = await request(server)
          .post('/auth/signin')
          .send({
            email: 'authuser@email.com',
            password: 'authuserkey'
          });

        assert.exists(signIn.body.token);
      });

      it('should sign out user when all fields are corrects', async () => {
        const signOut = await request(server)
          .post('/auth/signout')
          .set('Authorization', token);

        assert.equal(signOut.body.result, 'user successfully signed out!');
      });
    });

    describe('change password', () => {
      it('should change password when all fields are corrects', async () => {
        const changePassword = await request(server)
          .post('/auth/change-password')
          .set('Authorization', token)
          .send({
            currentPassword: 'authuserkey',
            newPassword: 'changeduserkey',
            confirmPassword: 'changeduserkey'
          });

        assert.equal(changePassword.body.result, 'password successfully changed!');
      });
    });

    describe('email verification', () => {
      it('should send a email verification when all fields are corrects', async () =>{
        const emailVerification = await request(server)
          .post('/auth/send-email-verification')
          .set('Authorization', token);

        assert.equal(emailVerification.body.result, 'email verification successfully sended!');
      });
    });

    describe('reset password', () => {
      it('should send a reset password when all fields are corrects', async () => {
        const resetPassword = await request(server)
          .post('/auth/send-reset-password')
          .send({
            email: 'authuser@email.com'
          });

        assert.equal(resetPassword.body.result, 'reset password successfully sended!');
      });
    });

    describe('me', () => {
      it('should return some user infos when all fields are corrects', async () => {
        const user = await request(server)
          .get('/auth/me')
          .set('Authorization', token);

        assert.equal(user.body.status, 'connected');
      });
    });
  });
  run()
}, 2500);
