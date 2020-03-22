const request = require('supertest');
const { expect } = require('chai');

const bcrypt = require('bcrypt');
const app = require('../../app');
const db = require('../../db/connection');

const users = db.get('users');

const config = require('../../config');


let tokenAdmin;
let tokenUser;
let userId;

async function setup() {
  await users.insert({
    username: 'Admin',
    password: await bcrypt.hash('password', config.saltRounds),
    active: true,
    role: 'admin',
  });
  const { _id } = await users.insert({
    username: 'user',
    password: await bcrypt.hash('password', config.saltRounds),
    active: true,
    role: 'user',
  });
  userId = _id;

  const res1 = await request(app)
    .post('/auth/login')
    .send({
      username: 'Admin',
      password: 'password',
    });
  tokenAdmin = res1.body.token;

  const res2 = await request(app)
    .post('/auth/login')
    .send({
      username: 'user',
      password: 'password',
    });
  tokenUser = res2.body.token;
}

describe('GET /api/v1/users', () => {
  before(async () => {
    await setup();
  });
  after(async () => {
    users.drop();
  });

  it('should not allow no admin user to get users', async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${tokenUser}`)
      .expect(401);
    expect(response.body.message).to.equal('Un-Authorized');
  });

  it('should get notes logged in user', async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(200);
    expect(response.body[0]).to.have.property('username');
  });
});

describe('PATCH /api/v1/users/:user_id', () => {
  before(async () => {
    await setup();
  });
  after(async () => {
    await users.drop();
  });

  it('should not allow no admin user to update user', async () => {
    const response = await request(app)
      .patch('/api/v1/users/123')
      .set('Authorization', `Bearer ${tokenUser}`)
      .expect(401);
    expect(response.body.message).to.equal('Un-Authorized');
  });

  it('should not allow invalid user_id', async () => {
    const response = await request(app)
      .patch('/api/v1/users/123')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(404);
    expect(response.body.message).to.include('Not Found');
  });

  it('should require anything', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(422);
    expect(response.body.message).to.include('empty');
  });

  it('should not allow invalid username to update user', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/${userId}`)
      .send({ username: 'a' })
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(422);
    expect(response.body.message).to.include('username');
  });

  it('should not allow invalid role to update user', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/${userId}`)
      .send({ role: 'invalid role' })
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(422);
    expect(response.body.message).to.include('role');
  });

  it('should not allow active without boolean to update user', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/${userId}`)
      .send({ active: 'not boolean' })
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(422);
    expect(response.body.message).to.include('active');
  });

  it('should update valid request', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/${userId}`)
      .send({
        username: 'user2',
        password: 'password2',
        role: 'admin',
        active: false,
      })
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(200);
    expect(response.body).to.have.include({
      username: 'user2',
      role: 'admin',
      active: false,
    });
  });
});
