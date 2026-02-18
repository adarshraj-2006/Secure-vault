// Basic Frontend Logic for Secure-Vault UI
document.addEventListener('DOMContentLoaded', () => {
    const loginCard = document.getElementById('login-card');
    const otpCard = document.getElementById('otp-card');
    const vaultSection = document.getElementById('vault-section');
    const authSection = document.getElementById('auth-section');

    const btnNext = document.getElementById('btn-next');
    const btnVerify = document.getElementById('btn-verify');
    const btnLogout = document.getElementById('btn-logout');

    const masterPassInput = document.getElementById('master-password');
    const otpInput = document.getElementById('otp-input');

    // Simulate Step 1 -> Step 2
    btnNext.addEventListener('click', () => {
        if (masterPassInput.value.length >= 4) {
            loginCard.classList.add('hidden');
            otpCard.classList.remove('hidden');
            console.log("Master password accepted locally, requesting OTP...");
        } else {
            alert("Please enter a valid password.");
        }
    });

    // Simulate Step 2 -> Vault Access
    btnVerify.addEventListener('click', () => {
        if (otpInput.value.length === 6) {
            authSection.classList.add('hidden');
            vaultSection.classList.remove('hidden');
            console.log("OTP Verified. Vault Unlocked.");
        } else {
            alert("Please enter the 6-digit OTP.");
        }
    });

    // Logout
    btnLogout.addEventListener('click', () => {
        vaultSection.classList.add('hidden');
        authSection.classList.remove('hidden');
        loginCard.classList.remove('hidden');
        otpCard.classList.add('hidden');
        masterPassInput.value = '';
        otpInput.value = '';
        console.log("Vault Locked.");
    });
});
