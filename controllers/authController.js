const User = require("../modals/authmodel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require('dotenv').config(); 
const jwt = require('jsonwebtoken');






// ------------------------get all user-------------------------------

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
// ---------------------- User Registration -------------------------

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
};

// ---------------------- User Login and JWT Token Generation -------------------------

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token with user information
    const token = jwt.sign(
      { email: user.email, username: user.username },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h", // Token will expire in 1 hour
      }
    );
    console.log(token)

    res.status(200).json({ message: "User logged in successfully", token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "An error occurred while logging in" });
  }
};

// ---------------------- Protected Route (Example) -------------------------

exports.protectedRoute = (req, res) => {
  // This route will be accessible only if the verifyToken middleware successfully verifies the token
  res.send('Hello world!');
};

// ---------------------- Logout Route -------------------------

// The logout functionality typically involves handling the client-side part, such as clearing the JWT token stored on the client side (e.g., clearing cookies or local storage). The server-side does not need to handle the logout explicitly as JWT tokens are stateless. Once the client-side token is cleared, the user will effectively be logged out.

// In the code provided, the logout route is commented out. As mentioned earlier, the logout functionality is mostly handled on the client-side.

// ...


// ----------------------------------forget-password-------------------------------------

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a reset token
    function generateOTP() {
      const characters = "0123456789";
      let token = "";
      const tokenLength = 6;

      for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
      }
      console.log(token);

      return token;
    }
    const OTP = generateOTP();

    // Set the reset token and its expiration in the user document
    user.OTPExpiration = Date.now() + 7200000; // Token expires in 1 hour
    user.OTP = OTP;
    
    await user.save();
    console.log(user)


    // Create a nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.freesmtpservers.com",
      port: 25, // or the appropriate port for your SMTP server
      secure: false, // Set to true if using a secure connection (e.g., SSL/TLS)
      auth: {},
    });

    // Compose the email message
    const mailOptions = {
      from: "dataprovidecheck@custom.com", // Sender address
      to: email, // Recipient address
      subject: "Password Reset", // Email subject
      text: `You have requested to reset your password. Your reset token is: ${OTP}`, // Plain text body
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        error: "An error occurred while sending the password reset email",
      });
  }
};
// ---------------------------------password reset------------------------------------
exports.resetPassword = async (req, res) => {
  try {
    const { email, OTP, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" }).console.log(error);
    }

    // Check if the reset token is valid and has not expired
    if (user.OTP !== OTP || user.OTPExpiration < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and reset token
    user.password = hashedPassword;
    // user.unset("OTP");
    // user.unset("OTPExpiration");
    user.OTP = undefined;
    user.OTPExpiration = undefined;
    await user.save();
    console.log("Password reset successful")

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res
    console.log(error)
      .status(500)
      .json({ error: "An error occurred while resetting the password" });
  }
};

// // -------------------------------------edit user-------------------------------------------
exports.editUser = async (req, res) => {
  try {
    const { userId } = req.session;
    const { username, email } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's information
    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    res.status(200).json({ message: "User information updated" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating user information" });
  }
};
// -------------------------------------change password-------------------------------------------

exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.session;
    const { currentPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while changing the password" });
  }
};
