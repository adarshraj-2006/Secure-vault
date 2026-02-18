const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

// Convert password to key (you could hash + salt more)
function deriveKey(password) {
  return CryptoJS.SHA256(password).toString();
}

function encryptFile(inputPath, outputPath, password) {
  const fileData = fs.readFileSync(inputPath);
  const key = deriveKey(password);
  const encrypted = CryptoJS.AES.encrypt(fileData.toString('base64'), key).toString();
  fs.writeFileSync(outputPath, encrypted, 'utf-8');
  console.log("✅ File encrypted and saved to:", outputPath);
}

function decryptFile(inputPath, outputPath, password) {
  const encryptedData = fs.readFileSync(inputPath, 'utf-8');
  const key = deriveKey(password);
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
  const decryptedBase64 = decrypted.toString(CryptoJS.enc.Utf8);
  const buffer = Buffer.from(decryptedBase64, 'base64');
  fs.writeFileSync(outputPath, buffer);
  console.log("✅ File decrypted and saved to:", outputPath);
}

module.exports = { encryptFile, decryptFile };
