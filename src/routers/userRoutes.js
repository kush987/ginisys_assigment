const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const {registerSchema, loginSchema} = require('../utils/schemaValidator');
const validate = require('../middlewares/validate');
const { User } = require('../models/Users');

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: kushal@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: test
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

router.post('/login', validate(loginSchema), userController.loginUser);

/**
/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - contact_no
 *               - password
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: kushal
 *               email:
 *                 type: string
 *                 format: email
 *                 example: kushal@gmail.com
 *               contact_no:
 *                 type: integer
 *                 example: 9861693169
 *               password:
 *                 type: string
 *                 format: password
 *                 example: test
 *     responses:
 *       200:
 *         description: Successfully registered
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/register', validate(registerSchema), userController.registerUser);

router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token missing' });
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) throw new Error('User not found');
  
      const tokens = generateTokens(user);
      res.status(200).json(tokens);
    } catch (err) {
      res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
  });

module.exports = router;