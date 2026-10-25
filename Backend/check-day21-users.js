
require('dotenv').config({
  path: require('path').join(__dirname, '.env')
});

const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'shoplite_day20'
    });

    const emails = [
      'day21-test@example.com',
      'day21-hash-test@example.com',
      'day21-normalize@example.com'
    ];

    const users = await User.find({
      email: { $in: emails }
    }).select('email passwordHash createdAt updatedAt').lean();

    for (const user of users) {
      console.log({
        email: user.email,
        hasPasswordHash: typeof user.passwordHash === 'string',
        hashLength: user.passwordHash?.length,
        hashStartsWithBcryptPrefix: /^\$2[aby]\$/.test(user.passwordHash || ''),
        hasCreatedAt: Boolean(user.createdAt),
        hasUpdatedAt: Boolean(user.updatedAt)
      });
    }

    const hashes = users.map(user => user.passwordHash);
    console.log(
      'Same-password accounts have different hashes:',
      hashes.length >= 2 && hashes[0] !== hashes[1]
    );
    console.log('Number of users checked:', users.length);
  } catch (error) {
    console.error('User verification failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();
