const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://rshabib300_db_user:W5YPh3XrTyDhRk9I@databaj.jq2wwa1.mongodb.net/databaj?retryWrites=true&w=majority&appName=databaj');
  const db = mongoose.connection.db;
  
  // Update Habib to Super Admin and verified
  await db.collection('users').updateOne(
    { email: 'rshabib300@gmail.com' },
    { $set: { role: 'super_admin', isVerified: true, status: 'active' } }
  );

  // Set all existing seed users to verified
  await db.collection('users').updateMany(
    { isVerified: { $exists: false } },
    { $set: { isVerified: true, status: 'active' } }
  );

  const users = await db.collection('users').find().toArray();
  console.log('All Users:');
  users.forEach(u => console.log(u.email, 'Role:', u.role, 'Verified:', u.isVerified));
  
  await mongoose.disconnect();
}

run().catch(console.error);
