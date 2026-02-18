const crypto = require('crypto');
const fs = require('fs');

function encryptFile(filePath, password) {
  const data = fs.readFileSync(filePath);
  const key = crypto.scryptSync(password, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([iv, cipher.update(data), cipher.final()]);
  fs.writeFileSync(filePath + '.enc', encrypted);
  console.log('File encrypted:', filePath + '.enc');
}

function decryptFile(encFilePath, password) {
  const encrypted = fs.readFileSync(encFilePath);
  const key = crypto.scryptSync(password, 'salt', 32);
  const iv = encrypted.slice(0, 16);
  const data = encrypted.slice(16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  fs.writeFileSync(encFilePath.replace('.enc', '.dec'), decrypted);
  console.log('File decrypted:', encFilePath.replace('.enc', '.dec'));
}

module.exports = { encryptFile, decryptFile };
