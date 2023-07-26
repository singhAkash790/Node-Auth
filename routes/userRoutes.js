const express = require('express');
const router = express.Router();
const userController = require("../controllers/usersController");

router.get('/allData', userController.getAllUsers);
router.get('/signIn', userController.loginUser);
router.post('/signUp', userController.createUser);
router.patch('/userEdit', userController.updateUser);
router.patch('/userEdit', userController.updateUser);
router.delete('/usedelete', userController.deleteUser);

module.exports = router;
