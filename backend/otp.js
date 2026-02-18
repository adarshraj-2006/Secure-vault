const nodemailer = require("nodemailer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const vaultDataPath = path.join(__dirname, '..', 'vault-data.json');

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const otps = new Map(); // email => { otp, expires }

function getTrustedEmails() {
  try {
    if (fs.existsSync(vaultDataPath)) {
      const data = JSON.parse(fs.readFileSync(vaultDataPath, 'utf-8'));
      return data.trustedEmails || [];
    }
  } catch (err) {
    console.error("Error reading trusted emails:", err.message);
  }
  return [];
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your_email@gmail.com",
    pass: "your_app_password", // Use app password or OAuth token
  },
});

function isTrustedEmail(email) {
  const trusted = getTrustedEmails();
  return trusted.includes(email);
}

function generateAndSendOtp(email) {
  if (!isTrustedEmail(email)) {
    return Promise.reject(new Error("Email not trusted"));
  }

  // Using native crypto to generate 6 digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const expires = Date.now() + OTP_EXPIRY_MS;
  otps.set(email, { otp, expires });

  const mailOptions = {
    from: '"VaultGuardian" <your_email@gmail.com>',
    to: email,
    subject: "Your VaultGuardian OTP Code",
    text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
  };

  return transporter.sendMail(mailOptions);
}

function verifyOtp(email, inputOtp) {
  if (!otps.has(email)) return false;
  const { otp, expires } = otps.get(email);
  if (Date.now() > expires) {
    otps.delete(email);
    return false;
  }
  if (otp === inputOtp) {
    otps.delete(email);
    return true;
  }
  return false;
}

module.exports = { generateAndSendOtp, verifyOtp, isTrustedEmail };
