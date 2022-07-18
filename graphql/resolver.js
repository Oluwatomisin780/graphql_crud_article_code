const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../model/user');
module.exports = {
  userCreateAcct: async function ({ userInput }, req) {
    const error = [];
    if (!validator.isEmail(userInput.email)) {
      error.push({ message: 'Invalid Email' });
    }
    if (
      !validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      error.push({ message: 'password is too short ' });
    }
    if (error.length > 0) {
      const error = new Error('input is invalid ');
      throw error;
    }
    const userExist = await User.findOne({ email: userInput.email });
    if (userExist) {
      const error = new Error('User already exist');
      throw error;
    }
    const encryptPassword = bcrypt.hash(userInput.password);
    const user = new User({
      email: userInput.email,
      password: userInput.password,
      name: userInput.name,
    });

    const userAcctCreated = user.save();
    return { ...userAcctCreated._docs, _id: userAcctCreated._id.toString() };
  },
  userLogin: async function ({ name, password, email }) {
    const user = User.findOne({ password: password, email: email });
    if (!user) {
      const error = new Error('user does not exist');
      throw error;
    }
    const comparePassword = await bcrypt.compare(password, user.passsword);
    if (!comparePassword) {
      const error = new Error('invalid password ');
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        password: user.password,
      },
      'userSecret',
      { expiresIn: '1hr' }
    );
  },
};
