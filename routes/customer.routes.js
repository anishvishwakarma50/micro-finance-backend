const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const verifyToken = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers for the authenticated admin or agent
 *     tags:
 *       - Customer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   adminId:
 *                     type: integer
 *       500:
 *         description: Server error
 *   post:
 *     summary: Add new customer
 *     tags:
 *       - Customer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Phone number already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers under the admin using JWT token
 *     tags:
 *       - Customer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customers list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 adminId:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 customers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       address:
 *                         type: string
 *                       adminId:
 *                         type: integer
 *       400:
 *         description: Unauthorized access or missing admin code
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */



router.get('/', verifyToken, checkRole('admin', 'agent'), customerController.getAllByAdminCode);
router.post('/', verifyToken, checkRole('admin', 'agent'), customerController.create);

module.exports = router;
