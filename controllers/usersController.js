const User = require("../modals/Users");
const bcrypt = require("bcrypt");



exports.createUser = async (req, res) => {
  const {username,email,password,phoneNumber}=req.body;
  try {
    //  check username is exixt or not
    const exitingUser = await User.findOne({username});
    if(exitingUser){
      return res.status(400).json({message:"username is already registered."})
    }
    //  check user is exixt or not
    const exitingEmail = await User.findOne({email});
    if(exitingEmail){
      return res.status(400).json({message:"email is already registered."})
    }

    const newUser = new User({
      username,
      email,
      password,
      phoneNumber,
    });
    await newUser.save();
    res.status(200).json({message:"user created succesfully",user:newUser});

  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


// exports.getUserById = async (req, res) => {
//   const { email } = req.params;
//   try {
//     const user = await User.findById(email);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch user" });
//   }
// };

 
// exports.loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Find the user by username
//     const user = await User.findOne({ username });

//     // User not found or incorrect password
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ error: 'Invalid username or password.' });
//     }
//     res.status(200).json({ message: 'User logged in successfully.' });
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while logging in.' });
//   }
// };

// exports.updateUser = async (req, res) => {
//   const { email } = req.params;
//   try {
//     const user = await User.findByIdAndUpdate(email, req.body, { new: true });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update user" });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findByIdAndDelete(id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json({ message: "User deleted successfully" });
//   } catch (error) { 
//     res.status(500).json({ error: "Failed to delete user" });
//   }
// };

// exports.resetPassword = async (req, res) => {
//   try {
//     const { email, resetToken, newPassword } = req.body;

//     // Validate reset token and email
//     // ...

//     // Check if reset token has expired
//     const user = await User.findOne({ email, resetToken });
//     if (!user || hasResetTokenExpired(user.resetTokenExpiration)) {
//       return res.status(400).json({ error: 'Invalid or expired reset token.' });
//     }

//     // Update the user's password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     user.resetToken = undefined;
//     user.resetTokenExpiration = undefined;
//     await user.save();

//     res.status(200).json({ message: 'Password reset successfully.' });
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while resetting the password.' });
//   }
// };