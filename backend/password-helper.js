const crypto = require('crypto');

// Secure hash with salt using pbkdf2
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16); // 16-byte buffer
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
};

const verifyPassword = (inputPassword, storedValue) => {
  if (typeof storedValue !== 'string' || !storedValue.includes(':')) {
    console.error("⚠️ Invalid password hash format.");
    return false;
  }

  const [saltHex, originalHashHex] = storedValue.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const hash = crypto.pbkdf2Sync(inputPassword, salt, 100000, 64, 'sha512');
  return hash.toString('hex') === originalHashHex;
};

module.exports = { hashPassword, verifyPassword };
