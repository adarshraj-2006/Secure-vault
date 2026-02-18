// main.js
const readline = require('readline-sync');
const { loginFlow } = require('./backend/auth');
const { encryptFile } = require('./backend/encrypt');
const { decryptFile } = require('./backend/decrypt');
const fs = require('fs');
const path = require('path');

const vaultDataPath = path.join(__dirname, 'vault-data.json');

function addTrustedEmail() {
  const email = readline.question("📧 Enter new trusted email: ");
  if (!email.includes("@")) {
    console.log("❌ Invalid email format.");
    return;
  }

  let data = { passwordHash: "", trustedEmails: [] };
  if (fs.existsSync(vaultDataPath)) {
    data = JSON.parse(fs.readFileSync(vaultDataPath));
  }

  if (!data.trustedEmails) data.trustedEmails = [];
  if (data.trustedEmails.includes(email)) {
    console.log("ℹ️ Email already in trusted list.");
    return;
  }

  data.trustedEmails.push(email);
  fs.writeFileSync(vaultDataPath, JSON.stringify(data, null, 2));
  console.log("✅ Trusted email added. You can now use it for OTP.");
}

async function main() {
  console.log(`
  ########################################
  #                                      #
  #      🛡️  WELCOME TO SECURE-VAULT      #
  #                                      #
  ########################################
  `);

  const access = await loginFlow();
  if (!access) {
    console.log("\n❌ Access denied. System locked.");
    return;
  }

  while (true) {
    console.log(`
  📦 MAIN MENU:
  1. 🔒 Encrypt a file (Protect)
  2. 🔓 Decrypt a file (Restore)
  3. 📁 View vault contents
  4. 📧 Add a trusted email
  5. 🚪 Exit
    `);

    const choice = readline.question("Choose an option: ");

    try {
      if (choice === '1') {
        const filePath = readline.question("📄 Enter full path of the file to encrypt: ");
        const pass = readline.question("🔑 Enter encryption password: ", { hideEchoBack: true });
        encryptFile(filePath, pass);

      } else if (choice === '2') {
        const fileName = readline.question("📄 Enter the name of the .svault file (e.g. secret.txt.svault): ");
        const pass = readline.question("🔑 Enter decryption password: ", { hideEchoBack: true });
        decryptFile(fileName, pass);

      } else if (choice === '3') {
        const vaultPath = path.join(__dirname, 'vault');
        if (!fs.existsSync(vaultPath)) fs.mkdirSync(vaultPath);
        const files = fs.readdirSync(vaultPath);
        console.log("\n🔐 PROTECTED FILES IN VAULT:");
        if (files.length === 0) console.log("   (Empty)");
        files.forEach(f => console.log("   📁 " + f));

      } else if (choice === '4') {
        addTrustedEmail();

      } else if (choice === '5') {
        console.log("👋 Exiting Secure-Vault. Stay safe!");
        break;

      } else {
        console.log("⚠️ Invalid option. Try again.");
      }
    } catch (e) {
      console.log("❌ Error:", e.message);
    }
  }
}

main();
