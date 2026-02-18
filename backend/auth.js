const fs = require('fs');
const path = require('path');
const readline = require('readline-sync');
const { hashPassword, verifyPassword } = require('./password-helper');
const { generateAndSendOtp, verifyOtp, isTrustedEmail } = require('./otp');

const vaultDataPath = path.join(__dirname, '..', 'vault-data.json');

// Try to load biometric helper
let authenticateBiometric = null;
try {
  authenticateBiometric = require('./biometric').authenticateBiometric;
} catch (e) {
  // If biometric.js fails or package is missing, we define a fallback or mock
  authenticateBiometric = async () => {
    console.log("🛠️ Biometric hardware not detected. Skipping biometric step for now...");
    return true;
  };
}

function loadVaultData() {
  try {
    if (fs.existsSync(vaultDataPath)) {
      return JSON.parse(fs.readFileSync(vaultDataPath, 'utf-8'));
    }
  } catch (err) {
    console.error("Error reading vault data:", err.message);
  }
  return { passwordHash: "", trustedEmails: [] };
}

function saveVaultData(data) {
  fs.writeFileSync(vaultDataPath, JSON.stringify(data, null, 2));
}

async function loginFlow() {
  console.log("\n--- 🔐 SYSTEM AUTHENTICATION ---");
  const data = loadVaultData();

  // 1. Password setup or check
  if (!data.passwordHash) {
    console.log("📝 No vault password found. Please create a new password.");
    const newPassword = readline.question('Enter new vault password: ', { hideEchoBack: true });
    const confirmPassword = readline.question('Confirm new vault password: ', { hideEchoBack: true });

    if (newPassword !== confirmPassword) {
      console.log("❌ Passwords do not match.");
      return false;
    }

    data.passwordHash = hashPassword(newPassword);
    saveVaultData(data);
    console.log("✅ Vault password created!");
  }

  const inputPassword = readline.question('🔑 Enter your password to unlock: ', { hideEchoBack: true });
  if (!verifyPassword(inputPassword, data.passwordHash)) {
    console.log("❌ Incorrect password.");
    return false;
  }
  console.log("✅ Password correct.");

  // 2. OTP Verification
  const email = readline.question("📧 Enter your trusted email for OTP verification: ");
  if (!isTrustedEmail(email)) {
    console.log("❌ This email is not in the trusted list.");
    return false;
  }

  try {
    console.log("⏳ Sending OTP to your email...");
    await generateAndSendOtp(email);
    console.log("📩 OTP sent!");

    const maxAttempts = 3;
    let otpSuccess = false;
    for (let i = 1; i <= maxAttempts; i++) {
      const enteredOTP = readline.question(`🔑 Enter OTP (${i}/${maxAttempts}): `);
      if (verifyOtp(email, enteredOTP)) {
        console.log("✅ OTP verified.");
        otpSuccess = true;
        break;
      }
      console.log("❌ Incorrect OTP.");
    }
    if (!otpSuccess) return false;
  } catch (err) {
    console.error("❌ OTP Error:", err.message);
    return false;
  }

  // 3. Biometric Verification
  console.log("🤳 Final Step: Biometric Verification...");
  const biometricsPassed = await authenticateBiometric();
  if (!biometricsPassed) {
    console.log("❌ Biometric verification failed.");
    return false;
  }

  console.log("✨ Authentication successful! Vault unlocked.");
  return true;
}

module.exports = { loginFlow };
