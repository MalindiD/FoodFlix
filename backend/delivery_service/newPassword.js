const bcrypt = require('bcryptjs');

async function hashPassword() {
  const hashed = await bcrypt.hash('sarath@12345', 10);
  console.log(hashed);
}

hashPassword();
