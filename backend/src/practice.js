const crypto = require('crypto')

const jwt = crypto.randomBytes(64).toString('hex')

console.log(jwt)