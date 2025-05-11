const { User } = require("../models/Users");
const bcrypt = require('bcrypt');
const generateTokens = require('../utils/generateToken');
const CustomError = require("../middlewares/CustomError");

const registerUser = async ({ name, email, contact_no, password }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new CustomError('Email already registered', 409);

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    contact_no,
    password: hashedPassword,
  });

//   const tokens = generateTokens(user);
  return { user: { id: user.id, name: user.name, email: user.email }, message: "SuccessFully Register" };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new CustomError('Invalid credentials', 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new CustomError('Invalid credentials', 401);

  const tokens = generateTokens(user);
  return { user: { id: user.id, name: user.name, email: user.email }, ...tokens };
};

module.exports = { registerUser, loginUser };
