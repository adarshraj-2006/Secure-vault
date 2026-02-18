// decrypt.js
const fs = require('fs');
const CryptoJS = require('crypto-js');
const path = require('path');

function decryptFile(encryptedFileName, password) {
  const encryptedPath = path.join(__dirname, '..', 'vault', encryptedFileName);

  if (!fs.existsSync(encryptedPath)) {
    throw new Error('Encrypted file not found in vault: ' + encryptedFileName);
  }

  const encryptedContent = fs.readFileSync(encryptedPath, 'utf8');
  const bytes = CryptoJS.AES.decrypt(encryptedContent, password);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) {
    throw new Error('Incorrect password or corrupted file.');
  }

  const outputFileName = encryptedFileName.replace('.svault', '.decrypted');
  fs.writeFileSync(outputFileName, decrypted);

  console.log(`🔓 Decrypted content saved to ${outputFileName}`);
}

module.exports = { decryptFile };
