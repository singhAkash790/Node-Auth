const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    // Email format validation using a regular expression
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address'],
  },
  password: { type: String, required: true },
  OTP: { type: String, default: '' }, // The reset token
  OTPExpiration: {
    type: Date,
    default: Date.now,
    // The 'expire' option automatically deletes documents after the specified time
    expires: 3600, // Set the expiration time to 3600 seconds (1 hour)
  },
});

module.exports = mongoose.model('User', userSchema);
  