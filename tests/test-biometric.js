const { authenticateBiometric } = require("../backend/biometric");

(async () => {
  const success = await authenticateBiometric();
  console.log("Authenticated:", success);
})();
