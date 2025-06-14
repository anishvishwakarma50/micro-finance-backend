const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
// const verifyToken = require('../middlewares/auth.middleware'); // Uncomment if needed in future

/**
 * @swagger
 * /api/admin:
 *   post:
 *     summary: Register a new admin or agent
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - mobile
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [admin, agent]
 *               acode:
 *                 type: string
 *                 description: Required only if registering as an agent. Must be the valid 8-letter code of an existing admin.
 *                 example: ABCD1234
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 mobile:
 *                   type: string
 *                 role:
 *                   type: string
 *                 acode:
 *                   type: string
 *       400:
 *         description: Validation error or missing/invalid admin code for agent
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */

router.post('/', adminController.createAdmin);

module.exports = router;
