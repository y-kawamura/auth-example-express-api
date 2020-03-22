const request = require('supertest');
const { expect } = require('chai');

const app = require('../app');
const db = require('../db/connection');

const users = db.get('users');

const user = {
  username: 'user',
  password: 'password',
};

describe('GET /auth', () => {
  it('should response with a message', async () => {
    const response = await request(app)
      .get('/auth')
      .expect(200);
    expect(response.body.message).to.equal('🔐');
  });
});

describe('POST /auth/signup', () => {

  beforeEach(async () => {
    await users.drop();
    await request(app).post('/auth/signup').send(user);
  });

  it('should require a username', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({})
      .expect(422);
    expect(response.body.message).to.equal('"username" is required');
  });

  it('should require a password', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({ username: 'user' })
      .expect(422);
    expect(response.body.message).to.equal('"password" is required');
  });

  it('should create a new user', async () => {
    const newUser = {
      username: 'newuser',
      password: 'password',
    };
    const response = await request(app)
      .post('/auth/signup')
      .send(newUser)
      .expect(200);
    expect(response.body).to.have.property('token');
  });

  it('should not allow a user with an existing username', async () => {
    const duplicatedUser = {
      username: 'user',
      password: 'password',
    };
    const response = await request(app)
      .post('/auth/signup')
      .send(duplicatedUser)
      .expect(409);
    expect(response.body.message).to.equal('That username is already exist. Please choose another one.');
  });
});

describe('POST /auth/login', () => {

  before(async () => {
    await users.drop();
    await request(app).post('/auth/signup').send(user);
  });

  it('should require a username', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({})
      .expect(422);
    expect(response.body.message).to.equal('Unable to login.');
  });

  it('should require a password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'user' })
      .expect(422);
    expect(response.body.message).to.equal('Unable to login.');
  });

  it('should only allow valid users to login', async () => {
    const noUser = {
      username: 'nouser',
      password: 'password',
    };
    const response = await request(app)
      .post('/auth/login')
      .send(noUser)
      .expect(422);
    expect(response.body.message).to.equal('Unable to login.');
  });

  it('should only allow valid password to login', async () => {
    const invalidUser = {
      username: 'user',
      password: 'invalidpassword',
    };
    const response = await request(app)
      .post('/auth/login')
      .send(invalidUser)
      .expect(422);
    expect(response.body.message).to.equal('Unable to login.');
  });

  it('should login with valid user and password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send(user)
      .expect(200);
    expect(response.body).to.have.property('token');
  });

});
