const chai = require('chai');
const request = require('supertest');

const server = require('../src/server.js');

const assert = chai.assert;

setTimeout(function () {
  describe('post tests', () => {
    let token;

    before(async () => {
      await request(server)
        .post('/users')
        .send({
          name: 'post user',
          username: 'postuser',
          email: 'postuser@email.com',
          password: 'postuserkey',
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
          email: 'postuser@email.com',
          password: 'postuserkey'
        });

      token = signIn.body.token;
    });

    after(async() => {
      await request(server)
        .del('/users')
        .set('Authorization', token);
    });

    describe('post CRUD', () => {
      let postId;

      it('should create a post when all fields are corrects', async () => {
        const post = await request(server)
          .post('/posts')
          .set('Authorization', token)
          .attach('picture', process.cwd() + '/public/images/default-avatar.png')
          .field('description', 'testpost');

        postId = post.body._id

        assert.equal(post.body.description, 'testpost');
      });

      it('should read a post when all fields are corrects', async () => {
        const post = await request(server)
          .get('/posts/' + postId);

        assert.equal(post.body._id, postId);
      });

      it('should update a post when all fields are corrects', async () => {
        const post = await request(server)
          .put('/posts')
          .set('Authorization', token)
          .send({
            post: postId,
            description: 'updated description'
          });

        assert.equal(post.body.description, 'updated description');
      });

      it('should delete a post when all fields are corrects', async () => {
        const post = await request(server)
          .del('/posts')
          .set('Authorization', token)
          .send({
            post: postId
          });

        assert.equal(post.body.result, 'post successfully deleted!');
      });
    });

    describe('like tests', () => {
      let postId;

      before(async () => {
        const post = await request(server)
          .post('/posts')
          .set('Authorization', token)
          .attach('picture', process.cwd() + '/public/images/default-avatar.png')
          .field('description', 'testpost');

        postId = post.body._id;
      });

      after(async () => {
        await request(server)
          .del('/posts')
          .set('Authorization', token)
          .send({
            post: postId
          });
      });

      it('should like a post when all fields are corrects', async () => {
        const post = await request(server)
          .post('/posts/like')
          .set('Authorization', token)
          .send({
            post: postId
          });

        assert.equal(post.body.result, 'like successfully added on post!');
      });

      it('should dislike a post when all fields are corrects', async () => {
        const post = await request(server)
          .post('/posts/like')
          .set('Authorization', token)
          .send({
            post: postId
          });

        assert.equal(post.body.result, 'dislike successfully added on post!');
      });
    });
  });
}, 2500);
