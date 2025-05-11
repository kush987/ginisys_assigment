const { registerUser, loginUser } = require('../../src/services/userService');
const { User } = require('../../src/models/Users');
const bcrypt = require('bcrypt');
const generateTokens = require('../../src/utils/generateToken');
const CustomError = require('../../src/middlewares/CustomError');

// Mock dependencies
jest.mock('bcrypt');
jest.mock('../../src/utils/generateToken');
jest.mock('../../src/models/Users');

describe('User Service Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {

    it('should successfully register a new user', async () => {
      const userInput = {
        name: 'John Doe',
        email: 'john@example.com',
        contact_no: 1234567890,
        password: 'password123',
      };

      // Simulating no user exists with the same email
      User.findOne.mockResolvedValue(null);

      // Simulating password hashing
      bcrypt.hash.mockResolvedValue('hashedPassword');

      // Simulating user creation
      User.create.mockResolvedValue({
        id: 1,
        ...userInput,
        password: 'hashedPassword',
      });

      // Call the registerUser function
      const result = await registerUser(userInput);

      // Check if the result is as expected
      expect(result).toEqual({
        user: { id: 1, name: 'John Doe', email: 'john@example.com' },
        message: 'SuccessFully Register',
      });
    });

    it('should throw an error if the email is already taken', async () => {
      const userInput = {
        name: 'John Doe',
        email: 'john@example.com',
        contact_no: 1234567890,
        password: 'password123',
      };

      // Simulating existing user
      User.findOne.mockResolvedValue({});

      // Test if an error is thrown when email is already registered
      await expect(registerUser(userInput)).rejects.toThrowError(new CustomError('Email already registered', 409));
    });

  });

  describe('loginUser', () => {

    it('should successfully log in with correct credentials', async () => {
      const userInput = {
        email: 'john@example.com',
        password: 'password123',
      };

      const userFromDb = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      };

      // Simulating a user found in the database
      User.findOne.mockResolvedValue(userFromDb);

      // Simulating password comparison
      bcrypt.compare.mockResolvedValue(true);

      // Simulating token generation
      generateTokens.mockReturnValue({ accessToken: 'accessToken', refreshToken: 'refreshToken' });

      // Call the loginUser function
      const result = await loginUser(userInput);

      // Check if the result is as expected
      expect(result).toEqual({
        user: { id: 1, name: 'John Doe', email: 'john@example.com' },
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
    });

    it('should throw an error if the user does not exist', async () => {
      const userInput = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      // Simulating no user found
      User.findOne.mockResolvedValue(null);

      // Test if an error is thrown when user is not found
      await expect(loginUser(userInput)).rejects.toThrowError(new CustomError('Invalid credentials', 401));
    });

    it('should throw an error if the password is incorrect', async () => {
      const userInput = {
        email: 'john@example.com',
        password: 'wrongPassword',
      };

      const userFromDb = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      };

      // Simulating user found
      User.findOne.mockResolvedValue(userFromDb);

      // Simulating password mismatch
      bcrypt.compare.mockResolvedValue(false);

      // Test if an error is thrown when password does not match
      await expect(loginUser(userInput)).rejects.toThrowError(new CustomError('Invalid credentials', 401));
    });

  });

});
