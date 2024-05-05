const express = require('express');
const router = express.Router();

const authController = require('../../controllers/authController');
const userController = require('../../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication operations
 */

/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Get user by token
 *     description: Get the profile of the currently logged-in user using their authentication token.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.get('/', authController.authenticate, userController.getMyProfile);

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Authenticate user & get token
 *     description: Authenticate a user using their credentials and receive an authentication token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated user and received token
 *       401:
 *         description: Unauthorized - Invalid credentials
 */
router.post('/', authController.loginUser);

/**
 * @swagger
 * /api/auth/update-password:
 *   patch:
 *     summary: Update user password
 *     description: Update the password of the currently logged-in user.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad request - Invalid request body
 *       401:
 *         description: Unauthorized - Invalid token or password
 */
router.patch(
  '/update-password',
  authController.authenticate,
  authController.updatePassword
);

module.exports = router;
