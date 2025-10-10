const crypto = require('crypto')

function generateRandomPassword(length = 12) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  const randomBytes = crypto.randomBytes(length);
  const passwordArray = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % charset.length;
    passwordArray.push(charset[randomIndex]);
  }

  return passwordArray.join('');
}

// Example usage:
const password = generateRandomPassword(32);
console.log('Generated Password:', password);
