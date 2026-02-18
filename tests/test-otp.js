const { generateAndSendOtp, verifyOtp, isTrustedEmail } = require("../backend/otp");
const readline = require("readline-sync");

(async () => {
  const email = readline.question("Enter a trusted email to test OTP: ");
  if (!isTrustedEmail(email)) {
    console.log("❌ Email not trusted. Please add it to the trustedEmails list in otp.js");
    return;
  }
  try {
    console.log("📧 Sending OTP...");
    await generateAndSendOtp(email);
    console.log("✅ OTP sent to", email);

    const inputOtp = readline.question("🔑 Enter the OTP you received: ");
    const verified = verifyOtp(email, inputOtp);

    if (verified) {
      console.log("✨ OTP verified successfully!");
    } else {
      console.log("❌ OTP verification failed or expired.");
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
    if (err.message.includes("auth")) {
      console.log("\n💡 TIP: You likely need to set your real email and App Password in otp.js");
    }
  }
})();
