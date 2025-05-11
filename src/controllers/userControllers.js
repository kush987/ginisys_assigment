const userService = require('../services/userService');

const registerUser = async (req, res, next) => {
    try {
      const result = await userService.registerUser(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };
  
const loginUser = async (req, res, next) => {
    try {
      const result = await userService.loginUser(req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
  
module.exports = { 
    registerUser, 
    loginUser 
};
