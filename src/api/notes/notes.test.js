const request = require('supertest');
const { expect } = require('chai');

const bcrypt = require('bcrypt');
const app = require('../../app');
const db = require('../../db/connection');

const users = db.get('users');
const notes = db.get('notes');

const config = require('../../config');

const note1 = {
  title: 'note1',
  note: 'This is note1',
};
const note2 = {
  title: 'note2',
  note: 'This is note2',
};

let token;

async function setup() {
  await users.drop();
  await notes.drop();

  const hashPassword = await bcrypt.hash('password', config.saltRounds);
  const { _id } = await users.insert({
    username: 'user',
    password: hashPassword,
    active: true,
    role: 'user',
  });

  await notes.insert({
    ...note1,
    user_id: _id.toString(),
  });
  await notes.insert({
    ...note2,
    user_id: _id.toString(),
  });

  const res = await request(app)
    .post('/auth/login')
    .send({
      username: 'user',
      password: 'password',
    });
  token = res.body.token;
}

describe('GET /api/v1/notes', () => {
  before(async () => {
    await setup();
  });

  it('should not get notes no logged in user', async () => {
    const response = await request(app)
      .get('/api/v1/notes')
      .expect(401);
    expect(response.body.message).to.equal('Un-Authorized');
  });

  it('should get notes logged in user', async () => {
    const response = await request(app)
      .get('/api/v1/notes')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body[0]).to.deep.include(note1);
    expect(response.body[1]).to.deep.include(note2);
  });
});

describe('POST /api/v1/notes', () => {
  before(async () => {
    await setup();
  });

  it('should not create note no logged in user', async () => {
    const response = await request(app)
      .post('/api/v1/notes')
      .expect(401);
    expect(response.body.message).to.equal('Un-Authorized');
  });

  it('should require a title', async () => {
    const response = await request(app)
      .post('/api/v1/notes')
      .send({})
      .set('Authorization', `Bearer ${token}`)
      .expect(422);
    expect(response.body.message).to.equal('"title" is required');
  });

  it('should require a note', async () => {
    const response = await request(app)
      .post('/api/v1/notes')
      .send({ title: 'title' })
      .set('Authorization', `Bearer ${token}`)
      .expect(422);
    expect(response.body.message).to.equal('"note" is required');
  });

  it('should create note with title and note', async () => {
    const response = await request(app)
      .post('/api/v1/notes')
      .send({
        title: 'title',
        note: 'this is a note',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.have.include({
      title: 'title',
      note: 'this is a note',
    });
  });

  it('should not allow empty title to create note', async () => {
    const response = await request(app)
      .post('/api/v1/notes')
      .send({
        title: '',
        note: 'this is a note',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(422);
    expect(response.body.message).to.equal('"title" is not allowed to be empty');
  });

  it('should not allow empty note to create note', async () => {
    const response = await request(app)
      .post('/api/v1/notes')
      .send({
        title: 'title',
        note: '',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(422);
    expect(response.body.message).to.equal('"note" is not allowed to be empty');
  });
});
