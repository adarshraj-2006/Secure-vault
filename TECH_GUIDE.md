# 🎓 Beginner's Guide: Technology & Tools

If you are new to coding or this project, this guide explains exactly what technologies we used, why we chose them, and how the "magic" happens behind the scenes.

---

## 🛠️ The Core Stack (The Essentials)

### 1. Node.js (The Engine)
*   **What it is**: A tool that lets you run JavaScript code directly on your computer (instead of just inside a web browser).
*   **Why we use it**: It allows us to manage your computer's files, talk to email servers, and create a powerful command-line interface.

### 2. HTML5 & CSS3 (The Look)
*   **What it is**: The building blocks of the web. HTML handles the structure, and CSS handles the beauty.
*   **Special Tech: Glassmorphism**: You'll notice the frontend looks like "frosted glass." This is achieved using `backdrop-filter: blur()` in CSS, a modern design trend used by Apple and Microsoft.

---

## 📦 Installed Packages (The "Superpowers")

We use **NPM (Node Package Manager)** to add extra features to our project without writing everything from scratch.

### 🔐 `crypto-js`
*   **Purpose**: Handles the "secret math" of encryption.
*   **How it works**: It takes your plain text (like "My Password") and turns it into a scrambled mess of characters that only the correct key can unscramble. We use the **AES-256** standard, which is used by banks.

### 📧 `nodemailer`
*   **Purpose**: Sends emails automatically.
*   **How it works**: It connects your Node.js code to an email provider (like Gmail). It’s how we send the 6-digit OTP code to your phone or computer.

### ⌨️ `readline-sync`
*   **Purpose**: Makes the command-line interactive.
*   **How it works**: Usually, Node.js scripts just run and stop. This package lets the program "pause" and ask you a question, like *"Enter your password:"*, and wait for your answer.

---

## 🚀 Advanced Tech (Added for You)

### 🤳 `windows-hello` (Biometric Security)
*   **Concept**: This is what makes this vault "Advanced."
*   **What it does**: It tells your computer to trigger its built-in Fingerprint or FaceID scanner.
*   **Note**: This requires specialized hardware on your laptop/PC. If you don't have it, our code is smart enough to skip it so you can still use the vault!

### 🔑 PBKDF2 Hashing
*   **The Problem**: We should **never** store your real password in a file. If a hacker saw `vault-data.json`, they would know your password.
*   **The Solution**: We "Hash" your password using PBKDF2. It’s a one-way transformation. Even the computer doesn't know your password; it only knows if the *result* of the math matches what's stored.

### 📡 `serve` (Simple Hosting)
*   **Purpose**: Instantly creates a local website.
*   **User Action**: When you run `npm run dev` in the frontend folder, it uses this tool to show you the vault dashboard.

---

## 📖 Key Terms for Beginners

| Term | Simple Definition |
| :--- | :--- |
| **Encryption** | Scrambling data so only you can read it. |
| **Decryption** | Unscrambling data back to its original form. |
| **Dependencies** | Other pieces of code that our project "depends" on to work. |
| **Endpoint** | A specific part of the program that handles a task (like "Login"). |
| **Vault** | A safe, locked folder where your protected data lives. |

---

## 🛠️ How to Add Your Own Packages
If you want to add more "superpowers" later, open your terminal and type:
```bash
npm install <package-name>
```
Example: `npm install chalk` (to make your terminal text colorful!)
