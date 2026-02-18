const fs = require('fs');
const CryptoJS = require('crypto-js');
const path = require('path');

function encryptFile(inputPath, password) {
  if (!fs.existsSync(inputPath)) {
    throw new Error('File not found at path: ' + inputPath);
  }
  const fileContent = fs.readFileSync(inputPath, 'utf8');
  const encrypted = CryptoJS.AES.encrypt(fileContent, password).toString();
  const fileName = path.basename(inputPath);

  // Ensure vault directory exists
  const vaultDir = path.join(__dirname, '..', 'vault');
  if (!fs.existsSync(vaultDir)) {
    fs.mkdirSync(vaultDir);
  }

  const outputPath = path.join(vaultDir, fileName + '.svault');
  fs.writeFileSync(outputPath, encrypted);
  console.log(`✅ Encrypted and saved: ${outputPath}`);
}

module.exports = { encryptFile };
