require('dotenv').config();

const bcrypt = require('bcrypt');

const db = require('../db/connection');

const saltRounds = 12;

const users = db.get('users');

async function createAdminUser() {
  try {
    const user = await users.findOne({ role: 'admin' });
    if (user) {
      console.log('Admin user already eixsts');
    } else {
      await users.insert({
        username: 'Admin',
        password: await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, saltRounds),
        role: 'admin',
        active: true,
      });
      console.log('Admin user created');
    }
  } catch (error) {
    console.log(error);
  } finally {
    db.close();
  }
}

createAdminUser();
