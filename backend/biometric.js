let windowsHello = null;
try {
  windowsHello = require('windows-hello');
} catch (e) {
  // Package not installed
}

async function authenticateBiometric() {
  if (!windowsHello) {
    console.log("⚠️  'windows-hello' package not found. (Install with: npm install windows-hello)");
    return true; // Fallback to allowing access if hardware/software not setup, for demo purposes
  }

  try {
    console.log("🧠 Waiting for Windows Hello biometric authentication...");

    const result = await windowsHello.prompt("Confirm your identity with Windows Hello");

    if (result.success) {
      console.log("✅ Biometric authentication successful.");
      return true;
    } else {
      console.log("❌ Biometric authentication failed.");
      return false;
    }

  } catch (error) {
    console.error("❌ Biometric error:", error.message);
    return false;
  }
}

module.exports = { authenticateBiometric };
