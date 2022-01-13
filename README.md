# Instagram Clone Backend

A REST API that replicates some Instagram features.

## Related Repositories
[Instagram Clone Frontend](https://github.com/eddotbarbosa/instagram-clone-frontend)

## Table of contents
* [Features](#Features)
* [Technologies](#technologies)
* [Getting Started](#Getting-Started)
* [REST API reference](#REST-API-reference)
* [License](#License)

## Features
* users
* authentication
* change password
* email verification
* reset password
* followers
* posts
* comments
* likes
* change avatar
* feed
* tests

## Technologies
* nodejs
* npm
* editorconfig
* eslint
* dotenv
* nodemon
* cors
* express
* body parser
* mongoose
* bcrypt
* mocha
* chai
* supertest
* jsonwebtoken
* nodemailer
* handlebars
* multer
* sharp

## Getting Started
### installation:
```
git init
git clone https://github.com/eddotbarbosa/instagram-clone-backend.git
npm install
```
### configs:
.env
```
PORT="project port number, default value was set to 5000"
DB_URI="your mongoose DB URI"
JWT_SECRET="some secrect key"
```
/src/configs/nodemailer
```
exports.transporter = {
  host: "your smtp host",
  port: smtp port,
  auth: {
    user: "your smtp user",
    pass: "your smtp password"
  }
};
```
### running:
project in dev mode
```
npm run dev
```
tests
```
npm test
```

## REST API reference

### REST API endpoint list:

| HTTP method | URI path | Description |
|-------------|----------|-------------|
| POST | /users | create user |
| GET | /users/:username | read user |
| PUT | /users | update user infos |
| DELETE | /users | delete user |
| POST | /users/follow | follow a user |
| POST | /users/unfollow | unfollow a user |
| GET | /users/:username/followers | read the user followers |
| GET | /users/:username/following | read who the user follows |
| PUT | /users/change-avatar | change user avatar |
| GET | /users/feed | read user feed |
| POST | /auth/signin | sign in user |
| POST | /auth/signout | sign out user |
| POST | /auth/change-password | change user password |
| POST | /auth/send-email-verification | send a email to user to verify the user email |
| POST | /auth/email-verification | applies email verification |
| POST | /auth/send-reset-password | send a email to user to reset user password |
| POST | /auth/reset-password | applies reset password |
| GET | /auth/me | read some user infos |
| POST | /posts | create a post |
| GET | /posts/:post | read a post |
| PUT | /posts | update a post |
| DELETE | /posts | delete a post |
| POST | /posts/like | add or remove like in a post |
| POST | /comments | add a comment in a post |
| GET | /comments/:comment | read a comment |
| PUT | /comments | update a comment |
| DELETE | /comments | delete a comment |


## License
[MIT license.](https://github.com/eddotbarbosa/instagram-clone-backend/blob/master/LICENSE)

