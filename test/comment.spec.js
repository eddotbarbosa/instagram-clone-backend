const chai = require('chai');
const request = require('supertest');

const server = require('../src/server.js');

const assert = chai.assert;

setTimeout(function () {
  describe('comment tests', () => {
    let token, postId;

    before(async () => {
      await request(server)
        .post('/users')
        .send({
          name: 'comment user',
          username: 'commentuser',
          email: 'commentuser@email.com',
          password: 'commentuserkey'
        });

      const signIn = await request(server)
        .post('/auth/signin')
        .send({
          email: 'commentuser@email.com',
          password: 'commentuserkey'
        });

      token = signIn.body.token;

      const post = await request(server)
        .post('/posts')
        .set('Authorization', token)
        .attach('picture', process.cwd() + '/public/images/default-avatar.png')
        .field('description', 'commentpost');

      postId = post.body._id;
    });

    after(async () => {
      await request(server)
        .del('/posts')
        .set('Authorization', token)
        .send({
          post: postId
        });

      await request(server)
        .del('/users')
        .set('Authorization', token);
    });

    describe('comment CRUD', () => {
      let commentId;

      it('should create a comment when all fields are corrects', async () => {
        const comment = await request(server)
          .post('/comments')
          .set('Authorization', token)
          .send({
            post: postId,
            comment: 'test comment'
          });

        commentId = comment.body._id;

        assert.equal(comment.body.comment, 'test comment');
      });

      it('should read a comment when all fields are corrects', async () => {
        const comment = await request(server)
          .get('/comments/' + commentId);

        assert.equal(comment.body.comment, 'test comment');
      });

      it('should update a comment when all fields are corrects', async () => {
        const comment = await request(server)
          .put('/comments')
          .set('Authorization', token)
          .send({
            commentId: commentId,
            comment: 'updated comment'
          });

        assert.equal(comment.body.comment, 'updated comment');
      });

      it('should delete a comment when all fields are corrects', async () => {
        const comment = await request(server)
         .del('/comments')
         .set('Authorization', token)
         .send({
           comment: commentId
         });

        assert.equal(comment.body.result, 'comment successfully deleted!');
      });
    });
  });
}, 2500);
